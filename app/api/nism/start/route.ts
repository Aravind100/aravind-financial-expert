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
  11: 7,
  12: 8,
};

const DIFFICULTY_TARGETS = {
  Easy: 30,
  Medium: 50,
  Hard: 20,
} as const;

type Difficulty = keyof typeof DIFFICULTY_TARGETS;

type Question = {
  id: string;
  module_code: string;
  unit_number: number;
  unit_title: string | null;
  topic: string | null;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  difficulty: Difficulty;
};

type DifficultyChoice = {
  easy: number;
  medium: number;
  hard: number;
};

function shuffle<T>(items: T[]): T[] {
  const array = [...items];

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

/*
  Find a valid combination of Easy / Medium / Hard questions
  for every unit while maintaining the global target:

  Easy   = 30
  Medium = 50
  Hard   = 20
*/
function findDifficultyPlan(
  questionsByUnit: Record<number, Question[]>
): Record<number, DifficultyChoice> | null {
  const units = Object.keys(UNIT_QUOTAS).map(Number);

  const states = new Map<
    string,
    {
      easy: number;
      medium: number;
      hard: number;
      plan: Record<number, DifficultyChoice>;
    }
  >();

  states.set("0-0-0", {
    easy: 0,
    medium: 0,
    hard: 0,
    plan: {},
  });

  for (const unit of units) {
    const quota = UNIT_QUOTAS[unit];
    const unitQuestions = questionsByUnit[unit] || [];

    const easyAvailable = unitQuestions.filter(
      (q) => q.difficulty === "Easy"
    ).length;

    const mediumAvailable = unitQuestions.filter(
      (q) => q.difficulty === "Medium"
    ).length;

    const hardAvailable = unitQuestions.filter(
      (q) => q.difficulty === "Hard"
    ).length;

    const choices: DifficultyChoice[] = [];

    for (let easy = 0; easy <= quota; easy++) {
      for (let medium = 0; medium <= quota - easy; medium++) {
        const hard = quota - easy - medium;

        if (
          easy <= easyAvailable &&
          medium <= mediumAvailable &&
          hard <= hardAvailable
        ) {
          choices.push({
            easy,
            medium,
            hard,
          });
        }
      }
    }

    const nextStates = new Map<
      string,
      {
        easy: number;
        medium: number;
        hard: number;
        plan: Record<number, DifficultyChoice>;
      }
    >();

    for (const state of states.values()) {
      const randomizedChoices = shuffle(choices);

      for (const choice of randomizedChoices) {
        const newEasy = state.easy + choice.easy;
        const newMedium = state.medium + choice.medium;
        const newHard = state.hard + choice.hard;

        if (newEasy > DIFFICULTY_TARGETS.Easy) continue;
        if (newMedium > DIFFICULTY_TARGETS.Medium) continue;
        if (newHard > DIFFICULTY_TARGETS.Hard) continue;

        const key = `${newEasy}-${newMedium}-${newHard}`;

        if (!nextStates.has(key)) {
          nextStates.set(key, {
            easy: newEasy,
            medium: newMedium,
            hard: newHard,
            plan: {
              ...state.plan,
              [unit]: choice,
            },
          });
        }
      }
    }

    states.clear();

    for (const [key, value] of nextStates) {
      states.set(key, value);
    }
  }

  const finalKey = `${DIFFICULTY_TARGETS.Easy}-${DIFFICULTY_TARGETS.Medium}-${DIFFICULTY_TARGETS.Hard}`;

  return states.get(finalKey)?.plan || null;
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

    /*
      Get mock-test configuration
    */
    const { data: mockTest, error: mockTestError } = await admin
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

    /*
      Get all active V-A questions.
      Correct answer and explanation are NOT selected.
    */
    const { data: questions, error: questionError } = await admin
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

    const allQuestions = (questions || []) as Question[];

    if (allQuestions.length < 100) {
      return NextResponse.json(
        {
          error:
            "Not enough active questions available. 100 questions are required to start the mock test.",
          available: allQuestions.length,
          required: 100,
        },
        {
          status: 400,
        }
      );
    }

    /*
      Group questions by unit.
    */
    const questionsByUnit: Record<number, Question[]> = {};

    for (let unit = 1; unit <= 12; unit++) {
      questionsByUnit[unit] = [];
    }

    for (const question of allQuestions) {
      const unitNumber = Number(question.unit_number);

      if (questionsByUnit[unitNumber]) {
        questionsByUnit[unitNumber].push(question);
      }
    }

    /*
      Check unit availability.
    */
    const unavailableUnits: {
      unit: number;
      required: number;
      available: number;
    }[] = [];

    for (const [unitString, quota] of Object.entries(UNIT_QUOTAS)) {
      const unit = Number(unitString);
      const available = questionsByUnit[unit]?.length || 0;

      if (available < quota) {
        unavailableUnits.push({
          unit,
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

    /*
      Check overall difficulty availability.
    */
    const difficultyCounts: Record<Difficulty, number> = {
      Easy: allQuestions.filter((q) => q.difficulty === "Easy").length,
      Medium: allQuestions.filter((q) => q.difficulty === "Medium").length,
      Hard: allQuestions.filter((q) => q.difficulty === "Hard").length,
    };

    for (const difficulty of ["Easy", "Medium", "Hard"] as Difficulty[]) {
      if (
        difficultyCounts[difficulty] <
        DIFFICULTY_TARGETS[difficulty]
      ) {
        return NextResponse.json(
          {
            error:
              "There are not enough questions of one difficulty level to create a balanced mock test.",
            difficulty,
            required: DIFFICULTY_TARGETS[difficulty],
            available: difficultyCounts[difficulty],
          },
          {
            status: 400,
          }
        );
      }
    }

    /*
      Find a unit + difficulty combination that exactly produces:

      Easy   30
      Medium 50
      Hard   20
    */
    const difficultyPlan = findDifficultyPlan(questionsByUnit);

    if (!difficultyPlan) {
      return NextResponse.json(
        {
          error:
            "The current question bank cannot create the requested balanced difficulty distribution. Please add more questions across the affected units and difficulty levels.",
          target: DIFFICULTY_TARGETS,
        },
        {
          status: 400,
        }
      );
    }

    /*
      Select questions according to the calculated plan.
    */
    const selectedQuestions: Question[] = [];

    for (const [unitString, choice] of Object.entries(difficultyPlan)) {
      const unit = Number(unitString);

      const unitQuestions = shuffle(questionsByUnit[unit]);

      const easyQuestions = shuffle(
        unitQuestions.filter((q) => q.difficulty === "Easy")
      );

      const mediumQuestions = shuffle(
        unitQuestions.filter((q) => q.difficulty === "Medium")
      );

      const hardQuestions = shuffle(
        unitQuestions.filter((q) => q.difficulty === "Hard")
      );

      selectedQuestions.push(
        ...easyQuestions.slice(0, choice.easy),
        ...mediumQuestions.slice(0, choice.medium),
        ...hardQuestions.slice(0, choice.hard)
      );
    }

    /*
      Final randomization.
    */
    const finalQuestions = shuffle(selectedQuestions);

    if (finalQuestions.length !== 100) {
      return NextResponse.json(
        {
          error: "Unable to create a 100-question mock test.",
          selected: finalQuestions.length,
        },
        {
          status: 500,
        }
      );
    }

    /*
      Create attempt.
    */
    const { data: attempt, error: attemptError } = await admin
      .from("nism_attempts")
      .insert({
        test_number: testNumber,
        question_count: 100,
        duration_minutes: mockTest.duration_minutes || 120,
        status: "started",
      })
      .select("id")
      .single();

    if (attemptError) {
      throw attemptError;
    }

    /*
      Save question order.
    */
    const attemptQuestions = finalQuestions.map((question, index) => ({
      attempt_id: attempt.id,
      question_id: question.id,
      question_number: index + 1,
    }));

    const { error: attemptQuestionError } = await admin
      .from("nism_attempt_questions")
      .insert(attemptQuestions);

    if (attemptQuestionError) {
      throw attemptQuestionError;
    }

    /*
      Send only safe question data to browser.
      NEVER send correct_option or explanation here.
    */
    const safeQuestions = finalQuestions.map((question, index) => ({
      question_number: index + 1,
      id: question.id,
      unit_number: question.unit_number,
      unit_title: question.unit_title,
      topic: question.topic,
      question_text: question.question_text,
      option_a: question.option_a,
      option_b: question.option_b,
      option_c: question.option_c,
      option_d: question.option_d,
      difficulty: question.difficulty,
    }));

    return NextResponse.json({
      success: true,
      attemptId: attempt.id,
      testNumber,
      questionCount: 100,
      durationMinutes: mockTest.duration_minutes || 120,

      difficultyDistribution: {
        Easy: 30,
        Medium: 50,
        Hard: 20,
      },

      questions: safeQuestions,
    });
  } catch (error) {
    console.error("NISM mock test start error:", error);

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
