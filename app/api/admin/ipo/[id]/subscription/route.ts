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
      .order("category", { ascending: true });

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

    const category = String(body.category || "").trim();

    if (!category) {
      return NextResponse.json(
        { error: "Category is required." },
        { status: 400 }
      );
    }

    if (
      body.subscription_times === undefined ||
      body.subscription_times === null ||
      body.subscription_times === ""
    ) {
      return NextResponse.json(
        { error: "Subscription times is required." },
        { status: 400 }
      );
    }

    const subscriptionTimes = Number(body.subscription_times);

    if (!Number.isFinite(subscriptionTimes) || subscriptionTimes < 0) {
      return NextResponse.json(
        { error: "Subscription times must be a valid non-negative number." },
        { status: 400 }
      );
    }

    const admin = supabaseAdmin();

    const payload = {
      ipo_id: id,
      category,
      subscription_times: subscriptionTimes,
      updated_on: body.updated_on || new Date().toISOString().slice(0, 10),
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

    const category = String(body.category || "").trim();

    if (!category) {
      return NextResponse.json(
        { error: "Category is required." },
        { status: 400 }
      );
    }

    const subscriptionTimes = Number(body.subscription_times);

    if (!Number.isFinite(subscriptionTimes) || subscriptionTimes < 0) {
      return NextResponse.json(
        { error: "Subscription times must be a valid non-negative number." },
        { status: 400 }
      );
    }

    const admin = supabaseAdmin();

    const updates = {
      category,
      subscription_times: subscriptionTimes,
      updated_on: body.updated_on || new Date().toISOString().slice(0, 10),
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
