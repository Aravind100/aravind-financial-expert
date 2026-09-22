"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type YearData = {
  year: number;
  value: number;
  gain: number;
};

function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, value));
}

function numberToIndianWords(num: number): string {
  if (!Number.isFinite(num) || num <= 0) {
    return "Zero Rupees";
  }

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function belowThousand(n: number): string {
    let result = "";

    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }

    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + " ";
      n %= 10;
    }

    if (n > 0) {
      result += ones[n] + " ";
    }

    return result.trim();
  }

  let n = Math.floor(num);
  let result = "";

  const crore = Math.floor(n / 10000000);
  n %= 10000000;

  const lakh = Math.floor(n / 100000);
  n %= 100000;

  const thousand = Math.floor(n / 1000);
  n %= 1000;

  if (crore > 0) {
    result += belowThousand(crore) + " Crore ";
  }

  if (lakh > 0) {
    result += belowThousand(lakh) + " Lakh ";
  }

  if (thousand > 0) {
    result += belowThousand(thousand) + " Thousand ";
  }

  if (n > 0) {
    result += belowThousand(n);
  }

  return result.trim() + " Rupees";
}

function calculateCAGR(
  initialInvestment: number,
  finalValue: number,
  years: number
) {
  const initial = Math.max(1, initialInvestment);
  const finalAmount = Math.max(0, finalValue);
  const period = Math.max(1, years);

  let cagr = 0;

  if (finalAmount > 0) {
    cagr =
      (Math.pow(finalAmount / initial, 1 / period) - 1) *
      100;
  }

  const yearlyData: YearData[] = [];

  for (let year = 1; year <= period; year++) {
    const value =
      initial * Math.pow(1 + cagr / 100, year);

    yearlyData.push({
      year,
      value,
      gain: value - initial,
    });
  }

  return {
    cagr,
    totalGain: finalAmount - initial,
    yearlyData,
  };
}

