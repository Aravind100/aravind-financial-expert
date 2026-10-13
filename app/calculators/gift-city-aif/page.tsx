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

function SliderField({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatValue: (value: number) => string;
  hint?: string;
}) {
  return (
    <label style={{ display: "grid", gap: 9 }}>
      <span style={{ fontWeight: 600 }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-label={label}
          style={{
            width: "100%",
            minWidth: 0,
            accentColor: "#0f766e",
            cursor: "ew-resize",
            height: 7,
            borderRadius: 999,
          }}
        />
        <output
          style={{
            minWidth: 100,
            textAlign: "right",
            fontWeight: 800,
            fontSize: 13,
            color: "#0f766e",
            background: "#ecfeff",
            border: "1px solid #a5f3fc",
            borderRadius: 10,
            padding: "8px 9px",
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
          }}
        >
          {formatValue(value)}
        </output>
      </div>
      {hint ? <small className="muted">{hint}</small> : null}
    </label>
  );
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

  return (
    <main style={{ maxWidth: 1180, margin: "0 auto", padding: "32px 20px 72px", color: "#0f172a" }}>
      <section style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 24,
        padding: "clamp(26px, 5vw, 52px)",
        color: "#ffffff",
        background: "linear-gradient(125deg, #0b132b 0%, #123b5d 52%, #087e8b 100%)",
        boxShadow: "0 24px 60px rgba(15, 23, 42, 0.18)",
      }}>
        <div style={{ position: "absolute", width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.07)", right: -70, top: -100 }} />
        <div style={{ position: "absolute", width: 180, height: 180, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.16)", right: 70, bottom: -110 }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 780 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 999, background: "rgba(255,255,255,0.09)", fontSize: 12, fontWeight: 800, letterSpacing: "0.12em" }}>
            🌎 INTERNATIONAL INVESTOR TOOLS
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.08, letterSpacing: "-0.04em", margin: "22px 0 16px", color: "#ffffff" }}>
            Invest in India.<br />Understand your USD returns.
          </h1>
          <p style={{ maxWidth: 720, color: "rgba(255,255,255,0.82)", fontSize: "clamp(1rem, 2vw, 1.15rem)", lineHeight: 1.75, margin: 0 }}>
            Explore how portfolio performance, fund fees and rupee movement may affect the dollar value of an investment through an eligible Indian investment route.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
            {["USD-based illustration", "Currency-adjusted estimate", "Instant calculations"].map((item) => (
              <span key={item} style={{ padding: "8px 12px", borderRadius: 10, background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.12)", fontSize: 13, fontWeight: 600 }}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: 24, marginTop: 28, alignItems: "start" }}>
        <section style={{ padding: "clamp(20px, 3vw, 30px)", border: "1px solid #e2e8f0", borderRadius: 22, background: "#ffffff", boxShadow: "0 12px 36px rgba(15,23,42,0.06)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 46, height: 46, display: "grid", placeItems: "center", flexShrink: 0, borderRadius: 14, background: "#e0f2fe", fontSize: 22 }}>🎛️</div>
            <div>
              <h2 style={{ margin: "0 0 5px", fontSize: 23 }}>Investment assumptions</h2>
              <p style={{ margin: 0, color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>Move the sliders to explore different scenarios.</p>
            </div>
          </div>
          <div style={{ display: "grid", gap: 23 }}>
            <SliderField
              label="Initial investment (USD)"
              value={investmentUsd}
              min={10000}
              max={1000000}
              step={5000}
              onChange={setInvestmentUsd}
              formatValue={(value) => numberFormat(value, "USD")}
            />

            <SliderField
              label="Entry exchange rate (INR per USD)"
              value={entryRate}
              min={70}
              max={120}
              step={0.25}
              onChange={setEntryRate}
              formatValue={(value) => `₹${value.toFixed(2)}`}
            />

            <SliderField
              label="Expected annual portfolio return (%)"
              value={annualReturn}
              min={-20}
              max={30}
              step={0.5}
              onChange={setAnnualReturn}
              formatValue={percent}
            />

            <SliderField
              label="Annual fund fee (%)"
              value={annualFee}
              min={0}
              max={5}
              step={0.25}
              onChange={setAnnualFee}
              formatValue={percent}
            />

            <SliderField
              label="Annual INR depreciation vs USD (%)"
              value={rupeeDepreciation}
              min={-10}
              max={15}
              step={0.5}
              onChange={setRupeeDepreciation}
              formatValue={percent}
              hint="Negative values model rupee appreciation; positive values model depreciation."
            />

            <SliderField
              label="Investment duration"
              value={duration}
              min={1}
              max={20}
              step={1}
              onChange={setDuration}
              formatValue={(value) => `${value} ${value === 1 ? "year" : "years"}`}
            />

            <SliderField
              label="Other one-time costs (USD, optional)"
              value={otherCostsUsd}
              min={0}
              max={50000}
              step={100}
              onChange={setOtherCostsUsd}
              formatValue={(value) => numberFormat(value, "USD")}
            />

            <button
              type="button"
              className="btn alt"
              onClick={() => {
                setInvestmentUsd(100_000);
                setEntryRate(88);
                setAnnualReturn(12);
                setAnnualFee(2);
                setRupeeDepreciation(4);
                setDuration(5);
                setOtherCostsUsd(0);
              }}
            >
              Reset example
            </button>
          </div>
        </section>

        <section style={{ padding: "clamp(20px, 3vw, 30px)", border: "1px solid #cbd5e1", borderRadius: 22, background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 58%)", boxShadow: "0 12px 36px rgba(15,23,42,0.06)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#0f766e", fontSize: 12, fontWeight: 800, letterSpacing: "0.12em" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#14b8a6" }} />
            ILLUSTRATIVE RESULTS
          </div>
          <div style={{ marginTop: 16, padding: 22, borderRadius: 18, color: "#ffffff", background: "linear-gradient(135deg, #0f766e, #115e59)" }}>
            <p style={{ color: "rgba(255,255,255,0.78)", fontSize: 13, fontWeight: 700, margin: 0 }}>ESTIMATED FINAL VALUE IN USD</p>
            <p style={{ fontSize: "clamp(2.1rem, 5vw, 3.2rem)", fontWeight: 850, letterSpacing: "-0.04em", margin: "10px 0 0", overflowWrap: "anywhere", lineHeight: 1.1 }}>
              {numberFormat(result.finalUsd, "USD")}
            </p>
            <p style={{ margin: "12px 0 0", fontSize: 14, color: "rgba(255,255,255,0.82)" }}>
              {result.profitUsd >= 0 ? "Potential gain" : "Potential loss"}: {result.profitUsd >= 0 ? "+" : "−"}{numberFormat(Math.abs(result.profitUsd), "USD")}
            </p>
          </div>
          <div style={{ display: "grid", gap: 0 }}>
            {[
              ["Annualized USD return", percent(result.annualizedUsdReturn)],
              ["Entry exchange rate", `₹${entryRate.toFixed(2)} / USD`],
              ["Estimated exit exchange rate", `₹${result.exitRate.toFixed(2)} / USD`],
              ["Initial INR equivalent", numberFormat(result.initialInr, "INR")],
              ["Estimated final INR value", numberFormat(result.finalInr, "INR")],
              ["Illustrative net annual INR growth", percent(result.netAnnualGrowth)],
              ["Other costs deducted", numberFormat(otherCostsUsd, "USD")],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 16, padding: "14px 0", borderBottom: "1px solid #e2e8f0" }}>
                <span className="muted">{label}</span>
                <strong style={{ textAlign: "right", overflowWrap: "anywhere" }}>{value}</strong>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 22, padding: 18, background: "#ecfeff", border: "1px solid #a5f3fc", borderRadius: 15 }}>
            <strong style={{ color: "#155e75" }}>💱 How currency depreciation affects you</strong>
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

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 30 }}>
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
