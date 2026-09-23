import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function shuffle<T>(items: T[]): T[] {
  const array = [...items];

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [
      array[j],
      array[i],
    ];
  }

  return array;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const unitNumber = Number(body?.unitNumber);
    const questionCount = Number(body?.questionCount);

    if (
      !Number.isInteger(unitNumber) ||
      unitNumber < 1 ||
      unitNumber > 12
    ) {
      return NextResponse.json(
        {
          error: "Invalid unit number.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      ![10, 20, 25].includes(questionCount)
    ) {
      return NextResponse.json(
        {
          error:
            "Question count must be 10, 20 or 25.",
        },
        {
          status: 400,
        }
      );
    }

    const admin = supabaseAdmin();

    const { data: questions, error } =
      await admin
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
          difficulty,
          explanation
        `)
        .eq("module_code", "V-A")
        .eq("unit_number", unitNumber)
        .eq("is_active", true);

    if (error) {
      throw error;
    }

    if (!questions || questions.length < questionCount) {
      return NextResponse.json(
        {
          error:
            "Not enough active questions are available for this unit.",
          unitNumber,
          available: questions?.length || 0,
          requested: questionCount,
        },
        {
          status: 400,
        }
      );
    }

    const selectedQuestions = shuffle(
      questions
    ).slice(0, questionCount);

    const safeQuestions =
      selectedQuestions.map(
        (question, index) => ({
          questionNumber: index + 1,
          id: question.id,
          unitNumber: question.unit_number,
          unitTitle: question.unit_title,
          topic: question.topic,
          questionText:
            question.question_text,
          optionA: question.option_a,
          optionB: question.option_b,
          optionC: question.option_c,
          optionD: question.option_d,
          difficulty: question.difficulty,
          explanation:
            question.explanation,
        })
      );

    return NextResponse.json({
      success: true,
      unitNumber,
      questionCount,
      questions: safeQuestions,
    });
  } catch (error) {
    console.error(
      "NISM practice start error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to start practice.",
      },
      {
        status: 500,
      }
    );
  }
}
