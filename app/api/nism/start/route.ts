import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

/* =========================================================
   NISM V-A MOCK TEST START API

   Internal practice-test structure:
   - 100 questions
   - 12-unit distribution
   - 25 Easy
   - 50 Medium
   - 25 Hard

   Additional automation:
   - Avoid previous mock-test question sets
   - Prefer Approved questions
   - Prefer Scenario / Application / Calculation
   - Balance A/B/C/D answer positions
   - Supports 1,100+ questions
   - Does NOT expose correct answers to browser
   ========================================================= */

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

const ANSWER_TARGETS: Record<string, number> = {
  A: 25,
  B: 25,
  C: 25,
  D: 25,
};

const PAGE_SIZE = 500;

/* =========================================================
   TYPES
   ========================================================= */

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

/* =========================================================
   SHUFFLE
   ========================================================= */

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

/* =========================================================
   NORMALIZE DIFFICULTY
   ========================================================= */

function normalizeDifficulty(
  value: string | null | undefined
): string {
  const v = String(value || "")
    .trim()
    .toLowerCase();

  if (v === "easy") {
    return "Easy";
  }

  if (v === "medium") {
    return "Medium";
  }

  if (v === "hard") {
    return "Hard";
  }

  /*
    Existing bank should contain Easy/Medium/Hard.
    Unknown values are treated as Medium rather than
    crashing the test generator.
  */
  return "Medium";
}

/* =========================================================
   NORMALIZE ANSWER
   ========================================================= */

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

/* =========================================================
   NORMALIZE QUESTION TYPE
   ========================================================= */

function normalizeQuestionType(
  value: string | null | undefined
): string {
  const v = String(value || "")
    .trim()
    .toLowerCase();

  if (v === "scenario") {
    return "Scenario";
  }

  if (v === "application") {
    return "Application";
  }

  if (v === "calculation") {
    return "Calculation";
  }

  if (v === "regulatory") {
    return "Regulatory";
  }

  return "Conceptual";
}

/* =========================================================
   QUALITY SCORE

   Approved > Review

   We DO NOT require Approved because currently the bank
   contains many Review questions and we want Tests 2-10
   generated automatically.
   ========================================================= */

function getQualityScore(
  question: QuestionRecord
): number {
  const status = String(
    question.quality_status || ""
  )
    .trim()
    .toLowerCase();

  if (status === "approved") {
    return 30;
  }

  if (status === "review") {
    return 10;
  }

  return 0;
}

/* =========================================================
   QUESTION TYPE SCORE
   ========================================================= */

function getTypeScore(
  question: QuestionRecord,
  scenarioApplicationCount: number,
  calculationCount: number
): number {
  const type = normalizeQuestionType(
    question.question_type
  );

  let score = 0;

  /*
    Prefer Application / Scenario until we have around
    30 such questions.
  */
  if (
    (type === "Application" ||
      type === "Scenario") &&
    scenarioApplicationCount < 30
  ) {
    score += 25;
  }

  /*
    Prefer Calculation until we have around 10.
  */
  if (
    (type === "Calculation" ||
      question.is_calculation === true) &&
    calculationCount < 10
  ) {
    score += 30;
  }

  /*
    Scenario flag can be useful even when question_type
    has not been classified yet.
  */
  if (
    question.is_scenario === true &&
    scenarioApplicationCount < 30
  ) {
    score += 10;
  }

  return score;
}

/* =========================================================
   ANSWER BALANCE SCORE
   ========================================================= */

function getAnswerBalanceScore(
  question: QuestionRecord,
  answerCounts: Record<string, number>
): number {
  const answer = normalizeAnswer(
    question.correct_option
  );

  const target =
    ANSWER_TARGETS[answer] || 25;

  const current =
    answerCounts[answer] || 0;

  return (target - current) * 4;
}

/* =========================================================
   TOTAL CANDIDATE SCORE
   ========================================================= */

function getCandidateScore(
  question: QuestionRecord,
  answerCounts: Record<string, number>,
  scenarioApplicationCount: number,
  calculationCount: number
): number {
  const qualityScore =
    getQualityScore(question);

  const typeScore =
    getTypeScore(
      question,
      scenarioApplicationCount,
      calculationCount
    );

  const answerScore =
    getAnswerBalanceScore(
      question,
      answerCounts
    );

  /*
    Small random value prevents the same questions from
    always being selected in the same order.
  */
  const randomScore =
    Math.random() * 8;

  return (
    qualityScore +
    typeScore +
    answerScore +
    randomScore
  );
}

