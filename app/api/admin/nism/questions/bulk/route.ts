import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const ADMIN_EMAIL = (
  process.env.ADMIN_EMAIL ||
  "aravindchaudhary90@gmail.com"
)
  .trim()
  .toLowerCase();

function parseCSV(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && insideQuotes && next === '"') {
      cell += '"';
      i++;
      continue;
    }

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === "," && !insideQuotes) {
      row.push(cell.trim());
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && next === "\n") {
        i++;
      }

      row.push(cell.trim());
      cell = "";

      if (row.some((value) => value !== "")) {
        rows.push(row);
      }

      row = [];
      continue;
    }

    cell += char;
  }

  row.push(cell.trim());

  if (row.some((value) => value !== "")) {
    rows.push(row);
  }

  return rows;
}

export async function POST(request: Request) {
  try {
    const supabase = supabaseAdmin();

    const body = await request.json();
    const csvText = String(body?.csvText || "");

    if (!csvText.trim()) {
      return NextResponse.json(
        {
          error: "CSV file is empty.",
        },
        { status: 400 }
      );
    }

    const rows = parseCSV(csvText);

    if (rows.length < 2) {
      return NextResponse.json(
        {
          error: "CSV must contain a header row and at least one question.",
        },
        { status: 400 }
      );
    }

    const headers = rows[0].map((header) =>
      header.trim().toLowerCase()
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

    const missingHeaders = requiredHeaders.filter(
      (header) => !headers.includes(header)
    );

    if (missingHeaders.length > 0) {
      return NextResponse.json(
        {
          error: `Missing CSV columns: ${missingHeaders.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const indexOf = (name: string) =>
      headers.indexOf(name);

    const questions: any[] = [];
    const invalidRows: any[] = [];
    const csvQuestionTexts = new Set<string>();

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];

      const get = (name: string) =>
        String(row[indexOf(name)] || "").trim();

      const unitNumber = Number(get("unit_number"));
      const topic = get("topic");
      const questionText = get("question_text");
      const optionA = get("option_a");
      const optionB = get("option_b");
      const optionC = get("option_c");
      const optionD = get("option_d");
      const correctOption = get("correct_option").toUpperCase();
      const explanation = get("explanation");
      const difficulty = get("difficulty");

      const validationErrors: string[] = [];

      if (
        !Number.isInteger(unitNumber) ||
        unitNumber < 1 ||
        unitNumber > 12
      ) {
        validationErrors.push("Invalid unit_number");
      }

      if (!questionText) {
        validationErrors.push("Missing question_text");
      }

      if (!optionA || !optionB || !optionC || !optionD) {
        validationErrors.push("All four options are required");
      }

      if (!["A", "B", "C", "D"].includes(correctOption)) {
        validationErrors.push("Invalid correct_option");
      }

      if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
        validationErrors.push("Invalid difficulty");
      }

      const normalizedQuestion =
        questionText.toLowerCase();

      if (csvQuestionTexts.has(normalizedQuestion)) {
        validationErrors.push(
          "Duplicate question inside CSV"
        );
      }

      if (validationErrors.length > 0) {
        invalidRows.push({
          row: i + 1,
          errors: validationErrors,
          question: questionText,
        });

        continue;
      }

      csvQuestionTexts.add(normalizedQuestion);

      questions.push({
        module_code: "V-A",
        unit_number: unitNumber,
        topic,
        question_text: questionText,
        option_a: optionA,
        option_b: optionB,
        option_c: optionC,
        option_d: optionD,
        correct_option: correctOption,
        explanation,
        difficulty,
        source_type: "Original Practice Question",
        source_reference:
          "Independent NISM Series V-A practice material",
        language: "English",
        is_active: true,
      });
    }

    if (questions.length === 0) {
      return NextResponse.json(
        {
          error: "No valid questions found in the CSV.",
          invalidRows,
        },
        { status: 400 }
      );
    }

    /*
     * Check existing questions to avoid duplicates.
     */
    const questionTexts = questions.map(
      (question) => question.question_text
    );

    const { data: existingQuestions, error: existingError } =
      await supabase
        .from("nism_questions")
        .select("question_text")
        .eq("module_code", "V-A")
        .in("question_text", questionTexts);

    if (existingError) {
      console.error(
        "Existing question lookup error:",
        existingError
      );

      return NextResponse.json(
        {
          error:
            "Unable to check existing questions.",
          details: existingError.message,
          code: existingError.code,
          hint: existingError.hint,
          details_from_supabase:
            existingError.details,
        },
        { status: 500 }
      );
    }

    const existingSet = new Set(
      (existingQuestions || []).map(
        (question) =>
          question.question_text.toLowerCase()
      )
    );

    const newQuestions = questions.filter(
      (question) =>
        !existingSet.has(
          question.question_text.toLowerCase()
        )
    );

    const skipped =
      questions.length - newQuestions.length;

    if (newQuestions.length === 0) {
      return NextResponse.json({
        success: true,
        imported: 0,
        skipped,
        invalidRows,
        message:
          "All questions in this CSV already exist.",
      });
    }

    /*
     * Insert in batches.
     */
    const batchSize = 50;
    let imported = 0;

    for (
      let i = 0;
      i < newQuestions.length;
      i += batchSize
    ) {
      const batch = newQuestions.slice(
        i,
        i + batchSize
      );

      const { error: insertError } =
        await supabase
          .from("nism_questions")
          .insert(batch);

      if (insertError) {
        console.error(
          "Supabase question insert error:",
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

    importedBeforeError: imported,
  },
  { status: 500 }
);
      }

      imported += batch.length;
    }

    return NextResponse.json({
      success: true,
      imported,
      skipped,
      invalidRows,
    });
  } catch (error) {
    console.error(
      "NISM bulk upload error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to process the CSV upload.",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}
