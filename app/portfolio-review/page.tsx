
"use client";

import styles from "./page.module.css";
import { useMemo, useState } from "react";

type PortfolioType = "stock" | "mutual-fund";
type AssetClass = "equity" | "debt" | "hybrid" | "other" | "unclassified";

type Holding = {
  id: string;
  type: PortfolioType;
  assetClass: AssetClass;
  name: string;
  quantity: number;
  invested: number;
  currentValue: number;
  sipAmount: number;
};

const emptyHolding = (type: PortfolioType = "stock"): Holding => ({
  id: `${Date.now()}-${Math.random()}`,
  type,
  assetClass: type === "stock" ? "equity" : "unclassified",
  name: "",
  quantity: 0,
  invested: 0,
  currentValue: 0,
  sipAmount: 0,
});

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const percentage = (value: number) =>
  `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;

const profitLossPercent = (currentValue: number, invested: number) =>
  invested > 0 ? ((currentValue - invested) / invested) * 100 : null;

function normalizeHeader(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
}

function getCell(row: Record<string, unknown>, aliases: string[]) {
  const keys = Object.keys(row);
  const normalizedAliases = aliases.map(normalizeHeader);
  const key = keys.find((item) =>
    normalizedAliases.includes(normalizeHeader(item))
  );
  return key ? row[key] : "";
}

function parseNumber(value: unknown): number {
  if (typeof value === "number") {
    return Number.isFinite(value) && value >= 0 ? value : 0;
  }

  const cleaned = String(value ?? "").replace(/[₹,\s]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function parseRows(rows: Record<string, unknown>[]): Holding[] {
  return rows
    .map((row, index) => {
      const name = String(
        getCell(row, [
          "name",
          "stock name",
          "stock",
          "scheme",
          "scheme name",
          "fund name",
          "investment name",
          "security name",
          "company name",
        ]) ?? ""
      ).trim();

      const rawType = String(
        getCell(row, ["type", "investment type", "asset type", "category"])
      ).toLowerCase();

      const type: PortfolioType =
        rawType.includes("mutual") ||
        rawType.includes("fund") ||
        rawType.includes("sip")
          ? "mutual-fund"
          : "stock";

      const rawAssetClass = String(
        getCell(row, ["asset class", "equity debt", "asset category", "investment class"])
      ).toLowerCase();
      const assetClass: AssetClass =
        type === "stock"
          ? "equity"
          : rawAssetClass.includes("debt") || rawAssetClass.includes("fixed income")
          ? "debt"
          : rawAssetClass.includes("hybrid") || rawAssetClass.includes("balanced")
            ? "hybrid"
            : rawAssetClass.includes("other") || rawAssetClass.includes("gold")
              ? "other"
              : rawAssetClass.includes("equity") || rawAssetClass.includes("stock")
                ? "equity"
                : "unclassified";

      return {
        id: `import-${Date.now()}-${index}-${Math.random()}`,
        type,
        assetClass,
        name,
        quantity: parseNumber(
          getCell(row, ["quantity", "units", "shares", "qty"])
        ),
        invested: parseNumber(
          getCell(row, [
            "invested",
            "invested amount",
            "total invested",
            "investment amount",
            "cost",
            "purchase value",
            "cost value",
          ])
        ),
        currentValue: parseNumber(
          getCell(row, [
            "current value",
            "market value",
            "current market value",
            "current valuation",
            "valuation",
            "value",
          ])
        ),
        sipAmount: parseNumber(
          getCell(row, [
            "sip",
            "sip amount",
            "monthly sip",
            "monthly sip amount",
            "monthly investment",
          ])
        ),
      };
    })
    .filter((holding) => holding.name.length > 0);
}

export default function PortfolioReviewPage() {
  const [type, setType] = useState<"all" | PortfolioType>("all");
  const [holdings, setHoldings] = useState<Holding[]>([emptyHolding()]);
  const [message, setMessage] = useState("");
  const [investorName, setInvestorName] = useState("");
  const [investorEmail, setInvestorEmail] = useState("");
  const [investorPhone, setInvestorPhone] = useState("");
  const [pendingHoldings, setPendingHoldings] = useState<Holding[]>([]);
  const [fileName, setFileName] = useState("");
  const [isReading, setIsReading] = useState(false);

  const visible = holdings.filter(
    (h) => type === "all" || h.type === type
  );

  const totals = useMemo(() => {
    const invested = visible.reduce((sum, h) => sum + h.invested, 0);
    const current = visible.reduce((sum, h) => sum + h.currentValue, 0);
    const sip = visible.reduce((sum, h) => sum + h.sipAmount, 0);
    return { invested, current, profit: current - invested, sip };
  }, [visible]);

  const allocation = useMemo(() => {
    const stocks = visible
      .filter((h) => h.type === "stock")
      .reduce((sum, h) => sum + h.currentValue, 0);
    const mutualFunds = visible
      .filter((h) => h.type === "mutual-fund")
      .reduce((sum, h) => sum + h.currentValue, 0);
    const equity = visible
      .filter((h) => h.assetClass === "equity")
      .reduce((sum, h) => sum + h.currentValue, 0);
    const debt = visible
      .filter((h) => h.assetClass === "debt")
      .reduce((sum, h) => sum + h.currentValue, 0);
    const hybrid = visible
      .filter((h) => h.assetClass === "hybrid")
      .reduce((sum, h) => sum + h.currentValue, 0);
    const other = visible
      .filter((h) => h.assetClass === "other")
      .reduce((sum, h) => sum + h.currentValue, 0);
    const unclassified = visible
      .filter((h) => h.assetClass === "unclassified")
      .reduce((sum, h) => sum + h.currentValue, 0);
    const total = equity + debt + hybrid + other + unclassified;
    const pct = (value: number) => total > 0 ? (value / total) * 100 : 0;
    return {
      stocks,
      mutualFunds,
      total,
      stockPercent: stocks + mutualFunds > 0 ? (stocks / (stocks + mutualFunds)) * 100 : 0,
      mutualFundPercent: stocks + mutualFunds > 0 ? (mutualFunds / (stocks + mutualFunds)) * 100 : 0,
      equity,
      debt,
      hybrid,
      other,
      unclassified,
      equityPercent: pct(equity),
      debtPercent: pct(debt),
      hybridPercent: pct(hybrid),
      otherPercent: pct(other),
      unclassifiedPercent: pct(unclassified),
    };
  }, [visible]);

  const totalProfitPercent =
    totals.invested > 0 ? (totals.profit / totals.invested) * 100 : null;

  function updateHolding(id: string, field: keyof Holding, value: string) {
    setHoldings((old) =>
      old.map((h) => {
        if (h.id !== id) return h;
        if (field === "type") {
          const nextType = value as PortfolioType;
          return {
            ...h,
            type: nextType,
            assetClass: nextType === "stock" ? "equity" : h.assetClass,
          };
        }
        if (field === "assetClass") return { ...h, assetClass: value as AssetClass };
        if (field === "name") return { ...h, name: value };
        return { ...h, [field]: Math.max(0, Number(value) || 0) };
      })
    );
  }

  async function uploadFile(file?: File) {
    if (!file) return;

    setMessage("");
    setPendingHoldings([]);
    setFileName("");

    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !["csv", "xlsx", "xls"].includes(extension)) {
      setMessage("Please select a CSV, XLSX, or XLS file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("File is too large. Please upload a file under 5 MB.");
      return;
    }

    setIsReading(true);

    try {
      const XLSX = await import("xlsx");
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheet = workbook.SheetNames[0];

      if (!firstSheet) {
        throw new Error("The file does not contain a worksheet.");
      }

      const worksheet = workbook.Sheets[firstSheet];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
        worksheet,
        { defval: "" }
      );

      if (!rows.length) {
        throw new Error("The selected file is empty or has no data rows.");
      }

      const imported = parseRows(rows);

      if (!imported.length) {
        throw new Error(
          "No holdings found. Include a column such as Name, Stock Name, or Scheme Name, with a name in each row."
        );
      }

      if (
        !Object.keys(rows[0]).some((key) =>
          [
            "invested",
            "invested amount",
            "total invested",
            "investment amount",
            "cost",
            "purchase value",
            "current value",
            "market value",
            "value",
            "sip amount",
            "monthly sip",
            "quantity",
            "units",
            "shares",
            "qty",
          ].map(normalizeHeader).includes(normalizeHeader(key))
        )
      ) {
        throw new Error(
          "Please include columns for quantity, invested amount, current value, or SIP amount."
        );
      }

      setPendingHoldings(imported);
      setFileName(file.name);
      setMessage(
        `Found ${imported.length} holding(s). Review the preview before importing.`
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to read this file. Please check its format."
      );
    } finally {
      setIsReading(false);
    }
  }

  function importPreview() {
    if (!pendingHoldings.length) return;

    setHoldings((old) => [
      ...old.filter((h) => h.name.trim()),
      ...pendingHoldings,
    ]);

    setMessage(`Imported ${pendingHoldings.length} holding(s). Please verify the values.`);
    setPendingHoldings([]);
    setFileName("");
  }

  function cancelPreview() {
    setPendingHoldings([]);
    setFileName("");
    setMessage("Import cancelled. Your portfolio has not been changed.");
  }

  function sendEnquiry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const lines = visible
      .filter((h) => h.name.trim())
      .map(
        (h) =>
          `${h.type === "stock" ? "Stock" : "Mutual fund"}: ${h.name}, invested ${money(h.invested)}, current ${money(h.currentValue)}`
      );

    const subject = encodeURIComponent("Portfolio Review Enquiry");
    const body = encodeURIComponent(
      `Name: ${investorName}\nEmail: ${investorEmail}\nPhone: ${investorPhone}\n\nPortfolio summary\nInvested: ${money(totals.invested)}\nCurrent value: ${money(totals.current)}\nMonthly SIP: ${money(totals.sip)}\n\nHoldings:\n${lines.join("\n")}`
    );

    window.location.href =
      `mailto:aravindchaudhary90@gmail.com?subject=${subject}&body=${body}`;
  }

  async function downloadPDFReport() {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "mm", format: "a4" });

    const pdfMoney = (value: number) =>
      `INR ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value)}`;
    const pdfPercent = (value: number | null) =>
      value === null ? "N/A" : percentage(value);
    const reportDate = new Date().toLocaleDateString("en-IN");
    const reportHoldings = visible.filter((h) => h.name.trim());

    const aiResponse = await fetch("/api/portfolio-review/report", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    holdings: reportHoldings.map((h) => ({
      type: h.type,
      assetClass: h.assetClass,
      name: h.name,
      quantity: h.quantity,
      invested: h.invested,
      currentValue: h.currentValue,
      sipAmount: h.sipAmount,
    })),
  }),
});

const aiResult = await aiResponse.json();

if (!aiResponse.ok) {
  throw new Error(aiResult.error || "Unable to generate AI observations.");
}

const aiAnalysis: string = aiResult.analysis;

    function createPieChartDataUrl(
      slices: Array<{ label: string; value: number; color: string }>
    ) {
      const canvas = document.createElement("canvas");
      canvas.width = 420;
      canvas.height = 420;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Could not create the portfolio pie chart.");
      const total = slices.reduce((sum, item) => sum + item.value, 0);
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      let startAngle = -Math.PI / 2;
      if (total > 0) {
        slices.filter((item) => item.value > 0).forEach((item) => {
          const angle = (item.value / total) * Math.PI * 2;
          context.beginPath();
          context.moveTo(210, 210);
          context.arc(210, 210, 170, startAngle, startAngle + angle);
          context.closePath();
          context.fillStyle = item.color;
          context.fill();
          context.strokeStyle = "#ffffff";
          context.lineWidth = 3;
          context.stroke();
          startAngle += angle;
        });
      } else {
        context.beginPath();
        context.arc(210, 210, 170, 0, Math.PI * 2);
        context.fillStyle = "#e5e7eb";
        context.fill();
      }
      context.beginPath();
      context.arc(210, 210, 92, 0, Math.PI * 2);
      context.fillStyle = "#ffffff";
      context.fill();
      context.fillStyle = "#15324b";
      context.textAlign = "center";
      context.font = "bold 24px Arial";
      context.fillText("Allocation", 210, 202);
      context.font = "bold 20px Arial";
      context.fillText(pdfMoney(allocation.total), 210, 232);
      return canvas.toDataURL("image/png");
    }

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    const navy: [number, number, number] = [21, 50, 75];
    const teal: [number, number, number] = [7, 133, 138];
    const pale: [number, number, number] = [242, 246, 249];
    const line: [number, number, number] = [216, 226, 233];
    const ink: [number, number, number] = [38, 55, 70];
    const muted: [number, number, number] = [98, 118, 134];
    const green: [number, number, number] = [22, 132, 91];
    const red: [number, number, number] = [185, 55, 55];
    let y = 15;

    function roundedCard(x: number, top: number, w: number, h: number, fill: [number, number, number]) {
      doc.setFillColor(...fill);
      doc.setDrawColor(...line);
      doc.roundedRect(x, top, w, h, 2.5, 2.5, "FD");
    }

    function sectionTitle(title: string) {
      ensureSpace(12);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...navy);
      doc.text(title.toUpperCase(), margin, y);
      y += 3;
      doc.setDrawColor(...teal);
      doc.setLineWidth(0.8);
      doc.line(margin, y, margin + 18, y);
      y += 6;
    }

    function drawCompactPageHeader() {
      doc.setFillColor(...navy);
      doc.rect(0, 0, pageWidth, 16, "F");
      doc.setFillColor(...teal);
      doc.rect(0, 0, pageWidth, 1.5, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text("ARAVIND FINANCIAL EXPERT", margin, 7);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(220, 239, 240);
      doc.text(`Portfolio review | ${reportDate}`, pageWidth - margin, 7, { align: "right" });
      doc.setDrawColor(...line);
      doc.line(margin, 19, pageWidth - margin, 19);
    }

    function ensureSpace(height: number) {
      if (y + height > pageHeight - 18) {
        doc.addPage();
        drawCompactPageHeader();
        y = 25;
      }
    }

    function bodyText(text: string, size = 8.5, color: [number, number, number] = ink, lineHeight = 4.2) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(size);
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(text, contentWidth);
      ensureSpace(lines.length * lineHeight + 2);
      doc.text(lines, margin, y);
      y += lines.length * lineHeight + 2;
    }

    // Branded banner
    doc.setFillColor(...navy);
    doc.rect(0, 0, pageWidth, 43, "F");
    doc.setFillColor(...teal);
    doc.rect(0, 0, pageWidth, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(19);
    doc.setTextColor(255, 255, 255);
    doc.text("ARAVIND FINANCIAL EXPERT", margin, 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(220, 239, 240);
    doc.text("Stock / SIP Portfolio Review", margin, 23);
    doc.setFontSize(8);
    doc.text(`Report date: ${reportDate}`, margin, 31);
    doc.text("Contact: +91 91733 34069", margin, 36);
    doc.text("aravindchaudhary90@gmail.com", pageWidth - margin, 36, { align: "right" });
    if (investorName.trim()) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text(`Prepared for: ${investorName.trim().slice(0, 55)}`, pageWidth - margin, 15, { align: "right" });
    }
    y = 51;

    sectionTitle("Portfolio summary");
    const gap = 3;
    const metricW = (contentWidth - gap * 3) / 4;
    const metricH = 22;
    const metrics: Array<[string, string, [number, number, number]]> = [
      ["TOTAL INVESTED", pdfMoney(totals.invested), navy],
      ["CURRENT VALUE", pdfMoney(totals.current), navy],
      ["NET DIFFERENCE", `${totals.profit > 0 ? "+" : totals.profit < 0 ? "−" : ""}${pdfMoney(Math.abs(totals.profit))}`, totals.profit >= 0 ? green : red],
      ["MONTHLY SIP", pdfMoney(totals.sip), navy],
    ];
    metrics.forEach(([label, value, valueColor], index) => {
      const x = margin + index * (metricW + gap);
      roundedCard(x, y, metricW, metricH, pale);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.3);
      doc.setTextColor(...muted);
      doc.text(label, x + 3, y + 6);
      doc.setFontSize(9);
      doc.setTextColor(...valueColor);
      const wrapped = doc.splitTextToSize(value, metricW - 6);
      doc.text(wrapped, x + 3, y + 14);
    });
    y += metricH + 3;

    const gainColor = totalProfitPercent === null ? muted : totalProfitPercent >= 0 ? green : red;
    roundedCard(margin, y, contentWidth, 15, [231, 245, 241]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...muted);
    doc.text("OVERALL GAIN / LOSS", margin + 4, y + 6);
    doc.setFontSize(12);
    doc.setTextColor(...gainColor);
    doc.text(pdfPercent(totalProfitPercent), margin + 4, y + 11.5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...ink);
    doc.text("Difference divided by total invested amount", margin + 55, y + 9);
    y += 22;

    sectionTitle("Equity / debt asset allocation");
    const assetSlices = [
      { label: "Equity", amount: allocation.equity, pct: allocation.equityPercent, color: "#07855a" },
      { label: "Debt", amount: allocation.debt, pct: allocation.debtPercent, color: "#2563eb" },
      { label: "Hybrid", amount: allocation.hybrid, pct: allocation.hybridPercent, color: "#f59e0b" },
      { label: "Other", amount: allocation.other, pct: allocation.otherPercent, color: "#8b5cf6" },
      { label: "Unclassified", amount: allocation.unclassified, pct: allocation.unclassifiedPercent, color: "#9ca3af" },
    ];
    const pieDataUrl = createPieChartDataUrl(
      assetSlices.map((item) => ({ label: item.label, value: item.amount, color: item.color }))
    );
    ensureSpace(58);
    doc.addImage(pieDataUrl, "PNG", margin, y, 48, 48);
    const legendX = margin + 55;
    assetSlices.forEach((item, index) => {
      const rowY = y + 6 + index * 8;
      doc.setFillColor(...(
        item.label === "Equity" ? [7, 133, 90] :
        item.label === "Debt" ? [37, 99, 235] :
        item.label === "Hybrid" ? [245, 158, 11] :
        item.label === "Other" ? [139, 92, 246] : [156, 163, 175]
      ) as [number, number, number]);
      doc.circle(legendX + 2, rowY - 1, 1.8, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...ink);
      doc.text(item.label, legendX + 7, rowY);
      doc.setFont("helvetica", "normal");
      doc.text(pdfMoney(item.amount), legendX + 33, rowY);
      doc.setFont("helvetica", "bold");
      doc.text(`${item.pct.toFixed(1)}%`, pageWidth - margin, rowY, { align: "right" });
    });
    y += 43;

    // Compact stacked allocation bar makes the asset mix easier to scan at a glance.
    ensureSpace(13);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...navy);
    doc.text("PORTFOLIO MIX", margin, y + 2);
    const barX = margin + 30;
    const barY = y - 1;
    const barW = contentWidth - 30;
    const barH = 5;
    doc.setFillColor(232, 237, 241);
    doc.roundedRect(barX, barY, barW, barH, 2, 2, "F");
    let barOffset = 0;
    assetSlices.forEach((item) => {
      const fraction = allocation.total > 0 ? Math.max(0, item.amount / allocation.total) : 0;
      const segmentW = barW * fraction;
      if (segmentW > 0.1) {
        const rgb: [number, number, number] = item.label === "Equity" ? [7, 133, 90] : item.label === "Debt" ? [37, 99, 235] : item.label === "Hybrid" ? [245, 158, 11] : item.label === "Other" ? [139, 92, 246] : [156, 163, 175];
        doc.setFillColor(...rgb);
        doc.rect(barX + barOffset, barY, segmentW, barH, "F");
        barOffset += segmentW;
      }
    });
    y += 10;

    sectionTitle("Asset allocation observations");
    const observations: string[] = [];
    if (allocation.total <= 0) {
      observations.push("Enter current values to calculate asset allocation.");
    } else {
      if (allocation.equityPercent >= 99.99) {
        observations.push("The entered portfolio is effectively 100% equity. Consider whether diversification across asset classes is appropriate for your goals, time horizon and risk tolerance.");
      } else if (allocation.debtPercent >= 99.99) {
        observations.push("The entered portfolio is effectively 100% debt. Consider whether exposure to other asset classes is appropriate for your goals, time horizon and risk tolerance.");
      } else if (allocation.unclassifiedPercent > 0) {
        observations.push(`${allocation.unclassifiedPercent.toFixed(1)}% of the portfolio is unclassified. Select an asset class for these holdings to improve the accuracy of this report.`);
      } else {
        observations.push(`The entered portfolio includes ${allocation.equityPercent.toFixed(1)}% equity and ${allocation.debtPercent.toFixed(1)}% debt. Whether this mix is appropriate depends on your goals, time horizon and risk tolerance.`);
      }
      if (allocation.hybridPercent > 0 || allocation.otherPercent > 0) {
        observations.push("Hybrid and other assets are shown separately and are not included in the equity or debt percentages.");
      }
    }
    observations.forEach((item) => bodyText(`• ${item}`, 7.8, ink, 4));

    // Top holdings and concentration: calculated from the current portfolio values entered by the investor.
    const rankedHoldings = [...reportHoldings]
      .filter((h) => h.currentValue > 0)
      .sort((a, b) => b.currentValue - a.currentValue)
      .slice(0, 5);
    if (rankedHoldings.length) {
      sectionTitle("Largest holdings by current value");
      const tableX = margin;
      const tableW = contentWidth;
      const nameW = tableW * 0.48;
      const amountW = tableW * 0.28;
      const pctW = tableW - nameW - amountW;
      doc.setFillColor(...navy);
      doc.roundedRect(tableX, y - 3, tableW, 7, 1.5, 1.5, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.8);
      doc.setTextColor(255, 255, 255);
      doc.text("HOLDING", tableX + 3, y + 1.5);
      doc.text("CURRENT VALUE", tableX + nameW + amountW - 3, y + 1.5, { align: "right" });
      doc.text("PORTFOLIO SHARE", tableX + tableW - 3, y + 1.5, { align: "right" });
      y += 7;
      rankedHoldings.forEach((h, idx) => {
        ensureSpace(7);
        const share = totals.current > 0 ? (h.currentValue / totals.current) * 100 : 0;
        if (idx % 2 === 0) {
          doc.setFillColor(...pale);
          doc.rect(tableX, y - 3.5, tableW, 7, "F");
        }
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(...ink);
        const shortName = doc.splitTextToSize(h.name, nameW - 6)[0];
        doc.text(shortName, tableX + 3, y + 1.2);
        doc.text(pdfMoney(h.currentValue), tableX + nameW + amountW - 3, y + 1.2, { align: "right" });
        doc.text(`${share.toFixed(2)}%`, tableX + tableW - 3, y + 1.2, { align: "right" });
        y += 7;
      });
      const topFiveValue = rankedHoldings.reduce((sum, h) => sum + h.currentValue, 0);
      const topFiveShare = totals.current > 0 ? (topFiveValue / totals.current) * 100 : 0;
      bodyText(`The ${rankedHoldings.length} largest holding(s) shown above represent ${topFiveShare.toFixed(1)}% of the portfolio's current value. A higher concentration in a small number of holdings can increase holding-specific risk.`, 7.2, muted, 3.7);
    }

    sectionTitle("Holdings breakdown");
    if (!reportHoldings.length) {
      bodyText("No named holdings were entered.");
    }

    reportHoldings.forEach((h, index) => {
      const holdingProfit = h.currentValue - h.invested;
      const holdingPct = profitLossPercent(h.currentValue, h.invested);
      const holdingAllocation = totals.current > 0 ? (h.currentValue / totals.current) * 100 : 0;
      const cardHeight = 38;
      ensureSpace(cardHeight + 3);
      roundedCard(margin, y, contentWidth, cardHeight, index % 2 === 0 ? pale : [255, 255, 255]);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.2);
      doc.setTextColor(...navy);
      const nameLines = doc.splitTextToSize(`${index + 1}. ${h.name}`, contentWidth - 47);
      doc.text(nameLines.slice(0, 2), margin + 4, y + 6);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...muted);
      doc.text(`${h.type === "stock" ? "Stock" : "Mutual fund"}  |  Asset class: ${h.assetClass}  |  Quantity / units: ${h.quantity}`, margin + 4, y + 13);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(holdingProfit >= 0 ? green[0] : red[0], holdingProfit >= 0 ? green[1] : red[1], holdingProfit >= 0 ? green[2] : red[2]);
      doc.text(`${holdingProfit > 0 ? "+" : holdingProfit < 0 ? "−" : ""}${pdfMoney(Math.abs(holdingProfit))}`, pageWidth - margin - 4, y + 7, { align: "right" });
      doc.setFontSize(7.3);
      doc.text(pdfPercent(holdingPct), pageWidth - margin - 4, y + 12.5, { align: "right" });

      const colY = y + 21;
      const colW = contentWidth / 4;
      const details = [
        ["INVESTED", pdfMoney(h.invested)],
        ["CURRENT VALUE", pdfMoney(h.currentValue)],
        ["PORTFOLIO SHARE", `${holdingAllocation.toFixed(2)}%`],
        ["MONTHLY SIP", pdfMoney(h.sipAmount)],
      ];
      details.forEach(([label, value], colIndex) => {
        const x = margin + 4 + colIndex * colW;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(5.8);
        doc.setTextColor(...muted);
        doc.text(label, x, colY);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(...ink);
        doc.text(value, x, colY + 5);
      });
      y += cardHeight + 3;
    });

    sectionTitle("AI-generated portfolio observations");

