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
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.email) {
    return false;
  }

  return user.email.trim().toLowerCase() === ADMIN_EMAIL;
}

/* ============================================
   UPDATE IPO
============================================ */

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const admin = await isAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized." },
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

    const body = await request.json();

    const supabase = supabaseAdmin();

    const allowedFields = [
      "company_name",
      "slug",
      "status",
      "issue_type",
      "price_band_min",
      "price_band_max",
      "face_value",
      "issue_size",
      "fresh_issue",
      "offer_for_sale",
      "lot_size",
      "minimum_investment",
      "open_date",
      "close_date",
      "allotment_date",
      "listing_date",
      "registrar",
      "lead_managers",
      "company_overview",
      "business_description",
      "business_model",
      "industry",
      "competitive_strengths",
      "risks",
      "objects_of_issue",
      "management",
      "eps",
      "pe_ratio",
      "pb_ratio",
      "roe",
      "roce",
      "debt_equity",
      "retail_quota",
      "nii_quota",
      "qib_quota",
      "employee_quota",
      "other_quota",
      "retail_lot_size",
      "nii_lot_size",
      "subscription_data",
      "listing_information",
      "logo_url",
      "banner_url",
      "is_published",
    ];

    const updates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field];
      }
    }

    const { data, error } = await supabase
      .from("ipos")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("IPO update error:", error);

      return NextResponse.json(
        {
          error:
            error.code === "23505"
              ? "Another IPO already uses this slug."
              : error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      ipo: data,
    });
  } catch (error) {
    console.error("IPO PATCH error:", error);

    return NextResponse.json(
      {
        error: "Unable to update IPO.",
      },
      { status: 500 }
    );
  }
}

/* ============================================
   DELETE IPO
============================================ */

export async function DELETE(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const admin = await isAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized." },
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

    const supabase = supabaseAdmin();

    const { error } = await supabase
      .from("ipos")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("IPO delete error:", error);

      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("IPO DELETE error:", error);

    return NextResponse.json(
      {
        error: "Unable to delete IPO.",
      },
      { status: 500 }
    );
  }
}
