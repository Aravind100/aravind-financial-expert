"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type RetirementYearData = {
  year: number;
  corpus: number;
  requiredCorpus: number;
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

function calculateRetirement(
  currentAge: number,
  retirementAge: number,
  monthlyExpenses: number,
  currentSavings: number,
  inflation: number,
  preRetirementReturn: number,
  postRetirementReturn: number,
  retirementYears: number
) {
  const age = Math.max(18, currentAge);
  const retireAge = Math.max(age + 1, retirementAge);
  const expenses = Math.max(0, monthlyExpenses);
  const savings = Math.max(0, currentSavings);

  const inflationRate = Math.max(0, inflation) / 100;
  const preReturn = Math.max(0, preRetirementReturn) / 100;
  const postReturn = Math.max(0, postRetirementReturn) / 100;

  const yearsToRetirement = retireAge - age;

  /*
   * Estimate monthly expenses at retirement.
   */
  const retirementMonthlyExpense =
    expenses *
    Math.pow(1 + inflationRate, yearsToRetirement);

  /*
   * Annual retirement expense in the first year.
   */
  const firstYearAnnualExpense =
    retirementMonthlyExpense * 12;

  /*
   * Retirement corpus calculation.

   * This is a simplified present-value illustration:
   * retirement withdrawals are assumed to increase with inflation,
   * while the corpus earns the assumed post-retirement return.
   */
  let requiredCorpus = 0;

  if (retirementYears > 0) {
    const realReturn =
      (1 + postReturn) / (1 + inflationRate) - 1;

    if (Math.abs(realReturn) < 0.000001) {
      requiredCorpus =
        firstYearAnnualExpense *
        retirementYears;
    } else {
      requiredCorpus =
        firstYearAnnualExpense *
        ((1 -
          Math.pow(
            1 + realReturn,
            -retirementYears
          )) /
          realReturn);
    }
  }

  /*
   * Project existing savings until retirement.
   */
  const projectedExistingSavings =
    savings *
    Math.pow(
      1 + preReturn,
      yearsToRetirement
    );

  /*
   * Remaining amount required at retirement.
   */
  const additionalCorpusRequired = Math.max(
    0,
    requiredCorpus - projectedExistingSavings
  );

  /*
   * Monthly SIP required before retirement.
   */
  const monthsToRetirement =
    yearsToRetirement * 12;

  const monthlyPreReturn = preReturn / 12;

  let requiredMonthlySIP = 0;

  if (additionalCorpusRequired > 0) {
    if (monthlyPreReturn === 0) {
      requiredMonthlySIP =
        additionalCorpusRequired /
        Math.max(1, monthsToRetirement);
    } else {
      requiredMonthlySIP =
        (additionalCorpusRequired *
          monthlyPreReturn) /
        (Math.pow(
          1 + monthlyPreReturn,
          monthsToRetirement
        ) - 1);
    }
  }

  const totalFutureSIPInvestment =
    requiredMonthlySIP *
    monthsToRetirement;

  const estimatedSIPGrowth =
    Math.max(
      0,
      additionalCorpusRequired -
        totalFutureSIPInvestment
    );

  /*
   * Year-by-year projection.
   */
  const yearlyData: RetirementYearData[] = [];

  for (
    let year = 1;
    year <= yearsToRetirement;
    year++
  ) {
    const projectedSavings =
      savings *
      Math.pow(1 + preReturn, year);

    const monthsCompleted = year * 12;

    let sipCorpus = 0;

    if (requiredMonthlySIP > 0) {
      if (monthlyPreReturn === 0) {
        sipCorpus =
          requiredMonthlySIP *
          monthsCompleted;
      } else {
        sipCorpus =
          requiredMonthlySIP *
          ((Math.pow(
            1 + monthlyPreReturn,
            monthsCompleted
          ) -
            1) /
            monthlyPreReturn);
      }
    }

    const corpus =
      projectedSavings + sipCorpus;

    /*
     * This is a simple linear progress indicator toward
     * the required retirement corpus.
     */
    yearlyData.push({
      year,
      corpus,
      requiredCorpus,
    });
  }

  return {
    yearsToRetirement,
    retirementMonthlyExpense,
    firstYearAnnualExpense,
    requiredCorpus,
    projectedExistingSavings,
    additionalCorpusRequired,
    requiredMonthlySIP,
    totalFutureSIPInvestment,
    estimatedSIPGrowth,
    yearlyData,
  };
}

