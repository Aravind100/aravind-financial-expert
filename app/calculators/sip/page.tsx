"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type YearData = {
  year: number;
  invested: number;
  value: number;
  gain: number;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, value));
}

function numberToIndianWords(value: number) {
  const amount = Math.round(Math.max(0, value));

  if (amount === 0) return "Zero Rupees";

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

  function twoDigits(num: number): string {
    if (num < 20) return ones[num];
    return `${tens[Math.floor(num / 10)]}${
      num % 10 ? ` ${ones[num % 10]}` : ""
    }`;
  }

  function threeDigits(num: number): string {
    if (num < 100) return twoDigits(num);

    return `${ones[Math.floor(num / 100)]} Hundred${
      num % 100 ? ` ${twoDigits(num % 100)}` : ""
    }`;
  }

  let remaining = amount;
  const parts: string[] = [];

  const crore = Math.floor(remaining / 10000000);
  remaining %= 10000000;

  const lakh = Math.floor(remaining / 100000);
  remaining %= 100000;

  const thousand = Math.floor(remaining / 1000);
  remaining %= 1000;

  const hundred = remaining;

  if (crore) parts.push(`${threeDigits(crore)} Crore`);
  if (lakh) parts.push(`${threeDigits(lakh)} Lakh`);
  if (thousand) parts.push(`${threeDigits(thousand)} Thousand`);
  if (hundred) parts.push(threeDigits(hundred));

  return `${parts.join(" ")} Rupees`;
}

function calculateSIP(
  monthlySIP: number,
  years: number,
  annualReturn: number,
  annualStepUp: number
) {
  const months = Math.max(1, Math.round(years * 12));
  const monthlyRate = annualReturn / 100 / 12;

  let corpus = 0;
  let totalInvested = 0;
  let currentMonthlySIP = Math.max(0, monthlySIP);

  const yearlyData: YearData[] = [];

  for (let month = 1; month <= months; month++) {
    corpus = corpus * (1 + monthlyRate) + currentMonthlySIP;
    totalInvested += currentMonthlySIP;

    if (month % 12 === 0 || month === months) {
      const year = Math.ceil(month / 12);

      yearlyData.push({
        year,
        invested: totalInvested,
        value: corpus,
        gain: corpus - totalInvested,
      });
    }

    if (month % 12 === 0 && month < months) {
      currentMonthlySIP *= 1 + annualStepUp / 100;
    }
  }

  return {
    totalInvested,
    estimatedReturns: corpus - totalInvested,
    futureValue: corpus,
    yearlyData,
  };
}

export const metadata = {
  title: "SIP Calculator | Calculate SIP Investment Growth",
  description:
    "Use the SIP Calculator to estimate investment value, total investment and potential returns based on SIP amount, time period, expected return and annual step-up.",
};

