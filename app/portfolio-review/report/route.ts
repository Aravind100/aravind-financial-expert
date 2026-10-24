
export const runtime = "nodejs";

type Holding = {
  type: "stock" | "mutual-fund";
  assetClass: string;
  name: string;
  quantity: number;
  invested: number;
  currentValue: number;
  sipAmount: number;
};

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "AI report is not configured. Please check the server environment variables." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const rawHoldings = body?.holdings;

    if (
      !Array.isArray(rawHoldings) ||
      rawHoldings.length < 1 ||
      rawHoldings.length > 100
    ) {
      return Response.json(
        { error: "Please submit between 1 and 100 portfolio holdings." },
        { status: 400 }
      );
    }

    const holdings: Holding[] = rawHoldings.map((item: any) => {
      const numberValue = (value: unknown) => {
        const n = Number(value);
        return Number.isFinite(n) && n >= 0 ? n : 0;
      };

      return {
        type: item?.type === "mutual-fund" ? "mutual-fund" : "stock",
        assetClass: String(item?.assetClass ?? "unclassified").slice(0, 40),
        name: String(item?.name ?? "").trim().slice(0, 100),
        quantity: numberValue(item?.quantity),
        invested: numberValue(item?.invested),
        currentValue: numberValue(item?.currentValue),
        sipAmount: numberValue(item?.sipAmount),
      };
    });

    if (holdings.some((h) => !h.name)) {
      return Response.json(
        { error: "Every holding must have a name." },
        { status: 400 }
      );
    }

    const totalInvested = holdings.reduce((sum, h) => sum + h.invested, 0);
    const totalCurrent = holdings.reduce((sum, h) => sum + h.currentValue, 0);
    const totalDifference = totalCurrent - totalInvested;

    const openAIResponse = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          store: false,
          instructions: [
            "You write clear, cautious portfolio observations for an Indian investor.",
            "Use only the supplied portfolio data. Do not invent live prices, company fundamentals, news, ratings, forecasts, or market facts.",
            "Explain the portfolio's reported gain/loss, asset-class mix, concentration and missing or unclassified information where relevant.",
            "Clearly state that the figures are user-entered and are not independently verified.",
            "Do not recommend buying, selling, holding, replacing, or targeting specific securities.",
            "Do not promise returns or present the report as personalised investment advice.",
            "Use a professional, easy-to-understand tone. Keep the response concise, with headings and bullet points.",
          ].join(" "),
          input: JSON.stringify({
            currency: "INR",
            totalInvested,
            totalCurrent,
            totalDifference,
            holdings,
          }),
          max_output_tokens: 700,
        }),
      }
    );

    const result = await openAIResponse.json();

    if (!openAIResponse.ok) {
      console.error("OpenAI API request failed:", result?.error?.code);

      return Response.json(
        {
          error:
            openAIResponse.status === 429
              ? "AI service quota or rate limit reached. Check your OpenAI API billing and usage."
              : "The AI service could not generate the observations. Please try again.",
        },
        { status: 502 }
      );
    }

    const analysis = (result.output ?? [])
      .flatMap((item: any) => item.content ?? [])
      .filter((item: any) => item.type === "output_text")
      .map((item: any) => item.text ?? "")
      .join("\n")
      .trim();

    if (!analysis) {
      return Response.json(
        { error: "The AI service returned an empty report. Please try again." },
        { status: 502 }
      );
    }

    return Response.json({ analysis });
  } catch (error) {
    console.error("Portfolio report route failed:", error);

    return Response.json(
      { error: "Unable to generate AI observations. Please try again." },
      { status: 500 }
    );
  }
}
