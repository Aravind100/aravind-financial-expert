import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const ADMIN_EMAIL = (
  process.env.ADMIN_EMAIL || "aravindchaudhary90@gmail.com"
)
  .trim()
  .toLowerCase();

const BUCKET_NAME = "ipo-images";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

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

export async function POST(request: Request) {
  try {
    /* ============================================
       ADMIN AUTHENTICATION
    ============================================ */

    const admin = await isAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    /* ============================================
       READ FORM DATA
    ============================================ */

    const formData = await request.formData();

    const file = formData.get("file");
    const ipoId = formData.get("ipoId");
    const imageType = formData.get("type");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Image file is required." },
        { status: 400 }
      );
    }

    if (typeof ipoId !== "string" || !ipoId.trim()) {
      return NextResponse.json(
        { error: "IPO ID is required." },
        { status: 400 }
      );
    }

    if (
      imageType !== "logo" &&
      imageType !== "banner"
    ) {
      return NextResponse.json(
        { error: "Invalid image type." },
        { status: 400 }
      );
    }

    /* ============================================
       FILE VALIDATION
    ============================================ */

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Only JPG, PNG and WebP images are allowed.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "Image size must be 5 MB or less.",
        },
        { status: 400 }
      );
    }

    /* ============================================
       VERIFY IPO EXISTS
    ============================================ */

    const supabase = supabaseAdmin();

    const { data: ipo, error: ipoError } = await supabase
      .from("ipos")
      .select("id, company_name, logo_url, banner_url")
      .eq("id", ipoId)
      .single();

    if (ipoError || !ipo) {
      return NextResponse.json(
        { error: "IPO not found." },
        { status: 404 }
      );
    }

    /* ============================================
       FILE EXTENSION
    ============================================ */

    const extensionMap: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    };

    const extension = extensionMap[file.type];

    /* ============================================
       STORAGE PATH
    ============================================ */

    const fileName = `${imageType}-${crypto.randomUUID()}.${extension}`;

    const filePath = `ipos/${ipoId}/${fileName}`;

    const fileBuffer = Buffer.from(
      await file.arrayBuffer()
    );

    /* ============================================
       UPLOAD TO SUPABASE STORAGE
    ============================================ */

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error(
        "IPO image upload error:",
        uploadError
      );

      return NextResponse.json(
        {
          error:
            uploadError.message ||
            "Unable to upload image.",
        },
        { status: 500 }
      );
    }

    /* ============================================
       GET PUBLIC URL
    ============================================ */

    const {
      data: publicUrlData,
    } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;

    /* ============================================
       UPDATE IPO RECORD
    ============================================ */

    const updatePayload =
      imageType === "logo"
        ? { logo_url: publicUrl }
        : { banner_url: publicUrl };

    const { error: updateError } = await supabase
      .from("ipos")
      .update(updatePayload)
      .eq("id", ipoId);

    if (updateError) {
      console.error(
        "IPO image URL update error:",
        updateError
      );

      return NextResponse.json(
        {
          error:
            "Image uploaded, but IPO record could not be updated.",
        },
        { status: 500 }
      );
    }

    /* ============================================
       SUCCESS
    ============================================ */

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: filePath,
      type: imageType,
    });
  } catch (error) {
    console.error(
      "IPO image upload route error:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to upload IPO image.",
      },
      { status: 500 }
    );
  }
}
