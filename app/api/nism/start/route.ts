import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const MODULE_CODE = "V-A";

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

const DIFFICULTY_TARGETS: Record<string, number> = {
  Easy: 25,
  Medium: 50,
  Hard: 25,
};

/*
 * Realistic target based on the current question bank.
 *
 * These are SOFT targets.
 *
 * Current bank has approximately:
 * Conceptual: 1039
 * Application: 24
 * Scenario: 25
 * Calculation: 12
 * Regulatory: 0
 *
 * Scenario/calculation flags provide additional
 * usable questions.
 */
const QUESTION_TYPE_TARGETS: Record<string, number> = {
  Conceptual: 50,
  Application: 20,
  Scenario: 18,
  Calculation: 12,
  Regulatory: 0,
};

const ANSWER_TARGETS: Record<string, number> = {
  A: 25,
  B: 25,
  C: 25,
  D: 25,
};

const PAGE_SIZE = 500;

type QuestionRecord = {
  id: string;
  module_code: string | null;
  unit_number: number;
  unit_title: string | null;
  topic: string | null;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  difficulty: string | null;
  question_type: string | null;
  quality_status: string | null;
  is_scenario: boolean | null;
  is_calculation: boolean | null;
};

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

function normalizeDifficulty(
  value: string | null | undefined
): string {
  const v = String(value || "")
    .trim()
    .toLowerCase();

  if (v === "easy") return "Easy";
  if (v === "medium") return "Medium";
  if (v === "hard") return "Hard";

  return "Medium";
}

function normalizeAnswer(
  value: string | null | undefined
): string {
  const v = String(value || "")
    .trim()
    .toUpperCase();

  if (
    v === "A" ||
    v === "B" ||
    v === "C" ||
    v === "D"
  ) {
    return v;
  }

  return "A";
}

function normalizeQuestionType(
  value: string | null | undefined
): string {
  const v = String(value || "")
    .trim()
    .toLowerCase();

  if (v === "application") {
    return "Application";
  }

  if (v === "scenario") {
    return "Scenario";
  }

  if (v === "calculation") {
    return "Calculation";
  }

  if (v === "regulatory") {
    return "Regulatory";
  }

  return "Conceptual";
}

/*
 * Determine the effective type of a question.
 *
 * Priority:
 *
 * 1. Calculation flag
 * 2. Scenario flag
 * 3. Explicit Application
 * 4. Explicit Regulatory
 * 5. Conceptual
 *
 * This allows the existing database flags to
 * improve classification without editing 1,100
 * questions manually.
 */
function getEffectiveQuestionType(
  question: QuestionRecord
): string {
  if (
    question.is_calculation === true
  ) {
    return "Calculation";
  }

  if (
    question.is_scenario === true
  ) {
    return "Scenario";
  }

  const explicitType =
    normalizeQuestionType(
      question.question_type
    );

  if (
    explicitType === "Application"
  ) {
    return "Application";
  }

  if (
    explicitType === "Regulatory"
  ) {
    return "Regulatory";
  }

  return "Conceptual";
}

function getQualityScore(
  question: QuestionRecord
): number {
  const status =
    String(
      question.quality_status || ""
    )
      .trim()
      .toLowerCase();

  if (status === "approved") {
    return 25;
  }

  if (status === "review") {
    return 5;
  }

  return 0;
}

/*
 * Type balancing.
 *
 * IMPORTANT:
 *
 * We compare CURRENT / TARGET rather than
 * simply TARGET - CURRENT.
 *
 * This prevents the 50-question Conceptual
 * target from overpowering all the smaller
 * categories.
 */
