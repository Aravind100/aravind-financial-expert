
"use client";

import styles from "./page.module.css";
import { useMemo, useState } from "react";

type PortfolioType = "stock" | "mutual-fund";

type Holding = {
  id: string;
  type: PortfolioType;
  name: string;
  quantity: number;
  invested: number;
  currentValue: number;
  sipAmount: number;
};

const emptyHolding = (type: PortfolioType = "stock"): Holding => ({
  id: `${Date.now()}-${Math.random()}`,
  type,
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

      return {
        id: `import-${Date.now()}-${index}-${Math.random()}`,
        type,
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

  function updateHolding(id: string, field: keyof Holding, value: string) {
    setHoldings((old) =>
      old.map((h) => {
        if (h.id !== id) return h;
        if (field === "type") {
          return { ...h, type: value as PortfolioType };
        }
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
    const doc = new jsPDF();

    const reportDate = new Date().toLocaleDateString("en-IN");
    const reportHoldings = visible.filter((h) => h.name.trim());

    let y = 20;
    const left = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    function addPageIfNeeded(requiredHeight = 10) {
      if (y + requiredHeight > pageHeight - 18) {
        doc.addPage();
        y = 20;
      }
    }

    function writeLine(text: string, size = 10) {
      addPageIfNeeded(size / 2 + 4);
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(text, pageWidth - left * 2);
      doc.text(lines, left, y);
      y += lines.length * (size / 2 + 2);
    }

    doc.setFont("helvetica", "bold");
    writeLine("ARAVIND FINANCIAL EXPERT", 16);
    doc.setFont("helvetica", "normal");
    writeLine("Stock / SIP Portfolio Review", 13);
    writeLine(`Report date: ${reportDate}`, 10);
    y += 4;

    doc.setFont("helvetica", "bold");
    writeLine("PORTFOLIO SUMMARY", 12);
    doc.setFont("helvetica", "normal");
    writeLine(`Total invested: ${money(totals.invested)}`);
    writeLine(`Current value: ${money(totals.current)}`);
    writeLine(`Difference: ${money(totals.profit)}`);
    writeLine(`Monthly SIP: ${money(totals.sip)}`);
    y += 5;

    doc.setFont("helvetica", "bold");
    writeLine("HOLDINGS", 12);
    doc.setFont("helvetica", "normal");

    if (!reportHoldings.length) {
      writeLine("No named holdings were entered.");
    }

    reportHoldings.forEach((h, index) => {
      addPageIfNeeded(38);
      doc.setFont("helvetica", "bold");
      writeLine(`${index + 1}. ${h.name}`, 10);
      doc.setFont("helvetica", "normal");
      writeLine(
        `Type: ${h.type === "stock" ? "Stock" : "Mutual fund"} | Quantity/units: ${h.quantity}`
      );
      writeLine(`Invested: ${money(h.invested)}`);
      writeLine(`Current value: ${money(h.currentValue)}`);
      writeLine(`Difference: ${money(h.currentValue - h.invested)}`);
      writeLine(`Monthly SIP: ${money(h.sipAmount)}`);
      y += 3;
    });

    y += 3;
    doc.setFont("helvetica", "bold");
    writeLine("IMPORTANT INFORMATION", 11);
    doc.setFont("helvetica", "normal");
    writeLine(
      "This report is based only on values entered or imported by the user. " +
      "It does not fetch live market prices or provide a buy, hold or sell recommendation."
    );
    writeLine(
      "The difference shown is current value minus invested amount. " +
      "It is not an annualised return and may not represent actual SIP performance."
    );
    writeLine(
      "Please verify all figures and consult an appropriately qualified financial professional if needed."
    );

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
          It is not an annualised return and may not equal actual SIP returns.
        </p>
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
    void downloadPDFReport().catch(() => {
      setMessage("Unable to generate the PDF. Please try again.");
    });
  }}
  className="mt-4 rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white"
>
  Download PDF Report
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
