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
   UPDATE QUESTION
   ========================================================= */

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } =
      await context.params;

    const body =
      await request.json();

    const supabase =
      supabaseAdmin();

    const updateData: Record<
      string,
      unknown
    > = {};

    if (
      body.unit_number !==
      undefined
    ) {
      updateData.unit_number =
        Number(body.unit_number);
    }

    if (
      body.unit_title !==
      undefined
    ) {
      updateData.unit_title =
        String(
          body.unit_title
        ).trim();
    }

    if (
      body.topic !==
      undefined
    ) {
      updateData.topic =
        body.topic
          ? String(
              body.topic
            ).trim()
          : null;
    }

    if (
      body.question_text !==
      undefined
    ) {
      updateData.question_text =
        String(
          body.question_text
        ).trim();
    }

    for (const field of [
      "option_a",
      "option_b",
      "option_c",
      "option_d",
    ]) {
      if (
        body[field] !==
        undefined
      ) {
        updateData[field] =
          String(
            body[field]
          ).trim();
      }
    }

    if (
      body.correct_option !==
      undefined
    ) {
      if (
        !["A", "B", "C", "D"].includes(
          body.correct_option
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid correct answer.",
          },
          { status: 400 }
        );
      }

      updateData.correct_option =
        body.correct_option;
    }

    if (
      body.explanation !==
      undefined
    ) {
      updateData.explanation =
        body.explanation
          ? String(
              body.explanation
            ).trim()
          : null;
    }

    if (
      body.difficulty !==
      undefined
    ) {
      if (
        ![
          "Easy",
          "Medium",
          "Hard",
        ].includes(
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

      updateData.difficulty =
        body.difficulty;
    }

    if (
      body.is_active !==
      undefined
    ) {
      updateData.is_active =
        Boolean(
          body.is_active
        );
    }

    updateData.updated_at =
      new Date().toISOString();

    const { data, error } =
      await supabase
        .from("nism_questions")
        .update(updateData)
        .eq("id", id)
        .eq("module_code", "V-A")
        .select()
        .single();

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          error:
            "Unable to update question.",
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


/* =========================================================
   DELETE QUESTION
   ========================================================= */

export async function DELETE(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } =
      await context.params;

    const supabase =
      supabaseAdmin();

    /*
     * We deactivate instead of physically
     * deleting the question.
     *
     * This protects previous attempts.
     */

    const { data, error } =
      await supabase
        .from("nism_questions")
        .update({
          is_active: false,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", id)
        .eq("module_code", "V-A")
        .select()
        .single();

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          error:
            "Unable to deactivate question.",
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
