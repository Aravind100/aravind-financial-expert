
import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export const runtime = "nodejs";
export const maxDuration = 30;

type Holding = {
  type?: string;
  name?: string;
  quantity?: number;
  invested?: number;
  currentValue?: number;
  sipAmount?: number;
};

const safeNumber = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : 0;

function cleanText(value: unknown, maxLength = 120): string {
  return typeof value === "string"
    ? value.replace(/[^\x20-\x7E]/g, "").slice(0, maxLength)
    : "";
}

function wrapText(text: string, maxChars = 88): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    if ((line + " " + word).trim().length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = (line + " " + word).trim();
    }
  }

  if (line) lines.push(line);
  return lines;
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "The AI report service is not configured." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const rawHoldings = body?.holdings;

    if (!Array.isArray(rawHoldings) || rawHoldings.length === 0) {
      return NextResponse.json(
        { error: "Add at least one portfolio holding." },
        { status: 400 }
      );
    }

    if (rawHoldings.length > 100) {
      return NextResponse.json(
        { error: "A maximum of 100 holdings is allowed per report." },
        { status: 400 }
      );
    }

    const holdings: Holding[] = rawHoldings.map((item: Holding) => ({
      type: cleanText(item.type, 30) || "unknown",
      name: cleanText(item.name, 100),
      quantity: safeNumber(item.quantity),
      invested: safeNumber(item.invested),
      currentValue: safeNumber(item.currentValue),
      sipAmount: safeNumber(item.sipAmount),
    })).filter((h) => h.name);

    if (!holdings.length) {
      return NextResponse.json(
        { error: "No valid holding names were provided." },
        { status: 400 }
      );
    }

    const invested = holdings.reduce((s, h) => s + (h.invested || 0), 0);
    const current = holdings.reduce((s, h) => s + (h.currentValue || 0), 0);
    const difference = current - invested;
    const monthlySip = holdings.reduce((s, h) => s + (h.sipAmount || 0), 0);

    const portfolioData = {
      reportDate: new Date().toISOString().slice(0, 10),
      currency: "INR",
      holdingCount: holdings.length,
      investedAmount: invested,
      currentValue: current,
      difference,
      monthlySip,
      holdings,
    };

    const aiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        instructions: [
          "You write clear educational portfolio review reports for Indian investors.",
          "Use only the supplied portfolio data.",
          "Do not invent market prices, company fundamentals, fund rankings, benchmarks, returns, or sector classifications.",
          "Distinguish user-entered values from verified market data.",
          "Do not issue buy, sell, hold, or replacement recommendations.",
          "Do not claim that the portfolio is safe, guaranteed, or certain to outperform.",
          "Discuss data limitations, concentration questions to investigate, and practical educational next steps.",
          "If the data does not support a conclusion, explicitly say so.",
          "Return plain text with short headings and bullet points.",
          "Keep the report concise and professional.",
        ].join(" "),
        input: JSON.stringify(portfolioData),
        max_output_tokens: 900,
      }),
    });

    if (!aiResponse.ok) {
      console.error("OpenAI report request failed:", aiResponse.status);
      return NextResponse.json(
        { error: "AI analysis failed. Please try again later." },
        { status: 502 }
      );
    }

    const aiJson = await aiResponse.json();
    const aiText = (aiJson.output ?? [])
      .flatMap((item: { content?: { type?: string; text?: string }[] }) =>
        item.content ?? []
      )
      .filter((item: { type?: string }) => item.type === "output_text")
      .map((item: { text?: string }) => item.text ?? "")
      .join("\n")
      .trim();

    if (!aiText) {
      return NextResponse.json(
        { error: "The AI returned an empty report." },
        { status: 502 }
      );
    }

    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);
    let page = pdf.addPage([595.28, 841.89]);
    let y = 790;

    const addLine = (text: string, bold = false, size = 10) => {
      if (y < 55) {
        page = pdf.addPage([595.28, 841.89]);
        y = 790;
      }

      page.drawText(text.slice(0, 110), {
        x: 48,
        y,
        size,
        font: bold ? boldFont : font,
        color: rgb(0.12, 0.17, 0.22),
      });

      y -= size + 7;
    };

    addLine("ARAVIND FINANCIAL EXPERT", true, 18);
    addLine("Stock / Mutual Fund Portfolio Review", true, 14);
    addLine(`Report date: ${portfolioData.reportDate}`);
    addLine(" ");
    addLine("PORTFOLIO SNAPSHOT", true, 12);
    addLine(`Holdings reviewed: ${portfolioData.holdingCount}`);
    addLine(`Total invested (entered): INR ${invested.toFixed(2)}`);
    addLine(`Current value (entered): INR ${current.toFixed(2)}`);
    addLine(`Difference: INR ${difference.toFixed(2)}`);
    addLine(`Monthly SIP entered: INR ${monthlySip.toFixed(2)}`);
    addLine(" ");
    addLine("HOLDINGS", true, 12);

    for (const h of holdings) {
      addLine(`${h.type}: ${h.name}`);
      addLine(
        `Invested INR ${h.invested.toFixed(2)} | Current INR ${h.currentValue.toFixed(2)}`
      );
    }

    addLine(" ");
    addLine("AI-GENERATED OBSERVATIONS", true, 12);

    for (const paragraph of aiText.split(/\n+/)) {
      const cleaned = paragraph.replace(/^[#*\-\s]+/, "").trim();
      if (!cleaned) continue;

      for (const line of wrapText(cleaned)) {
        addLine(line);
      }
    }

    addLine(" ");
    addLine("IMPORTANT LIMITATIONS", true, 12);
    for (const line of wrapText(
      "This report uses investor-provided figures and AI-generated educational observations. " +
      "It does not verify live market prices, NAVs, returns, or underlying holdings. " +
      "It is not a personalised buy, sell, hold, or replacement recommendation. " +
      "Verify all figures and consider the relevant risks before making financial decisions."
    )) {
      addLine(line);
    }

    const bytes = await pdf.save();

    return new Response(new Uint8Array(bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="portfolio-review.pdf"',
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Portfolio PDF generation failed:", error);
    return NextResponse.json(
      { error: "Could not generate the portfolio report." },
      { status: 500 }
    );
  }
}
