"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type YearData = {
  year: number;
  invested: number;
  value: number;
  gains: number;
};

function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, value));
}

function numberToIndianWords(num: number): string {
  if (!Number.isFinite(num) || num <= 0) return "Zero Rupees";

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

  if (crore > 0) result += belowThousand(crore) + " Crore ";
  if (lakh > 0) result += belowThousand(lakh) + " Lakh ";
  if (thousand > 0) result += belowThousand(thousand) + " Thousand ";
  if (n > 0) result += belowThousand(n);

  return result.trim() + " Rupees";
}

function calculateLumpsum(
  initialInvestment: number,
  years: number,
  annualReturn: number
) {
  const monthlyRate = annualReturn / 100 / 12;

  let corpus = initialInvestment;

  const yearlyData: YearData[] = [];

  for (let month = 1; month <= years * 12; month++) {
    corpus = corpus * (1 + monthlyRate);

    if (month % 12 === 0) {
      const year = month / 12;

      yearlyData.push({
        year,
        invested: initialInvestment,
        value: corpus,
        gains: corpus - initialInvestment,
      });
    }
  }

  return {
    futureValue: corpus,
    totalInvested: initialInvestment,
    estimatedGains: corpus - initialInvestment,
    yearlyData,
  };
}

export const metadata = {
  title: "Lumpsum Calculator | Calculate Investment Growth",
  description:
    "Use the Lumpsum Calculator to estimate future investment value, estimated gains and long-term wealth growth based on investment amount, time period and expected return.",
};