aiAnalysis
  .split(/\n+/)
  .map((line) => line.trim())
  .filter(Boolean)
  .forEach((line) => bodyText(line, 7.5, ink, 3.8));

bodyText(
  "AI-generated observations are informational and may contain errors. Verify all figures and seek appropriate professional advice before making investment decisions.",
  7.2,
  muted,
  3.8
);
    y += 1;
    sectionTitle("Important information");
    bodyText("This report is based only on values entered or imported by the user. It does not fetch live market prices or provide a buy, hold or sell recommendation.", 7.5, ink, 3.8);
    bodyText("Gain/loss percentage is the difference divided by the entered invested amount. It is not an annualised return and may not represent actual SIP performance. Allocation percentages use entered current values and may change as values change.", 7.5, ink, 3.8);
    bodyText("Please verify all figures and consult an appropriately qualified financial professional if needed.", 7.5, ink, 3.8);

    // Consistent footer and page numbering on every page.
    const pageCount = doc.getNumberOfPages();
    for (let page = 1; page <= pageCount; page++) {
      doc.setPage(page);
      doc.setDrawColor(...line);
      doc.setLineWidth(0.4);
      doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...muted);
      doc.text("ARAVIND FINANCIAL EXPERT  |  Portfolio review", margin, pageHeight - 7);
      doc.text(`Page ${page} of ${pageCount}`, pageWidth - margin, pageHeight - 7, { align: "right" });
    }

    doc.save("Aravind-Financial-Portfolio-Report.pdf");
  }

  return (
    <main className={styles.page}>
      <header className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Investor tools
        </p>
        <h1 className="text-3xl font-bold sm:text-4xl">
          Stock / SIP Portfolio Review
        </h1>
        <p className="mt-3 max-w-3xl text-gray-600">
          Add your existing investments to understand your portfolio&apos;s
          reported value and prepare for a more detailed review.
        </p>
      </header>

      <section className="mb-6 rounded-2xl border p-4 sm:p-6">
        <h2 className="text-xl font-semibold">1. Select portfolio</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            ["all", "Stocks + Mutual Funds"],
            ["stock", "Stocks"],
            ["mutual-fund", "Mutual Funds / SIP"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setType(value as typeof type)}
              className={`rounded-full border px-4 py-2 text-sm ${
                type === value
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "bg-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-6 rounded-2xl border p-4 sm:p-6">
        <h2 className="text-xl font-semibold">2. Enter or upload holdings</h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter invested amount and current value from your latest statement.
          This tool does not fetch live market prices.
        </p>

        <label className="mt-4 block text-sm font-medium">
          Import an Excel or CSV file
          <input
            type="file"
            accept=".csv,.xlsx,.xls,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            className="mt-2 block w-full text-sm"
            disabled={isReading}
            onChange={(event) => {
              void uploadFile(event.target.files?.[0]);
              event.currentTarget.value = "";
            }}
          />
        </label>

        <p className="mt-2 text-xs text-gray-500">
          Supported: CSV, XLSX, XLS. Maximum file size: 5 MB. Use a header row
          with columns such as Name, Type, Quantity, Invested Amount, Current
          Value, and SIP Amount.
        </p>

        {isReading && (
          <p role="status" className="mt-3 text-sm">
            Reading file…
          </p>
        )}

        {message && (
          <p role="status" className="mt-3 text-sm">
            {message}
          </p>
        )}

        {pendingHoldings.length > 0 && (
          <div className="mt-5 rounded-xl border p-4">
            <h3 className="font-semibold">Import preview</h3>
            <p className="mt-1 text-sm text-gray-600">
              File: {fileName}. Check the first rows below before adding them.
            </p>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-2">Type</th>
                    <th className="p-2">Asset class</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Quantity</th>
                    <th className="p-2">Invested</th>
                    <th className="p-2">Current value</th>
                    <th className="p-2">Monthly SIP</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingHoldings.slice(0, 10).map((h) => (
                    <tr key={h.id} className="border-b">
                      <td className="p-2">
                        {h.type === "stock" ? "Stock" : "Mutual fund"}
                      </td>
                      <td className="p-2">{h.assetClass}</td>
                      <td className="p-2">{h.name}</td>
                      <td className="p-2">{h.quantity}</td>
                      <td className="p-2">{money(h.invested)}</td>
                      <td className="p-2">{money(h.currentValue)}</td>
                      <td className="p-2">{money(h.sipAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pendingHoldings.length > 10 && (
              <p className="mt-2 text-xs text-gray-500">
                Showing the first 10 of {pendingHoldings.length} holdings.
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={importPreview}
                className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white"
              >
                Import {pendingHoldings.length} holdings
              </button>
              <button
                type="button"
                onClick={cancelPreview}
                className="rounded-lg border px-4 py-2 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 space-y-5">
          {visible.map((h) => (
            <div key={h.id} className="rounded-xl bg-gray-50 p-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <label className="text-sm">
                  Investment type
                  <select
                    value={h.type}
                    onChange={(e) =>
                      updateHolding(h.id, "type", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border bg-white p-2"
                  >
                    <option value="stock">Stock</option>
                    <option value="mutual-fund">Mutual fund / SIP</option>
                  </select>
                </label>

                <label className="text-sm">
                  Asset class
                  <select
                    value={h.assetClass}
                    disabled={h.type === "stock"}
                    onChange={(e) => updateHolding(h.id, "assetClass", e.target.value)}
                    className="mt-1 w-full rounded-lg border bg-white p-2 disabled:bg-gray-100"
                  >
                    <option value="equity">Equity</option>
                    <option value="debt">Debt / fixed income</option>
                    <option value="hybrid">Hybrid / balanced</option>
                    <option value="other">Other (e.g. gold)</option>
                    <option value="unclassified">Not sure / unclassified</option>
                  </select>
                </label>

                <label className="text-sm">
                  Stock or scheme name
                  <input
                    value={h.name}
                    onChange={(e) =>
                      updateHolding(h.id, "name", e.target.value)
                    }
                    placeholder="e.g. company or fund name"
                    className="mt-1 w-full rounded-lg border bg-white p-2"
                  />
                </label>

                <label className="text-sm">
                  Quantity / units (optional)
                  <input
                    type="number"
                    min="0"
                    value={h.quantity || ""}
                    onChange={(e) =>
                      updateHolding(h.id, "quantity", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border bg-white p-2"
                  />
                </label>

                <label className="text-sm">
                  Total invested (₹)
                  <input
                    type="number"
                    min="0"
                    value={h.invested || ""}
                    onChange={(e) =>
                      updateHolding(h.id, "invested", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border bg-white p-2"
                  />
                </label>

                <label className="text-sm">
                  Current value (₹)
                  <input
                    type="number"
                    min="0"
                    value={h.currentValue || ""}
                    onChange={(e) =>
                      updateHolding(h.id, "currentValue", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border bg-white p-2"
                  />
                </label>

                <label className="text-sm">
                  Monthly SIP (₹, if applicable)
                  <input
                    type="number"
                    min="0"
                    value={h.sipAmount || ""}
                    onChange={(e) =>
                      updateHolding(h.id, "sipAmount", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border bg-white p-2"
                  />
                </label>
              </div>

              <div className="mt-4 grid gap-3 rounded-lg border bg-white p-3 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-gray-500">Gain / loss</p>
                  <p className={`mt-1 font-semibold ${h.currentValue - h.invested >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                    {money(h.currentValue - h.invested)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Gain / loss %</p>
                  <p className={`mt-1 font-semibold ${(h.currentValue - h.invested) >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                    {profitLossPercent(h.currentValue, h.invested) === null ? "N/A" : percentage(profitLossPercent(h.currentValue, h.invested) as number)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Portfolio allocation</p>
                  <p className="mt-1 font-semibold">
                    {totals.current > 0 ? `${((h.currentValue / totals.current) * 100).toFixed(2)}%` : "0.00%"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setHoldings((old) => old.filter((item) => item.id !== h.id))
                }
                className="mt-3 text-sm text-red-700 underline"
              >
                Remove holding
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            setHoldings((old) => [
              ...old,
              emptyHolding(type === "all" ? "stock" : type),
            ])
          }
          className="mt-4 rounded-lg border px-4 py-2 font-medium"
        >
          + Add holding
        </button>
      </section>

      <section className="mb-6 rounded-2xl border p-4 sm:p-6">
        <h2 className="text-xl font-semibold">3. Your portfolio snapshot</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Invested amount", money(totals.invested)],
            ["Current value", money(totals.current)],
            ["Difference", money(totals.profit)],
            ["Overall gain / loss", totalProfitPercent === null ? "N/A" : percentage(totalProfitPercent)],
            ["Monthly SIP", money(totals.sip)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-600">{label}</p>
              <p className="mt-2 text-xl font-bold">{value}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-600">
          Difference = entered current value minus entered invested amount.
          The percentage is calculated as difference divided by total invested.
          It is not an annualised return and may not equal actual SIP returns.
        </p>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="rounded-xl border p-4">
            <h3 className="font-semibold">Equity vs. debt allocation</h3>
            <p className="mt-1 text-sm text-gray-600">Based on the asset class selected for each holding and its current value.</p>
            <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row">
              <div
                aria-label={`Equity ${allocation.equityPercent.toFixed(1)} percent, debt ${allocation.debtPercent.toFixed(1)} percent, hybrid ${allocation.hybridPercent.toFixed(1)} percent, other ${allocation.otherPercent.toFixed(1)} percent, unclassified ${allocation.unclassifiedPercent.toFixed(1)} percent`}
                className="h-44 w-44 shrink-0 rounded-full"
                style={{
                  background: allocation.total > 0
                    ? `conic-gradient(#07855a 0% ${allocation.equityPercent}%, #2563eb ${allocation.equityPercent}% ${allocation.equityPercent + allocation.debtPercent}%, #f59e0b ${allocation.equityPercent + allocation.debtPercent}% ${allocation.equityPercent + allocation.debtPercent + allocation.hybridPercent}%, #8b5cf6 ${allocation.equityPercent + allocation.debtPercent + allocation.hybridPercent}% ${allocation.equityPercent + allocation.debtPercent + allocation.hybridPercent + allocation.otherPercent}%, #9ca3af ${allocation.equityPercent + allocation.debtPercent + allocation.hybridPercent + allocation.otherPercent}% 100%)`
                    : "#e5e7eb",
                }}
              />
              <div className="w-full space-y-2 text-sm">
                {[
                  ["Equity", allocation.equity, allocation.equityPercent, "#07855a"],
                  ["Debt", allocation.debt, allocation.debtPercent, "#2563eb"],
                  ["Hybrid", allocation.hybrid, allocation.hybridPercent, "#f59e0b"],
                  ["Other", allocation.other, allocation.otherPercent, "#8b5cf6"],
                  ["Unclassified", allocation.unclassified, allocation.unclassifiedPercent, "#9ca3af"],
                ].map(([label, amount, pct, color]) => (
                  <div key={String(label)} className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: String(color) }} />
                      {String(label)}
                    </span>
                    <span className="text-right font-medium">{money(Number(amount))} · {Number(pct).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 rounded-lg border p-3 text-sm">
              {allocation.total <= 0
                ? "Enter current values to calculate your asset allocation."
                : allocation.equityPercent >= 99.99
                  ? "Your entered portfolio is 100% equity. Consider whether adding other asset classes would improve diversification for your goals and risk tolerance."
                  : allocation.debtPercent >= 99.99
                    ? "Your entered portfolio is 100% debt. Consider whether broader asset-class diversification fits your goals and risk tolerance."
                    : allocation.unclassifiedPercent > 0
                      ? `${allocation.unclassifiedPercent.toFixed(1)}% of the portfolio is unclassified. Please select an asset class for those holdings to improve the report.`
                      : `Your entered portfolio has ${allocation.equityPercent.toFixed(1)}% equity and ${allocation.debtPercent.toFixed(1)}% debt. Suitability depends on your goals, time horizon and risk tolerance.`}
            </div>
          </div>

          <div className="rounded-xl border p-4">
            <h3 className="font-semibold">Allocation by investment type</h3>
            <p className="mt-1 text-sm text-gray-600">Based on current value of the visible holdings.</p>
            <div className="mt-4 space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                  <span>Stocks</span>
                  <span className="font-medium">{money(allocation.stocks)} · {allocation.stockPercent.toFixed(1)}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-emerald-700" style={{ width: `${allocation.stockPercent}%` }} />
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                  <span>Mutual funds</span>
                  <span className="font-medium">{money(allocation.mutualFunds)} · {allocation.mutualFundPercent.toFixed(1)}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-green-300" style={{ width: `${allocation.mutualFundPercent}%` }} />
                </div>
              </div>
              {allocation.total === 0 && <p className="text-sm text-gray-500">Enter current values to see your allocation.</p>}
            </div>
          </div>

          <div className="rounded-xl border p-4">
            <h3 className="font-semibold">Allocation by holding</h3>
            <p className="mt-1 text-sm text-gray-600">Share of the total current value.</p>
            <div className="mt-4 space-y-3">
              {visible.filter((h) => h.name.trim()).length === 0 ? (
                <p className="text-sm text-gray-500">Add or import named holdings to see allocation.</p>
              ) : (
                visible.filter((h) => h.name.trim()).map((h) => {
                  const share = totals.current > 0 ? (h.currentValue / totals.current) * 100 : 0;
                  return (
                    <div key={`allocation-${h.id}`}>
                      <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                        <span className="min-w-0 truncate">{h.name}</span>
                        <span className="shrink-0 font-medium">{share.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full bg-emerald-600" style={{ width: `${share}%` }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border p-4 sm:p-6">
        <h2 className="text-xl font-semibold">
          4. Request a detailed review (optional)
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Your email app will open with a draft enquiry. Review it before sending.
        </p>

        <form
          onSubmit={sendEnquiry}
          className="mt-4 grid gap-4 sm:grid-cols-2"
        >
          <label className="text-sm">
            Name
            <input
              required
              value={investorName}
              onChange={(e) => setInvestorName(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2"
            />
          </label>

          <label className="text-sm">
            Email
            <input
              required
              type="email"
              value={investorEmail}
              onChange={(e) => setInvestorEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2"
            />
          </label>

          <label className="text-sm sm:col-span-2">
            Phone (optional)
            <input
              value={investorPhone}
              onChange={(e) => setInvestorPhone(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2"
            />
          </label>

          <button
            type="submit"
            className="rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white sm:col-span-2"
          >
            Prepare portfolio review enquiry
          </button>
        </form>

        
<button
  type="button"
  onClick={() => {
    alert("Button click is working!");
  }}
  className="mt-4 rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white"
>
  Test Download Button
</button>

      </section>

      <p className="mt-6 text-xs leading-5 text-gray-500">
        This tool summarises user-entered figures and does not provide a buy,
        hold or sell recommendation. Values may be inaccurate or outdated.
        Verify all figures before making investment decisions.
      </p>
    </main>
  );
}
