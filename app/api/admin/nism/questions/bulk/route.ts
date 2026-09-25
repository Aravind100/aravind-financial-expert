import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const ADMIN_EMAIL = (
  process.env.ADMIN_EMAIL || "aravindchaudhary90@gmail.com"
)
  .trim()
  .toLowerCase();

const units: Record<number, string> = {
  1: "Investment Landscape",
  2: "Concept and Role of Mutual Fund",
  3: "Legal Structure of Mutual Funds in India",
  4: "Legal and Regulatory Framework",
  5: "Scheme Related Information",
  6: "Fund Distribution and Channel Management",
  7: "Net Asset Value, Total Expense Ratio and Investment Valuation",
  8: "Taxation",
  9: "Investor Services",
  10: "Risk, Return and Performance",
  11: "Mutual Fund Scheme Selection",
  12: "Financial Planning",
};

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && insideQuotes && next === '"') {
      field += '"';
      i++;
      continue;
    }

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === "," && !insideQuotes) {
      row.push(field);
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && next === "\n") {
        i++;
      }

      row.push(field);
      field = "";

      if (row.some((value) => value.trim() !== "")) {
        rows.push(row);
      }

      row = [];
      continue;
    }

    field += char;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
  }

  if (row.some((value) => value.trim() !== "")) {
    rows.push(row);
  }

  return rows;
}

function clean(value: string | undefined) {
  return (value || "").trim();
}

