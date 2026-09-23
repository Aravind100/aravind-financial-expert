import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const ADMIN_EMAIL = (
  process.env.ADMIN_EMAIL ||
  "aravindchaudhary90@gmail.com"
)
  .trim()
  .toLowerCase();

async function isAdmin() {
  const supabase = await createClient();

  const { data, error } =
    await supabase.auth.getUser();

  const email = data.user?.email
    ?.trim()
    .toLowerCase();

  return !error && email === ADMIN_EMAIL;
}


/* =========================================================
   GET QUESTIONS
   ========================================================= */

export async function GET(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } =
      new URL(request.url);

    const search =
      searchParams.get("search")?.trim() || "";

    const unit =
      searchParams.get("unit") || "";

    const difficulty =
      searchParams.get("difficulty") || "";

    const supabase = supabaseAdmin();

    let query = supabase
      .from("nism_questions")
      .select("*")
      .eq("module_code", "V-A")
      .order("unit_number", {
        ascending: true,
      })
      .order("created_at", {
        ascending: false,
      });

    if (unit) {
      query = query.eq(
        "unit_number",
        Number(unit)
      );
    }

    if (difficulty) {
      query = query.eq(
        "difficulty",
        difficulty
      );
    }

    if (search) {
      query = query.or(
        `question_text.ilike.%${search}%,topic.ilike.%${search}%,unit_title.ilike.%${search}%`
      );
    }

    const { data, error } =
      await query;

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          error:
            "Unable to load questions.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      questions: data || [],
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Something went wrong.",
      },
      { status: 500 }
    );
  }
}


/* =========================================================
   ADD QUESTION
   ========================================================= */

export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const requiredFields = [
      "unit_number",
      "unit_title",
      "question_text",
      "option_a",
      "option_b",
      "option_c",
      "option_d",
      "correct_option",
      "difficulty",
    ];

    for (const field of requiredFields) {
      if (
        body[field] === undefined ||
        body[field] === null ||
        String(body[field]).trim() === ""
      ) {
        return NextResponse.json(
          {
            error: `${field} is required.`,
          },
          { status: 400 }
        );
      }
    }

    if (
      !["A", "B", "C", "D"].includes(
        body.correct_option
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Correct answer must be A, B, C or D.",
        },
        { status: 400 }
      );
    }

    if (
      !["Easy", "Medium", "Hard"].includes(
        body.difficulty
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid difficulty.",
        },
        { status: 400 }
      );
    }

    const supabase =
      supabaseAdmin();

    const { data, error } =
      await supabase
        .from("nism_questions")
        .insert({
          module_code: "V-A",
          unit_number:
            Number(body.unit_number),
          unit_title:
            body.unit_title.trim(),
          topic:
            body.topic?.trim() || null,
          question_text:
            body.question_text.trim(),
          option_a:
            body.option_a.trim(),
          option_b:
            body.option_b.trim(),
          option_c:
            body.option_c.trim(),
          option_d:
            body.option_d.trim(),
          correct_option:
            body.correct_option,
          explanation:
            body.explanation?.trim() ||
            null,
          difficulty:
            body.difficulty,
          is_active:
            body.is_active !== false,
          source_type:
            "Original Practice Question",
          source_reference:
            "Based on NISM V-A published objectives",
          language: "English",
        })
        .select()
        .single();

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          error:
            "Unable to create question.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      question: data,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Something went wrong.",
      },
      { status: 500 }
    );
  }
}