export default function SIPCalculatorPage() {
  const [monthlySIP, setMonthlySIP] = useState(10000);
  const [years, setYears] = useState(15);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [annualStepUp, setAnnualStepUp] = useState(0);

  const result = useMemo(
    () =>
      calculateSIP(
        monthlySIP,
        years,
        expectedReturn,
        annualStepUp
      ),
    [monthlySIP, years, expectedReturn, annualStepUp]
  );

  const maxChartValue = Math.max(
    ...result.yearlyData.map((item) => item.value),
    1
  );

  const applyExample = (
    sip: number,
    period: number,
    returnRate: number,
    stepUp: number
  ) => {
    setMonthlySIP(sip);
    setYears(period);
    setExpectedReturn(returnRate);
    setAnnualStepUp(stepUp);
  };

  return (
    <>
      {/* HERO */}
      <section className="pageHero sipHero">
        <div>
          <div className="sipEyebrow">INVESTMENT CALCULATOR</div>

          <h1>SIP Calculator</h1>

          <p>
            Estimate the potential future value of your monthly SIP
            investment.
          </p>

          <p className="sipHeroText">
            Enter your monthly investment, investment period, expected
            annual return and optional annual SIP increase to create an
            illustrative investment projection.
          </p>
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="section sipCalculatorSection">
        <div className="sipCalculatorGrid">

          <div className="card sipInputCard">
            <div className="sipCardEyebrow">CALCULATE YOUR SIP</div>

            <h2>Investment details</h2>

            <div className="sipInputGroup">
              <label htmlFor="monthlySIP">
                Monthly SIP
              </label>

              <input
                id="monthlySIP"
                type="number"
                min="0"
                step="500"
                value={monthlySIP}
                onChange={(e) =>
                  setMonthlySIP(Number(e.target.value))
                }
              />

              <div className="sipInputWords">
                {numberToIndianWords(monthlySIP)} per month
              </div>
            </div>

            <div className="sipInputGroup">
              <label htmlFor="years">
                Investment Period
              </label>

              <div className="sipRangeValue">
                <strong>{years}</strong>
                <span>Years</span>
              </div>

              <input
                id="years"
                type="range"
                min="1"
                max="40"
                step="1"
                value={years}
                onChange={(e) =>
                  setYears(Number(e.target.value))
                }
              />

              <div className="sipRangeLabels">
                <span>1 Year</span>
                <span>40 Years</span>
              </div>
            </div>

            <div className="sipInputGroup">
              <label htmlFor="expectedReturn">
                Expected Return p.a.
              </label>

              <div className="sipRangeValue">
                <strong>{expectedReturn}%</strong>
                <span>per year</span>
              </div>

              <input
                id="expectedReturn"
                type="range"
                min="0"
                max="30"
                step="0.5"
                value={expectedReturn}
                onChange={(e) =>
                  setExpectedReturn(Number(e.target.value))
                }
              />

              <div className="sipRangeLabels">
                <span>0%</span>
                <span>30%</span>
              </div>
            </div>

            <div className="sipInputGroup">
              <label htmlFor="annualStepUp">
                Annual SIP Increase
              </label>

              <div className="sipRangeValue">
                <strong>{annualStepUp}%</strong>
                <span>every year</span>
              </div>

              <input
                id="annualStepUp"
                type="range"
                min="0"
                max="30"
                step="1"
                value={annualStepUp}
                onChange={(e) =>
                  setAnnualStepUp(Number(e.target.value))
                }
              />

              <div className="sipRangeLabels">
                <span>0%</span>
                <span>30%</span>
              </div>
            </div>

            <div className="sipExampleButtons">
              <span>Quick examples:</span>

              <button
                type="button"
                onClick={() =>
                  applyExample(5000, 15, 12, 0)
                }
              >
                ₹5K
              </button>

              <button
                type="button"
                onClick={() =>
                  applyExample(10000, 15, 12, 0)
                }
              >
                ₹10K
              </button>

              <button
                type="button"
                onClick={() =>
                  applyExample(25000, 20, 12, 10)
                }
              >
                ₹25K + 10%
              </button>
            </div>
          </div>

          <div className="card sipResultCard">
            <div className="sipCardEyebrow">YOUR ILLUSTRATION</div>

            <h2>Estimated investment outcome</h2>

            <div className="sipFutureValue">
              <span>Estimated Future Value</span>

              <strong>
                {formatCurrency(result.futureValue)}
              </strong>

              <small>
                {numberToIndianWords(result.futureValue)}
              </small>
            </div>

            <div className="sipResultGrid">
              <div>
                <span>Total Invested</span>
                <strong>
                  {formatCurrency(result.totalInvested)}
                </strong>
              </div>

              <div>
                <span>Estimated Returns</span>
                <strong>
                  {formatCurrency(result.estimatedReturns)}
                </strong>
              </div>
            </div>

            <div className="sipResultBar">
              <div
                className="sipInvestedBar"
                style={{
                  width: `${
                    result.futureValue > 0
                      ? Math.min(
                          100,
                          (result.totalInvested /
                            result.futureValue) *
                            100
                        )
                      : 0
                  }%`,
                }}
              />
            </div>

            <div className="sipBarLegend">
              <span>
                <i className="sipLegendInvested" />
                Invested
              </span>

              <span>
                <i className="sipLegendReturns" />
                Estimated growth
              </span>
            </div>

            <div className="sipSummary">
              <div>
                <span>Monthly SIP</span>
                <strong>
                  {formatCurrency(monthlySIP)}
                </strong>
              </div>

              <div>
                <span>Investment Period</span>
                <strong>{years} Years</strong>
              </div>

              <div>
                <span>Expected Return</span>
                <strong>{expectedReturn}% p.a.</strong>
              </div>

              <div>
                <span>Annual Step-Up</span>
                <strong>{annualStepUp}%</strong>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CHART */}
      <section className="section sipChartSection">
        <div className="sipSectionHeading">
          <div>
            <div className="sipEyebrow">
              YEAR-BY-YEAR ILLUSTRATION
            </div>

            <h2>How the investment can grow over time</h2>

            <p className="muted">
              The chart illustrates the estimated portfolio value
              based on the assumptions entered above.
            </p>
          </div>
        </div>

        <div className="card sipChartCard">
          <div className="sipChart">
            {result.yearlyData.map((item) => (
              <div className="sipChartColumn" key={item.year}>
                <div className="sipChartValue">
                  {formatCurrency(item.value)}
                </div>

                <div className="sipChartBarArea">
                  <div
                    className="sipChartBar"
                    style={{
                      height: `${
                        (item.value / maxChartValue) * 100
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
      <section className="section sipTableSection">
        <div className="sipSectionHeading">
          <div>
            <div className="sipEyebrow">
              YEAR-WISE BREAKDOWN
            </div>

            <h2>Investment growth summary</h2>
          </div>
        </div>

        <div className="sipTableWrap">
          <table className="sipTable">
            <thead>
              <tr>
                <th>Year</th>
                <th>Total Invested</th>
                <th>Estimated Value</th>
                <th>Estimated Gain</th>
              </tr>
            </thead>

            <tbody>
              {result.yearlyData.map((item) => (
                <tr key={item.year}>
                  <td>{item.year}</td>
                  <td>{formatCurrency(item.invested)}</td>
                  <td>{formatCurrency(item.value)}</td>
                  <td>{formatCurrency(item.gain)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* WHAT IS SIP */}
      <section className="sipInfoSection">
        <div className="section">
          <div className="sipInfoGrid">

            <div>
              <div className="sipEyebrow">
                UNDERSTAND SIP
              </div>

              <h2>What is a SIP?</h2>
            </div>

            <div>
              <p>
                A Systematic Investment Plan, commonly called SIP,
                is a way of investing a fixed amount at regular
                intervals into a mutual fund scheme.
              </p>

              <p>
                Instead of investing a large amount at one time,
                an investor can invest periodically according to
                their chosen amount and frequency.
              </p>

              <p>
                The number of units purchased can vary because the
                applicable NAV can change over time.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* HOW SIP WORKS */}
      <section className="section">
        <div className="sipCenteredHeading">
          <div className="sipEyebrow">
            HOW IT WORKS
          </div>

          <h2>Understand the SIP journey</h2>

          <p className="muted">
            A simple way to understand the basic SIP process.
          </p>
        </div>

        <div className="sipWorkflow">

          <div className="sipWorkflowCard">
            <span>01</span>
            <h3>Choose an amount</h3>
            <p className="muted">
              Decide how much you want to invest periodically.
            </p>
          </div>

          <div className="sipWorkflowCard">
            <span>02</span>
            <h3>Choose a period</h3>
            <p className="muted">
              Select an investment horizon according to your
              financial objective.
            </p>
          </div>

          <div className="sipWorkflowCard">
            <span>03</span>
            <h3>Invest regularly</h3>
            <p className="muted">
              Your selected amount is invested at the chosen
              frequency.
            </p>
          </div>

          <div className="sipWorkflowCard">
            <span>04</span>
            <h3>Review periodically</h3>
            <p className="muted">
              Continue to review your investments and financial
              objectives over time.
            </p>
          </div>

        </div>
      </section>

      {/* STEP-UP */}
      <section className="sipBlueSection">
        <div className="section">
          <div className="sipBlueGrid">

            <div>
              <div className="sipEyebrow sipLightEyebrow">
                STEP-UP SIP
              </div>

              <h2>Increase your SIP as your income grows.</h2>

              <p>
                A Step-Up SIP increases the investment amount
                periodically according to a chosen percentage or
                amount. This can be used to illustrate how a
                gradually increasing contribution affects the
                investment outcome.
              </p>
            </div>

            <div className="sipBlueExample">
              <span>Example</span>

              <strong>
                ₹10,000/month
              </strong>

              <p>
                with a 10% annual increase can result in a
                significantly different investment contribution
                over a long period compared with keeping the SIP
                unchanged.
              </p>

              <button
                type="button"
                onClick={() =>
                  applyExample(10000, 20, 12, 10)
                }
              >
                Try ₹10K + 10% Step-Up
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* EXAMPLE */}
      <section className="section sipExampleSection">
        <div className="sipCenteredHeading">
          <div className="sipEyebrow">
            SIMPLE EXAMPLE
          </div>

          <h2>What happens with ₹10,000 per month?</h2>

          <p className="muted">
            The following illustration uses the assumptions below.
          </p>
        </div>

        <div className="sipExampleGrid">

          <div className="card">
            <span>Monthly SIP</span>
            <strong>₹10,000</strong>
          </div>

          <div className="card">
            <span>Investment Period</span>
            <strong>15 Years</strong>
          </div>

          <div className="card">
            <span>Assumed Return</span>
            <strong>12% p.a.</strong>
          </div>

          <div className="card">
            <span>Step-Up</span>
            <strong>0%</strong>
          </div>

        </div>

        <div className="sipExampleNote">
          <p>
            These figures are an illustration based on the assumptions
            above. Actual returns are market-linked and may be higher
            or lower.
          </p>

          <button
            type="button"
            onClick={() =>
              applyExample(10000, 15, 12, 0)
            }
          >
            Calculate This Example →
          </button>
        </div>
      </section>

      {/* SIP BENEFITS */}
      <section className="sipLightSection">
        <div className="section">
          <div className="sipCenteredHeading">
            <div className="sipEyebrow">
              KEY CONCEPTS
            </div>

            <h2>Why investors consider SIPs</h2>
          </div>

          <div className="sipBenefitGrid">

            <div className="card">
              <div className="sipBenefitIcon">📅</div>
              <h3>Regular investing</h3>
              <p className="muted">
                Helps create a structured investment habit.
              </p>
            </div>

            <div className="card">
              <div className="sipBenefitIcon">💵</div>
              <h3>Flexible contribution</h3>
              <p className="muted">
                The investment amount can be selected according to
                the chosen scheme and applicable rules.
              </p>
            </div>

            <div className="card">
              <div className="sipBenefitIcon">⏳</div>
              <h3>Long-term approach</h3>
              <p className="muted">
                A longer investment horizon can allow more time for
                compounding to work, subject to market performance.
              </p>
            </div>

            <div className="card">
              <div className="sipBenefitIcon">📈</div>
              <h3>Market participation</h3>
              <p className="muted">
                Regular investing can provide participation across
                different market levels.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* RELATED */}
      <section className="section sipRelatedSection">
        <div className="sipCenteredHeading">
          <div className="sipEyebrow">
            RELATED CALCULATORS
          </div>

          <h2>Explore more financial tools</h2>
        </div>

        <div className="sipRelatedGrid">

          <Link href="/calculators" className="card">
            <strong>All Calculators</strong>
            <span>Explore →</span>
          </Link>

          <Link href="/swp" className="card">
            <strong>SWP Calculator</strong>
            <span>Calculate →</span>
          </Link>

          <Link href="/calculators/lumpsum" className="card">
            <strong>Lumpsum Calculator</strong>
            <span>Coming Soon →</span>
          </Link>

        </div>
      </section>

      {/* CTA */}
      <section className="sipCTA">
        <div>
          <div className="sipEyebrow">
            PLAN WITH INFORMATION
          </div>

          <h2>Have a financial goal in mind?</h2>

          <p>
            Use the calculator to explore the numbers, then understand
            the assumptions and risks before making an investment
            decision.
          </p>

          <div className="actions">
            <Link className="btn" href="/contact">
              Share Your Requirement
            </Link>

            <Link className="btn alt" href="/articles">
              Read Financial Articles
            </Link>
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="sipDisclaimer">
        <p>
          This SIP calculator is an educational and illustrative tool.
          The calculation assumes a constant annual return for
          illustration purposes and does not represent a guaranteed
          return or prediction of future performance. Actual mutual
          fund returns are market-linked and may vary. Investment
          decisions should consider the relevant scheme documents,
          risks, costs, taxes and individual circumstances.
        </p>
      </section>
    </>
  );
}
