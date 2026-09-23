import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const UNIT_QUOTAS: Record<number, number> = {
  1: 9,
  2: 9,
  3: 8,
  4: 9,
  5: 8,
  6: 8,
  7: 9,
  8: 8,
  9: 8,
  10: 9,
  11: 8,
  12: 8,
};

function shuffle<T>(items: T[]): T[] {
  const array = [...items];

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const testNumber = Number(body?.testNumber);

    if (
      !Number.isInteger(testNumber) ||
      testNumber < 1 ||
      testNumber > 10
    ) {
      return NextResponse.json(
        {
          error: "Invalid mock test number.",
        },
        {
          status: 400,
        }
      );
    }

    const admin = supabaseAdmin();

    /* =========================
       GET MOCK TEST
       ========================= */

    const { data: mockTest, error: mockTestError } =
      await admin
        .from("nism_mock_tests")
        .select("*")
        .eq("test_number", testNumber)
        .maybeSingle();

    if (mockTestError) {
      throw mockTestError;
    }

    if (!mockTest) {
      return NextResponse.json(
        {
          error: "Mock test not found.",
        },
        {
          status: 404,
        }
      );
    }

    /* =========================
       GET ACTIVE QUESTIONS
       ========================= */

    const { data: questions, error: questionError } =
      await admin
        .from("nism_questions")
        .select(`
          id,
          module_code,
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
      throw questionError;
    }

    if (!questions || questions.length < 100) {
      return NextResponse.json(
        {
          error:
            "Not enough active questions available. 100 questions are required to start the mock test.",
          available: questions?.length || 0,
          required: 100,
        },
        {
          status: 400,
        }
      );
    }

    /* =========================
       GROUP QUESTIONS BY UNIT
       ========================= */

    const questionsByUnit: Record<number, typeof questions> =
      {};

    for (let unit = 1; unit <= 12; unit++) {
      questionsByUnit[unit] = [];
    }

    for (const question of questions) {
      const unitNumber = Number(question.unit_number);

      if (questionsByUnit[unitNumber]) {
        questionsByUnit[unitNumber].push(question);
      }
    }

    /* =========================
       CHECK UNIT AVAILABILITY
       ========================= */

    const unavailableUnits: {
      unit: number;
      required: number;
      available: number;
    }[] = [];

    for (const [unitString, quota] of Object.entries(
      UNIT_QUOTAS
    )) {
      const unitNumber = Number(unitString);

      const available =
        questionsByUnit[unitNumber]?.length || 0;

      if (available < quota) {
        unavailableUnits.push({
          unit: unitNumber,
          required: quota,
          available,
        });
      }
    }

    if (unavailableUnits.length > 0) {
      return NextResponse.json(
        {
          error:
            "There are not enough active questions in one or more units to create a balanced mock test.",
          unavailableUnits,
        },
        {
          status: 400,
        }
      );
    }

    /* =========================
       SELECT BALANCED QUESTIONS
       ========================= */

    const selectedQuestions = [];

    for (const [unitString, quota] of Object.entries(
      UNIT_QUOTAS
    )) {
      const unitNumber = Number(unitString);

      const unitQuestions = shuffle(
        questionsByUnit[unitNumber]
      );

      selectedQuestions.push(
        ...unitQuestions.slice(0, quota)
      );
    }

    /* =========================
       FINAL SHUFFLE
       ========================= */

    const finalQuestions =
      shuffle(selectedQuestions);

    if (finalQuestions.length !== 100) {
      return NextResponse.json(
        {
          error:
            "Unable to create a 100-question mock test.",
        },
        {
          status: 500,
        }
      );
    }

    /* =========================
       CREATE ATTEMPT
       ========================= */

    const { data: attempt, error: attemptError } =
      await admin
        .from("nism_attempts")
        .insert({
          test_number: testNumber,
          question_count: 100,
          duration_minutes:
            mockTest.duration_minutes || 120,
          status: "started",
        })
        .select("id")
        .single();

    if (attemptError) {
      throw attemptError;
    }

    /* =========================
       SAVE QUESTION ORDER
       ========================= */

    const attemptQuestions =
      finalQuestions.map(
        (question, index) => ({
          attempt_id: attempt.id,
          question_id: question.id,
          question_number: index + 1,
        })
      );

    const { error: attemptQuestionError } =
      await admin
        .from("nism_attempt_questions")
        .insert(attemptQuestions);

    if (attemptQuestionError) {
      throw attemptQuestionError;
    }

    /* =========================
       SEND SAFE QUESTION DATA
       ========================= */

    const safeQuestions =
      finalQuestions.map(
        (question, index) => ({
          question_number: index + 1,
          id: question.id,
          unit_number: question.unit_number,
          unit_title: question.unit_title,
          topic: question.topic,
          question_text:
            question.question_text,
          option_a: question.option_a,
          option_b: question.option_b,
          option_c: question.option_c,
          option_d: question.option_d,
          difficulty: question.difficulty,
        })
      );

    return NextResponse.json({
      success: true,

      attemptId: attempt.id,

      testNumber,

      questionCount: 100,

      durationMinutes:
        mockTest.duration_minutes || 120,

      questions: safeQuestions,
    });
  } catch (error) {
    console.error(
      "NISM mock test start error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to start mock test.",
      },
      {
        status: 500,
      }
    );
  }
}