export default function CAGRCalculatorPage() {
  const [initialInvestment, setInitialInvestment] =
    useState(100000);

  const [finalValue, setFinalValue] =
    useState(200000);

  const [years, setYears] = useState(5);

  const result = useMemo(() => {
    return calculateCAGR(
      initialInvestment,
      finalValue,
      years
    );
  }, [initialInvestment, finalValue, years]);

  const maxChartValue = Math.max(
    finalValue,
    initialInvestment,
    1
  );

  const absoluteReturn =
    initialInvestment > 0
      ? ((finalValue - initialInvestment) /
          initialInvestment) *
        100
      : 0;

  return (
    <div className="cagr-page">
      {/* HERO */}
      <section className="calculatorHero">
        <div className="calculatorEyebrow">
          CAGR CALCULATOR
        </div>

        <h1>
          Calculate Your Investment's Annualized Growth
        </h1>

        <p>
          Calculate the Compound Annual Growth Rate of an
          investment using the initial value, final value and
          investment period.
        </p>
      </section>

      {/* CALCULATOR */}
      <section className="calculatorSection">
        <div className="calculatorBox">
          <div className="calculatorBoxHeader">
            <h2>CAGR Calculator</h2>

            <p>
              Enter your investment values and time period to
              calculate the annualized growth rate.
            </p>
          </div>

          <div className="cagrInputGrid">
            {/* INITIAL INVESTMENT */}
            <div className="calculatorInputCard">
              <label htmlFor="cagr-initial">
                Initial Investment
              </label>

              <div className="calculatorInputWrap">
                <span>₹</span>

                <input
                  id="cagr-initial"
                  type="number"
                  min="0"
                  step="1000"
                  value={
                    initialInvestment === 0
                      ? ""
                      : initialInvestment
                  }
                  onChange={(e) => {
                    const value = e.target.value;

                    setInitialInvestment(
                      value === "" ? 0 : Number(value)
                    );
                  }}
                  onBlur={() => {
                    if (initialInvestment < 1) {
                      setInitialInvestment(1);
                    }
                  }}
                />
              </div>

              <p className="calculatorInputHint">
                Starting investment value
              </p>
            </div>

            {/* FINAL VALUE */}
            <div className="calculatorInputCard">
              <label htmlFor="cagr-final">
                Final Investment Value
              </label>

              <div className="calculatorInputWrap">
                <span>₹</span>

                <input
                  id="cagr-final"
                  type="number"
                  min="0"
                  step="1000"
                  value={
                    finalValue === 0
                      ? ""
                      : finalValue
                  }
                  onChange={(e) => {
                    const value = e.target.value;

                    setFinalValue(
                      value === "" ? 0 : Number(value)
                    );
                  }}
                  onBlur={() => {
                    if (finalValue < 0) {
                      setFinalValue(0);
                    }
                  }}
                />
              </div>

              <p className="calculatorInputHint">
                Ending investment value
              </p>
            </div>

            {/* PERIOD */}
            <div className="calculatorInputCard">
              <label htmlFor="cagr-years">
                Investment Period
              </label>

              <div className="calculatorInputWrap">
                <input
                  id="cagr-years"
                  type="number"
                  min="1"
                  max="50"
                  value={years}
                  onChange={(e) => {
                    const value = Number(
                      e.target.value
                    );

                    setYears(
                      Number.isFinite(value)
                        ? Math.min(
                            50,
                            Math.max(1, value)
                          )
                        : 1
                    );
                  }}
                />

                <span>Years</span>
              </div>

              <input
                className="calculatorRange"
                type="range"
                min="1"
                max="50"
                value={years}
                onChange={(e) =>
                  setYears(Number(e.target.value))
                }
              />

              <p className="calculatorInputHint">
                {years} years
              </p>
            </div>
          </div>

          {/* RESULT */}
          <div className="cagrMainResult">
            <span>
              Compound Annual Growth Rate
            </span>

            <strong>
              {result.cagr.toFixed(2)}%
            </strong>

            <p>
              Annualized growth rate over {years}{" "}
              {years === 1 ? "year" : "years"}
            </p>
          </div>

          {/* SUMMARY */}
          <div className="calculatorResults">
            <div className="calculatorResultCard">
              <span>Initial Investment</span>

              <strong>
                {formatINR(initialInvestment)}
              </strong>
            </div>

            <div className="calculatorResultCard">
              <span>Final Value</span>

              <strong>
                {formatINR(finalValue)}
              </strong>
            </div>

            <div className="calculatorResultCard calculatorResultHighlight">
              <span>Total Gain / Loss</span>

              <strong>
                {formatINR(
                  result.totalGain
                )}
              </strong>
            </div>
          </div>

          {/* FINAL VALUE WORDS */}
          <div className="calculatorAmountWords">
            <span>
              Final Investment Value in words
            </span>

            <strong>
              {numberToIndianWords(finalValue)}
            </strong>
          </div>

          {/* RETURN COMPARISON */}
          <div className="cagrReturnComparison">
            <div>
              <span>
                Absolute Return
              </span>

              <strong>
                {absoluteReturn.toFixed(2)}%
              </strong>
            </div>

            <div>
              <span>
                CAGR
              </span>

              <strong>
                {result.cagr.toFixed(2)}%
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* CHART */}
      <section className="calculatorSection">
        <div className="calculatorContentCard">
          <div className="calculatorSectionHeading">
            <div>
              <span className="calculatorSmallLabel">
                ANNUALIZED GROWTH
              </span>

              <h2>
                Illustrative Year-by-Year Growth
              </h2>
            </div>
          </div>

          <div className="cagrChart">
            {result.yearlyData.map((item) => (
              <div
                className="cagrChartItem"
                key={item.year}
              >
                <div className="cagrChartValue">
                  {formatINR(item.value)}
                </div>

                <div className="cagrChartBar">
                  <div
                    className="cagrChartFill"
                    style={{
                      height: `${
                        (item.value /
                          maxChartValue) *
                        100
                      }%`,
                    }}
                  />
                </div>

                <span>
                  Year {item.year}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YEAR TABLE */}
      <section className="calculatorSection">
        <div className="calculatorContentCard">
          <div className="calculatorSectionHeading">
            <div>
              <span className="calculatorSmallLabel">
                YEAR-WISE VIEW
              </span>

              <h2>
                Investment Growth Table
              </h2>
            </div>
          </div>

          <div className="calculatorTableWrap">
            <table className="calculatorTable">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Estimated Value</th>
                  <th>Gain vs Initial</th>
                </tr>
              </thead>

              <tbody>
                {result.yearlyData.map(
                  (item) => (
                    <tr key={item.year}>
                      <td>{item.year}</td>

                      <td>
                        {formatINR(item.value)}
                      </td>

                      <td>
                        {formatINR(item.gain)}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* WHAT IS CAGR */}
      <section className="calculatorSection">
        <div className="cagrInfoGrid">
          <div className="calculatorInfoCard">
            <span className="calculatorSmallLabel">
              UNDERSTANDING CAGR
            </span>

            <h2>
              What is CAGR?
            </h2>

            <p>
              CAGR stands for Compound Annual Growth Rate.
              It represents the annualized rate at which an
              investment would have grown from its starting
              value to its ending value over a specific period.
            </p>

            <p>
              CAGR is useful because it converts the total
              growth over several years into an annualized
              growth rate.
            </p>

            <div className="calculatorHighlightNote">
              <strong>
                Important:
              </strong>
              <br />
              CAGR is an annualized mathematical measure. It
              does not mean the investment actually earned the
              same percentage every year.
            </div>
          </div>

          <div className="calculatorInfoCard">
            <span className="calculatorSmallLabel">
              CAGR FORMULA
            </span>

            <h2>
              How CAGR is Calculated
            </h2>

            <div className="cagrFormula">
              CAGR = (Final Value ÷ Initial Value)
              <sup>1 ÷ Years</sup> − 1
            </div>

            <p>
              The calculator uses the initial investment,
              final investment value and holding period to
              calculate the annualized growth rate.
            </p>

            <p>
              The result is expressed as a percentage per year.
            </p>
          </div>
        </div>
      </section>

      {/* CAGR VS ABSOLUTE RETURN */}
      <section className="calculatorSection">
        <div className="calculatorContentCard">
          <div className="calculatorSectionHeading">
            <div>
              <span className="calculatorSmallLabel">
                UNDERSTAND THE DIFFERENCE
              </span>

              <h2>
                CAGR vs Absolute Return
              </h2>
            </div>
          </div>

          <div className="cagrComparison">
            <div>
              <h3>
                Absolute Return
              </h3>

              <p>
                Absolute return shows the total percentage
                increase or decrease between the initial and
                final investment values.
              </p>

              <div className="cagrExample">
                <strong>
                  Example
                </strong>

                <span>
                  ₹1,00,000 → ₹1,50,000
                </span>

                <b>
                  Absolute Return = 50%
                </b>
              </div>
            </div>

            <div>
              <h3>
                CAGR
              </h3>

              <p>
                CAGR expresses that same growth as an
                annualized rate over the entire investment
                period.
              </p>

              <div className="cagrExample">
                <strong>
                  Example
                </strong>

                <span>
                  ₹1,00,000 → ₹1,50,000 over 5 years
                </span>

                <b>
                  CAGR ≈ 8.45%
                </b>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="calculatorSection">
        <div className="calculatorContentCard">
          <div className="calculatorSectionHeading">
            <div>
              <span className="calculatorSmallLabel">
                HOW IT WORKS
              </span>

              <h2>
                How to Use the CAGR Calculator
              </h2>
            </div>
          </div>

          <div className="cagrSteps">
            <div className="calculatorStep">
              <span>01</span>

              <h3>
                Enter Initial Value
              </h3>

              <p>
                Enter the amount or value of the investment
                at the beginning of the period.
              </p>
            </div>

            <div className="calculatorStep">
              <span>02</span>

              <h3>
                Enter Final Value
              </h3>

              <p>
                Enter the investment value at the end of the
                selected period.
              </p>
            </div>

            <div className="calculatorStep">
              <span>03</span>

              <h3>
                Enter Time Period
              </h3>

              <p>
                Enter the number of years for which the
                investment was held.
              </p>
            </div>

            <div className="calculatorStep">
              <span>04</span>

              <h3>
                View CAGR
              </h3>

              <p>
                The calculator converts the total growth into
                an annualized percentage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK EXAMPLES */}
      <section className="calculatorSection">
        <div className="calculatorContentCard">
          <div className="calculatorSectionHeading">
            <div>
              <span className="calculatorSmallLabel">
                QUICK EXAMPLES
              </span>

              <h2>
                Try Different Investment Scenarios
              </h2>
            </div>
          </div>

          <div className="cagrQuickGrid">
            {[
              {
                initial: 100000,
                final: 200000,
                years: 5,
              },
              {
                initial: 100000,
                final: 300000,
                years: 10,
              },
              {
                initial: 500000,
                final: 1000000,
                years: 7,
              },
              {
                initial: 1000000,
                final: 2500000,
                years: 10,
              },
            ].map((example, index) => {
              const calculation =
                calculateCAGR(
                  example.initial,
                  example.final,
                  example.years
                );

              return (
                <button
                  type="button"
                  key={index}
                  className="calculatorQuickCard"
                  onClick={() => {
                    setInitialInvestment(
                      example.initial
                    );

                    setFinalValue(
                      example.final
                    );

                    setYears(
                      example.years
                    );

                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                >
                  <span>
                    {formatINR(
                      example.initial
                    )}{" "}
                    →{" "}
                    {formatINR(
                      example.final
                    )}
                  </span>

                  <strong>
                    {calculation.cagr.toFixed(2)}%
                  </strong>

                  <small>
                    Over {example.years} years
                  </small>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* RELATED CALCULATORS */}
      <section className="calculatorSection">
        <div className="calculatorContentCard">
          <div className="calculatorSectionHeading">
            <div>
              <span className="calculatorSmallLabel">
                EXPLORE MORE
              </span>

              <h2>
                Related Financial Calculators
              </h2>
            </div>
          </div>

          <div className="cagrRelatedGrid">
            <Link
              href="/calculators/sip"
              className="calculatorRelatedCard"
            >
              <span>📈</span>

              <h3>
                SIP Calculator
              </h3>

              <p>
                Estimate the potential growth of regular
                monthly investments.
              </p>
            </Link>

            <Link
              href="/calculators/lumpsum"
              className="calculatorRelatedCard"
            >
              <span>💰</span>

              <h3>
                Lumpsum Calculator
              </h3>

              <p>
                Estimate the potential future value of a
                one-time investment.
              </p>
            </Link>

            <Link
              href="/calculators"
              className="calculatorRelatedCard"
            >
              <span>🧮</span>

              <h3>
                All Calculators
              </h3>

              <p>
                Explore the complete collection of financial
                calculators.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="calculatorCTA">
        <div>
          <span className="calculatorSmallLabel">
            PLAN WITH CLARITY
          </span>

          <h2>
            Want to Understand Your Investment Better?
          </h2>

          <p>
            Use CAGR as one measure for understanding
            historical or hypothetical annualized growth.
            Consider your financial goal, time horizon and
            risk profile before making an investment decision.
          </p>

          <Link
            href="/contact"
            className="primaryButton"
          >
            Discuss Your Financial Needs
          </Link>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="calculatorDisclaimer">
        <strong>
          Disclaimer:
        </strong>{" "}
        This calculator provides a mathematical illustration
        based on the values entered by the user. CAGR is an
        annualized measure and does not imply that returns
        were actually earned at the same rate every year.
        Actual investment values can fluctuate and may be
        affected by market conditions, fees, taxes and other
        factors. Market-linked investments are subject to
        market risks. Past performance does not guarantee
        future results.
      </section>
    </div>
  );
}