function getQuestionTypeScore(
  question: QuestionRecord,
  typeCounts: Record<string, number>
): number {
  const type =
    getEffectiveQuestionType(
      question
    );

  const target =
    QUESTION_TYPE_TARGETS[type] || 0;

  /*
   * Regulatory currently has no available
   * questions, so don't attempt to force it.
   */
  if (target <= 0) {
    return -100;
  }

  const current =
    typeCounts[type] || 0;

  const progressRatio =
    current / target;

  /*
   * Maximum priority at the beginning.
   * Priority reduces as the type approaches
   * its target.
   */
  let score =
    (1 - progressRatio) * 100;

  /*
   * Stronger preference for the less common
   * practical question styles.
   */
  if (
    type === "Calculation" &&
    current < target
  ) {
    score += 25;
  }

  if (
    type === "Scenario" &&
    current < target
  ) {
    score += 20;
  }

  if (
    type === "Application" &&
    current < target
  ) {
    score += 15;
  }

  /*
   * Once the target is reached, strongly
   * discourage additional questions of that
   * type unless necessary.
   */
  if (
    current >= target
  ) {
    score -= 100;
  }

  return score;
}

function getAnswerBalanceScore(
  question: QuestionRecord,
  answerCounts: Record<string, number>
): number {
  const answer =
    normalizeAnswer(
      question.correct_option
    );

  const target =
    ANSWER_TARGETS[answer] || 25;

  const current =
    answerCounts[answer] || 0;

  return (
    target - current
  ) * 4;
}

function getCandidateScore(
  question: QuestionRecord,
  answerCounts: Record<string, number>,
  typeCounts: Record<string, number>
): number {
  return (
    getQualityScore(
      question
    ) +
    getQuestionTypeScore(
      question,
      typeCounts
    ) +
    getAnswerBalanceScore(
      question,
      answerCounts
    ) +
    Math.random() * 10
  );
}

async function fetchAllActiveQuestions(): Promise<
  QuestionRecord[]
