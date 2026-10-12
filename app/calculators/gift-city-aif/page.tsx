"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

function numberFormat(value: number, currency: "USD" | "INR") {
  return new Intl.NumberFormat(currency === "USD" ? "en-US" : "en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}


function percent(value: number) {
  return `${value.toFixed(2)}%`;
}

export default function GiftCityAifCalculatorPage() {
  const [investmentUsd, setInvestmentUsd] = useState(100_000);
  const [entryRate, setEntryRate] = useState(88);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [annualFee, setAnnualFee] = useState(2);
  const [rupeeDepreciation, setRupeeDepreciation] = useState(4);
  const [duration, setDuration] = useState(5);
  const [otherCostsUsd, setOtherCostsUsd] = useState(0);

  const result = useMemo(() => {
    const initialInr = investmentUsd * entryRate;
    // Simplified annual model: fee is applied to the value after gross portfolio growth.
    const netAnnualGrowth =
      (1 + annualReturn / 100) * (1 - annualFee / 100) - 1;
    const finalInr = initialInr * Math.pow(1 + netAnnualGrowth, duration);
    const exitRate =
      entryRate * Math.pow(1 + rupeeDepreciation / 100, duration);
    const finalUsdBeforeCosts = finalInr / exitRate;
    const finalUsd = finalUsdBeforeCosts - otherCostsUsd;
    const profitUsd = finalUsd - investmentUsd;
    const annualizedUsdReturn =
      investmentUsd > 0 && finalUsd > 0
        ? (Math.pow(finalUsd / investmentUsd, 1 / duration) - 1) * 100
        : -100;

    return {
      initialInr,
      netAnnualGrowth: netAnnualGrowth * 100,
      finalInr,
      exitRate,
      finalUsdBeforeCosts,
      finalUsd,
      profitUsd,
      annualizedUsdReturn,
      currencyImpactEstimate: finalUsdBeforeCosts -
        finalInr / entryRate,
    };
  }, [
    investmentUsd,
    entryRate,
    annualReturn,
    annualFee,
    rupeeDepreciation,
    duration,
    otherCostsUsd,
  ]);

  const updateNumber =
    (setter: (value: number) => void, min: number, max: number) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = Number(event.target.value);
      if (Number.isFinite(parsed)) setter(Math.min(max, Math.max(min, parsed)));
    };

  return (
    <main className="section" style={{ maxWidth: 1080, margin: "0 auto", paddingTop: 36, paddingBottom: 64 }}>
      <div className="calculatorEyebrow">INTERNATIONAL INVESTOR TOOLS</div>
      <h1>Foreign Investor — India Investment Calculator</h1>
      <p className="muted" style={{ maxWidth: 800 }}>
        Estimate how an investment in an Indian portfolio may translate back
        into US dollars after assumed portfolio returns, annual fund fees and
        rupee depreciation. Designed for educational scenario analysis,
        including discussions about eligible GIFT City and AIF routes.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: 24, marginTop: 28 }}>
        <section className="card" style={{ padding: 24 }}>
          <h2>Investment assumptions</h2>
          <div style={{ display: "grid", gap: 18, marginTop: 18 }}>
            <label style={{ display: "grid", gap: 7 }}>
              <span>Initial investment (USD)</span>
              <input type="number" min={1} max={1000000000} step={1000} value={investmentUsd}
                onChange={updateNumber(setInvestmentUsd, 1, 1_000_000_000)}
                style={{ width: "100%", padding: 11, border: "1px solid #cbd5e1", borderRadius: 8 }} />
            </label>
            <label style={{ display: "grid", gap: 7 }}>
              <span>Entry exchange rate (INR per USD)</span>
              <input type="number" min={1} max={500} step={0.1} value={entryRate}
                onChange={updateNumber(setEntryRate, 1, 500)}
                style={{ width: "100%", padding: 11, border: "1px solid #cbd5e1", borderRadius: 8 }} />
            </label>
            <label style={{ display: "grid", gap: 7 }}>
              <span>Expected annual portfolio return (%)</span>
              <input type="number" min={-100} max={100} step={0.5} value={annualReturn}
                onChange={updateNumber(setAnnualReturn, -100, 100)}
                style={{ width: "100%", padding: 11, border: "1px solid #cbd5e1", borderRadius: 8 }} />
            </label>
            <label style={{ display: "grid", gap: 7 }}>
              <span>Annual fund fee (%)</span>
              <input type="number" min={0} max={50} step={0.25} value={annualFee}
                onChange={updateNumber(setAnnualFee, 0, 50)}
                style={{ width: "100%", padding: 11, border: "1px solid #cbd5e1", borderRadius: 8 }} />
            </label>
            <label style={{ display: "grid", gap: 7 }}>
              <span>Annual INR depreciation vs USD (%)</span>
              <input type="number" min={-50} max={50} step={0.5} value={rupeeDepreciation}
                onChange={updateNumber(setRupeeDepreciation, -50, 50)}
                style={{ width: "100%", padding: 11, border: "1px solid #cbd5e1", borderRadius: 8 }} />
              <small className="muted">Use a negative figure to model rupee appreciation.</small>
            </label>
            <label style={{ display: "grid", gap: 7 }}>
              <span>Investment duration (years)</span>
              <input type="number" min={1} max={50} step={1} value={duration}
                onChange={updateNumber(setDuration, 1, 50)}
                style={{ width: "100%", padding: 11, border: "1px solid #cbd5e1", borderRadius: 8 }} />
            </label>
            <label style={{ display: "grid", gap: 7 }}>
              <span>Other one-time costs (USD, optional)</span>
              <input type="number" min={0} max={1000000000} step={100} value={otherCostsUsd}
                onChange={updateNumber(setOtherCostsUsd, 0, 1_000_000_000)}
                style={{ width: "100%", padding: 11, border: "1px solid #cbd5e1", borderRadius: 8 }} />
            </label>
            <button type="button" className="btn alt" onClick={() => {
              setInvestmentUsd(100_000);
              setEntryRate(88);
              setAnnualReturn(12);
              setAnnualFee(2);
              setRupeeDepreciation(4);
              setDuration(5);
              setOtherCostsUsd(0);
            }}>Reset example</button>
          </div>
        </section>

        <section className="card" style={{ padding: 24 }}>
          <div className="calculatorEyebrow">ILLUSTRATIVE RESULTS</div>
          <h2 style={{ marginTop: 8 }}>Estimated final value in USD</h2>
          <p style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 750, margin: "12px 0 24px", overflowWrap: "anywhere" }}>
            {numberFormat(result.finalUsd, "USD")}
          </p>
          <div style={{ display: "grid", gap: 0 }}>
            {[
              ["Estimated USD profit / loss", `${result.profitUsd >= 0 ? "+" : "−"}${numberFormat(Math.abs(result.profitUsd), "USD")}`],
              ["Annualized USD return", percent(result.annualizedUsdReturn)],
              ["Entry exchange rate", `₹${entryRate.toFixed(2)} / USD`],
              ["Estimated exit exchange rate", `₹${result.exitRate.toFixed(2)} / USD`],
              ["Initial INR equivalent", numberFormat(result.initialInr, "INR")],
              ["Estimated final INR value", numberFormat(result.finalInr, "INR")],
              ["Illustrative net annual INR growth", percent(result.netAnnualGrowth)],
              ["Other costs deducted", numberFormat(otherCostsUsd, "USD")],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 16, padding: "13px 0", borderBottom: "1px solid #e2e8f0" }}>
                <span className="muted">{label}</span>
                <strong style={{ textAlign: "right", overflowWrap: "anywhere" }}>{value}</strong>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 22, padding: 16, background: "#f1f5f9", borderRadius: 10 }}>
            <strong>How currency depreciation affects you</strong>
            <p className="muted" style={{ marginBottom: 0, marginTop: 8 }}>
              If the rupee weakens against the dollar, the same INR portfolio
              value converts into fewer US dollars. A higher INR investment
              return does not necessarily mean a higher USD return.
            </p>
          </div>
        </section>
      </div>

      <section style={{ marginTop: 28 }}>
        <h2>Important assumptions and limitations</h2>
        <ul className="muted" style={{ lineHeight: 1.8, paddingLeft: 22 }}>
          <li>This simplified model compounds the portfolio return and applies the annual fee multiplicatively each year.</li>
          <li>Currency depreciation is modelled as a constant annual rate; actual exchange rates can move up or down.</li>
          <li>Taxes in India and the investor’s country of tax residence, withholding tax, fund-specific costs, transaction charges and repatriation costs are not calculated.</li>
          <li>GIFT City, AIF and other routes have different eligibility, regulatory, tax and product rules. This calculator does not determine eligibility or the best investment route.</li>
          <li>Returns are hypothetical, not forecasts or guarantees, and actual investments can lose value.</li>
        </ul>
      </section>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
        <Link className="btn" href="/contact">Discuss your requirement →</Link>
        <Link className="btn alt" href="/calculators">← All calculators</Link>
      </div>
      <p className="muted" style={{ fontSize: 13, marginTop: 24 }}>
        Educational illustration only; not tax, legal or investment advice.
        Cross-border investors should confirm the applicable rules with
        qualified tax and regulatory professionals before investing.
      </p>
    </main>
  );
}
