import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const ADMIN_EMAIL = (
  process.env.ADMIN_EMAIL || "aravindchaudhary90@gmail.com"
)
  .trim()
  .toLowerCase();

async function isAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email?.trim().toLowerCase();

  return !!email && email === ADMIN_EMAIL;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const admin = supabaseAdmin();

    const { data, error } = await admin
      .from("ipo_quarterly_results")
      .select("*")
      .eq("ipo_id", id)
      .order("financial_year", {
        ascending: false,
      })
      .order("quarter", {
        ascending: false,
      })
      .limit(4);

    if (error) {
      console.error("Quarterly results fetch error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      results: data || [],
    });
  } catch (error) {
    console.error("Quarterly GET error:", error);

    return NextResponse.json(
      { error: "Failed to load quarterly results" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    const admin = supabaseAdmin();

    const payload = {
      ipo_id: id,
      financial_year: body.financial_year || null,
      quarter: body.quarter || null,
      revenue: body.revenue || null,
      ebitda: body.ebitda || null,
      pat: body.pat || null,
      eps: body.eps || null,
    };

    if (!payload.financial_year || !payload.quarter) {
      return NextResponse.json(
        {
          error:
            "Financial year and quarter are required.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await admin
      .from("ipo_quarterly_results")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      console.error("Quarterly results insert error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      result: data,
    });
  } catch (error) {
    console.error("Quarterly POST error:", error);

    return NextResponse.json(
      { error: "Failed to save quarterly result" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    if (!body.result_id) {
      return NextResponse.json(
        { error: "result_id is required." },
        { status: 400 }
      );
    }

    const admin = supabaseAdmin();

    const updates = {
      financial_year: body.financial_year || null,
      quarter: body.quarter || null,
      revenue: body.revenue || null,
      ebitda: body.ebitda || null,
      pat: body.pat || null,
      eps: body.eps || null,
    };

    const { data, error } = await admin
      .from("ipo_quarterly_results")
      .update(updates)
      .eq("id", body.result_id)
      .eq("ipo_id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Quarterly results update error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      result: data,
    });
  } catch (error) {
    console.error("Quarterly PATCH error:", error);

    return NextResponse.json(
      { error: "Failed to update quarterly result" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    if (!body.result_id) {
      return NextResponse.json(
        { error: "result_id is required." },
        { status: 400 }
      );
    }

    const admin = supabaseAdmin();

    const { error } = await admin
      .from("ipo_quarterly_results")
      .delete()
      .eq("id", body.result_id)
      .eq("ipo_id", id);

    if (error) {
      console.error("Quarterly results delete error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Quarterly DELETE error:", error);

    return NextResponse.json(
      { error: "Failed to delete quarterly result" },
      { status: 500 }
    );
  }
}