export default function RetirementCalculatorPage() {
  const [currentAge, setCurrentAge] =
    useState(35);

  const [retirementAge, setRetirementAge] =
    useState(60);

  const [monthlyExpenses, setMonthlyExpenses] =
    useState(50000);

  const [currentSavings, setCurrentSavings] =
    useState(500000);

  const [inflation, setInflation] =
    useState(6);

  const [preRetirementReturn, setPreRetirementReturn] =
    useState(12);

  const [postRetirementReturn, setPostRetirementReturn] =
    useState(8);

  const [retirementYears, setRetirementYears] =
    useState(25);

  const result = useMemo(() => {
    return calculateRetirement(
      currentAge,
      retirementAge,
      monthlyExpenses,
      currentSavings,
      inflation,
      preRetirementReturn,
      postRetirementReturn,
      retirementYears
    );
  }, [
    currentAge,
    retirementAge,
    monthlyExpenses,
    currentSavings,
    inflation,
    preRetirementReturn,
    postRetirementReturn,
    retirementYears,
  ]);

  const maxChartValue = Math.max(
    result.requiredCorpus,
    ...result.yearlyData.map(
      (item) => item.corpus
    ),
    1
  );

  const corpusProgress =
    result.requiredCorpus > 0
      ? Math.min(
          100,
          (result.projectedExistingSavings /
            result.requiredCorpus) *
            100
        )
      : 0;

  return (
    <div className="retirement-page">

      {/* HERO */}
      <section className="calculatorHero">
        <div className="calculatorEyebrow">
          RETIREMENT CALCULATOR
        </div>

        <h1>
          Plan Today for a More Prepared Retirement
        </h1>

        <p>
          Estimate the retirement corpus you may need,
          understand how inflation can affect future
          expenses and calculate an illustrative monthly
          investment requirement.
        </p>
      </section>

      {/* CALCULATOR */}
      <section className="calculatorSection">
        <div className="calculatorBox">

          <div className="calculatorBoxHeader">
            <h2>
              Retirement Calculator
            </h2>

            <p>
              Enter your current financial details and
              assumptions to create an illustrative
              retirement projection.
            </p>
          </div>

          <div className="retirementInputGrid">

            {/* CURRENT AGE */}
            <div className="calculatorInputCard">
              <label htmlFor="current-age">
                Current Age
              </label>

              <div className="calculatorInputWrap">
                <input
                  id="current-age"
                  type="number"
                  min="18"
                  max="80"
                  value={currentAge}
                  onChange={(e) => {
                    const value =
                      Number(e.target.value);

                    setCurrentAge(
                      Number.isFinite(value)
                        ? Math.min(
                            80,
                            Math.max(18, value)
                          )
                        : 18
                    );

                    if (
                      Number.isFinite(value) &&
                      retirementAge <= value
                    ) {
                      setRetirementAge(
                        Math.min(85, value + 1)
                      );
                    }
                  }}
                />

                <span>Years</span>
              </div>

              <p className="calculatorInputHint">
                Your current age
              </p>
            </div>

            {/* RETIREMENT AGE */}
            <div className="calculatorInputCard">
              <label htmlFor="retirement-age">
                Retirement Age
              </label>

              <div className="calculatorInputWrap">
                <input
                  id="retirement-age"
                  type="number"
                  min={currentAge + 1}
                  max="85"
                  value={retirementAge}
                  onChange={(e) => {
                    const value =
                      Number(e.target.value);

                    setRetirementAge(
                      Number.isFinite(value)
                        ? Math.min(
                            85,
                            Math.max(
                              currentAge + 1,
                              value
                            )
                          )
                        : currentAge + 1
                    );
                  }}
                />

                <span>Years</span>
              </div>

              <p className="calculatorInputHint">
                Planned retirement age
              </p>
            </div>

            {/* MONTHLY EXPENSES */}
            <div className="calculatorInputCard">
              <label htmlFor="monthly-expenses">
                Current Monthly Expenses
              </label>

              <div className="calculatorInputWrap">
                <span>₹</span>

                <input
                  id="monthly-expenses"
                  type="number"
                  min="0"
                  step="1000"
                  value={
                    monthlyExpenses === 0
                      ? ""
                      : monthlyExpenses
                  }
                  onChange={(e) => {
                    const value =
                      e.target.value;

                    setMonthlyExpenses(
                      value === ""
                        ? 0
                        : Number(value)
                    );
                  }}
                />
              </div>

              <p className="calculatorInputHint">
                Current monthly household expenses
              </p>
            </div>

            {/* CURRENT SAVINGS */}
            <div className="calculatorInputCard">
              <label htmlFor="current-savings">
                Current Retirement Savings
              </label>

              <div className="calculatorInputWrap">
                <span>₹</span>

                <input
                  id="current-savings"
                  type="number"
                  min="0"
                  step="1000"
                  value={
                    currentSavings === 0
                      ? ""
                      : currentSavings
                  }
                  onChange={(e) => {
                    const value =
                      e.target.value;

                    setCurrentSavings(
                      value === ""
                        ? 0
                        : Number(value)
                    );
                  }}
                />
              </div>

              <p className="calculatorInputHint">
                Existing savings earmarked for retirement
              </p>
            </div>

            {/* INFLATION */}
            <div className="calculatorInputCard">
              <label htmlFor="retirement-inflation">
                Expected Inflation
              </label>

              <div className="calculatorInputWrap">
                <input
                  id="retirement-inflation"
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

            {/* PRE RETIREMENT RETURN */}
            <div className="calculatorInputCard">
              <label htmlFor="pre-return">
                Pre-Retirement Return
              </label>

              <div className="calculatorInputWrap">
                <input
                  id="pre-return"
                  type="number"
                  min="0"
                  max="30"
                  step="0.1"
                  value={preRetirementReturn}
                  onChange={(e) => {
                    const value =
                      Number(e.target.value);

                    setPreRetirementReturn(
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
                value={preRetirementReturn}
                onChange={(e) =>
                  setPreRetirementReturn(
                    Number(e.target.value)
                  )
                }
              />

              <p className="calculatorInputHint">
                Illustrative annual return before retirement
              </p>
            </div>

            {/* POST RETIREMENT RETURN */}
            <div className="calculatorInputCard">
              <label htmlFor="post-return">
                Post-Retirement Return
              </label>

              <div className="calculatorInputWrap">
                <input
                  id="post-return"
                  type="number"
                  min="0"
                  max="20"
                  step="0.1"
                  value={postRetirementReturn}
                  onChange={(e) => {
                    const value =
                      Number(e.target.value);

                    setPostRetirementReturn(
                      Number.isFinite(value)
                        ? Math.min(
                            20,
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
                max="20"
                step="0.1"
                value={postRetirementReturn}
                onChange={(e) =>
                  setPostRetirementReturn(
                    Number(e.target.value)
                  )
                }
              />

              <p className="calculatorInputHint">
                Illustrative annual return during retirement
              </p>
            </div>

            {/* RETIREMENT YEARS */}
            <div className="calculatorInputCard">
              <label htmlFor="retirement-years">
                Retirement Period
              </label>

              <div className="calculatorInputWrap">
                <input
                  id="retirement-years"
                  type="number"
                  min="1"
                  max="50"
                  value={retirementYears}
                  onChange={(e) => {
                    const value =
                      Number(e.target.value);

                    setRetirementYears(
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
                value={retirementYears}
                onChange={(e) =>
                  setRetirementYears(
                    Number(e.target.value)
                  )
                }
              />

              <p className="calculatorInputHint">
                Estimated years in retirement
              </p>
            </div>
          </div>

          {/* RETIREMENT RESULT */}
          <div className="retirementMainResult">
            <span>
              Estimated Retirement Corpus Required
            </span>

            <strong>
              {formatINR(
                result.requiredCorpus
              )}
            </strong>

            <p>
              Estimated requirement at age{" "}
              {retirementAge}
            </p>
          </div>

          {/* RESULTS */}
          <div className="calculatorResults">

            <div className="calculatorResultCard">
              <span>
                Monthly Expense at Retirement
              </span>

              <strong>
                {formatINR(
                  result.retirementMonthlyExpense
                )}
              </strong>
            </div>

            <div className="calculatorResultCard">
              <span>
                Existing Savings at Retirement
              </span>

              <strong>
                {formatINR(
                  result.projectedExistingSavings
                )}
              </strong>
            </div>

            <div className="calculatorResultCard calculatorResultHighlight">
              <span>
                Required Monthly SIP
              </span>

              <strong>
                {formatINR(
                  result.requiredMonthlySIP
                )}
              </strong>
            </div>
          </div>

          {/* WORDS */}
          <div className="calculatorAmountWords">
            <span>
              Required Retirement Corpus in words
            </span>

            <strong>
              {numberToIndianWords(
                result.requiredCorpus
              )}
            </strong>
          </div>

          {/* PROGRESS */}
          <div className="retirementProgress">
            <div className="retirementProgressHeader">
              <h3>
                Current Savings Progress
              </h3>

              <strong>
                {corpusProgress.toFixed(1)}%
              </strong>
            </div>

            <div className="retirementProgressBar">
              <div
                style={{
                  width: `${corpusProgress}%`,
                }}
              />
            </div>

            <p>
              Based on the current savings entered,
              this is the estimated portion of the
              required retirement corpus represented by
              those savings when projected to retirement.
            </p>
          </div>
        </div>
      </section>

      {/* YEAR CHART */}
      <section className="calculatorSection">
        <div className="calculatorContentCard">

          <div className="calculatorSectionHeading">
            <div>
              <span className="calculatorSmallLabel">
                RETIREMENT JOURNEY
              </span>

              <h2>
                Projected Corpus Growth
              </h2>
            </div>
          </div>

          <div className="retirementChart">

            {result.yearlyData.map((item) => (
              <div
                className="retirementChartItem"
                key={item.year}
              >
                <div className="retirementChartValue">
                  {formatINR(
                    item.corpus
                  )}
                </div>

                <div className="retirementChartBar">
                  <div
                    className="retirementChartFill"
                    style={{
                      height: `${
                        (item.corpus /
                          maxChartValue) *
                        100
                      }%`,
                    }}
                  />
                  <div
                    className="retirementChartTarget"
                    style={{
                      height: `${
                        (item.requiredCorpus /
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

          <div className="retirementChartLegend">

            <span>
              <i className="retirementLegendCorpus" />
              Projected Corpus
            </span>

            <span>
              <i className="retirementLegendTarget" />
              Required Corpus
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
                Retirement Planning Table
              </h2>
            </div>
          </div>

          <div className="calculatorTableWrap">
            <table className="calculatorTable">

              <thead>
                <tr>
                  <th>Year</th>
                  <th>Projected Corpus</th>
                  <th>Required Corpus</th>
                  <th>Gap / Surplus</th>
                </tr>
              </thead>

              <tbody>

                {result.yearlyData.map(
                  (item) => {

                    const gap =
                      item.corpus -
                      item.requiredCorpus;

                    return (
                      <tr key={item.year}>
                        <td>
                          {item.year}
                        </td>

                        <td>
                          {formatINR(
                            item.corpus
                          )}
                        </td>

                        <td>
                          {formatINR(
                            item.requiredCorpus
                          )}
                        </td>

                        <td>
                          {formatINR(
                            gap
                          )}
                        </td>
                      </tr>
                    );
                  }
                )}

              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* INFORMATION */}
      <section className="calculatorSection">
        <div className="retirementInfoGrid">

          <div className="calculatorInfoCard">

            <span className="calculatorSmallLabel">
              RETIREMENT PLANNING
            </span>

            <h2>
              Why Start Planning Early?
            </h2>

            <p>
              Retirement planning involves estimating future
              expenses, considering inflation and determining
              how much may need to be accumulated before
              regular employment income stops.
            </p>

            <p>
              Starting earlier can provide more time for
              investments to potentially compound and may
              allow the required monthly investment to be
              spread over a longer period.
            </p>

            <div className="calculatorHighlightNote">
              <strong>
                Time matters.
              </strong>
              <br />
              A longer investment horizon can change the
              amount that needs to be invested each month.
            </div>

          </div>

          <div className="calculatorInfoCard">

            <span className="calculatorSmallLabel">
              INFLATION
            </span>

            <h2>
              Future Expenses Can Be Different
            </h2>

            <p>
              Your current monthly expenses may not represent
              what you need after retirement. Inflation can
              increase the cost of goods and services over
              time.
            </p>

            <p>
              This calculator therefore increases the current
              monthly expense using the inflation assumption
              before estimating the retirement corpus.
            </p>

            <div className="calculatorHighlightNote">
              <strong>
                Example:
              </strong>
              <br />
              ₹50,000 monthly expenses today at an assumed
              6% inflation rate would become approximately
              ₹2.15 lakh per month after 25 years.
            </div>

          </div>

        </div>
      </section>

      {/* RETIREMENT STEPS */}
      <section className="calculatorSection">
        <div className="calculatorContentCard">

          <div className="calculatorSectionHeading">
            <div>
              <span className="calculatorSmallLabel">
                HOW IT WORKS
              </span>

              <h2>
                Four Steps to Retirement Planning
              </h2>
            </div>
          </div>

          <div className="retirementSteps">

            <div className="calculatorStep">
              <span>01</span>

              <h3>
                Estimate Expenses
              </h3>

              <p>
                Start with your current monthly expenses and
                consider which expenses may continue after
                retirement.
              </p>
            </div>

            <div className="calculatorStep">
              <span>02</span>

              <h3>
                Account for Inflation
              </h3>

              <p>
                Estimate how your future expenses may change
                over your remaining working years.
              </p>
            </div>

            <div className="calculatorStep">
              <span>03</span>

              <h3>
                Estimate the Corpus
              </h3>

              <p>
                Consider the expected investment return and
                the number of years you may need the corpus.
              </p>
            </div>

            <div className="calculatorStep">
              <span>04</span>

              <h3>
                Invest & Review
              </h3>

              <p>
                Build the corpus and review your assumptions
                periodically as circumstances change.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* IMPORTANT FACTORS */}
      <section className="calculatorSection">
        <div className="calculatorContentCard">

          <div className="calculatorSectionHeading">
            <div>
              <span className="calculatorSmallLabel">
                KEY FACTORS
              </span>

              <h2>
                What Can Affect Your Retirement Plan?
              </h2>
            </div>
          </div>

          <div className="retirementFactors">

            <div>
              <h3>
                Inflation
              </h3>

              <p>
                Higher inflation can increase the amount
                required to maintain purchasing power.
              </p>
            </div>

            <div>
              <h3>
                Investment Returns
              </h3>

              <p>
                Actual returns can differ from the assumption
                used in the calculator.
              </p>
            </div>

            <div>
              <h3>
                Retirement Duration
              </h3>

              <p>
                A longer retirement period may require a
                larger corpus.
              </p>
            </div>

            <div>
              <h3>
                Lifestyle & Healthcare
              </h3>

              <p>
                Lifestyle changes, healthcare costs and
                unexpected expenses can affect retirement
                requirements.
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
                Explore Different Retirement Scenarios
              </h2>
            </div>
          </div>

          <div className="retirementQuickGrid">

            {[
              {
                age: 30,
                retirement: 60,
                expenses: 40000,
                savings: 300000,
              },
              {
                age: 35,
                retirement: 60,
                expenses: 50000,
                savings: 500000,
              },
              {
                age: 40,
                retirement: 60,
                expenses: 75000,
                savings: 1000000,
              },
              {
                age: 45,
                retirement: 60,
                expenses: 100000,
                savings: 1500000,
              },
            ].map((example, index) => {

              const calculation =
                calculateRetirement(
                  example.age,
                  example.retirement,
                  example.expenses,
                  example.savings,
                  6,
                  12,
                  8,
                  25
                );

              return (
                <button
                  type="button"
                  key={index}
                  className="calculatorQuickCard"
                  onClick={() => {

                    setCurrentAge(
                      example.age
                    );

                    setRetirementAge(
                      example.retirement
                    );

                    setMonthlyExpenses(
                      example.expenses
                    );

                    setCurrentSavings(
                      example.savings
                    );

                    setInflation(6);
                    setPreRetirementReturn(12);
                    setPostRetirementReturn(8);
                    setRetirementYears(25);

                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });

                  }}
                >

                  <span>
                    Age {example.age} →{" "}
                    {example.retirement}
                  </span>

                  <strong>
                    {formatINR(
                      calculation.requiredMonthlySIP
                    )}
                    /month
                  </strong>

                  <small>
                    Current expenses{" "}
                    {formatINR(
                      example.expenses
                    )}
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

          <div className="retirementRelatedGrid">

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
              href="/calculators/goal-planning"
              className="calculatorRelatedCard"
            >
              <span>🎯</span>

              <h3>
                Goal Planner
              </h3>

              <p>
                Estimate the investment required for a
                future financial goal.
              </p>
            </Link>

            <Link
              href="/swp"
              className="calculatorRelatedCard"
            >
              <span>💰</span>

              <h3>
                SWP Calculator
              </h3>

              <p>
                Explore systematic withdrawals from an
                invested retirement corpus.
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
            Start Planning Your Retirement
          </h2>

          <p>
            Use the calculator to understand the numbers,
            then consider your financial goals, risk profile,
            expected expenses and investment strategy.
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
        inflation, investment returns, expenses, taxes,
        healthcare costs and longevity may differ
        materially. Market-linked investments are subject
        to market risks. This calculator does not constitute
        investment advice or guarantee future returns.

      </section>

    </div>
  );
}