> {
  const admin =
    supabaseAdmin();

  const allQuestions:
    QuestionRecord[] = [];

  let start = 0;

  while (true) {
    const end =
      start + PAGE_SIZE - 1;

    const {
      data,
      error,
    } = await admin
      .from(
        "nism_questions"
      )
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
        correct_option,
        difficulty,
        question_type,
        quality_status,
        is_scenario,
        is_calculation
      `)
      .eq(
        "module_code",
        MODULE_CODE
      )
      .eq(
        "is_active",
        true
      )
      .range(
        start,
        end
      );

    if (error) {
      throw new Error(
        `Failed to fetch NISM questions: ${error.message}`
      );
    }

    if (
      !data ||
      data.length === 0
    ) {
      break;
    }

    allQuestions.push(
      ...(data as QuestionRecord[])
    );

    if (
      data.length <
      PAGE_SIZE
    ) {
      break;
    }

    start += PAGE_SIZE;
  }

  return allQuestions;
}

async function getPreviousTestQuestionIds(
  testNumber: number
): Promise<Set<string>> {
  if (
    testNumber <= 1
  ) {
    return new Set<string>();
  }

  const admin =
    supabaseAdmin();

  const previousTestNumbers =
    Array.from(
      {
        length:
          testNumber - 1,
      },
      (_, index) =>
        index + 1
    );

  const {
    data: mockTests,
    error:
      mockTestsError,
  } = await admin
    .from(
      "nism_mock_tests"
    )
    .select(
      "id, test_number"
    )
    .eq(
      "module_code",
      MODULE_CODE
    )
    .in(
      "test_number",
      previousTestNumbers
    );

  if (
    mockTestsError
  ) {
    throw new Error(
      `Failed to fetch previous mock tests: ${mockTestsError.message}`
    );
  }

  if (
    !mockTests ||
    mockTests.length === 0
  ) {
    return new Set<string>();
  }

  const mockTestIds =
    mockTests.map(
      (row) =>
        row.id as string
    );

  const {
    data: attempts,
    error:
      attemptsError,
  } = await admin
    .from(
      "nism_attempts"
    )
    .select(`
      id,
      mock_test_id,
      submitted_at,
      created_at
    `)
    .in(
      "mock_test_id",
      mockTestIds
    )
    .order(
      "created_at",
      {
        ascending:
          false,
      }
    );

  if (
    attemptsError
  ) {
    throw new Error(
      `Failed to fetch previous attempts: ${attemptsError.message}`
    );
  }

  if (
    !attempts ||
    attempts.length === 0
  ) {
    return new Set<string>();
  }

  const latestAttemptIds =
    new Map<
      string,
      string
    >();

  /*
   * Only completed/submitted attempts
   * are used for no-repeat logic.
   */
  for (
    const attempt of
      attempts
  ) {
    const mockTestId =
      String(
        attempt.mock_test_id
      );

    const attemptId =
      String(
        attempt.id
      );

    if (
      !attempt.submitted_at
    ) {
      continue;
    }

    if (
      !latestAttemptIds.has(
        mockTestId
      )
    ) {
      latestAttemptIds.set(
        mockTestId,
        attemptId
      );
    }
  }

  const attemptIds =
    Array.from(
      latestAttemptIds.values()
    );

  if (
    attemptIds.length === 0
  ) {
    return new Set<string>();
  }

  const {
    data:
      attemptQuestions,
    error:
      attemptQuestionsError,
  } = await admin
    .from(
      "nism_attempt_questions"
    )
    .select(
      "attempt_id, question_id"
    )
    .in(
      "attempt_id",
      attemptIds
    );

  if (
    attemptQuestionsError
  ) {
    throw new Error(
      `Failed to fetch previous question sets: ${attemptQuestionsError.message}`
    );
  }

  const usedQuestionIds =
    new Set<string>();

  for (
    const row of
      attemptQuestions ||
      []
  ) {
    if (
      row.question_id
    ) {
      usedQuestionIds.add(
        String(
          row.question_id
        )
      );
    }
  }

  return usedQuestionIds;
}

function selectQuestions(
  allQuestions: QuestionRecord[],
  previousQuestionIds: Set<string>,
  allowPreviousQuestions: boolean
): QuestionRecord[] {
  const selected:
    QuestionRecord[] = [];

  const selectedIds =
    new Set<string>();

  const remainingUnits:
    Record<number, number> = {
      ...UNIT_QUOTAS,
    };

  const remainingDifficulty:
    Record<string, number> = {
      ...DIFFICULTY_TARGETS,
    };

  const answerCounts:
    Record<string, number> = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
  };

  const typeCounts:
    Record<string, number> = {
    Conceptual: 0,
    Application: 0,
    Scenario: 0,
    Calculation: 0,
    Regulatory: 0,
  };

  function isEligible(
    question: QuestionRecord
  ): boolean {
    if (
      selectedIds.has(
        question.id
      )
    ) {
      return false;
    }

    if (
      !allowPreviousQuestions &&
      previousQuestionIds.has(
        question.id
      )
    ) {
      return false;
    }

    if (
      !remainingUnits[
        question.unit_number
      ] ||
      remainingUnits[
        question.unit_number
      ] <= 0
    ) {
      return false;
    }

    const difficulty =
      normalizeDifficulty(
        question.difficulty
      );

    if (
      !remainingDifficulty[
        difficulty
      ] ||
      remainingDifficulty[
        difficulty
      ] <= 0
    ) {
      return false;
    }

    return true;
  }

  while (
    selected.length <
    100
  ) {
    const availablePairs:
      Array<{
        unit: number;
        difficulty: string;
        candidates: QuestionRecord[];
        scarcity: number;
      }> = [];

    /*
     * Preserve the exact unit and
     * difficulty quotas.
     */
    for (
      const unitKey of
        Object.keys(
          remainingUnits
        )
    ) {
      const unit =
        Number(
          unitKey
        );

      if (
        remainingUnits[
          unit
        ] <= 0
      ) {
        continue;
      }

      for (
        const difficulty of
          Object.keys(
            remainingDifficulty
          )
      ) {
        if (
          remainingDifficulty[
            difficulty
          ] <= 0
        ) {
          continue;
        }

        const candidates =
          allQuestions.filter(
            (
              question
            ) => {
              if (
                !isEligible(
                  question
                )
              ) {
                return false;
              }

              if (
                question.unit_number !==
                unit
              ) {
                return false;
              }

              return (
                normalizeDifficulty(
                  question.difficulty
                ) ===
                difficulty
              );
            }
          );

        if (
          candidates.length ===
          0
        ) {
          continue;
        }

        const required =
          Math.min(
            remainingUnits[
              unit
            ],
            remainingDifficulty[
              difficulty
            ]
          ) || 1;

        availablePairs.push({
          unit,
          difficulty,
          candidates,
          scarcity:
            candidates.length /
            required,
        });
      }
    }

    if (
      availablePairs.length ===
      0
    ) {
      break;
    }

    /*
     * Protect scarce combinations first.
     */
    availablePairs.sort(
      (a, b) =>
        a.scarcity -
        b.scarcity
    );

    const chosenPair =
      availablePairs[0];

    /*
     * Rank candidates inside the
     * selected unit/difficulty bucket.
     */
    const ranked =
      chosenPair.candidates
        .map(
          (
            question
          ) => ({
            question,
            score:
              getCandidateScore(
                question,
                answerCounts,
                typeCounts
              ),
          })
        )
        .sort(
          (a, b) =>
            b.score -
            a.score
        );

    /*
     * Randomize among the best candidates
     * so tests are not identical.
     */
    const topCount =
      Math.min(
        8,
        ranked.length
      );

    const question =
      ranked[
        Math.floor(
          Math.random() *
            topCount
        )
      ].question;

    selected.push(
      question
    );

    selectedIds.add(
      question.id
    );

    remainingUnits[
      question.unit_number
    ]--;

    const difficulty =
      normalizeDifficulty(
        question.difficulty
      );

    remainingDifficulty[
      difficulty
    ]--;

    const answer =
      normalizeAnswer(
        question.correct_option
      );

    answerCounts[
      answer
    ]++;

    const type =
      getEffectiveQuestionType(
        question
      );

    if (
      typeCounts[type] !==
      undefined
    ) {
      typeCounts[type]++;
    }
  }

  /*
   * Must contain exactly 100.
   */
  if (
    selected.length !==
    100
  ) {
    return [];
  }

  /*
   * Validate unit distribution.
   */
  for (
    const unitKey of
      Object.keys(
        UNIT_QUOTAS
      )
  ) {
    const unit =
      Number(
        unitKey
      );

    const actual =
      selected.filter(
        (
          question
        ) =>
          question.unit_number ===
          unit
      ).length;

    if (
      actual !==
      UNIT_QUOTAS[
        unit
      ]
    ) {
      return [];
    }
  }

  /*
   * Validate difficulty distribution.
   */
  for (
    const difficulty of
      Object.keys(
        DIFFICULTY_TARGETS
      )
  ) {
    const actual =
      selected.filter(
        (
          question
        ) =>
          normalizeDifficulty(
            question.difficulty
          ) ===
          difficulty
      ).length;

    if (
      actual !==
      DIFFICULTY_TARGETS[
        difficulty
      ]
    ) {
      return [];
    }
  }

  return selected;
}

function rebalanceAnswerPositions(
  selected: QuestionRecord[],
  allQuestions: QuestionRecord[],
  previousQuestionIds: Set<string>,
  allowPreviousQuestions: boolean
): QuestionRecord[] {
  const selectedIds =
    new Set(
      selected.map(
        (
          question
        ) =>
          question.id
      )
    );

  const counts:
    Record<string, number> = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
  };

  for (
    const question of
      selected
  ) {
    const answer =
      normalizeAnswer(
        question.correct_option
      );

    counts[
      answer
    ]++;
  }

  function findReplacement(
    original: QuestionRecord,
    desiredAnswer: string
  ): QuestionRecord | null {
    const candidates =
      allQuestions.filter(
        (
          question
        ) => {
          if (
            selectedIds.has(
              question.id
            )
          ) {
            return false;
          }

          if (
            !allowPreviousQuestions &&
            previousQuestionIds.has(
              question.id
            )
          ) {
            return false;
          }

          if (
            question.unit_number !==
            original.unit_number
          ) {
            return false;
          }

          if (
            normalizeDifficulty(
              question.difficulty
            ) !==
            normalizeDifficulty(
              original.difficulty
            )
          ) {
            return false;
          }

          /*
           * Keep the same effective question
           * type when replacing, so answer
           * balancing doesn't destroy the
           * question-type balance.
           */
          if (
            getEffectiveQuestionType(
              question
            ) !==
            getEffectiveQuestionType(
              original
            )
          ) {
            return false;
          }

          return (
            normalizeAnswer(
              question.correct_option
            ) ===
            desiredAnswer
          );
        }
      );

    if (
      candidates.length ===
      0
    ) {
      return null;
    }

    return shuffle(
      candidates
    )[0];
  }

  for (
    let i = 0;
    i < 30;
    i++
  ) {
    const sorted =
      Object.entries(
        counts
      ).sort(
        (a, b) =>
          b[1] -
          a[1]
      );

    const highest =
      sorted[0];

    const lowest =
      sorted[
        sorted.length - 1
      ];

    if (
      highest[1] <= 30 &&
      lowest[1] >= 20
    ) {
      break;
    }

    const overAnswer =
      highest[0];

    const underAnswer =
      lowest[0];

    const replaceIndex =
      selected.findIndex(
        (
          question
        ) =>
          normalizeAnswer(
            question.correct_option
          ) ===
          overAnswer
      );

    if (
      replaceIndex ===
      -1
    ) {
      break;
    }

    const replacement =
      findReplacement(
        selected[
          replaceIndex
        ],
        underAnswer
      );

    if (
      !replacement
    ) {
      break;
    }

    const oldQuestion =
      selected[
        replaceIndex
      ];

    selectedIds.delete(
      oldQuestion.id
    );

    selectedIds.add(
      replacement.id
    );

    counts[
      overAnswer
    ]--;

    counts[
      underAnswer
    ]++;

    selected[
      replaceIndex
    ] =
      replacement;
  }

  return selected;
}

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const testNumber =
      Number(
        body?.testNumber
      );

    /*
     * Validate test number.
     */
    if (
      !Number.isInteger(
        testNumber
      ) ||
      testNumber < 1 ||
      testNumber > 10
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid mock test number. Test number must be between 1 and 10.",
        },
        {
          status: 400,
        }
      );
    }

    const admin =
      supabaseAdmin();

    /*
     * Load mock test configuration.
     */
    const {
      data: mockTest,
      error:
        mockTestError,
    } = await admin
      .from(
        "nism_mock_tests"
      )
      .select(`
        id,
        module_code,
        test_number,
        title,
        question_count,
        duration_minutes,
        passing_percentage,
        is_active
      `)
      .eq(
        "module_code",
        MODULE_CODE
      )
      .eq(
        "test_number",
        testNumber
      )
      .eq(
        "is_active",
        true
      )
      .maybeSingle();

    if (
      mockTestError
    ) {
      console.error(
        "Mock test configuration error:",
        mockTestError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            `Failed to load mock test: ${mockTestError.message}`,
        },
        {
          status: 500,
        }
      );
    }

    if (!mockTest) {
      return NextResponse.json(
        {
          success: false,
          error:
            `Mock Test ${testNumber} is not configured.`,
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Load all active questions.
     */
    const allQuestions =
      await fetchAllActiveQuestions();

    console.log(
      `NISM: Loaded ${allQuestions.length} active questions.`
    );

    if (
      allQuestions.length <
      100
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            `Only ${allQuestions.length} active questions are available. At least 100 are required.`,
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Find questions used by the latest
     * submitted previous tests.
     */
    const previousQuestionIds =
      await getPreviousTestQuestionIds(
        testNumber
      );

    console.log(
      `NISM Test ${testNumber}: ${previousQuestionIds.size} previous-test questions identified.`
    );

    /*
     * Strict selection:
     * no reuse of previous completed tests.
     */
    let selectedQuestions =
      selectQuestions(
        allQuestions,
        previousQuestionIds,
        false
      );

    let usedFallback =
      false;

    /*
     * Fallback only if exact 100 questions
     * cannot be created under all current
     * unit/difficulty constraints.
     */
    if (
      selectedQuestions.length !==
      100
    ) {
      console.warn(
        `NISM Test ${testNumber}: strict selection failed. Activating fallback.`
      );

      selectedQuestions =
        selectQuestions(
          allQuestions,
          previousQuestionIds,
          true
        );

      usedFallback =
        true;
    }

    if (
      selectedQuestions.length !==
      100
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to generate a valid 100-question mock test from the current question bank.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Balance A/B/C/D without changing
     * unit, difficulty or effective type.
     */
    selectedQuestions =
      rebalanceAnswerPositions(
        selectedQuestions,
        allQuestions,
        previousQuestionIds,
        usedFallback
      );

    /*
     * Random final order.
     */
    selectedQuestions =
      shuffle(
        selectedQuestions
      );

    /*
     * Create attempt.
     */
    const {
      data: attempt,
      error:
        attemptError,
    } = await admin
      .from(
        "nism_attempts"
      )
      .insert({
        module_code:
          MODULE_CODE,

        mock_test_id:
          mockTest.id,

        started_at:
          new Date().toISOString(),

        total_questions:
          selectedQuestions.length,

        attempted_questions:
          0,

        correct_answers:
          0,

        wrong_answers:
          0,

        unanswered_questions:
          selectedQuestions.length,

        score: 0,

        percentage: 0,

        passed: false,

        time_taken_seconds:
          0,

        status:
          "in_progress",
      })
      .select("id")
      .single();

    if (
      attemptError ||
      !attempt
    ) {
      console.error(
        "Attempt creation error:",
        attemptError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            attemptError?.message ||
            "Failed to create NISM attempt.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Store question mapping.
     */
    const attemptQuestionRows =
      selectedQuestions.map(
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
        attemptQuestionRows
      );

    if (
      attemptQuestionError
    ) {
      console.error(
        "Attempt-question mapping error:",
        attemptQuestionError
      );

      await admin
        .from(
          "nism_attempts"
        )
        .delete()
        .eq(
          "id",
          attempt.id
        );

      return NextResponse.json(
        {
          success: false,
          error:
            `Failed to store attempt questions: ${attemptQuestionError.message}`,
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Safe frontend response.
     *
     * IMPORTANT:
     * correct_option is NEVER sent
     * to the browser.
     */
    const safeQuestions =
      selectedQuestions.map(
        (
          question,
          index
        ) => ({
          id:
            question.id,

          questionNumber:
            index + 1,

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
            normalizeDifficulty(
              question.difficulty
            ),
        })
      );

    console.log(
      `NISM Test ${testNumber}: generated ${safeQuestions.length} questions.`
    );

    return NextResponse.json({
      success: true,

      attemptId:
        attempt.id,

      testNumber,

      questionCount:
        safeQuestions.length,

      durationMinutes:
        mockTest.duration_minutes ??
        120,

      questions:
        safeQuestions,
    });

  } catch (error) {
    console.error(
      "NISM START API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unexpected server error.",
      },
      {
        status: 500,
      }
    );
  }
}
