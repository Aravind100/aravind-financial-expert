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

/* ============================================
   GET QUARTERLY RESULTS
============================================ */

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

    if (!id) {
      return NextResponse.json(
        { error: "IPO ID is required." },
        { status: 400 }
      );
    }

    const admin = supabaseAdmin();

    const { data, error } = await admin
      .from("ipo_quarterly_results")
      .select("*")
      .eq("ipo_id", id)
      .order("financial_year", {
        ascending: false,
      })
      .order("quarter_label", {
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
      { error: "Failed to load quarterly results." },
      { status: 500 }
    );
  }
}

/* ============================================
   ADD QUARTERLY RESULT
============================================ */

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

    if (!id) {
      return NextResponse.json(
        { error: "IPO ID is required." },
        { status: 400 }
      );
    }

    if (!body.financial_year?.trim()) {
      return NextResponse.json(
        { error: "Financial year is required." },
        { status: 400 }
      );
    }

    if (!body.quarter_label?.trim()) {
      return NextResponse.json(
        { error: "Quarter is required." },
        { status: 400 }
      );
    }

    const admin = supabaseAdmin();

    const payload = {
      ipo_id: id,
      financial_year: body.financial_year.trim(),
      quarter_label: body.quarter_label.trim(),
      revenue: body.revenue ?? null,
      ebitda: body.ebitda ?? null,
      ebitda_margin: body.ebitda_margin ?? null,
      pat: body.pat ?? null,
      eps: body.eps ?? null,
      total_assets: body.total_assets ?? null,
      total_debt: body.total_debt ?? null,
      net_worth: body.net_worth ?? null,
    };

    const { data, error } = await admin
      .from("ipo_quarterly_results")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      console.error(
        "Quarterly results insert error:",
        error
      );

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      result: data,
    });
  } catch (error) {
    console.error("Quarterly POST error:", error);

    return NextResponse.json(
      { error: "Failed to save quarterly result." },
      { status: 500 }
    );
  }
}

/* ============================================
   UPDATE QUARTERLY RESULT
============================================ */

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

    if (!body.financial_year?.trim()) {
      return NextResponse.json(
        { error: "Financial year is required." },
        { status: 400 }
      );
    }

    if (!body.quarter_label?.trim()) {
      return NextResponse.json(
        { error: "Quarter is required." },
        { status: 400 }
      );
    }

    const admin = supabaseAdmin();

    const updates = {
      financial_year: body.financial_year.trim(),
      quarter_label: body.quarter_label.trim(),
      revenue: body.revenue ?? null,
      ebitda: body.ebitda ?? null,
      ebitda_margin: body.ebitda_margin ?? null,
      pat: body.pat ?? null,
      eps: body.eps ?? null,
      total_assets: body.total_assets ?? null,
      total_debt: body.total_debt ?? null,
      net_worth: body.net_worth ?? null,
    };

    const { data, error } = await admin
      .from("ipo_quarterly_results")
      .update(updates)
      .eq("id", body.result_id)
      .eq("ipo_id", id)
      .select("*")
      .single();

    if (error) {
      console.error(
        "Quarterly results update error:",
        error
      );

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      result: data,
    });
  } catch (error) {
    console.error("Quarterly PATCH error:", error);

    return NextResponse.json(
      { error: "Failed to update quarterly result." },
      { status: 500 }
    );
  }
}

/* ============================================
   DELETE QUARTERLY RESULT
============================================ */

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
      console.error(
        "Quarterly results delete error:",
        error
      );

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
      { error: "Failed to delete quarterly result." },
      { status: 500 }
    );
  }
}
