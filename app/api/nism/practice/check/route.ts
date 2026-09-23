import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const questionId = String(body?.questionId || "").trim();
    const selectedOption = String(body?.selectedOption || "")
      .trim()
      .toUpperCase();

    if (!questionId) {
      return NextResponse.json(
        { error: "Question ID is required." },
        { status: 400 }
      );
    }

    if (!["A", "B", "C", "D"].includes(selectedOption)) {
      return NextResponse.json(
        { error: "Invalid answer option." },
        { status: 400 }
      );
    }

    const admin = supabaseAdmin();

    const { data: question, error } = await admin
      .from("nism_questions")
      .select(`
        id,
        correct_option,
        explanation
      `)
      .eq("id", questionId)
      .eq("module_code", "V-A")
      .eq("is_active", true)
      .single();

    if (error || !question) {
      return NextResponse.json(
        { error: "Question not found." },
        { status: 404 }
      );
    }

    const correctOption = String(question.correct_option)
      .trim()
      .toUpperCase();

    const correct = selectedOption === correctOption;

    return NextResponse.json({
      success: true,
      correct,
      correctOption,
      explanation: question.explanation || "",
    });
  } catch (error) {
    console.error("NISM practice answer check error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to check answer.",
      },
      { status: 500 }
    );
  }
}
