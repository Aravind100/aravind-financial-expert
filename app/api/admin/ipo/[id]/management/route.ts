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
      .from("ipo_management")
      .select("*")
      .eq("ipo_id", id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Management fetch error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      management: data || [],
    });
  } catch (error) {
    console.error("Management GET error:", error);

    return NextResponse.json(
      { error: "Failed to load management information" },
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

    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 }
      );
    }

    const admin = supabaseAdmin();

    const payload = {
      ipo_id: id,
      name: body.name.trim(),
      designation: body.designation?.trim() || null,
      role: body.role?.trim() || null,
      profile: body.profile?.trim() || null,
    };

    const { data, error } = await admin
      .from("ipo_management")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      console.error("Management insert error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      management: data,
    });
  } catch (error) {
    console.error("Management POST error:", error);

    return NextResponse.json(
      { error: "Failed to save management member" },
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

    if (!body.management_id) {
      return NextResponse.json(
        { error: "management_id is required." },
        { status: 400 }
      );
    }

    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 }
      );
    }

    const admin = supabaseAdmin();

    const updates = {
      name: body.name.trim(),
      designation: body.designation?.trim() || null,
      role: body.role?.trim() || null,
      profile: body.profile?.trim() || null,
    };

    const { data, error } = await admin
      .from("ipo_management")
      .update(updates)
      .eq("id", body.management_id)
      .eq("ipo_id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Management update error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      management: data,
    });
  } catch (error) {
    console.error("Management PATCH error:", error);

    return NextResponse.json(
      { error: "Failed to update management member" },
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

    if (!body.management_id) {
      return NextResponse.json(
        { error: "management_id is required." },
        { status: 400 }
      );
    }

    const admin = supabaseAdmin();

    const { error } = await admin
      .from("ipo_management")
      .delete()
      .eq("id", body.management_id)
      .eq("ipo_id", id);

    if (error) {
      console.error("Management delete error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Management DELETE error:", error);

    return NextResponse.json(
      { error: "Failed to delete management member" },
      { status: 500 }
    );
  }
}
