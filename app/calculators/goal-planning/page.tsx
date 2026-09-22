"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type GoalYearData = {
  year: number;
  futureGoalCost: number;
  sipCorpus: number;
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

function calculateGoal(
  currentGoalCost: number,
  years: number,
  inflation: number,
  expectedReturn: number
) {
  const currentCost = Math.max(0, currentGoalCost);
  const period = Math.max(1, years);
  const inflationRate = Math.max(0, inflation) / 100;
  const annualReturn = Math.max(0, expectedReturn) / 100;

  /*
    Future goal cost after inflation
  */
  const futureGoalCost =
    currentCost *
    Math.pow(1 + inflationRate, period);

  /*
    Monthly investment return
  */
  const monthlyReturn = annualReturn / 12;
  const months = period * 12;

  /*
    Required monthly SIP to target the future goal.
    This assumes the SIP is invested at the end of each month.
  */
  let requiredMonthlySIP = 0;

  if (futureGoalCost > 0) {
    if (monthlyReturn === 0) {
      requiredMonthlySIP =
        futureGoalCost / months;
    } else {
      requiredMonthlySIP =
        (futureGoalCost * monthlyReturn) /
        (Math.pow(1 + monthlyReturn, months) - 1);
    }
  }

  /*
    Required lumpsum today
  */
  const requiredLumpsum =
    annualReturn === 0
      ? futureGoalCost
      : futureGoalCost /
        Math.pow(1 + annualReturn, period);

  const totalSIPInvestment =
    requiredMonthlySIP * months;

  const estimatedSIPGrowth =
    futureGoalCost - totalSIPInvestment;

  /*
    Year-by-year illustration
  */
  const yearlyData: GoalYearData[] = [];

  for (let year = 1; year <= period; year++) {
    const goalCost =
      currentCost *
      Math.pow(1 + inflationRate, year);

    const monthsCompleted = year * 12;

    let corpus = 0;

    if (monthlyReturn === 0) {
      corpus =
        requiredMonthlySIP * monthsCompleted;
    } else {
      corpus =
        requiredMonthlySIP *
        ((Math.pow(
          1 + monthlyReturn,
          monthsCompleted
        ) -
          1) /
          monthlyReturn);
    }

    yearlyData.push({
      year,
      futureGoalCost: goalCost,
      sipCorpus: corpus,
    });
  }

  return {
    futureGoalCost,
    requiredMonthlySIP,
    requiredLumpsum,
    totalSIPInvestment,
    estimatedSIPGrowth,
    yearlyData,
  };
}