/* =========================================================
   FETCH COMPLETE ACTIVE QUESTION BANK

   We deliberately use 500-row pages so a 1,100+ question
   bank is not truncated by a 1,000-row response limit.
   ========================================================= */

async function fetchAllActiveQuestions(): Promise<
  QuestionRecord[]
> {
  const admin = supabaseAdmin();

  const allQuestions: QuestionRecord[] =
    [];

  let start = 0;

  while (true) {
    const end =
      start + PAGE_SIZE - 1;

    const {
      data,
      error,
    } = await admin
      .from("nism_questions")
      .select(
        `
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
        `
      )
      .eq(
        "module_code",
        MODULE_CODE
      )
      .eq(
        "is_active",
        true
      )
      .range(start, end);

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

    /*
      Last page reached.
    */
    if (
      data.length < PAGE_SIZE
    ) {
      break;
    }

    start += PAGE_SIZE;
  }

  return allQuestions;
}

/* =========================================================
   GET PREVIOUS TEST QUESTION IDS

   For Test 2:
     exclude latest completed Test 1 set.

   For Test 3:
     exclude latest completed Test 1 + Test 2 sets.

   ...

   For Test 10:
     exclude latest completed Tests 1-9 sets.

   We intentionally use only the latest completed attempt
   for each previous test, so repeated attempts do not
   permanently consume the whole question bank.
   ========================================================= */

