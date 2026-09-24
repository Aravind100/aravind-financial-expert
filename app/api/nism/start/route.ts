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

const DIFFICULTY_TARGETS = {
  Easy: 30,
  Medium: 50,
  Hard: 20,
};

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

    /* -------------------------------------------------------
       1. Get mock test configuration
    ------------------------------------------------------- */

    const { data: mockTest, error: mockTestError } =
      await admin
        .from("nism_mock_tests")
        .select("*")
        .eq("module_code", "V-A")
        .eq("test_number", testNumber)
        .eq("is_active", true)
        .single();

    if (mockTestError || !mockTest) {
      console.error(
        "Mock test fetch error:",
        mockTestError
      );

      return NextResponse.json(
        {
          error: "Mock test configuration not found.",
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
       2. Get active question bank
    ------------------------------------------------------- */

    const { data: allQuestions, error: questionError } =
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
          error: "Unable to load the NISM question bank.",
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
            "There are not enough active questions in the question bank to start this mock test.",
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
       3. Select questions by unit
    ------------------------------------------------------- */

    const selectedQuestions: any[] = [];

    for (const [unitKey, quota] of Object.entries(
      UNIT_QUOTAS
    )) {
      const unitNumber = Number(unitKey);

      const unitQuestions = allQuestions.filter(
        (question) =>
          Number(question.unit_number) === unitNumber
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

      const shuffledUnit =
        shuffle(unitQuestions);

      selectedQuestions.push(
        ...shuffledUnit.slice(0, quota)
      );
    }

    /* -------------------------------------------------------
       4. Adjust to exact question count
    ------------------------------------------------------- */

    let finalQuestions = shuffle(
      selectedQuestions
    );

    if (finalQuestions.length > questionCount) {
      finalQuestions =
        finalQuestions.slice(
          0,
          questionCount
        );
    }

    /* -------------------------------------------------------
       5. Check difficulty distribution
    ------------------------------------------------------- */

    const difficultyCounts = {
      Easy: finalQuestions.filter(
        (q) => q.difficulty === "Easy"
      ).length,

      Medium: finalQuestions.filter(
        (q) => q.difficulty === "Medium"
      ).length,

      Hard: finalQuestions.filter(
        (q) => q.difficulty === "Hard"
      ).length,
    };

    /*
      The unit quotas above determine the 100-question
      structure. We verify the available distribution here
      but do not manufacture duplicate questions.
    */

    console.log(
      "NISM Mock Test difficulty distribution:",
      {
        target: DIFFICULTY_TARGETS,
        actual: difficultyCounts,
      }
    );

    /* -------------------------------------------------------
       6. Create attempt
    ------------------------------------------------------- */

    const { data: attempt, error: attemptError } =
      await admin
        .from("nism_attempts")
        .insert({
          module_code: "V-A",
          test_number: testNumber,
          question_count: finalQuestions.length,
          duration_minutes: durationMinutes,
          status: "started",
        })
        .select("id")
        .single();

    if (attemptError || !attempt) {
      console.error(
        "Attempt creation error:",
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
       7. Save question order
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
        "Attempt question creation error:",
        attemptQuestionError
      );

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
       8. Send safe question data to browser
       Never send correct answers.
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
