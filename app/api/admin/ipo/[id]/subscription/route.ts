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
      .from("ipo_subscription")
      .select("*")
      .eq("ipo_id", id)
      .order("subscription_date", { ascending: false });

    if (error) {
      console.error("Subscription fetch error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      subscriptions: data || [],
    });
  } catch (error) {
    console.error("Subscription GET error:", error);

    return NextResponse.json(
      { error: "Failed to load subscription information" },
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

    if (!body.subscription_date) {
      return NextResponse.json(
        { error: "Subscription date is required." },
        { status: 400 }
      );
    }

    const admin = supabaseAdmin();

    const payload = {
      ipo_id: id,
      subscription_date: body.subscription_date,
      retail: body.retail ?? null,
      nii: body.nii ?? null,
      qib: body.qib ?? null,
      employee: body.employee ?? null,
      other: body.other ?? null,
      total: body.total ?? null,
      notes: body.notes?.trim() || null,
    };

    const { data, error } = await admin
      .from("ipo_subscription")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      console.error("Subscription insert error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      subscription: data,
    });
  } catch (error) {
    console.error("Subscription POST error:", error);

    return NextResponse.json(
      { error: "Failed to save subscription information" },
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

    if (!body.subscription_id) {
      return NextResponse.json(
        { error: "subscription_id is required." },
        { status: 400 }
      );
    }

    if (!body.subscription_date) {
      return NextResponse.json(
        { error: "Subscription date is required." },
        { status: 400 }
      );
    }

    const admin = supabaseAdmin();

    const updates = {
      subscription_date: body.subscription_date,
      retail: body.retail ?? null,
      nii: body.nii ?? null,
      qib: body.qib ?? null,
      employee: body.employee ?? null,
      other: body.other ?? null,
      total: body.total ?? null,
      notes: body.notes?.trim() || null,
    };

    const { data, error } = await admin
      .from("ipo_subscription")
      .update(updates)
      .eq("id", body.subscription_id)
      .eq("ipo_id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Subscription update error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      subscription: data,
    });
  } catch (error) {
    console.error("Subscription PATCH error:", error);

    return NextResponse.json(
      { error: "Failed to update subscription information" },
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

    if (!body.subscription_id) {
      return NextResponse.json(
        { error: "subscription_id is required." },
        { status: 400 }
      );
    }

    const admin = supabaseAdmin();

    const { error } = await admin
      .from("ipo_subscription")
      .delete()
      .eq("id", body.subscription_id)
      .eq("ipo_id", id);

    if (error) {
      console.error("Subscription delete error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Subscription DELETE error:", error);

    return NextResponse.json(
      { error: "Failed to delete subscription information" },
      { status: 500 }
    );
  }
}
