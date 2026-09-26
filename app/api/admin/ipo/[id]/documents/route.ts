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
      .from("ipo_documents")
      .select("*")
      .eq("ipo_id", id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Documents fetch error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      documents: data || [],
    });
  } catch (error) {
    console.error("Documents GET error:", error);

    return NextResponse.json(
      { error: "Failed to load IPO documents" },
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

    const documentName = String(body.document_name || "").trim();
    const documentUrl = String(body.document_url || "").trim();

    if (!documentName) {
      return NextResponse.json(
        { error: "Document name is required." },
        { status: 400 }
      );
    }

    if (!documentUrl) {
      return NextResponse.json(
        { error: "Document URL is required." },
        { status: 400 }
      );
    }

    const admin = supabaseAdmin();

    const payload = {
      ipo_id: id,
      document_name: documentName,
      document_url: documentUrl,
    };

    const { data, error } = await admin
      .from("ipo_documents")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      console.error("Document insert error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      document: data,
    });
  } catch (error) {
    console.error("Documents POST error:", error);

    return NextResponse.json(
      { error: "Failed to save IPO document" },
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

    if (!body.document_id) {
      return NextResponse.json(
        { error: "document_id is required." },
        { status: 400 }
      );
    }

    const documentName = String(body.document_name || "").trim();
    const documentUrl = String(body.document_url || "").trim();

    if (!documentName || !documentUrl) {
      return NextResponse.json(
        { error: "Document name and URL are required." },
        { status: 400 }
      );
    }

    const admin = supabaseAdmin();

    const updates = {
      document_name: documentName,
      document_url: documentUrl,
    };

    const { data, error } = await admin
      .from("ipo_documents")
      .update(updates)
      .eq("id", body.document_id)
      .eq("ipo_id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Document update error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      document: data,
    });
  } catch (error) {
    console.error("Documents PATCH error:", error);

    return NextResponse.json(
      { error: "Failed to update IPO document" },
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

    if (!body.document_id) {
      return NextResponse.json(
        { error: "document_id is required." },
        { status: 400 }
      );
    }

    const admin = supabaseAdmin();

    const { error } = await admin
      .from("ipo_documents")
      .delete()
      .eq("id", body.document_id)
      .eq("ipo_id", id);

    if (error) {
      console.error("Document delete error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Documents DELETE error:", error);

    return NextResponse.json(
      { error: "Failed to delete IPO document" },
      { status: 500 }
    );
  }
}