export default function GoalPlanningCalculatorPage() {
  const [goalName, setGoalName] = useState(
    "Child Education"
  );

  const [currentGoalCost, setCurrentGoalCost] =
    useState(1000000);

  const [years, setYears] = useState(10);

  const [inflation, setInflation] = useState(6);

  const [expectedReturn, setExpectedReturn] =
    useState(12);

  const result = useMemo(() => {
    return calculateGoal(
      currentGoalCost,
      years,
      inflation,
      expectedReturn
    );
  }, [
    currentGoalCost,
    years,
    inflation,
    expectedReturn,
  ]);

  const maxChartValue = Math.max(
    ...result.yearlyData.flatMap((item) => [
      item.futureGoalCost,
      item.sipCorpus,
    ]),
    1
  );

  const currentCostPercentage =
    result.futureGoalCost > 0
      ? (currentGoalCost /
          result.futureGoalCost) *
        100
      : 0;

  const growthPercentage =
    result.futureGoalCost > 0
      ? (result.estimatedSIPGrowth /
          result.futureGoalCost) *
        100
      : 0;

  return (
    <div className="goal-page">
      {/* HERO */}
      <section className="calculatorHero">
        <div className="calculatorEyebrow">
          GOAL PLANNER CALCULATOR
        </div>

        <h1>
          Plan Today for the Cost of Tomorrow
        </h1>

        <p>
          Estimate how much your financial goal may cost in
          the future and calculate the investment required
          to target that goal.
        </p>
      </section>

      {/* CALCULATOR */}
      <section className="calculatorSection">
        <div className="calculatorBox">
          <div className="calculatorBoxHeader">
            <h2>
              Goal Planner
            </h2>

            <p>
              Enter your goal details to estimate its future
              cost and the investment required.
            </p>
          </div>

          <div className="goalInputGrid">
            {/* GOAL NAME */}
            <div className="calculatorInputCard">
              <label htmlFor="goal-name">
                Goal Name
              </label>

              <div className="goalTextInput">
                <input
                  id="goal-name"
                  type="text"
                  value={goalName}
                  onChange={(e) =>
                    setGoalName(e.target.value)
                  }
                  placeholder="e.g. Child Education"
                />
              </div>

              <p className="calculatorInputHint">
                Give your financial goal a name
              </p>
            </div>

            {/* CURRENT COST */}
            <div className="calculatorInputCard">
              <label htmlFor="goal-cost">
                Current Goal Cost
              </label>

              <div className="calculatorInputWrap">
                <span>₹</span>

                <input
                  id="goal-cost"
                  type="number"
                  min="0"
                  step="1000"
                  value={
                    currentGoalCost === 0
                      ? ""
                      : currentGoalCost
                  }
                  onChange={(e) => {
                    const value = e.target.value;

                    setCurrentGoalCost(
                      value === ""
                        ? 0
                        : Number(value)
                    );
                  }}
                  onBlur={() => {
                    if (currentGoalCost < 1000) {
                      setCurrentGoalCost(1000);
                    }
                  }}
                />
              </div>

              <p className="calculatorInputHint">
                What the goal costs today
              </p>
            </div>

            {/* YEARS */}
            <div className="calculatorInputCard">
              <label htmlFor="goal-years">
                Years to Goal
              </label>

              <div className="calculatorInputWrap">
                <input
                  id="goal-years"
                  type="number"
                  min="1"
                  max="50"
                  value={years}
                  onChange={(e) => {
                    const value =
                      Number(e.target.value);

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
                  setYears(
                    Number(e.target.value)
                  )
                }
              />

              <p className="calculatorInputHint">
                {years} years remaining
              </p>
            </div>

            {/* INFLATION */}
            <div className="calculatorInputCard">
              <label htmlFor="goal-inflation">
                Expected Inflation
              </label>

              <div className="calculatorInputWrap">
                <input
                  id="goal-inflation"
                  type="number"
                  min="0"
                  max="15"
                  step="0.1"
                  value={inflation}
                  onChange={(e) => {
                    const value =
                      Number(e.target.value);

                    setInflation(
                      Number.isFinite(value)
                        ? Math.min(
                            15,
                            Math.max(0, value)
                          )
                        : 0
                    );
                  }}
                />

                <span>%</span>
              </div>

              <input
                className="calculatorRange"
                type="range"
                min="0"
                max="15"
                step="0.1"
                value={inflation}
                onChange={(e) =>
                  setInflation(
                    Number(e.target.value)
                  )
                }
              />

              <p className="calculatorInputHint">
                Assumed annual inflation
              </p>
            </div>

            {/* RETURN */}
            <div className="calculatorInputCard">
              <label htmlFor="goal-return">
                Expected Investment Return
              </label>

              <div className="calculatorInputWrap">
                <input
                  id="goal-return"
                  type="number"
                  min="0"
                  max="30"
                  step="0.1"
                  value={expectedReturn}
                  onChange={(e) => {
                    const value =
                      Number(e.target.value);

                    setExpectedReturn(
                      Number.isFinite(value)
                        ? Math.min(
                            30,
                            Math.max(0, value)
                          )
                        : 0
                    );
                  }}
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
                  setExpectedReturn(
                    Number(e.target.value)
                  )
                }
              />

              <p className="calculatorInputHint">
                Illustrative annual return
              </p>
            </div>
          </div>

          {/* GOAL RESULT */}
          <div className="goalMainResult">
            <span>
              Estimated Future Cost of {goalName || "Your Goal"}
            </span>

            <strong>
              {formatINR(
                result.futureGoalCost
              )}
            </strong>

            <p>
              After {years}{" "}
              {years === 1 ? "year" : "years"} at{" "}
              {inflation}% assumed inflation
            </p>
          </div>

          {/* RESULTS */}
          <div className="calculatorResults">
            <div className="calculatorResultCard">
              <span>
                Required Monthly SIP
              </span>

              <strong>
                {formatINR(
                  result.requiredMonthlySIP
                )}
              </strong>
            </div>

            <div className="calculatorResultCard">
              <span>
                Required Lumpsum Today
              </span>

              <strong>
                {formatINR(
                  result.requiredLumpsum
                )}
              </strong>
            </div>

            <div className="calculatorResultCard calculatorResultHighlight">
              <span>
                Total SIP Investment
              </span>

              <strong>
                {formatINR(
                  result.totalSIPInvestment
                )}
              </strong>
            </div>
          </div>

          {/* WORDS */}
          <div className="calculatorAmountWords">
            <span>
              Estimated Future Goal Cost in words
            </span>

            <strong>
              {numberToIndianWords(
                result.futureGoalCost
              )}
            </strong>
          </div>

          {/* SIP GROWTH SUMMARY */}
          <div className="goalBreakdown">
            <div className="goalBreakdownHeader">
              <h3>
                Goal Cost vs Projected SIP Corpus
              </h3>

              <p>
                This illustration compares the estimated
                future goal cost with the projected corpus
                from the calculated monthly SIP.
              </p>
            </div>

            <div className="goalBar">
              <div
                className="goalBarCurrent"
                style={{
                  width: `${currentCostPercentage}%`,
                }}
              />

              <div
                className="goalBarGrowth"
                style={{
                  width: `${growthPercentage}%`,
                }}
              />
            </div>

            <div className="goalLegend">
              <span>
                <i className="goalLegendCurrent" />
                Current Goal Cost:{" "}
                {formatINR(currentGoalCost)}
              </span>

              <span>
                <i className="goalLegendGrowth" />
                Future Goal Cost:{" "}
                {formatINR(
                  result.futureGoalCost
                )}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* YEAR CHART */}
      <section className="calculatorSection">
        <div className="calculatorContentCard">
          <div className="calculatorSectionHeading">
            <div>
              <span className="calculatorSmallLabel">
                YEAR-BY-YEAR VIEW
              </span>

              <h2>
                How Your Goal Could Grow Over Time
              </h2>
            </div>
          </div>

          <div className="goalChart">
            {result.yearlyData.map((item) => (
              <div
                className="goalChartItem"
                key={item.year}
              >
                <div className="goalChartBars">
                  <div
                    className="goalChartGoalBar"
                    style={{
                      height: `${
                        (item.futureGoalCost /
                          maxChartValue) *
                        100
                      }%`,
                    }}
                  />

                  <div
                    className="goalChartSipBar"
                    style={{
                      height: `${
                        (item.sipCorpus /
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

          <div className="goalChartLegend">
            <span>
              <i className="goalChartGoalLegend" />
              Estimated Goal Cost
            </span>

            <span>
              <i className="goalChartSipLegend" />
              Projected SIP Corpus
            </span>
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
                Goal Planning Table
              </h2>
            </div>
          </div>

          <div className="calculatorTableWrap">
            <table className="calculatorTable">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Estimated Goal Cost</th>
                  <th>Projected SIP Corpus</th>
                </tr>
              </thead>

              <tbody>
                {result.yearlyData.map(
                  (item) => (
                    <tr key={item.year}>
                      <td>{item.year}</td>

                      <td>
                        {formatINR(
                          item.futureGoalCost
                        )}
                      </td>

                      <td>
                        {formatINR(
                          item.sipCorpus
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* WHAT IS GOAL PLANNING */}
      <section className="calculatorSection">
        <div className="goalInfoGrid">
          <div className="calculatorInfoCard">
            <span className="calculatorSmallLabel">
              GOAL PLANNING
            </span>

            <h2>
              Why Plan for Future Goals?
            </h2>

            <p>
              A financial goal may have a different cost in
              the future than it has today. Inflation can
              increase the amount of money required to fund
              education, a home, travel, retirement or other
              long-term objectives.
            </p>

            <p>
              Goal planning brings together the target amount,
              time horizon, inflation assumption and expected
              investment return to estimate how much may need
              to be invested.
            </p>

            <div className="calculatorHighlightNote">
              <strong>
                Start with the goal.
              </strong>
              <br />
              Then work backwards to understand the amount
              that may need to be invested.
            </div>
          </div>

          <div className="calculatorInfoCard">
            <span className="calculatorSmallLabel">
              INFLATION
            </span>

            <h2>
              Today's Cost May Not Be Tomorrow's Cost
            </h2>

            <p>
              Inflation means that the prices of goods and
              services can increase over time. A goal that
              costs ₹10 lakh today may require a larger amount
              several years from now.
            </p>

            <p>
              The calculator therefore first estimates the
              future cost of the goal using the inflation
              assumption entered by you.
            </p>

            <div className="calculatorHighlightNote">
              <strong>
                Example:
              </strong>
              <br />
              ₹10 lakh growing at an assumed 6% annual
              inflation for 10 years would become approximately
              ₹17.91 lakh.
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
                Four Steps to Plan a Goal
              </h2>
            </div>
          </div>

          <div className="goalSteps">
            <div className="calculatorStep">
              <span>01</span>

              <h3>
                Define the Goal
              </h3>

              <p>
                Decide what you want to achieve and estimate
                its current cost.
              </p>
            </div>

            <div className="calculatorStep">
              <span>02</span>

              <h3>
                Consider Inflation
              </h3>

              <p>
                Estimate how the cost of your goal may change
                over the time available.
              </p>
            </div>

            <div className="calculatorStep">
              <span>03</span>

              <h3>
                Calculate Investment
              </h3>

              <p>
                Estimate the SIP or lumpsum amount required
                to target the future goal value.
              </p>
            </div>

            <div className="calculatorStep">
              <span>04</span>

              <h3>
                Review Regularly
              </h3>

              <p>
                Review your progress and assumptions as your
                financial situation changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SIP VS LUMPSUM */}
      <section className="calculatorSection">
        <div className="calculatorContentCard">
          <div className="calculatorSectionHeading">
            <div>
              <span className="calculatorSmallLabel">
                FUNDING YOUR GOAL
              </span>

              <h2>
                SIP or Lumpsum?
              </h2>
            </div>
          </div>

          <div className="goalComparison">
            <div>
              <h3>
                Monthly SIP
              </h3>

              <ul>
                <li>
                  Invest a fixed amount periodically
                </li>

                <li>
                  Can help build investing discipline
                </li>

                <li>
                  Suitable when income is received regularly
                </li>

                <li>
                  Investment is spread over time
                </li>
              </ul>
            </div>

            <div>
              <h3>
                Lumpsum
              </h3>

              <ul>
                <li>
                  Invest a larger amount at one time
                </li>

                <li>
                  Useful when capital is already available
                </li>

                <li>
                  The entire amount begins participating from
                  the investment date
                </li>

                <li>
                  Investment value can fluctuate with market
                  conditions
                </li>
              </ul>
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
                Explore Common Financial Goals
              </h2>
            </div>
          </div>

          <div className="goalQuickGrid">
            {[
              {
                name: "Child Education",
                cost: 1000000,
                years: 10,
              },
              {
                name: "Dream Home",
                cost: 5000000,
                years: 10,
              },
              {
                name: "Wedding",
                cost: 1500000,
                years: 7,
              },
              {
                name: "Retirement",
                cost: 25000000,
                years: 20,
              },
            ].map((example) => {
              const calculation =
                calculateGoal(
                  example.cost,
                  example.years,
                  6,
                  12
                );

              return (
                <button
                  type="button"
                  key={example.name}
                  className="calculatorQuickCard"
                  onClick={() => {
                    setGoalName(
                      example.name
                    );

                    setCurrentGoalCost(
                      example.cost
                    );

                    setYears(
                      example.years
                    );

                    setInflation(6);
                    setExpectedReturn(12);

                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                >
                  <span>
                    {example.name}
                  </span>

                  <strong>
                    {formatINR(
                      calculation.requiredMonthlySIP
                    )}
                    /month
                  </strong>

                  <small>
                    Current cost{" "}
                    {formatINR(
                      example.cost
                    )}{" "}
                    • {example.years} years
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

          <div className="goalRelatedGrid">
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
              href="/calculators/cagr"
              className="calculatorRelatedCard"
            >
              <span>📊</span>

              <h3>
                CAGR Calculator
              </h3>

              <p>
                Calculate the annualized growth rate of an
                investment.
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
            Have a Financial Goal in Mind?
          </h2>

          <p>
            Use the calculator to understand the numbers,
            then consider your financial goal, time horizon,
            risk profile and investment strategy.
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
        This calculator provides an illustrative estimate
        based on the assumptions entered by the user.
        Inflation and investment returns are assumed to
        remain constant for calculation purposes. Actual
        inflation and investment returns may vary. Market-
        linked investments are subject to market risks.
        This calculator does not constitute investment advice
        or a guarantee of future returns.
      </section>
    </div>
  );
}
