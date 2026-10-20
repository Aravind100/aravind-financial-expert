
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

function parseCSV(text: string): Holding[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) throw new Error("The CSV needs a header and at least one holding.");

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const find = (row: string[], names: string[]) => {
    const index = headers.findIndex((h) => names.includes(h));
    return index < 0 ? "" : row[index]?.trim() ?? "";
  };
  const number = (value: string) => {
    const parsed = Number(value.replace(/[₹,\s]/g, ""));
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  };

  return lines.slice(1).filter((line) => line.trim()).map((line, index) => {
    const row = line.split(",").map((cell) => cell.trim());
    const rawType = find(row, ["type", "investment type"]).toLowerCase();
    const type: PortfolioType =
      rawType.includes("mutual") || rawType.includes("sip")
        ? "mutual-fund"
        : "stock";

    return {
      id: `csv-${Date.now()}-${index}`,
      type,
      name: find(row, ["name", "scheme", "scheme name", "stock", "stock name"]),
      quantity: number(find(row, ["quantity", "units", "shares"])),
      invested: number(find(row, ["invested", "invested amount", "cost"])),
      currentValue: number(find(row, ["current value", "market value", "value"])),
      sipAmount: number(find(row, ["sip", "sip amount", "monthly sip"])),
    };
  }).filter((holding) => holding.name);
}

export default function PortfolioReviewPage() {
  const [type, setType] = useState<"all" | PortfolioType>("all");
  const [holdings, setHoldings] = useState<Holding[]>([emptyHolding()]);
  const [message, setMessage] = useState("");
  const [investorName, setInvestorName] = useState("");
  const [investorEmail, setInvestorEmail] = useState("");
  const [investorPhone, setInvestorPhone] = useState("");

  const visible = holdings.filter((h) => type === "all" || h.type === type);

  const totals = useMemo(() => {
    const invested = visible.reduce((sum, h) => sum + h.invested, 0);
    const current = visible.reduce((sum, h) => sum + h.currentValue, 0);
    const sip = visible.reduce((sum, h) => sum + h.sipAmount, 0);
    return { invested, current, profit: current - invested, sip };
  }, [visible]);

  function updateHolding(id: string, field: keyof Holding, value: string) {
    setHoldings((old) => old.map((h) => {
      if (h.id !== id) return h;
      if (field === "type") return { ...h, type: value as PortfolioType };
      if (field === "name") return { ...h, name: value };
      return { ...h, [field]: Math.max(0, Number(value) || 0) };
    }));
  }

  async function uploadCSV(file?: File) {
    if (!file) return;
    try {
      const text = await file.text();
      const imported = parseCSV(text);
      if (!imported.length) throw new Error("No valid holdings found. Check your CSV columns.");
      setHoldings((old) => [...old.filter((h) => h.name.trim()), ...imported]);
      setMessage(`Imported ${imported.length} holding(s). Please verify the values.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to read this CSV file.");
    }
  }

  function sendEnquiry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const lines = visible.filter((h) => h.name.trim()).map((h) =>
      `${h.type === "stock" ? "Stock" : "Mutual fund"}: ${h.name}, invested ${money(h.invested)}, current ${money(h.currentValue)}`
    );

    const subject = encodeURIComponent("Portfolio Review Enquiry");
    const body = encodeURIComponent(
      `Name: ${investorName}\nEmail: ${investorEmail}\nPhone: ${investorPhone}\n\nPortfolio summary\nInvested: ${money(totals.invested)}\nCurrent value: ${money(totals.current)}\nMonthly SIP: ${money(totals.sip)}\n\nHoldings:\n${lines.join("\n")}`
    );
    window.location.href = `mailto:aravindchaudhary90@gmail.com?subject=${subject}&body=${body}`;
  }

  return (
    <main className={styles.page}>
      <header className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Investor tools
        </p>
        <h1 className="text-3xl font-bold sm:text-4xl">Stock / SIP Portfolio Review</h1>
        <p className="mt-3 max-w-3xl text-gray-600">
          Add your existing investments to understand your portfolio's reported
          value and prepare for a more detailed review.
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
                type === value ? "border-emerald-700 bg-emerald-700 text-white" : "bg-white"
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
          This version does not fetch live market prices.
        </p>

        <label className="mt-4 block text-sm font-medium">
          Import a CSV file
          <input
            type="file"
            accept=".csv,text/csv"
            className="mt-2 block w-full text-sm"
            onChange={(event) => uploadCSV(event.target.files?.[0])}
          />
        </label>

        <p className="mt-2 text-xs text-gray-500">
          CSV columns: type, name, quantity, invested, current value, sip amount.
          Use type values stock or mutual fund. Excel files are not supported yet.
        </p>

        {message && <p role="status" className="mt-3 text-sm">{message}</p>}

        <div className="mt-6 space-y-5">
          {visible.map((h) => (
            <div key={h.id} className="rounded-xl bg-gray-50 p-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <label className="text-sm">
                  Investment type
                  <select
                    value={h.type}
                    onChange={(e) => updateHolding(h.id, "type", e.target.value)}
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
                    onChange={(e) => updateHolding(h.id, "name", e.target.value)}
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
                    onChange={(e) => updateHolding(h.id, "quantity", e.target.value)}
                    className="mt-1 w-full rounded-lg border bg-white p-2"
                  />
                </label>
                <label className="text-sm">
                  Total invested (₹)
                  <input
                    type="number"
                    min="0"
                    value={h.invested || ""}
                    onChange={(e) => updateHolding(h.id, "invested", e.target.value)}
                    className="mt-1 w-full rounded-lg border bg-white p-2"
                  />
                </label>
                <label className="text-sm">
                  Current value (₹)
                  <input
                    type="number"
                    min="0"
                    value={h.currentValue || ""}
                    onChange={(e) => updateHolding(h.id, "currentValue", e.target.value)}
                    className="mt-1 w-full rounded-lg border bg-white p-2"
                  />
                </label>
                <label className="text-sm">
                  Monthly SIP (₹, if applicable)
                  <input
                    type="number"
                    min="0"
                    value={h.sipAmount || ""}
                    onChange={(e) => updateHolding(h.id, "sipAmount", e.target.value)}
                    className="mt-1 w-full rounded-lg border bg-white p-2"
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={() => setHoldings((old) => old.filter((item) => item.id !== h.id))}
                className="mt-3 text-sm text-red-700 underline"
              >
                Remove holding
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setHoldings((old) => [...old, emptyHolding(type === "all" ? "stock" : type)])}
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
        <h2 className="text-xl font-semibold">4. Request a detailed review (optional)</h2>
        <p className="mt-2 text-sm text-gray-600">
          Your email app will open with a draft enquiry. Review it before sending.
        </p>
        <form onSubmit={sendEnquiry} className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm">
            Name
            <input required value={investorName} onChange={(e) => setInvestorName(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2" />
          </label>
          <label className="text-sm">
            Email
            <input required type="email" value={investorEmail} onChange={(e) => setInvestorEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2" />
          </label>
          <label className="text-sm sm:col-span-2">
            Phone (optional)
            <input value={investorPhone} onChange={(e) => setInvestorPhone(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2" />
          </label>
          <button type="submit" className="rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white sm:col-span-2">
            Prepare portfolio review enquiry
          </button>
        </form>
      </section>

      <p className="mt-6 text-xs leading-5 text-gray-500">
        This tool summarises user-entered figures and does not provide a buy, hold
        or sell recommendation. Values may be inaccurate or outdated. Verify all
        figures before making investment decisions.
      </p>
    </main>
  );
}
