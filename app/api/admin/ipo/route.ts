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
   CREATE IPO
============================================ */

export async function POST(request: Request) {
  try {
    const admin = await isAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body.company_name?.trim()) {
      return NextResponse.json(
        { error: "Company name is required." },
        { status: 400 }
      );
    }

    if (!body.slug?.trim()) {
      return NextResponse.json(
        { error: "Slug is required." },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    const payload = {
      company_name: body.company_name.trim(),
      slug: body.slug.trim(),

      status: body.status || "upcoming",
      issue_type: body.issue_type || "Mainboard",

      price_band_min: body.price_band_min ?? null,
      price_band_max: body.price_band_max ?? null,

      face_value: body.face_value ?? null,

      issue_size: body.issue_size ?? null,
      fresh_issue: body.fresh_issue ?? null,
      offer_for_sale: body.offer_for_sale ?? null,

      lot_size: body.lot_size ?? null,
      minimum_investment: body.minimum_investment ?? null,

      open_date: body.open_date || null,
      close_date: body.close_date || null,
      allotment_date: body.allotment_date || null,
      listing_date: body.listing_date || null,

      registrar: body.registrar || null,
      lead_managers: body.lead_managers || null,

      company_overview: body.company_overview || null,
      business_description:
        body.business_description || null,
      business_model: body.business_model || null,

      industry: body.industry || null,
      competitive_strengths:
        body.competitive_strengths || null,
      risks: body.risks || null,
      objects_of_issue:
        body.objects_of_issue || null,

      management: body.management || null,

      eps: body.eps ?? null,
      pe_ratio: body.pe_ratio ?? null,
      pb_ratio: body.pb_ratio ?? null,
      roe: body.roe ?? null,
      roce: body.roce ?? null,
      debt_equity: body.debt_equity ?? null,

      retail_quota: body.retail_quota ?? null,
      nii_quota: body.nii_quota ?? null,
      qib_quota: body.qib_quota ?? null,
      employee_quota: body.employee_quota ?? null,
      other_quota: body.other_quota ?? null,

      retail_lot_size:
        body.retail_lot_size ?? null,
      nii_lot_size:
        body.nii_lot_size ?? null,

      subscription_data:
        body.subscription_data || null,

      listing_information:
        body.listing_information || null,

      logo_url: body.logo_url || null,
      banner_url: body.banner_url || null,

      is_published:
        body.is_published === true,
    };

    const { data, error } = await supabase
      .from("ipos")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      console.error("IPO create error:", error);

      return NextResponse.json(
        {
          error:
            error.code === "23505"
              ? "An IPO with this slug already exists."
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
    console.error("IPO POST error:", error);

    return NextResponse.json(
      {
        error: "Unable to create IPO.",
      },
      { status: 500 }
    );
  }
}
