import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const attemptId = body.attemptId;
    const answers = body.answers;
    const timeTakenSeconds = Number(body.timeTakenSeconds || 0);

    if (!attemptId || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Invalid submission." },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    // Get attempt
    const { data: attempt, error: attemptError } = await supabase
      .from("nism_attempts")
      .select("*")
      .eq("id", attemptId)
      .single();

    if (attemptError || !attempt) {
      return NextResponse.json(
        { error: "Attempt not found." },
        { status: 404 }
      );
    }

    // Prevent submitting an already submitted test
    if (attempt.status !== "in_progress") {
      return NextResponse.json(
        { error: "This test has already been submitted." },
        { status: 400 }
      );
    }

    // Get questions assigned to this attempt
    const { data: attemptQuestions, error: attemptQuestionsError } =
      await supabase
        .from("nism_attempt_questions")
        .select("question_id, question_number")
        .eq("attempt_id", attemptId)
        .order("question_number", { ascending: true });

    if (attemptQuestionsError || !attemptQuestions) {
      return NextResponse.json(
        { error: "Unable to load test questions." },
        { status: 500 }
      );
    }

    const questionIds = attemptQuestions.map(
      (item) => item.question_id
    );

    // Get correct answers from server/database
    const { data: questions, error: questionsError } = await supabase
      .from("nism_questions")
      .select(`
        id,
        unit_number,
        unit_title,
        topic,
        correct_option
      `)
      .in("id", questionIds);

    if (questionsError || !questions) {
      return NextResponse.json(
        { error: "Unable to verify answers." },
        { status: 500 }
      );
    }

    const questionMap = new Map(
      questions.map((question) => [
        question.id,
        question,
      ])
    );

    let correctAnswers = 0;
    let wrongAnswers = 0;
    let unansweredQuestions = 0;

    const answerRows = answers.map((answer: any) => {
      const question = questionMap.get(answer.questionId);

      const selectedOption =
        answer.selectedOption &&
        ["A", "B", "C", "D"].includes(answer.selectedOption)
          ? answer.selectedOption
          : null;

      const isCorrect =
        selectedOption !== null &&
        question &&
        selectedOption === question.correct_option;

      if (!selectedOption) {
        unansweredQuestions++;
      } else if (isCorrect) {
        correctAnswers++;
      } else {
        wrongAnswers++;
      }

      return {
        attempt_id: attemptId,
        question_id: answer.questionId,
        selected_option: selectedOption,
        is_correct: isCorrect || false,
        answered_at: new Date().toISOString(),
      };
    });

    // Save answers
    if (answerRows.length > 0) {
      const { error: answerError } = await supabase
        .from("nism_attempt_answers")
        .upsert(answerRows, {
          onConflict: "attempt_id,question_id",
        });

      if (answerError) {
        console.error(answerError);

        return NextResponse.json(
          { error: "Unable to save answers." },
          { status: 500 }
        );
      }
    }

    // Make sure unanswered count is accurate
    const attemptedQuestions =
      correctAnswers + wrongAnswers;

    unansweredQuestions =
      attempt.total_questions - attemptedQuestions;

    const score = correctAnswers;

    const percentage =
      attempt.total_questions > 0
        ? Number(
            ((score / attempt.total_questions) * 100).toFixed(2)
          )
        : 0;

    const passed =
      percentage >= 50;

    // Update attempt
    const { error: updateError } = await supabase
      .from("nism_attempts")
      .update({
        submitted_at: new Date().toISOString(),
        attempted_questions: attemptedQuestions,
        correct_answers: correctAnswers,
        wrong_answers: wrongAnswers,
        unanswered_questions: unansweredQuestions,
        score,
        percentage,
        passed,
        time_taken_seconds: timeTakenSeconds,
        status: "submitted",
      })
      .eq("id", attemptId);

    if (updateError) {
      console.error(updateError);

      return NextResponse.json(
        { error: "Unable to save result." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      attemptId,
      totalQuestions: attempt.total_questions,
      attemptedQuestions,
      correctAnswers,
      wrongAnswers,
      unansweredQuestions,
      score,
      percentage,
      passed,
      timeTakenSeconds,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong while submitting the test." },
      { status: 500 }
    );
  }
}
