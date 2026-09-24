import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const UNIT_TITLES: Record<number, string> = {
  1: "Investment Landscape",
  2: "Concept & Role of a Mutual Fund",
  3: "Legal Structure of Mutual Funds",
  4: "Legal & Regulatory Framework",
  5: "Scheme Related Concepts",
  6: "Distribution & Investor Services",
  7: "NAV, Valuation & Related Concepts",
  8: "Taxation & Financial Planning",
  9: "Investor Services",
  10: "Risk, Return & Performance",
  11: "Scheme Selection",
  12: "Scheme Selection & Suitability",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const unitNumber = Number(body.unitNumber);
    const questionCount = Number(body.questionCount);

    if (
      !Number.isInteger(unitNumber) ||
      unitNumber < 1 ||
      unitNumber > 12
    ) {
      return NextResponse.json(
        {
          error: "Invalid unit number.",
        },
        { status: 400 }
      );
    }

    if (![10, 20, 25].includes(questionCount)) {
      return NextResponse.json(
        {
          error: "Question count must be 10, 20 or 25.",
        },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("nism_questions")
      .select(
        `
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
        `
      )
      .eq("module_code", "V-A")
      .eq("unit_number", unitNumber)
      .eq("is_active", true);

    if (error) {
      console.error("NISM practice question fetch error:", error);

      return NextResponse.json(
        {
          error: "Unable to load practice questions.",
        },
        { status: 500 }
      );
    }

    if (!data || data.length < questionCount) {
      return NextResponse.json(
        {
          error: `Only ${data?.length || 0} active questions are available for this unit. Please add more questions to the question bank.`,
        },
        { status: 400 }
      );
    }

    /*
      Randomize the questions.
    */
    const shuffled = [...data].sort(() => Math.random() - 0.5);

    const selected = shuffled.slice(0, questionCount);

    /*
      Never send correct_option or explanation
      to the browser.
    */
    const questions = selected.map((question) => ({
      id: question.id,
      unitNumber: question.unit_number,
      unitTitle:
        question.unit_title ||
        UNIT_TITLES[question.unit_number] ||
        `Unit ${question.unit_number}`,
      topic: question.topic,
      questionText: question.question_text,
      optionA: question.option_a,
      optionB: question.option_b,
      optionC: question.option_c,
      optionD: question.option_d,
      difficulty: question.difficulty,
    }));

    return NextResponse.json({
      success: true,
      unitNumber,
      questionCount: questions.length,
      questions,
    });
  } catch (error) {
    console.error("NISM practice start error:", error);

    return NextResponse.json(
      {
        error: "Unable to start practice. Please try again.",
      },
      { status: 500 }
    );
  }
}
