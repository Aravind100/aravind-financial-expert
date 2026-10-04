import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function shuffle<T>(items: T[]): T[] {
  const array = [...items];

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [array[i], array[j]] = [
      array[j],
      array[i],
    ];
  }

  return array;
}

/*
  Practice-test unit distribution.

  This is our internal practice-test structure,
  not an official NISM question blueprint.

  Total = 100 questions.
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

/*
  Global difficulty target for each mock test.

  Total = 100 questions.

  This is our internal practice-test target,
  not an official NISM difficulty blueprint.
*/
const DIFFICULTY_TARGETS: Record<
  string,
  number
> = {
  Easy: 25,
  Medium: 50,
  Hard: 25,
};

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const testNumber = Number(
      body?.testNumber
    );

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
          error:
            "Invalid mock test number.",
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

    if (
      mockTestError ||
      !mockTest
    ) {
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
      Number(
        mockTest.question_count
      ) || 100;

    const durationMinutes =
      Number(
        mockTest.duration_minutes
      ) || 120;

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
      allQuestions.length <
        questionCount
    ) {
      return NextResponse.json(
        {
          error:
            "There are not enough active questions in the question bank.",
          available:
            allQuestions?.length || 0,
          required:
            questionCount,
        },
        {
          status: 400,
        }
      );
    }

    /* -------------------------------------------------------
       4. Prepare questions by unit and difficulty
    ------------------------------------------------------- */

    type QuestionRecord = {
      id: string;
      unit_number: number;
      unit_title: string;
      topic: string | null;
      question_text: string;
      option_a: string;
      option_b: string;
      option_c: string;
      option_d: string;
      difficulty: string;
    };

    type UnitPool = {
      unitNumber: number;
      quota: number;
      selectedCount: number;
      questions: Record<
        string,
        QuestionRecord[]
      >;
    };

    const unitPools: UnitPool[] =
      Object.entries(
        UNIT_QUOTAS
      ).map(
        ([
          unitKey,
          quota,
        ]) => ({
          unitNumber:
            Number(unitKey),

          quota,

          selectedCount: 0,

          questions: {
            Easy: [],
            Medium: [],
            Hard: [],
          },
        })
      );

    /*
      Put every question into its
      correct unit/difficulty pool.
    */
    for (
      const question of
        allQuestions as QuestionRecord[]
    ) {
      const unit = unitPools.find(
        (item) =>
          item.unitNumber ===
          Number(
            question.unit_number
          )
      );

      if (!unit) {
        continue;
      }

      const difficulty =
        question.difficulty;

      if (
        Object.prototype.hasOwnProperty.call(
          unit.questions,
          difficulty
        )
      ) {
        unit.questions[
          difficulty
        ].push(question);
      }
    }

    /*
      Shuffle every difficulty pool
      independently.
    */
    for (
      const unit of unitPools
    ) {
      unit.questions.Easy =
        shuffle(
          unit.questions.Easy
        );

      unit.questions.Medium =
        shuffle(
          unit.questions.Medium
        );

      unit.questions.Hard =
        shuffle(
          unit.questions.Hard
        );
    }

    /* -------------------------------------------------------
       5. Validate unit availability
    ------------------------------------------------------- */

    for (
      const unit of unitPools
    ) {
      const totalAvailable =
        unit.questions.Easy.length +
        unit.questions.Medium.length +
        unit.questions.Hard.length;

      if (
        totalAvailable <
        unit.quota
      ) {
        return NextResponse.json(
          {
            error:
              `Not enough active questions are available for Unit ${unit.unitNumber}. ` +
              `Required: ${unit.quota}, available: ${totalAvailable}.`,
          },
          {
            status: 400,
          }
        );
      }
    }

    /* -------------------------------------------------------
       6. Allocate global difficulty targets
       
       We allocate one question at a time across
       units so that no unit is forced to contain
       a fixed percentage of Easy/Medium/Hard questions.

       This is important because the difficulty
       distribution is different from unit to unit.
    ------------------------------------------------------- */

    const selectedQuestions: QuestionRecord[] =
      [];

    const difficultyOrder = [
      "Hard",
      "Medium",
      "Easy",
    ];

    for (
      const difficulty of
        difficultyOrder
    ) {
      const target =
        DIFFICULTY_TARGETS[
          difficulty
        ];

      let remaining =
        target;

      /*
        Continue distributing questions
        until the target is reached.
      */
      while (
        remaining > 0
      ) {
        /*
          Find units that still have:
          1. Empty quota slots
          2. Questions of this difficulty
        */
        const availableUnits =
          unitPools.filter(
            (unit) =>
              unit.selectedCount <
                unit.quota &&
              unit.questions[
                difficulty
              ].length > 0
          );

        if (
          availableUnits.length ===
          0
        ) {
          return NextResponse.json(
            {
              error:
                `Unable to create the requested difficulty distribution. ` +
                `Not enough ${difficulty} questions are available ` +
                `within the remaining unit quotas.`,
              requested:
                target,
              remaining,
            },
            {
              status: 400,
            }
          );
        }

        /*
          Randomize the available units
          so repeated tests do not always
          allocate difficulty in the same
          unit pattern.
        */
        const shuffledUnits =
          shuffle(
            availableUnits
          );

        /*
          Give one question to each
          available unit during this
          round.

          This prevents one unit from
          receiving all Hard questions.
        */
        for (
          const unit of
            shuffledUnits
        ) {
          if (
            remaining <= 0
          ) {
            break;
          }

          if (
            unit.selectedCount >=
            unit.quota
          ) {
            continue;
          }

          const pool =
            unit.questions[
              difficulty
            ];

          if (
            pool.length === 0
          ) {
            continue;
          }

          const question =
            pool.shift();

          if (!question) {
            continue;
          }

          selectedQuestions.push(
            question
          );

          unit.selectedCount += 1;

          remaining -= 1;
        }
      }
    }

    /* -------------------------------------------------------
       7. Final validation
    ------------------------------------------------------- */

    if (
      selectedQuestions.length !==
      questionCount
    ) {
      return NextResponse.json(
        {
          error:
            "Unable to build the required mock test.",
          selected:
            selectedQuestions.length,
          required:
            questionCount,
        },
        {
          status: 400,
        }
      );
    }

    /*
      Confirm that each unit received
      exactly its intended quota.
    */
    for (
      const unit of unitPools
    ) {
      if (
        unit.selectedCount !==
        unit.quota
      ) {
        return NextResponse.json(
          {
            error:
              `Unit ${unit.unitNumber} received ` +
              `${unit.selectedCount} questions instead of ` +
              `${unit.quota}.`,
          },
          {
            status: 400,
          }
        );
      }
    }

    /*
      Confirm the final difficulty
      distribution.
    */
    const finalDifficultyCounts: Record<
      string,
      number
    > = {
      Easy: 0,
      Medium: 0,
      Hard: 0,
    };

    for (
      const question of
        selectedQuestions
    ) {
      if (
        Object.prototype.hasOwnProperty.call(
          finalDifficultyCounts,
          question.difficulty
        )
      ) {
        finalDifficultyCounts[
          question.difficulty
        ] += 1;
      }
    }

    for (
      const difficulty of
        difficultyOrder
    ) {
      if (
        finalDifficultyCounts[
          difficulty
        ] !==
        DIFFICULTY_TARGETS[
          difficulty
        ]
      ) {
        return NextResponse.json(
          {
            error:
              `Difficulty distribution validation failed for ${difficulty}.`,
            expected:
              DIFFICULTY_TARGETS[
                difficulty
              ],
            actual:
              finalDifficultyCounts[
                difficulty
              ],
          },
          {
            status: 400,
          }
        );
      }
    }

    /* -------------------------------------------------------
       8. Shuffle final 100 questions
       
       The student should NOT see the difficulty
       pattern from the question order.
    ------------------------------------------------------- */

    const finalQuestions =
      shuffle(
        selectedQuestions
      );

    /* -------------------------------------------------------
       9. CREATE MOCK TEST ATTEMPT
       
       IMPORTANT:
       This matches the actual nism_attempts table schema.
    ------------------------------------------------------- */

    const {
      data: attempt,
      error: attemptError,
    } = await admin
      .from("nism_attempts")
      .insert({
        module_code:
          "V-A",

        mock_test_id:
          mockTest.id,

        total_questions:
          finalQuestions.length,
      })
      .select("id")
      .single();

    if (
      attemptError ||
      !attempt
    ) {
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
       10. Save question order
    ------------------------------------------------------- */

    const attemptQuestions =
      finalQuestions.map(
        (
          question,
          index
        ) => ({
          attempt_id:
            attempt.id,

          question_id:
            question.id,

          question_number:
            index + 1,
        })
      );

    const {
      error:
        attemptQuestionError,
    } = await admin
      .from(
        "nism_attempt_questions"
      )
      .insert(
        attemptQuestions
      );

    if (
      attemptQuestionError
    ) {
      console.error(
        "Attempt question error:",
        attemptQuestionError
      );

      /*
        Clean up the incomplete
        attempt if question assignment
        failed.
      */
      await admin
        .from("nism_attempts")
        .delete()
        .eq(
          "id",
          attempt.id
        );

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
       11. Send safe questions to browser
       
       IMPORTANT:
       Correct answers are NOT sent
       to the browser.
    ------------------------------------------------------- */

    const safeQuestions =
      finalQuestions.map(
        (
          question,
          index
        ) => ({
          questionNumber:
            index + 1,

          id:
            question.id,

          unitNumber:
            question.unit_number,

          unitTitle:
            question.unit_title,

          topic:
            question.topic,

          questionText:
            question.question_text,

          options: {
            A:
              question.option_a,

            B:
              question.option_b,

            C:
              question.option_c,

            D:
              question.option_d,
          },

          difficulty:
            question.difficulty,
        })
      );

    /* -------------------------------------------------------
       12. Return test to browser
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
