import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const testNumber = Number(body.testNumber);

    if (!testNumber || testNumber < 1 || testNumber > 10) {
      return NextResponse.json(
        { error: "Invalid mock test number." },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    // Find mock test
    const { data: mockTest, error: mockTestError } = await supabase
      .from("nism_mock_tests")
      .select("*")
      .eq("module_code", "V-A")
      .eq("test_number", testNumber)
      .eq("is_active", true)
      .single();

    if (mockTestError || !mockTest) {
      return NextResponse.json(
        { error: "Mock test not found." },
        { status: 404 }
      );
    }

    // Get active questions
    const { data: questions, error: questionError } = await supabase
      .from("nism_questions")
      .select(`
        id,
        unit_number,
        unit_title,
        topic,
        question_text,
        option_a,
        option_b,
        option_c,
        option_d,
        difficulty
      `)
      .eq("module_code", "V-A")
      .eq("is_active", true);

    if (questionError) {
      console.error(questionError);

      return NextResponse.json(
        { error: "Unable to load questions." },
        { status: 500 }
      );
    }

    if (!questions || questions.length < mockTest.question_count) {
      return NextResponse.json(
        {
          error: `Not enough questions available. ${mockTest.question_count} questions are required, but only ${
            questions?.length || 0
          } are available.`,
        },
        { status: 400 }
      );
    }

    // Shuffle questions
    const shuffled = [...questions].sort(() => Math.random() - 0.5);

    // Select required number
    const selectedQuestions = shuffled.slice(
      0,
      mockTest.question_count
    );

    // Create attempt
    const { data: attempt, error: attemptError } = await supabase
      .from("nism_attempts")
      .insert({
        module_code: "V-A",
        mock_test_id: mockTest.id,
        total_questions: mockTest.question_count,
        status: "in_progress",
      })
      .select()
      .single();

    if (attemptError || !attempt) {
      console.error(attemptError);

      return NextResponse.json(
        { error: "Unable to create test attempt." },
        { status: 500 }
      );
    }

    // Save question order for this attempt
    const attemptQuestions = selectedQuestions.map(
      (question, index) => ({
        attempt_id: attempt.id,
        question_id: question.id,
        question_number: index + 1,
      })
    );

    const { error: attemptQuestionsError } = await supabase
      .from("nism_attempt_questions")
      .insert(attemptQuestions);

    if (attemptQuestionsError) {
      console.error(attemptQuestionsError);

      // Clean up failed attempt
      await supabase
        .from("nism_attempts")
        .delete()
        .eq("id", attempt.id);

      return NextResponse.json(
        { error: "Unable to save test questions." },
        { status: 500 }
      );
    }

    // Send only safe question data to browser.
    // Correct answers are intentionally NOT included.
    const safeQuestions = selectedQuestions.map(
      (question, index) => ({
        questionNumber: index + 1,
        id: question.id,
        unitNumber: question.unit_number,
        unitTitle: question.unit_title,
        topic: question.topic,
        questionText: question.question_text,
        options: {
          A: question.option_a,
          B: question.option_b,
          C: question.option_c,
          D: question.option_d,
        },
        difficulty: question.difficulty,
      })
    );

    return NextResponse.json({
      success: true,
      attemptId: attempt.id,
      testNumber: mockTest.test_number,
      title: mockTest.title,
      durationMinutes: mockTest.duration_minutes,
      passingPercentage: mockTest.passing_percentage,
      totalQuestions: mockTest.question_count,
      questions: safeQuestions,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