function normalizeQuestion(text: string) {
  return text
    .replace(/^\uFEFF/, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export async function POST(request: Request) {
  try {
    // ---------------------------------------------
    // 1. ADMIN AUTH
    // ---------------------------------------------

    const supabase = await createClient();

    const { data, error } =
      await supabase.auth.getUser();

    const email = data.user?.email
      ?.trim()
      .toLowerCase();

    if (error || !email) {
      return NextResponse.json(
        {
          error: "Unauthorized. Please login again.",
        },
        { status: 401 }
      );
    }

    if (email !== ADMIN_EMAIL) {
      return NextResponse.json(
        {
          error: "Forbidden. Admin access required.",
        },
        { status: 403 }
      );
    }

    // ---------------------------------------------
    // 2. READ CSV
    // ---------------------------------------------

    const body = await request.json();

    const csvText = body?.csvText;

    if (!csvText || typeof csvText !== "string") {
      return NextResponse.json(
        {
          error: "CSV data is missing.",
        },
        { status: 400 }
      );
    }

    const rows = parseCSV(csvText);

    if (rows.length < 2) {
      return NextResponse.json(
        {
          error:
            "CSV must contain a header row and at least one question.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // 3. HEADERS
    // ---------------------------------------------

    const headers = rows[0].map((header) =>
      clean(header).toLowerCase()
    );

    const requiredHeaders = [
      "unit_number",
      "topic",
      "question_text",
      "option_a",
      "option_b",
      "option_c",
      "option_d",
      "correct_option",
      "explanation",
      "difficulty",
    ];

    const missingHeaders =
      requiredHeaders.filter(
        (header) => !headers.includes(header)
      );

    if (missingHeaders.length > 0) {
      return NextResponse.json(
        {
          error: `Missing CSV columns: ${missingHeaders.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    const indexOf = (name: string) =>
      headers.indexOf(name);

    // ---------------------------------------------
    // 4. VALIDATE QUESTIONS
    // ---------------------------------------------

    const validQuestions: any[] = [];

    const invalidRows: {
      row: number;
      reason: string;
    }[] = [];

    const batchQuestionTexts =
      new Set<string>();

    for (let i = 1; i < rows.length; i++) {
      const rowNumber = i + 1;
      const row = rows[i];

      const unitNumber = Number(
        clean(row[indexOf("unit_number")])
      );

      const topic = clean(
        row[indexOf("topic")]
      );

      const questionText = clean(
        row[indexOf("question_text")]
      );

      const optionA = clean(
        row[indexOf("option_a")]
      );

      const optionB = clean(
        row[indexOf("option_b")]
      );

      const optionC = clean(
        row[indexOf("option_c")]
      );

      const optionD = clean(
        row[indexOf("option_d")]
      );

      const correctOption = clean(
        row[indexOf("correct_option")]
      ).toUpperCase();

      const explanation = clean(
        row[indexOf("explanation")]
      );

      const difficulty = clean(
        row[indexOf("difficulty")]
      );

      // Unit validation
      if (
        !Number.isInteger(unitNumber) ||
        !units[unitNumber]
      ) {
        invalidRows.push({
          row: rowNumber,
          reason:
            "Unit number must be between 1 and 12.",
        });

        continue;
      }

      // Question validation
      if (!questionText) {
        invalidRows.push({
          row: rowNumber,
          reason:
            "Question text is missing.",
        });

        continue;
      }

      // Options validation
      if (
        !optionA ||
        !optionB ||
        !optionC ||
        !optionD
      ) {
        invalidRows.push({
          row: rowNumber,
          reason:
            "All four options are required.",
        });

        continue;
      }

      // Correct option validation
      if (
        !["A", "B", "C", "D"].includes(
          correctOption
        )
      ) {
        invalidRows.push({
          row: rowNumber,
          reason:
            "Correct option must be A, B, C or D.",
        });

        continue;
      }

      // Difficulty validation
      if (
        !["Easy", "Medium", "Hard"].includes(
          difficulty
        )
      ) {
        invalidRows.push({
          row: rowNumber,
          reason:
            "Difficulty must be Easy, Medium or Hard.",
        });

        continue;
      }

      const normalizedQuestion =
        normalizeQuestion(questionText);

      // Duplicate inside CSV
      if (
        batchQuestionTexts.has(
          normalizedQuestion
        )
      ) {
        invalidRows.push({
          row: rowNumber,
          reason:
            "Duplicate question inside this CSV.",
        });

        continue;
      }

      batchQuestionTexts.add(
        normalizedQuestion
      );

      // ---------------------------------------------
      // IMPORTANT:
      // unit_title is automatically generated here.
      // ---------------------------------------------

      validQuestions.push({
        module_code: "V-A",

        unit_number: unitNumber,

        unit_title:
          units[unitNumber],

        topic,

        question_text:
          questionText,

        option_a: optionA,

        option_b: optionB,

        option_c: optionC,

        option_d: optionD,

        correct_option:
          correctOption,

        explanation,

        difficulty,

        source_type:
          "Original Practice Question",

        source_reference:
          "Independent NISM Series V-A practice material",

        language: "English",

        is_active: true,
      });
    }

    // ---------------------------------------------
    // 5. NO VALID QUESTIONS
    // ---------------------------------------------

    if (validQuestions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          imported: 0,
          skipped: 0,
          invalidRows,
          error:
            "No valid questions were found.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // 6. ADMIN SUPABASE CLIENT
    // ---------------------------------------------

    const admin = supabaseAdmin();

    // ---------------------------------------------
    // 7. CHECK EXISTING QUESTIONS
    // ---------------------------------------------

    const {
      data: existingQuestions,
      error: existingError,
    } = await admin
      .from("nism_questions")
      .select("question_text")
      .eq("module_code", "V-A");

    if (existingError) {
      return NextResponse.json(
        {
          error:
            "Could not read existing questions.",
          message:
            existingError.message,
          code:
            existingError.code,
          details:
            existingError.details,
          hint:
            existingError.hint,
        },
        { status: 500 }
      );
    }

    const existingQuestionSet =
      new Set<string>();

    for (
      const item of existingQuestions || []
    ) {
      existingQuestionSet.add(
        normalizeQuestion(
          String(
            item.question_text || ""
          )
        )
      );
    }

    // ---------------------------------------------
    // 8. REMOVE DUPLICATES
    // ---------------------------------------------

    const questionsToInsert: any[] = [];

    let skippedDuplicates = 0;

    for (
      const question of validQuestions
    ) {
      const normalizedQuestion =
        normalizeQuestion(
          question.question_text
        );

      if (
        existingQuestionSet.has(
          normalizedQuestion
        )
      ) {
        skippedDuplicates++;
        continue;
      }

      existingQuestionSet.add(
        normalizedQuestion
      );

      questionsToInsert.push(
        question
      );
    }

    // ---------------------------------------------
    // 9. ALL DUPLICATES
    // ---------------------------------------------

    if (questionsToInsert.length === 0) {
      return NextResponse.json({
        success: true,
        imported: 0,
        skipped:
          skippedDuplicates,
        invalidRows,
        message:
          `No new questions imported. ${skippedDuplicates} questions already exist.`,
      });
    }

    // ---------------------------------------------
    // 10. INSERT
    // ---------------------------------------------

    let imported = 0;

    for (
      let i = 0;
      i < questionsToInsert.length;
      i += 25
    ) {
      const batch =
        questionsToInsert.slice(
          i,
          i + 25
        );

      const {
        data: insertedData,
        error: insertError,
      } = await admin
        .from("nism_questions")
        .insert(batch)
        .select("id");

      if (insertError) {
        console.error(
          "NISM insert error:",
          insertError
        );

        return NextResponse.json(
          {
            error: [
              "Supabase rejected the question insert.",
              insertError.message,
              insertError.code
                ? `Code: ${insertError.code}`
                : "",
              insertError.details
                ? `Details: ${insertError.details}`
                : "",
              insertError.hint
                ? `Hint: ${insertError.hint}`
                : "",
            ]
              .filter(Boolean)
              .join(" | "),

            importedBeforeError:
              imported,
          },
          { status: 500 }
        );
      }

      imported +=
        insertedData?.length ||
        batch.length;
    }

    // ---------------------------------------------
    // 11. SUCCESS
    // ---------------------------------------------

    return NextResponse.json({
      success: true,

      imported,

      skipped:
        skippedDuplicates,

      invalidRows,

      totalCsvRows:
        rows.length - 1,

      validRows:
        validQuestions.length,

      message:
        `${imported} questions imported successfully.`,
    });
  } catch (error) {
    console.error(
      "NISM bulk upload error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Bulk upload failed.",
      },
      { status: 500 }
    );
  }
}
