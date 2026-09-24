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

/*
  Practice-test distribution.

  This is our internal practice-test structure,
  not an official NISM question blueprint.
*/
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
  11: 7,
  12: 8,
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const testNumber = Number(body?.testNumber);

    /* -------------------------------------------------------
       1. Validate mock test number
    ------------------------------------------------------- */

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

    /* -------------------------------------------------------
       2. Get mock test configuration
    ------------------------------------------------------- */

    const {
      data: mockTest,
      error: mockTestError,
    } = await admin
      .from("nism_mock_tests")
      .select("*")
      .eq("module_code", "V-A")
      .eq("test_number", testNumber)
      .eq("is_active", true)
      .single();

    if (mockTestError || !mockTest) {
      console.error(
        "Mock test configuration error:",
        mockTestError
      );

      return NextResponse.json(
        {
          error:
            "Mock test configuration not found.",
        },
        {
          status: 404,
        }
      );
    }

    const questionCount =
      Number(mockTest.question_count) || 100;

    const durationMinutes =
      Number(mockTest.duration_minutes) || 120;

    /* -------------------------------------------------------
       3. Get active NISM questions
    ------------------------------------------------------- */

    const {
      data: allQuestions,
      error: questionError,
    } = await admin
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
      console.error(
        "Question bank error:",
        questionError
      );

      return NextResponse.json(
        {
          error:
            "Unable to load the NISM question bank.",
        },
        {
          status: 500,
        }
      );
    }

    if (
      !allQuestions ||
      allQuestions.length < questionCount
    ) {
      return NextResponse.json(
        {
          error:
            "There are not enough active questions in the question bank.",
          available:
            allQuestions?.length || 0,
          required: questionCount,
        },
        {
          status: 400,
        }
      );
    }

    /* -------------------------------------------------------
       4. Select questions according to unit quotas
    ------------------------------------------------------- */

    const selectedQuestions: any[] = [];

    for (const [unitKey, quota] of Object.entries(
      UNIT_QUOTAS
    )) {
      const unitNumber = Number(unitKey);

      const unitQuestions =
        allQuestions.filter(
          (question) =>
            Number(question.unit_number) ===
            unitNumber
        );

      if (unitQuestions.length < quota) {
        return NextResponse.json(
          {
            error:
              `Not enough active questions are available for Unit ${unitNumber}. ` +
              `Required: ${quota}, available: ${unitQuestions.length}.`,
          },
          {
            status: 400,
          }
        );
      }

      const shuffled =
        shuffle(unitQuestions);

      selectedQuestions.push(
        ...shuffled.slice(0, quota)
      );
    }

    const finalQuestions = shuffle(
      selectedQuestions
    ).slice(0, questionCount);

    /* -------------------------------------------------------
       5. CREATE MOCK TEST ATTEMPT
       
       IMPORTANT:
       This matches the actual nism_attempts table schema.
    ------------------------------------------------------- */

    const {
      data: attempt,
      error: attemptError,
    } = await admin
      .from("nism_attempts")
      .insert({
        module_code: "V-A",

        // Actual column in your database
        mock_test_id: mockTest.id,

        // Actual column in your database
        total_questions:
          finalQuestions.length,

        // status has a database default of "in_progress"
      })
      .select("id")
      .single();

    if (attemptError || !attempt) {
      console.error(
        "Mock test attempt creation error:",
        attemptError
      );

      return NextResponse.json(
        {
          error:
            "Unable to create mock test attempt.",
        },
        {
          status: 500,
        }
      );
    }

    /* -------------------------------------------------------
       6. Save question order
    ------------------------------------------------------- */

    const attemptQuestions =
      finalQuestions.map(
        (question, index) => ({
          attempt_id: attempt.id,
          question_id: question.id,
          question_number: index + 1,
        })
      );

    const {
      error: attemptQuestionError,
    } = await admin
      .from("nism_attempt_questions")
      .insert(attemptQuestions);

    if (attemptQuestionError) {
      console.error(
        "Attempt question error:",
        attemptQuestionError
      );

      // Clean up the incomplete attempt
      await admin
        .from("nism_attempts")
        .delete()
        .eq("id", attempt.id);

      return NextResponse.json(
        {
          error:
            "Unable to prepare mock test questions.",
        },
        {
          status: 500,
        }
      );
    }

    /* -------------------------------------------------------
       7. Send safe questions to browser
       
       IMPORTANT:
       Correct answers are NOT sent to the browser.
    ------------------------------------------------------- */

    const safeQuestions =
      finalQuestions.map(
        (question, index) => ({
          questionNumber: index + 1,

          id: question.id,

          unitNumber:
            question.unit_number,

          unitTitle:
            question.unit_title,

          topic:
            question.topic,

          questionText:
            question.question_text,

          options: {
            A: question.option_a,
            B: question.option_b,
            C: question.option_c,
            D: question.option_d,
          },

          difficulty:
            question.difficulty,
        })
      );

    /* -------------------------------------------------------
       8. Return test to browser
    ------------------------------------------------------- */

    return NextResponse.json({
      success: true,

      attemptId:
        attempt.id,

      testNumber,

      questionCount:
        safeQuestions.length,

      durationMinutes,

      questions:
        safeQuestions,
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