async function getPreviousTestQuestionIds(
  testNumber: number
): Promise<Set<string>> {
  if (testNumber <= 1) {
    return new Set<string>();
  }

  const admin = supabaseAdmin();

  const previousTestNumbers =
    Array.from(
      {
        length: testNumber - 1,
      },
      (_, index) =>
        index + 1
    );

  /* -------------------------------------------------------
     Get previous mock-test IDs
     ------------------------------------------------------- */

  const {
    data: mockTests,
    error: mockTestsError,
  } = await admin
    .from("nism_mock_tests")
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

  if (mockTestsError) {
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
      (row) => row.id as string
    );

  /* -------------------------------------------------------
     Get attempts
     ------------------------------------------------------- */

  const {
    data: attempts,
    error: attemptsError,
  } = await admin
    .from("nism_attempts")
    .select(
      `
      id,
      mock_test_id,
      submitted_at,
      created_at
      `
    )
    .in(
      "mock_test_id",
      mockTestIds
    )
    .order(
      "created_at",
      {
        ascending: false,
      }
    );

  if (attemptsError) {
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

  /* -------------------------------------------------------
     Latest completed attempt per previous test
     ------------------------------------------------------- */

  const latestAttemptIds =
    new Map<
      string,
      string
    >();

  for (
    const attempt of attempts
  ) {
    const mockTestId =
      String(
        attempt.mock_test_id
      );

    const attemptId =
      String(
        attempt.id
      );

    const submittedAt =
      attempt.submitted_at;

    if (
      !submittedAt
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

  /* -------------------------------------------------------
     Get questions from those attempts
     ------------------------------------------------------- */

  const {
    data: attemptQuestions,
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
      attemptQuestions || []
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

/* =========================================================
   SELECT QUESTIONS

   The algorithm maintains:

   - exact unit quota
   - exact difficulty quota
   - no duplicate questions
   - previous-test exclusion where possible

   It selects the most constrained unit/difficulty pool
   first, reducing the possibility of running out of a
   particular combination at the end.
   ========================================================= */

function selectQuestions(
  allQuestions: QuestionRecord[],
  previousQuestionIds: Set<string>,
  allowPreviousQuestions: boolean
): QuestionRecord[] {
  const selected: QuestionRecord[] =
    [];

  const selectedIds =
    new Set<string>();

  const remainingUnits: Record<
    number,
    number
  > = {
    ...UNIT_QUOTAS,
  };

  const remainingDifficulty: Record<
    string,
    number
  > = {
    ...DIFFICULTY_TARGETS,
  };

  const answerCounts: Record<
    string,
    number
  > = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
  };

  let scenarioApplicationCount =
    0;

  let calculationCount =
    0;

  /* -------------------------------------------------------
     Candidate eligibility
     ------------------------------------------------------- */

  function isEligible(
    question: QuestionRecord
  ): boolean {
    /*
      Never duplicate inside current test.
    */
    if (
      selectedIds.has(
        question.id
      )
    ) {
      return false;
    }

    /*
      Exclude previous tests unless fallback mode is active.
    */
    if (
      !allowPreviousQuestions &&
      previousQuestionIds.has(
        question.id
      )
    ) {
      return false;
    }

    /*
      Unit quota still required.
    */
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

    /*
      Difficulty quota still required.
    */
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

  /* -------------------------------------------------------
     Main selection loop
     ------------------------------------------------------- */

  while (
    selected.length < 100
  ) {
    const availablePairs: Array<{
      unit: number;
      difficulty: string;
      candidates: QuestionRecord[];
      scarcity: number;
    }> = [];

    for (
      const unitKey of Object.keys(
        remainingUnits
      )
    ) {
      const unit =
        Number(unitKey);

      if (
        remainingUnits[unit] <= 0
      ) {
        continue;
      }

      for (
        const difficulty of Object.keys(
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
            (question) => {
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
                ) === difficulty
              );
            }
          );

        if (
          candidates.length === 0
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

        const scarcity =
          candidates.length /
          required;

        availablePairs.push({
          unit,
          difficulty,
          candidates,
          scarcity,
        });
      }
    }

    /*
      No eligible pair remains.
    */
    if (
      availablePairs.length === 0
    ) {
      break;
    }

    /*
      Most constrained combination first.
    */
    availablePairs.sort(
      (a, b) =>
        a.scarcity -
        b.scarcity
    );

    const chosenPair =
      availablePairs[0];

    /* -------------------------------------------------------
       Rank candidates
       ------------------------------------------------------- */

    const ranked =
      chosenPair.candidates
        .map(
          (question) => ({
            question,
            score:
              getCandidateScore(
                question,
                answerCounts,
                scenarioApplicationCount,
                calculationCount
              ),
          })
        )
        .sort(
          (a, b) =>
            b.score -
            a.score
        );

    /*
      Choose randomly among top five candidates.
    */
    const topCount =
      Math.min(
        5,
        ranked.length
      );

    const selectedCandidate =
      ranked[
        Math.floor(
          Math.random() *
            topCount
        )
      ];

    const question =
      selectedCandidate.question;

    /* -------------------------------------------------------
       Add selected question
       ------------------------------------------------------- */

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
      normalizeQuestionType(
        question.question_type
      );

    if (
      type === "Scenario" ||
      type === "Application" ||
      question.is_scenario === true
    ) {
      scenarioApplicationCount++;
    }

    if (
      type === "Calculation" ||
      question.is_calculation === true
    ) {
      calculationCount++;
    }
  }

  /* -------------------------------------------------------
     Must contain exactly 100 questions.
     ------------------------------------------------------- */

  if (
    selected.length !== 100
  ) {
    return [];
  }

  /* -------------------------------------------------------
     Validate unit distribution.
     ------------------------------------------------------- */

  for (
    const unitKey of Object.keys(
      UNIT_QUOTAS
    )
  ) {
    const unit =
      Number(unitKey);

    const actual =
      selected.filter(
        (question) =>
          question.unit_number ===
          unit
      ).length;

    if (
      actual !==
      UNIT_QUOTAS[unit]
    ) {
      return [];
    }
  }

  /* -------------------------------------------------------
     Validate difficulty distribution.
     ------------------------------------------------------- */

  for (
    const difficulty of Object.keys(
      DIFFICULTY_TARGETS
    )
  ) {
    const actual =
      selected.filter(
        (question) =>
          normalizeDifficulty(
            question.difficulty
          ) === difficulty
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

/* =========================================================
   BALANCE ANSWER POSITIONS

   Target range:
     A = 20-30
     B = 20-30
     C = 20-30
     D = 20-30

   Replacement always keeps:
     - same unit
     - same difficulty

   Therefore unit and difficulty quotas remain unchanged.
   ========================================================= */

function rebalanceAnswerPositions(
  selected: QuestionRecord[],
  allQuestions: QuestionRecord[],
  previousQuestionIds: Set<string>,
  allowPreviousQuestions: boolean
): QuestionRecord[] {
  const selectedIds =
    new Set<string>(
      selected.map(
        (question) =>
          question.id
      )
    );

  const counts: Record<
    string,
    number
  > = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
  };

  for (
    const question of selected
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
        (question) => {
          /*
            Don't duplicate a selected question.
          */
          if (
            selectedIds.has(
              question.id
            )
          ) {
            return false;
          }

          /*
            Respect previous-test exclusion.
          */
          if (
            !allowPreviousQuestions &&
            previousQuestionIds.has(
              question.id
            )
          ) {
            return false;
          }

          /*
            Keep exact same unit.
          */
          if (
            question.unit_number !==
            original.unit_number
          ) {
            return false;
          }

          /*
            Keep exact same difficulty.
          */
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
            Desired answer position.
          */
          return (
            normalizeAnswer(
              question.correct_option
            ) === desiredAnswer
          );
        }
      );

    if (
      candidates.length === 0
    ) {
      return null;
    }

    return shuffle(
      candidates
    )[0];
  }

  /*
    Maximum 30 repair attempts.
  */
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
          b[1] - a[1]
      );

    const highest =
      sorted[0];

    const lowest =
      sorted[sorted.length - 1];

    /*
      Already within target range.
    */
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
        (question) =>
          normalizeAnswer(
            question.correct_option
          ) === overAnswer
      );

    if (
      replaceIndex === -1
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

    if (!replacement) {
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
    ] = replacement;
  }

  return selected;
}

/* =========================================================
   POST
   ========================================================= */

export async function POST(
  request: Request
) {
  try {
    /* -------------------------------------------------------
       Parse request
       ------------------------------------------------------- */

    const body =
      await request.json();

    const testNumber =
      Number(
        body?.testNumber
      );

    /* -------------------------------------------------------
       Validate test number
       ------------------------------------------------------- */

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

    /*
      IMPORTANT:
      Your project uses supabaseAdmin() as a function.
    */
    const admin =
      supabaseAdmin();

    /* -------------------------------------------------------
       1. Get mock-test configuration
       ------------------------------------------------------- */

    const {
      data: mockTest,
      error: mockTestError,
    } = await admin
      .from(
        "nism_mock_tests"
      )
      .select(
        `
        id,
        module_code,
        test_number,
        title,
        question_count,
        duration_minutes,
        passing_percentage,
        is_active
        `
      )
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

    /* -------------------------------------------------------
       2. Fetch complete active question bank
       ------------------------------------------------------- */

    const allQuestions =
      await fetchAllActiveQuestions();

    console.log(
      `NISM: Loaded ${allQuestions.length} active questions.`
    );

    if (
      allQuestions.length < 100
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

    /* -------------------------------------------------------
       3. Find questions used by previous tests
       ------------------------------------------------------- */

    const previousQuestionIds =
      await getPreviousTestQuestionIds(
        testNumber
      );

    console.log(
      `NISM Test ${testNumber}: ${previousQuestionIds.size} previous-test questions identified.`
    );

    /* -------------------------------------------------------
       4. Strict selection

       Previous test questions excluded.
       ------------------------------------------------------- */

    let selectedQuestions =
      selectQuestions(
        allQuestions,
        previousQuestionIds,
        false
      );

    let usedFallback =
      false;

    /* -------------------------------------------------------
       5. Fallback selection

       If the remaining unused bank cannot satisfy all exact
       quotas, allow previous questions so the test can still
       operate.

       This is only a safety mechanism.
       ------------------------------------------------------- */

    if (
      selectedQuestions.length !== 100
    ) {
      console.warn(
        `NISM Test ${testNumber}: strict selection could not create 100 questions. Activating fallback.`
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

    /* -------------------------------------------------------
       6. Final selection validation
       ------------------------------------------------------- */

    if (
      selectedQuestions.length !== 100
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

    /* -------------------------------------------------------
       7. Balance A/B/C/D
       ------------------------------------------------------- */

    selectedQuestions =
      rebalanceAnswerPositions(
        selectedQuestions,
        allQuestions,
        previousQuestionIds,
        usedFallback
      );

    /* -------------------------------------------------------
       8. Shuffle display order
       ------------------------------------------------------- */

    selectedQuestions =
      shuffle(
        selectedQuestions
      );

    /* -------------------------------------------------------
       9. Create attempt
       ------------------------------------------------------- */

    const {
      data: attempt,
      error: attemptError,
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

    /* -------------------------------------------------------
       10. Save question mapping
       ------------------------------------------------------- */

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

      /*
        Remove orphan attempt.
      */
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

    /* -------------------------------------------------------
       11. Prepare SAFE browser questions

       NEVER send:
         correct_option
         quality_status
         question_type
         internal metadata

       Correct answers stay on the server.
       ------------------------------------------------------- */

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

          optionA:
            question.option_a,

          optionB:
            question.option_b,

          optionC:
            question.option_c,

          optionD:
            question.option_d,

          difficulty:
            normalizeDifficulty(
              question.difficulty
            ),
        })
      );

    /* -------------------------------------------------------
       12. Return response

       This keeps the existing frontend response structure.
       ------------------------------------------------------- */

    return NextResponse.json({
      success: true,

      attemptId:
        attempt.id,

      testNumber:
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
