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

type CsvQuestion = {
  unit_number: number;
  topic: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: "A" | "B" | "C" | "D";
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
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

  row.push(field);

  if (row.some((value) => value.trim() !== "")) {
    rows.push(row);
  }

  return rows;
}

function clean(value: string | undefined) {
  return (value || "").trim();
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser();

    const email = data.user?.email?.trim().toLowerCase();

    if (error || !email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const csvText = body?.csvText;

    if (!csvText || typeof csvText !== "string") {
      return NextResponse.json(
        { error: "CSV data is missing." },
        { status: 400 }
      );
    }

    const rows = parseCSV(csvText);

    if (rows.length < 2) {
      return NextResponse.json(
        { error: "CSV must contain a header row and at least one question." },
        { status: 400 }
      );
    }

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

    const indexOf = (name: string) => headers.indexOf(name);

    const validQuestions: CsvQuestion[] = [];
    const invalidRows: {
      row: number;
      reason: string;
    }[] = [];

    const batchQuestionTexts = new Set<string>();

    for (let i = 1; i < rows.length; i++) {
      const rowNumber = i + 1;
      const row = rows[i];

      const unitNumber = Number(
        clean(row[indexOf("unit_number")])
      );

      const topic = clean(row[indexOf("topic")]);
      const questionText = clean(
        row[indexOf("question_text")]
      );

      const optionA = clean(row[indexOf("option_a")]);
      const optionB = clean(row[indexOf("option_b")]);
      const optionC = clean(row[indexOf("option_c")]);
      const optionD = clean(row[indexOf("option_d")]);

      const correctOption = clean(
        row[indexOf("correct_option")]
      ).toUpperCase();

      const explanation = clean(
        row[indexOf("explanation")]
      );

      const difficulty = clean(
        row[indexOf("difficulty")]
      );

      if (!Number.isInteger(unitNumber) || !units[unitNumber]) {
        invalidRows.push({
          row: rowNumber,
          reason: "Unit number must be between 1 and 12.",
        });
        continue;
      }

      if (!questionText) {
        invalidRows.push({
          row: rowNumber,
          reason: "Question text is missing.",
        });
        continue;
      }

      if (!optionA || !optionB || !optionC || !optionD) {
        invalidRows.push({
          row: rowNumber,
          reason: "All four options are required.",
        });
        continue;
      }

      if (!["A", "B", "C", "D"].includes(correctOption)) {
        invalidRows.push({
          row: rowNumber,
          reason: "Correct option must be A, B, C or D.",
        });
        continue;
      }

      if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
        invalidRows.push({
          row: rowNumber,
          reason: "Difficulty must be Easy, Medium or Hard.",
        });
        continue;
      }

      const normalizedQuestion = questionText
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();

      if (batchQuestionTexts.has(normalizedQuestion)) {
        invalidRows.push({
          row: rowNumber,
          reason: "Duplicate question in this CSV file.",
        });
        continue;
      }

      batchQuestionTexts.add(normalizedQuestion);

      validQuestions.push({
        unit_number: unitNumber,
        topic,
        question_text: questionText,
        option_a: optionA,
        option_b: optionB,
        option_c: optionC,
        option_d: optionD,
        correct_option: correctOption as
          | "A"
          | "B"
          | "C"
          | "D",
        explanation,
        difficulty: difficulty as
          | "Easy"
          | "Medium"
          | "Hard",
      });
    }

    if (validQuestions.length === 0) {
      return NextResponse.json({
        success: false,
        imported: 0,
        skipped: 0,
        invalidRows,
        message: "No valid questions were found.",
      });
    }

    const admin = supabaseAdmin();

    const { data: existingQuestions, error: existingError } =
      await admin
        .from("nism_questions")
        .select("question_text")
        .eq("module_code", "V-A");

    if (existingError) {
      throw existingError;
    }

    const existingQuestionSet = new Set(
      (existingQuestions || []).map((item) =>
        String(item.question_text)
          .toLowerCase()
          .replace(/\s+/g, " ")
          .trim()
      )
    );

    const questionsToInsert = [];
    let skippedDuplicates = 0;

    for (const question of validQuestions) {
      const normalizedQuestion = question.question_text
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();

      if (existingQuestionSet.has(normalizedQuestion)) {
        skippedDuplicates++;
        continue;
      }

      existingQuestionSet.add(normalizedQuestion);

      questionsToInsert.push({
        module_code: "V-A",
        unit_number: question.unit_number,
        unit_title: units[question.unit_number],
        topic: question.topic,
        question_text: question.question_text,
        option_a: question.option_a,
        option_b: question.option_b,
        option_c: question.option_c,
        option_d: question.option_d,
        correct_option: question.correct_option,
        explanation: question.explanation,
        difficulty: question.difficulty,
        source_type: "Original Practice Question",
        source_reference:
          "Based on NISM V-A published objectives",
        language: "English",
        is_active: true,
      });
    }

    let imported = 0;

    for (let i = 0; i < questionsToInsert.length; i += 100) {
      const batch = questionsToInsert.slice(i, i + 100);

      const { error: insertError } = await admin
        .from("nism_questions")
        .insert(batch);

      if (insertError) {
        throw insertError;
      }

      imported += batch.length;
    }

    return NextResponse.json({
      success: true,
      imported,
      skipped: skippedDuplicates,
      invalidRows,
      message: `${imported} questions imported successfully.`,
    });
  } catch (error) {
    console.error("NISM bulk upload error:", error);

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
