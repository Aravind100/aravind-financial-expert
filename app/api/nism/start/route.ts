import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

/* =========================================================
   NISM V-A MOCK TEST START API

   Features:
   - 100 questions
   - 12-unit distribution
   - 25 Easy / 50 Medium / 25 Hard
   - Avoid previous mock-test question sets
   - Prefer Approved questions
   - Prefer Scenario / Application / Calculation questions
   - Balance A/B/C/D answer positions
   - Fetch 1,100+ questions safely in pages
   - Existing frontend response format preserved
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

type QuestionRecord = {
  id: string;
  module_code?: string | null;
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

type AttemptRecord = {
  id: string;
  mock_test_id: string;
  submitted_at: string | null;
  created_at: string | null;
};

/* =========================================================
   SHUFFLE
   ========================================================= */

function shuffle<T>(array: T[]): T[] {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
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

  if (v === "easy") return "Easy";
  if (v === "medium") return "Medium";
  if (v === "hard") return "Hard";

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

  if (["A", "B", "C", "D"].includes(v)) {
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

  if (v === "scenario") return "Scenario";
  if (v === "application") return "Application";
  if (v === "calculation") return "Calculation";
  if (v === "regulatory") return "Regulatory";

  return "Conceptual";
}

/* =========================================================
   QUALITY SCORE

   Approved questions are preferred.
   Review questions remain eligible so Tests 2-10 can be
   generated without requiring another 900-question manual
   approval exercise.
   ========================================================= */

function qualityScore(
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
   TYPE SCORE

   Prefer application/scenario/calculation questions where
   available.

   These are preferences, NOT hard requirements.
   ========================================================= */

function typeScore(
  question: QuestionRecord,
  currentScenarioApplication: number,
  currentCalculations: number
): number {
  const type = normalizeQuestionType(
    question.question_type
  );

  let score = 0;

  if (
    (type === "Scenario" ||
      type === "Application") &&
    currentScenarioApplication < 30
  ) {
    score += 25;
  }

  if (
    (type === "Calculation" ||
      question.is_calculation === true) &&
    currentCalculations < 10
  ) {
    score += 30;
  }

  if (
    question.is_scenario === true &&
    currentScenarioApplication < 30
  ) {
    score += 10;
  }

  return score;
}

/* =========================================================
   ANSWER POSITION SCORE
   ========================================================= */

function answerBalanceScore(
  question: QuestionRecord,
  answerCounts: Record<string, number>
): number {
  const answer = normalizeAnswer(
    question.correct_option
  );

  const target =
    ANSWER_TARGETS[answer] ?? 25;

  const current =
    answerCounts[answer] ?? 0;

  return (target - current) * 4;
}

/* =========================================================
   TOTAL CANDIDATE SCORE
   ========================================================= */

function candidateScore(
  question: QuestionRecord,
  answerCounts: Record<string, number>,
  currentScenarioApplication: number,
  currentCalculations: number
): number {
  const quality = qualityScore(question);

  const type = typeScore(
    question,
    currentScenarioApplication,
    currentCalculations
  );

  const answer = answerBalanceScore(
    question,
    answerCounts
  );

  /*
    Small random component so different users do not
    always receive exactly the same ordering.
  */
  const randomness =
    Math.random() * 8;

  return (
    quality +
    type +
    answer +
    randomness
  );
}

/* =========================================================
   FETCH ALL ACTIVE QUESTIONS

   Supabase can limit large result sets.

   We therefore fetch:
     0-499
     500-999
     1000-1499
     ...

   This safely supports the current 1,100-question bank.
   ========================================================= */

async function fetchAllActiveQuestions(): Promise<
  QuestionRecord[]
> {
  const allQuestions: QuestionRecord[] = [];

  let from = 0;

  while (true) {
    const to =
      from + PAGE_SIZE - 1;

    const { data, error } =
      await supabaseAdmin()
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
        .eq("module_code", MODULE_CODE)
        .eq("is_active", true)
        .range(from, to);

    if (error) {
      throw new Error(
        `Failed to fetch NISM questions: ${error.message}`
      );
    }

    if (!data || data.length === 0) {
      break;
    }

    allQuestions.push(
      ...(data as QuestionRecord[])
    );

    if (data.length < PAGE_SIZE) {
      break;
    }

    from += PAGE_SIZE;
  }

  return allQuestions;
}

/* =========================================================
   GET PREVIOUS TEST QUESTION IDS

   Test 2:
     excludes latest Test 1 question set

   Test 3:
     excludes latest Test 1 + Test 2 sets

   ...

   Test 10:
     excludes latest Test 1-9 sets

   IMPORTANT:
   We use the latest completed attempt for each previous
   mock test rather than every historical attempt.

   This prevents repeated attempts from permanently
   consuming the entire 1,100-question bank.
   ========================================================= */

async function getPreviousTestQuestionIds(
  testNumber: number
): Promise<Set<string>> {
  if (testNumber <= 1) {
    return new Set<string>();
  }

  const previousTestNumbers =
    Array.from(
      {
        length: testNumber - 1,
      },
      (_, index) => index + 1
    );

  /* -------------------------------------------------------
     Get previous mock test IDs
     ------------------------------------------------------- */

  const {
    data: mockTests,
    error: mockTestsError,
  } = await supabaseAdmin()
    .from("nism_mock_tests")
    .select(
      "id, test_number"
    )
    .eq("module_code", MODULE_CODE)
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
      (row) => row.id
    );

  /* -------------------------------------------------------
     Get attempts belonging to previous tests
     ------------------------------------------------------- */

  const {
    data: attempts,
    error: attemptsError,
  } = await supabaseAdmin()
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

  const typedAttempts =
    attempts as AttemptRecord[];

  /* -------------------------------------------------------
     Keep latest completed attempt for each mock test
     ------------------------------------------------------- */

  const latestAttemptByMockTest =
    new Map<string, string>();

  for (const attempt of typedAttempts) {
    if (!attempt.submitted_at) {
      continue;
    }

    if (
      !latestAttemptByMockTest.has(
        attempt.mock_test_id
      )
    ) {
      latestAttemptByMockTest.set(
        attempt.mock_test_id,
        attempt.id
      );
    }
  }

  const latestAttemptIds =
    Array.from(
      latestAttemptByMockTest.values()
    );

  if (
    latestAttemptIds.length === 0
  ) {
    return new Set<string>();
  }

  /* -------------------------------------------------------
     Get questions belonging to those attempts
     ------------------------------------------------------- */

  const {
    data: attemptQuestions,
    error:
      attemptQuestionsError,
  } = await supabaseAdmin()
    .from("nism_attempt_questions")
    .select(
      "attempt_id, question_id"
    )
    .in(
      "attempt_id",
      latestAttemptIds
    );

  if (attemptQuestionsError) {
    throw new Error(
      `Failed to fetch previous question sets: ${attemptQuestionsError.message}`
    );
  }

  const usedQuestionIds =
    new Set<string>();

  for (
    const row of attemptQuestions || []
  ) {
    if (row.question_id) {
      usedQuestionIds.add(
        row.question_id
      );
    }
  }

  return usedQuestionIds;
}

/* =========================================================
   SELECT QUESTIONS

   First attempt:
     previous questions excluded.

   Fallback:
     previous questions allowed if exact quotas cannot
     otherwise be achieved.

   This prevents Tests 2-10 from breaking because one
   particular unit/difficulty pool becomes tight.
   ========================================================= */

function selectQuestions(
  allQuestions: QuestionRecord[],
  previousQuestionIds: Set<string>,
  allowPreviousQuestions: boolean
): SelectedQuestion[] {
  const selectedIds =
    new Set<string>();

  const selected: SelectedQuestion[] =
    [];

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

  let scenarioApplicationCount = 0;

  let calculationCount = 0;

  /* -------------------------------------------------------
     Determine whether question is eligible
     ------------------------------------------------------- */

  function isEligible(
    question: QuestionRecord
  ): boolean {
    if (
      selectedIds.has(question.id)
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

  /* -------------------------------------------------------
     Get candidates for unit + difficulty
     ------------------------------------------------------- */

  function getPairCandidates(
    unitNumber: number,
    difficulty: string
  ): QuestionRecord[] {
    return allQuestions.filter(
      (question) => {
        if (
          !isEligible(question)
        ) {
          return false;
        }

        if (
          question.unit_number !==
          unitNumber
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
  }

  /* -------------------------------------------------------
     Select most constrained pair first
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
      const unitString of Object.keys(
        remainingUnits
      )
    ) {
      const unit =
        Number(unitString);

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
          getPairCandidates(
            unit,
            difficulty
          );

        if (
          candidates.length === 0
        ) {
          continue;
        }

        const need =
          Math.min(
            remainingUnits[unit],
            remainingDifficulty[
              difficulty
            ]
          ) || 1;

        const scarcity =
          candidates.length /
          need;

        availablePairs.push({
          unit,
          difficulty,
          candidates,
          scarcity,
        });
      }
    }

    if (
      availablePairs.length === 0
    ) {
      break;
    }

    /*
      Most constrained pair first.
    */
    availablePairs.sort(
      (a, b) =>
        a.scarcity -
        b.scarcity
    );

    const chosenPair =
      availablePairs[0];

    /* -----------------------------------------------------
       Rank questions inside selected pair
       ----------------------------------------------------- */

    const rankedCandidates =
      chosenPair.candidates
        .map((question) => ({
          question,
          score:
            candidateScore(
              question,
              answerCounts,
              scenarioApplicationCount,
              calculationCount
            ),
        }))
        .sort(
          (a, b) =>
            b.score -
            a.score
        );

    /*
      Choose randomly from the best few candidates.
      This preserves quality preference but avoids
      identical tests every time.
    */
    const randomWindow =
      Math.min(
        5,
        rankedCandidates.length
      );

    const chosen =
      rankedCandidates[
        Math.floor(
          Math.random() *
            randomWindow
        )
      ].question;

    /* -----------------------------------------------------
       Add question
       ----------------------------------------------------- */

    selected.push(chosen);

    selectedIds.add(
      chosen.id
    );

    remainingUnits[
      chosen.unit_number
    ]--;

    const chosenDifficulty =
      normalizeDifficulty(
        chosen.difficulty
      );

    remainingDifficulty[
      chosenDifficulty
    ]--;

    const answer =
      normalizeAnswer(
        chosen.correct_option
      );

    answerCounts[answer]++;

    const type =
      normalizeQuestionType(
        chosen.question_type
      );

    if (
      type === "Scenario" ||
      type === "Application" ||
      chosen.is_scenario === true
    ) {
      scenarioApplicationCount++;
    }

    if (
      type === "Calculation" ||
      chosen.is_calculation === true
    ) {
      calculationCount++;
    }
  }

  /* -------------------------------------------------------
     Exact count validation
     ------------------------------------------------------- */

  if (
    selected.length !== 100
  ) {
    return [];
  }

  /* -------------------------------------------------------
     Validate unit distribution
     ------------------------------------------------------- */

  for (
    const unit of Object.keys(
      UNIT_QUOTAS
    )
  ) {
    const unitNumber =
      Number(unit);

    const actual =
      selected.filter(
        (question) =>
          question.unit_number ===
          unitNumber
      ).length;

    if (
      actual !==
      UNIT_QUOTAS[
        unitNumber
      ]
    ) {
      return [];
    }
  }

  /* -------------------------------------------------------
     Validate difficulty distribution
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
   REBALANCE ANSWER POSITIONS

   Target:
     approximately 20-30 questions for each A/B/C/D.

   Replacement is allowed only when:
     - same unit
     - same difficulty
     - question not already selected
     - previous-test exclusion respected

   We never modify correct_option.
   ========================================================= */

function rebalanceAnswerPositions(
  selected: SelectedQuestion[],
  allQuestions: QuestionRecord[],
  previousQuestionIds: Set<string>,
  allowPreviousQuestions: boolean
): SelectedQuestion[] {
  const selectedIds =
    new Set(
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

    counts[answer]++;
  }

  function findReplacement(
    selectedQuestion: SelectedQuestion,
    desiredAnswer: string
  ): QuestionRecord | null {
    const candidates =
      allQuestions.filter(
        (question) => {
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
            selectedQuestion.unit_number
          ) {
            return false;
          }

          if (
            normalizeDifficulty(
              question.difficulty
            ) !==
            normalizeDifficulty(
              selectedQuestion.difficulty
            )
          ) {
            return false;
          }

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
    Maximum 30 repair iterations.
  */
  for (
    let iteration = 0;
    iteration < 30;
    iteration++
  ) {
    const entries =
      Object.entries(counts);

    entries.sort(
      (a, b) =>
        b[1] - a[1]
    );

    const highest =
      entries[0];

    const lowest =
      entries[
        entries.length - 1
      ];

    /*
      Already nicely balanced.
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

    const overIndex =
      selected.findIndex(
        (question) =>
          normalizeAnswer(
            question.correct_option
          ) === overAnswer
      );

    if (
      overIndex === -1
    ) {
      break;
    }

    const replacement =
      findReplacement(
        selected[overIndex],
        underAnswer
      );

    if (!replacement) {
      break;
    }

    selectedIds.delete(
      selected[overIndex].id
    );

    selectedIds.add(
      replacement.id
    );

    counts[overAnswer]--;

    counts[underAnswer]++;

    selected[overIndex] =
      replacement;
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
    /* -----------------------------------------------------
       Read request
       ----------------------------------------------------- */

    const body =
      await request.json();

    const testNumber =
      Number(
        body?.testNumber
      );

    /* -----------------------------------------------------
       Validate test number
       ----------------------------------------------------- */

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
            "Invalid test number. Test number must be 1-10.",
        },
        {
          status: 400,
        }
      );
    }

    /* -----------------------------------------------------
       1. Get mock test configuration
       ----------------------------------------------------- */

    const {
      data: mockTest,
      error: mockTestError,
    } =
      await supabaseAdmin()
        .from("nism_mock_tests")
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

    if (mockTestError) {
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

    /* -----------------------------------------------------
       2. Fetch complete active question bank
       ----------------------------------------------------- */

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

    /* -----------------------------------------------------
       3. Get previous test question IDs
       ----------------------------------------------------- */

    const previousQuestionIds =
      await getPreviousTestQuestionIds(
        testNumber
      );

    console.log(
      `NISM Test ${testNumber}: ${previousQuestionIds.size} previous-test questions excluded.`
    );

    /* -----------------------------------------------------
       4. First selection attempt

       Previous test questions excluded.
       ----------------------------------------------------- */

    let selectedQuestions =
      selectQuestions(
        allQuestions,
        previousQuestionIds,
        false
      );

    let usedFallback =
      false;

    /* -----------------------------------------------------
       5. Fallback

       If exact unit + difficulty quotas cannot be
       achieved without previous questions, allow
       previous questions.

       This keeps the test operational even if the
       question bank becomes tight.
       ----------------------------------------------------- */

    if (
      selectedQuestions.length !== 100
    ) {
      console.warn(
        `NISM Test ${testNumber}: strict previous-test exclusion could not generate 100 questions. Using fallback.`
      );

      selectedQuestions =
        selectQuestions(
          allQuestions,
          previousQuestionIds,
          true
        );

      usedFallback = true;
    }

    /* -----------------------------------------------------
       Final selection validation
       ----------------------------------------------------- */

    if (
      selectedQuestions.length !== 100
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to generate a valid 100-question mock test with the current question bank. Please review active questions by unit and difficulty.",
        },
        {
          status: 500,
        }
      );
    }

    /* -----------------------------------------------------
       6. Answer-position balancing
       ----------------------------------------------------- */

    selectedQuestions =
      rebalanceAnswerPositions(
        selectedQuestions,
        allQuestions,
        previousQuestionIds,
        usedFallback
      );

    /* -----------------------------------------------------
       7. Final random order

       The selection logic decides WHAT questions to use.
       This decides their display order.
       ----------------------------------------------------- */

    selectedQuestions =
      shuffle(
        selectedQuestions
      );

    /* -----------------------------------------------------
       8. Create attempt
       ----------------------------------------------------- */

    const {
      data: attempt,
      error: attemptError,
    } =
      await supabaseAdmin()
        .from("nism_attempts")
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

    /* -----------------------------------------------------
       9. Save question mapping
       ----------------------------------------------------- */

    const attemptQuestionRows =
      selectedQuestions.map(
        (question, index) => ({
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
    } =
      await supabaseAdmin()
        .from(
          "nism_attempt_questions"
        )
        .insert(
          attemptQuestionRows
        );

    if (
      attemptQuestionError
    ) {
      /*
        Remove orphan attempt if question mapping fails.
      */

      await supabaseAdmin()
        .from("nism_attempts")
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

    /* -----------------------------------------------------
       10. Never expose correct_option to browser

       This is important for exam security.
       ----------------------------------------------------- */

    const safeQuestions =
      selectedQuestions.map(
        (question, index) => ({
          id: question.id,

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

    /* -----------------------------------------------------
       11. Return response

       IMPORTANT:
       This structure is kept compatible with the existing
       frontend.
       ----------------------------------------------------- */

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