export default function LumpsumCalculatorPage() {
  const [initialInvestment, setInitialInvestment] = useState(100000);
  const [years, setYears] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);

  const result = useMemo(
    () =>
      calculateLumpsum(
        initialInvestment,
        years,
        expectedReturn
      ),
    [initialInvestment, years, expectedReturn]
  );

  const maxChartValue =
    Math.max(...result.yearlyData.map((item) => item.value), 1);

  return (
    <div className="calculator-page">
      {/* HERO */}
      <section className="calculatorHero">
        <div className="calculatorEyebrow">
          LUMPSUM INVESTMENT CALCULATOR
        </div>

        <h1>See How Your Lumpsum Investment Could Grow</h1>

        <p>
          Estimate the future value of a one-time investment based on your
          investment amount, time period and expected annual return.
        </p>
      </section>

      {/* CALCULATOR */}
      <section className="calculatorSection">
        <div className="calculatorBox">
          <div className="calculatorBoxHeader">
            <h2>Lumpsum Calculator</h2>
            <p>
              Enter your investment details to see an illustrative growth
              projection.
            </p>
          </div>

          <div className="calculatorInputGrid">
            <div className="calculatorInputCard">
              <label>Initial Investment</label>

              <div className="calculatorInputWrap">
                <span>₹</span>
                <input
                  type="number"
                  min="1000"
                  value={initialInvestment}
                  onChange={(e) =>
                    setInitialInvestment(
                      Math.max(1000, Number(e.target.value) || 0)
                    )
                  }
                />
              </div>

              <p className="calculatorInputHint">
                One-time amount invested
              </p>
            </div>

            <div className="calculatorInputCard">
              <label>Investment Period</label>

              <div className="calculatorInputWrap">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={years}
                  onChange={(e) =>
                    setYears(
                      Math.min(
                        50,
                        Math.max(1, Number(e.target.value) || 1)
                      )
                    )
                  }
                />
                <span>Years</span>
              </div>

              <input
                className="calculatorRange"
                type="range"
                min="1"
                max="50"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
              />

              <p className="calculatorInputHint">
                {years} years
              </p>
            </div>

            <div className="calculatorInputCard">
              <label>Expected Return p.a.</label>

              <div className="calculatorInputWrap">
                <input
                  type="number"
                  min="0"
                  max="30"
                  step="0.1"
                  value={expectedReturn}
                  onChange={(e) =>
                    setExpectedReturn(
                      Math.min(
                        30,
                        Math.max(0, Number(e.target.value) || 0)
                      )
                    )
                  }
                />
                <span>%</span>
              </div>

              <input
                className="calculatorRange"
                type="range"
                min="0"
                max="30"
                step="0.1"
                value={expectedReturn}
                onChange={(e) =>
                  setExpectedReturn(Number(e.target.value))
                }
              />

              <p className="calculatorInputHint">
                Illustrative annual return
              </p>
            </div>
          </div>

          {/* RESULTS */}
          <div className="calculatorResults">
            <div className="calculatorResultCard">
              <span>Total Invested</span>
              <strong>{formatINR(result.totalInvested)}</strong>
            </div>

            <div className="calculatorResultCard">
              <span>Estimated Gains</span>
              <strong>{formatINR(result.estimatedGains)}</strong>
            </div>

            <div className="calculatorResultCard calculatorResultHighlight">
              <span>Estimated Future Value</span>
              <strong>{formatINR(result.futureValue)}</strong>
            </div>
          </div>

          <div className="calculatorAmountWords">
            <span>Estimated Future Value in words</span>
            <strong>
              {numberToIndianWords(result.futureValue)}
            </strong>
          </div>

          {/* INVESTMENT VS GROWTH */}
          <div className="calculatorBreakdown">
            <div className="calculatorBreakdownHeader">
              <h3>Investment vs Estimated Growth</h3>
              <p>
                This illustration shows how your one-time investment may
                grow over the selected period.
              </p>
            </div>

            <div className="calculatorBar">
              <div
                className="calculatorBarInvested"
                style={{
                  width: `${
                    (result.totalInvested / result.futureValue) * 100
                  }%`,
                }}
              />
              <div
                className="calculatorBarGrowth"
                style={{
                  width: `${
                    (result.estimatedGains / result.futureValue) * 100
                  }%`,
                }}
              />
            </div>

            <div className="calculatorLegend">
              <span>
                <i className="legendInvested" />
                Invested: {formatINR(result.totalInvested)}
              </span>

              <span>
                <i className="legendGrowth" />
                Estimated Growth: {formatINR(result.estimatedGains)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* YEARLY CHART */}
      <section className="calculatorSection">
        <div className="calculatorContentCard">
          <div className="calculatorSectionHeading">
            <div>
              <span className="calculatorSmallLabel">
                YEAR-BY-YEAR VIEW
              </span>
              <h2>How Your Investment Could Grow</h2>
            </div>
          </div>

          <div className="calculatorChart">
            {result.yearlyData.map((item) => (
              <div className="calculatorChartItem" key={item.year}>
                <div className="calculatorChartValue">
                  {formatINR(item.value)}
                </div>

                <div className="calculatorChartBar">
                  <div
                    className="calculatorChartFill"
                    style={{
                      height: `${
                        (item.value / maxChartValue) * 100
                      }%`,
                    }}
                  />
                </div>

                <span>Year {item.year}</span>
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
                YEAR-WISE BREAKDOWN
              </span>
              <h2>Investment Growth Table</h2>
            </div>
          </div>

          <div className="calculatorTableWrap">
            <table className="calculatorTable">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Invested</th>
                  <th>Estimated Value</th>
                  <th>Estimated Gains</th>
                </tr>
              </thead>

              <tbody>
                {result.yearlyData.map((item) => (
                  <tr key={item.year}>
                    <td>{item.year}</td>
                    <td>{formatINR(item.invested)}</td>
                    <td>{formatINR(item.value)}</td>
                    <td>{formatINR(item.gains)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* WHAT IS LUMPSUM */}
      <section className="calculatorSection">
        <div className="calculatorInfoGrid">
          <div className="calculatorInfoCard">
            <span className="calculatorSmallLabel">
              UNDERSTANDING LUMPSUM
            </span>

            <h2>What is a Lumpsum Investment?</h2>

            <p>
              A lumpsum investment means investing a larger amount of
              money at one time instead of investing a fixed amount
              periodically.
            </p>

            <p>
              For example, an investor may invest ₹1 lakh, ₹5 lakh or
              ₹10 lakh as a one-time investment and keep the investment
              invested for several years.
            </p>

            <p>
              The potential value can increase over time as returns are
              generated on the investment and subsequent returns can
              compound.
            </p>
          </div>

          <div className="calculatorInfoCard">
            <span className="calculatorSmallLabel">
              THE POWER OF COMPOUNDING
            </span>

            <h2>Time Can Make a Difference</h2>

            <p>
              Compounding means that returns generated by an investment
              can themselves become part of the amount on which future
              returns are calculated.
            </p>

            <p>
              The longer an investment remains invested, the more time
              there may be for this compounding effect to work.
            </p>

            <div className="calculatorHighlightNote">
              <strong>Illustration:</strong>
              <br />
              A one-time investment that remains invested for a longer
              period can potentially experience significant compounding,
              depending on the actual investment returns.
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
              <h2>How a Lumpsum Investment Works</h2>
            </div>
          </div>

          <div className="calculatorSteps">
            <div className="calculatorStep">
              <span>01</span>
              <h3>Choose Your Amount</h3>
              <p>
                Decide how much you want to invest as a one-time
                investment.
              </p>
            </div>

            <div className="calculatorStep">
              <span>02</span>
              <h3>Choose Your Time Horizon</h3>
              <p>
                Define how long you intend to remain invested.
              </p>
            </div>

            <div className="calculatorStep">
              <span>03</span>
              <h3>Investment Growth</h3>
              <p>
                The investment value can change based on the performance
                of the underlying investment.
              </p>
            </div>

            <div className="calculatorStep">
              <span>04</span>
              <h3>Review Your Goal</h3>
              <p>
                Periodically review the investment against your financial
                objective and risk profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LUMPSUM VS SIP */}
      <section className="calculatorSection">
        <div className="calculatorContentCard">
          <div className="calculatorSectionHeading">
            <div>
              <span className="calculatorSmallLabel">
                LUMPSUM VS SIP
              </span>
              <h2>Two Different Ways to Invest</h2>
            </div>
          </div>

          <div className="calculatorComparison">
            <div>
              <h3>Lumpsum</h3>
              <ul>
                <li>One-time investment</li>
                <li>Useful when a larger amount is already available</li>
                <li>
                  Market exposure begins with the invested amount
                </li>
                <li>
                  Investment value can fluctuate with market conditions
                </li>
              </ul>
            </div>

            <div>
              <h3>SIP</h3>
              <ul>
                <li>Regular periodic investment</li>
                <li>Can help build an investing discipline</li>
                <li>
                  Money is invested gradually over time
                </li>
                <li>
                  Each instalment gets its own period of market
                  participation
                </li>
              </ul>
            </div>
          </div>

          <p className="calculatorNote">
            The choice between lumpsum and SIP depends on factors such
            as available capital, financial goals, time horizon, risk
            tolerance and market conditions.
          </p>
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
              <h2>Try Different Investment Amounts</h2>
            </div>
          </div>

          <div className="calculatorQuickGrid">
            {[100000, 500000, 1000000, 2500000].map((amount) => {
              const example = calculateLumpsum(
                amount,
                10,
                12
              );

              return (
                <button
                  key={amount}
                  className="calculatorQuickCard"
                  onClick={() => {
                    setInitialInvestment(amount);
                    setYears(10);
                    setExpectedReturn(12);
                  }}
                >
                  <span>{formatINR(amount)}</span>
                  <strong>
                    {formatINR(example.futureValue)}
                  </strong>
                  <small>
                    10 years @ 12% illustrative return
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
              <h2>Related Financial Calculators</h2>
            </div>
          </div>

          <div className="calculatorRelatedGrid">
            <Link
              href="/calculators/sip"
              className="calculatorRelatedCard"
            >
              <span>📈</span>
              <h3>SIP Calculator</h3>
              <p>
                Estimate the potential growth of regular monthly
                investments.
              </p>
            </Link>

            <Link
              href="/swp"
              className="calculatorRelatedCard"
            >
              <span>💰</span>
              <h3>SWP Calculator</h3>
              <p>
                Explore systematic withdrawals from an invested corpus.
              </p>
            </Link>

            <Link
              href="/calculators"
              className="calculatorRelatedCard"
            >
              <span>🧮</span>
              <h3>All Calculators</h3>
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

          <h2>Have a Financial Goal in Mind?</h2>

          <p>
            Use calculators to understand the numbers, then consider
            your financial objective, time horizon and risk profile
            before making an investment decision.
          </p>

          <Link href="/contact" className="primaryButton">
            Discuss Your Financial Needs
          </Link>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="calculatorDisclaimer">
        <strong>Disclaimer:</strong> This calculator provides an
        illustrative estimate based on the inputs entered by the user.
        It assumes a constant rate of return for calculation purposes.
        Actual investment returns may vary and are subject to market
        conditions, fees, taxes and other factors. Market-linked
        investments are subject to market risks. Past performance does
        not guarantee future results.
      </section>
    </div>
  );
}
