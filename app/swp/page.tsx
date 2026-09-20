"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import EnquiryForm from "@/components/EnquiryForm";
import styles from "./SWP.module.css";

type YearData = {
  year: number;
  openingCorpus: number;
  withdrawal: number;
  closingCorpus: number;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, value));
}

function numberToIndianWords(value: number): string {
  if (!Number.isFinite(value) || value <= 0) {
    return "Rupees Zero Only";
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

  function twoDigitWords(num: number): string {
    if (num < 20) return ones[num];

    const ten = Math.floor(num / 10);
    const remainder = num % 10;

    return tens[ten] + (remainder ? " " + ones[remainder] : "");
  }

  function convertIndian(num: number): string {
    if (num === 0) return "";

    const parts: string[] = [];

    const crore = Math.floor(num / 10000000);
    num %= 10000000;

    const lakh = Math.floor(num / 100000);
    num %= 100000;

    const thousand = Math.floor(num / 1000);
    num %= 1000;

    const hundred = Math.floor(num / 100);
    num %= 100;

    if (crore) {
      parts.push(convertIndian(crore) + " Crore");
    }

    if (lakh) {
      parts.push(twoDigitWords(lakh) + " Lakh");
    }

    if (thousand) {
      parts.push(twoDigitWords(thousand) + " Thousand");
    }

    if (hundred) {
      parts.push(ones[hundred] + " Hundred");
    }

    if (num) {
      parts.push(twoDigitWords(num));
    }

    return parts.join(" ");
  }

  return `Rupees ${convertIndian(Math.floor(value))} Only`;
}

function calculateSWP(
  initialInvestment: number,
  startingMonthlySWP: number,
  expectedReturn: number,
  years: number,
  annualIncrease: number
) {
  let corpus = Math.max(0, initialInvestment);
  let monthlySWP = Math.max(0, startingMonthlySWP);
  let totalWithdrawn = 0;

  const monthlyReturn = expectedReturn / 100 / 12;
  const yearlyData: YearData[] = [];

  for (let month = 1; month <= years * 12; month++) {
    const openingCorpus = corpus;

    // Illustrative monthly growth
    corpus = corpus * (1 + monthlyReturn);

    // Actual withdrawal cannot exceed available corpus
    const actualWithdrawal = Math.min(monthlySWP, corpus);

    corpus -= actualWithdrawal;
    totalWithdrawn += actualWithdrawal;

    // Record yearly data
    if (month % 12 === 0) {
      yearlyData.push({
        year: month / 12,
        openingCorpus,
        withdrawal: actualWithdrawal * 12,
        closingCorpus: Math.max(0, corpus),
      });

      // Increase SWP once every year
      monthlySWP = monthlySWP * (1 + annualIncrease / 100);
    }

    if (corpus <= 0) {
      corpus = 0;
      break;
    }
  }

  return {
    totalWithdrawn,
    remainingCorpus: corpus,
    yearlyData,
  };
}

export default function SWPPage() {
  const [initialInvestment, setInitialInvestment] = useState(10000000);
  const [monthlySWP, setMonthlySWP] = useState(50000);
  const [expectedReturn, setExpectedReturn] = useState(8);
  const [years, setYears] = useState(20);
  const [annualIncrease, setAnnualIncrease] = useState(0);

  const result = useMemo(
    () =>
      calculateSWP(
        initialInvestment,
        monthlySWP,
        expectedReturn,
        years,
        annualIncrease
      ),
    [
      initialInvestment,
      monthlySWP,
      expectedReturn,
      years,
      annualIncrease,
    ]
  );

  const withdrawalRate =
    initialInvestment > 0
      ? ((monthlySWP * 12) / initialInvestment) * 100
      : 0;

  const maximumChartValue = Math.max(
    initialInvestment,
    ...result.yearlyData.map((item) => item.closingCorpus),
    1
  );

  const applyExample = (amount: number) => {
    setInitialInvestment(amount);

    if (amount === 10000000) {
      setMonthlySWP(50000);
    } else {
      setMonthlySWP(25000);
    }

    setExpectedReturn(8);
    setYears(20);
    setAnnualIncrease(0);
  };

  return (
    <main className={styles.page}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>
            SMART INCOME PLANNING
          </span>

          <h1>
            Systematic Withdrawal Plan
            <span> SWP</span>
          </h1>

          <p>
            Turn your accumulated investment corpus into a
            structured source of regular cash flow while keeping
            the remaining corpus invested.
          </p>

          <div className={styles.heroActions}>
            <a
              href="#calculator"
              className={styles.primaryButton}
            >
              Calculate Your SWP
            </a>

            <a
              href="#how-it-works"
              className={styles.secondaryButton}
            >
              How SWP Works
            </a>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.heroCircle}>
            <div className={styles.heroIcon}>₹</div>
            <strong>INVEST</strong>
            <span>WITHDRAW</span>
            <small>REMAINING CORPUS</small>
          </div>
        </div>
      </section>

      {/* QUICK SUMMARY */}
      <section className={styles.quickGrid}>
        <div className={styles.quickCard}>
          <strong>₹50 Lakh</strong>
          <span>Illustrative SWP example</span>
        </div>

        <div className={styles.quickCard}>
          <strong>₹1 Crore</strong>
          <span>Illustrative SWP example</span>
        </div>

        <div className={styles.quickCard}>
          <strong>Regular Cash Flow</strong>
          <span>
            Periodic withdrawals through redemption
          </span>
        </div>

        <div className={styles.quickCard}>
          <strong>Remaining Corpus</strong>
          <span>
            Can remain invested and fluctuate with markets
          </span>
        </div>
      </section>

      {/* WHAT IS SWP */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <span>01</span>

          <div>
            <p className={styles.eyebrow}>
              UNDERSTANDING SWP
            </p>

            <h2>What is SWP?</h2>
          </div>
        </div>

        <div className={styles.twoColumn}>
          <div>
            <p className={styles.largeText}>
              A{" "}
              <strong>
                Systematic Withdrawal Plan (SWP)
              </strong>{" "}
              is a mutual fund facility that allows an
              investor to withdraw a chosen amount
              periodically from an existing investment.
            </p>

            <p>
              Instead of withdrawing the entire investment at
              once, the investor can choose a monthly,
              quarterly or other permitted frequency.
            </p>

            <p>
              Units are redeemed at the applicable NAV to
              provide the withdrawal amount. Units that are not
              redeemed remain invested.
            </p>
          </div>

          <div className={styles.infoPanel}>
            <h3>Simple Example</h3>

            <div className={styles.exampleFlow}>
              <div>
                <strong>₹1 Cr</strong>
                <span>Starting corpus</span>
              </div>

              <div className={styles.arrow}>→</div>

              <div>
                <strong>₹50,000</strong>
                <span>Monthly withdrawal</span>
              </div>

              <div className={styles.arrow}>→</div>

              <div>
                <strong>Balance</strong>
                <span>Remains invested</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className={`${styles.section} ${styles.softSection}`}
      >
        <div className={styles.sectionHeading}>
          <span>02</span>

          <div>
            <p className={styles.eyebrow}>
              THE PROCESS
            </p>

            <h2>How does SWP work?</h2>
          </div>
        </div>

        <div className={styles.workflow}>
          <div className={styles.workflowCard}>
            <div className={styles.stepNumber}>01</div>

            <h3>Build Corpus</h3>

            <p>
              Start with an accumulated investment corpus
              suitable for your financial objective.
            </p>
          </div>

          <div className={styles.workflowLine}>→</div>

          <div className={styles.workflowCard}>
            <div className={styles.stepNumber}>02</div>

            <h3>Select SWP</h3>

            <p>
              Decide how much you want to withdraw and how
              frequently.
            </p>
          </div>

          <div className={styles.workflowLine}>→</div>

          <div className={styles.workflowCard}>
            <div className={styles.stepNumber}>03</div>

            <h3>Units Redeemed</h3>

            <p>
              The required number of units are redeemed at the
              applicable NAV.
            </p>
          </div>

          <div className={styles.workflowLine}>→</div>

          <div className={styles.workflowCard}>
            <div className={styles.stepNumber}>04</div>

            <h3>Cash Received</h3>

            <p>
              The withdrawal amount is transferred according
              to the applicable scheme process.
            </p>
          </div>

          <div className={styles.workflowLine}>→</div>

          <div className={styles.workflowCard}>
            <div className={styles.stepNumber}>05</div>

            <h3>Balance Remains</h3>

            <p>
              Remaining units remain invested and their value
              can fluctuate.
            </p>
          </div>
        </div>
      </section>

      {/* IMPORTANT CONCEPT */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <span>03</span>

          <div>
            <p className={styles.eyebrow}>
              IMPORTANT CONCEPT
            </p>

            <h2>SWP is not fixed interest income</h2>
          </div>
        </div>

        <div className={styles.warningBox}>
          <div className={styles.warningIcon}>!</div>

          <div>
            <h3>Understand the difference</h3>

            <p>
              SWP is a withdrawal facility, not a
              guaranteed-interest product. The amount you
              withdraw generally comes from redemption of
              investment units.
            </p>

            <p>
              If markets perform well, the remaining corpus may
              grow. If markets fall, the corpus may decline.
            </p>
          </div>
        </div>
      </section>

      {/* WITHDRAWAL RATE */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <span>04</span>

          <div>
            <p className={styles.eyebrow}>
              UNDERSTAND THE NUMBERS
            </p>

            <h2>Withdrawal rate matters</h2>
          </div>
        </div>

        <p className={styles.sectionIntro}>
          Your withdrawal rate is the annual withdrawal
          compared with your starting corpus. It is only one
          factor to consider when designing an SWP strategy.
        </p>

        <div className={styles.rateGrid}>
          <div className={styles.rateCard}>
            <span>3%</span>

            <strong>₹25,000/month</strong>

            <p>
              Illustrative annual withdrawal of ₹3 lakh from a
              ₹1 crore starting corpus.
            </p>
          </div>

          <div className={styles.rateCard}>
            <span>6%</span>

            <strong>₹50,000/month</strong>

            <p>
              Illustrative annual withdrawal of ₹6 lakh from a
              ₹1 crore starting corpus.
            </p>
          </div>

          <div className={styles.rateCard}>
            <span>9%</span>

            <strong>₹75,000/month</strong>

            <p>
              Illustrative annual withdrawal of ₹9 lakh from a
              ₹1 crore starting corpus.
            </p>
          </div>
        </div>
      </section>

      {/* 1 CRORE */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <span>05</span>

          <div>
            <p className={styles.eyebrow}>
              ILLUSTRATION
            </p>

            <h2>₹1 Crore SWP example</h2>
          </div>
        </div>

        <div className={styles.exampleGrid}>
          <div className={styles.bigExample}>
            <span>Starting Corpus</span>
            <strong>₹1 Crore</strong>
          </div>

          <div className={styles.bigExample}>
            <span>Monthly SWP</span>
            <strong>₹50,000</strong>
          </div>

          <div className={styles.bigExample}>
            <span>Illustrative Return</span>
            <strong>8% p.a.</strong>
          </div>

          <div className={styles.bigExample}>
            <span>Illustrative Period</span>
            <strong>20 Years</strong>
          </div>
        </div>

        <div className={styles.note}>
          <strong>Important:</strong> These figures are
          mathematical illustrations based on an assumed
          constant return. Actual market returns fluctuate and
          actual results can be materially different.
        </div>
      </section>

      {/* 50 LAKH */}
      <section
        className={`${styles.section} ${styles.softSection}`}
      >
        <div className={styles.sectionHeading}>
          <span>06</span>

          <div>
            <p className={styles.eyebrow}>
              ILLUSTRATION
            </p>

            <h2>₹50 Lakh SWP example</h2>
          </div>
        </div>

        <div className={styles.exampleGrid}>
          <div className={styles.bigExample}>
            <span>Starting Corpus</span>
            <strong>₹50 Lakh</strong>
          </div>

          <div className={styles.bigExample}>
            <span>Monthly SWP</span>
            <strong>₹25,000</strong>
          </div>

          <div className={styles.bigExample}>
            <span>Illustrative Return</span>
            <strong>8% p.a.</strong>
          </div>

          <div className={styles.bigExample}>
            <span>Illustrative Period</span>
            <strong>20 Years</strong>
          </div>
        </div>
      </section>

      {/* COMPOUNDING */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <span>07</span>

          <div>
            <p className={styles.eyebrow}>
              GROWTH + CASH FLOW
            </p>

            <h2>
              Can SWP and compounding work together?
            </h2>
          </div>
        </div>

        <div className={styles.twoColumn}>
          <div>
            <p className={styles.largeText}>
              Potentially, yes — but withdrawals reduce the
              amount of capital that remains invested.
            </p>

            <p>
              When the remaining corpus generates returns,
              those returns can contribute to future corpus
              growth.
            </p>

            <p>
              At the same time, every SWP withdrawal reduces
              the units or corpus available for future growth.
            </p>
          </div>

          <div className={styles.compoundingVisual}>
            <div className={styles.compoundCircle}>₹</div>

            <div className={styles.compoundItem}>
              <strong>Corpus</strong>
              <span>Remains invested</span>
            </div>

            <div className={styles.compoundItem}>
              <strong>Returns</strong>
              <span>Can fluctuate</span>
            </div>

            <div className={styles.compoundItem}>
              <strong>Withdrawal</strong>
              <span>Creates cash flow</span>
            </div>
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section
        id="calculator"
        className={`${styles.section} ${styles.calculatorSection}`}
      >
        <div className={styles.sectionHeading}>
          <span>08</span>

          <div>
            <p className={styles.eyebrow}>
              YOUR OWN SWP CALCULATOR
            </p>

            <h2>Calculate your SWP</h2>
          </div>
        </div>

        <p className={styles.sectionIntro}>
          Enter your own numbers and see how the withdrawal
          amount and remaining corpus change under a
          constant-return mathematical illustration.
        </p>

        {/* QUICK EXAMPLES */}
        <div className={styles.quickExamples}>
          <span>Try an example:</span>

          <button
            type="button"
            onClick={() => applyExample(5000000)}
          >
            ₹50 Lakh
          </button>

          <button
            type="button"
            onClick={() => applyExample(10000000)}
          >
            ₹1 Crore
          </button>
        </div>

        <div className={styles.calculatorGrid}>
          {/* INPUTS */}
          <div className={styles.calculatorInputs}>
            {/* INVESTMENT */}
            <div className={styles.inputGroup}>
              <label htmlFor="investment">
                Initial Investment / Corpus
              </label>

              <div className={styles.inputWithPrefix}>
                <span>₹</span>

                <input
                  id="investment"
                  type="number"
                  min="0"
                  step="10000"
                  value={initialInvestment}
                  onChange={(e) =>
                    setInitialInvestment(
                      Math.max(
                        0,
                        Number(e.target.value) || 0
                      )
                    )
                  }
                />
              </div>

              {/* AMOUNT IN WORDS */}
              <div className={styles.amountInWords}>
                {numberToIndianWords(initialInvestment)}
              </div>

              <input
                type="range"
                min="100000"
                max="100000000"
                step="100000"
                value={Math.min(
                  Math.max(initialInvestment, 100000),
                  100000000
                )}
                onChange={(e) =>
                  setInitialInvestment(
                    Number(e.target.value)
                  )
                }
                className={styles.range}
              />
            </div>

            {/* MONTHLY SWP */}
            <div className={styles.inputGroup}>
              <label htmlFor="monthlySwp">
                Monthly SWP Withdrawal
              </label>

              <div className={styles.inputWithPrefix}>
                <span>₹</span>

                <input
                  id="monthlySwp"
                  type="number"
                  min="0"
                  step="1000"
                  value={monthlySWP}
                  onChange={(e) =>
                    setMonthlySWP(
                      Math.max(
                        0,
                        Number(e.target.value) || 0
                      )
                    )
                  }
                />
              </div>

              {/* AMOUNT IN WORDS */}
              <div className={styles.amountInWords}>
                {numberToIndianWords(monthlySWP)}
              </div>

              <input
                type="range"
                min="1000"
                max="1000000"
                step="1000"
                value={Math.min(
                  Math.max(monthlySWP, 1000),
                  1000000
                )}
                onChange={(e) =>
                  setMonthlySWP(
                    Number(e.target.value)
                  )
                }
                className={styles.range}
              />
            </div>

            {/* RETURN */}
            <div className={styles.inputGroup}>
              <label htmlFor="return">
                Expected Return p.a.
              </label>

              <div className={styles.inputWithSuffix}>
                <input
                  id="return"
                  type="number"
                  min="0"
                  max="30"
                  step="0.1"
                  value={expectedReturn}
                  onChange={(e) =>
                    setExpectedReturn(
                      Math.min(
                        30,
                        Math.max(
                          0,
                          Number(e.target.value) || 0
                        )
                      )
                    )
                  }
                />

                <span>%</span>
              </div>

              <input
                type="range"
                min="0"
                max="20"
                step="0.1"
                value={Math.min(
                  expectedReturn,
                  20
                )}
                onChange={(e) =>
                  setExpectedReturn(
                    Number(e.target.value)
                  )
                }
                className={styles.range}
              />
            </div>

            {/* YEARS */}
            <div className={styles.inputGroup}>
              <label htmlFor="years">
                Investment Period
              </label>

              <div className={styles.inputWithSuffix}>
                <input
                  id="years"
                  type="number"
                  min="1"
                  max="50"
                  step="1"
                  value={years}
                  onChange={(e) =>
                    setYears(
                      Math.min(
                        50,
                        Math.max(
                          1,
                          Number(e.target.value) || 1
                        )
                      )
                    )
                  }
                />

                <span>Years</span>
              </div>

              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={years}
                onChange={(e) =>
                  setYears(
                    Number(e.target.value)
                  )
                }
                className={styles.range}
              />
            </div>

            {/* ANNUAL INCREASE */}
            <div className={styles.inputGroup}>
              <label htmlFor="increase">
                Annual SWP Increase
              </label>

              <div className={styles.inputWithSuffix}>
                <input
                  id="increase"
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  value={annualIncrease}
                  onChange={(e) =>
                    setAnnualIncrease(
                      Math.min(
                        20,
                        Math.max(
                          0,
                          Number(e.target.value) || 0
                        )
                      )
                    )
                  }
                />

                <span>%</span>
              </div>

              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={Math.min(
                  annualIncrease,
                  15
                )}
                onChange={(e) =>
                  setAnnualIncrease(
                    Number(e.target.value)
                  )
                }
                className={styles.range}
              />

              <small>
                Example: 5% means your monthly SWP increases
                by 5% every year.
              </small>
            </div>
          </div>

          {/* RESULTS */}
          <div className={styles.calculatorResults}>
            <div className={styles.resultMain}>
              <span>
                Estimated Remaining Corpus
              </span>

              <strong>
                {formatCurrency(
                  result.remainingCorpus
                )}
              </strong>

              <small>
                Based on the assumptions entered above
              </small>
            </div>

            <div className={styles.resultGrid}>
              <div className={styles.resultCard}>
                <span>Total Withdrawn</span>

                <strong>
                  {formatCurrency(
                    result.totalWithdrawn
                  )}
                </strong>
              </div>

              <div className={styles.resultCard}>
                <span>
                  Annual Starting Withdrawal
                </span>

                <strong>
                  {formatCurrency(
                    monthlySWP * 12
                  )}
                </strong>
              </div>

              <div className={styles.resultCard}>
                <span>
                  Starting Withdrawal Rate
                </span>

                <strong>
                  {withdrawalRate.toFixed(2)}%
                </strong>
              </div>

              <div className={styles.resultCard}>
                <span>Investment Period</span>

                <strong>
                  {years} Years
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* CHART */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h3>
                Projected Remaining Corpus
              </h3>

              <p>
                Illustrative year-by-year corpus based on
                the assumptions entered.
              </p>
            </div>
          </div>

          <div className={styles.chart}>
            {result.yearlyData.map((item) => {
              const height =
                (item.closingCorpus /
                  maximumChartValue) *
                100;

              return (
                <div
                  className={styles.barWrapper}
                  key={item.year}
                  title={`Year ${item.year}: ${formatCurrency(
                    item.closingCorpus
                  )}`}
                >
                  <div className={styles.barValue}>
                    {item.year % 5 === 0
                      ? formatCurrency(
                          item.closingCorpus
                        )
                      : ""}
                  </div>

                  <div className={styles.barTrack}>
                    <div
                      className={styles.bar}
                      style={{
                        height: `${Math.max(
                          height,
                          1
                        )}%`,
                      }}
                    />
                  </div>

                  <span>
                    Y{item.year}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.calculatorDisclaimer}>
          <strong>
            Calculator disclaimer:
          </strong>{" "}
          This calculator uses a simplified mathematical
          model with an assumed constant rate of return.
          Actual investment returns fluctuate, and actual
          SWP outcomes can be significantly different.
          This calculator should not be considered a
          prediction or guarantee of future returns.
        </div>
      </section>

      {/* IDLE MONEY */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <span>09</span>

          <div>
            <p className={styles.eyebrow}>
              CAPITAL PLANNING
            </p>

            <h2>
              What does "idle money" mean for SWP planning?
            </h2>
          </div>
        </div>

        <div className={styles.twoColumn}>
          <div>
            <p>
              Investors sometimes accumulate a substantial
              amount of money that is not currently required
              for immediate expenses.
            </p>

            <p>
              Depending on the financial goal, liquidity
              requirement, risk profile and investment
              horizon, part of such capital may be considered
              for an investment strategy designed to generate
              future cash flow.
            </p>
          </div>

          <div className={styles.infoPanel}>
            <h3>
              Before considering SWP, ask:
            </h3>

            <ul className={styles.checkList}>
              <li>
                How much money do I actually need every
                month?
              </li>

              <li>
                How long should the income continue?
              </li>

              <li>
                What market volatility can I tolerate?
              </li>

              <li>
                How much emergency cash should remain
                outside?
              </li>

              <li>
                What tax implications apply to my
                investment?
              </li>

              <li>
                Does the strategy match my financial goals?
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section
        className={`${styles.section} ${styles.softSection}`}
      >
        <div className={styles.sectionHeading}>
          <span>10</span>

          <div>
            <p className={styles.eyebrow}>
              PRACTICAL APPLICATION
            </p>

            <h2>
              Where can SWP be considered?
            </h2>
          </div>
        </div>

        <div className={styles.useCaseGrid}>
          <div className={styles.useCase}>
            <div>01</div>

            <h3>Retirement Cash Flow</h3>

            <p>
              Create a structured withdrawal approach from
              an accumulated retirement corpus.
            </p>
          </div>

          <div className={styles.useCase}>
            <div>02</div>

            <h3>Monthly Expenses</h3>

            <p>
              Plan periodic withdrawals to support recurring
              financial requirements.
            </p>
          </div>

          <div className={styles.useCase}>
            <div>03</div>

            <h3>Goal-Based Income</h3>

            <p>
              Align withdrawals with a planned financial
              requirement over a chosen period.
            </p>
          </div>

          <div className={styles.useCase}>
            <div>04</div>

            <h3>Portfolio Planning</h3>

            <p>
              Combine cash-flow requirements with an
              investment strategy suitable to your risk
              profile.
            </p>
          </div>
        </div>
      </section>

      {/* RISKS */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <span>11</span>

          <div>
            <p className={styles.eyebrow}>
              KNOW THE RISKS
            </p>

            <h2>
              Important things to understand
            </h2>
          </div>
        </div>

        <div className={styles.riskGrid}>
          <div>
            <h3>Market Risk</h3>

            <p>
              Investment values can rise and fall with
              market conditions.
            </p>
          </div>

          <div>
            <h3>Sequence Risk</h3>

            <p>
              Poor returns during the early withdrawal years
              can have a meaningful impact on the remaining
              corpus.
            </p>
          </div>

          <div>
            <h3>Withdrawal Risk</h3>

            <p>
              Higher withdrawals can reduce the capital
              available for future growth.
            </p>
          </div>

          <div>
            <h3>Inflation Risk</h3>

            <p>
              A fixed withdrawal may lose purchasing power as
              expenses increase over time.
            </p>
          </div>
        </div>
      </section>

      {/* TAX */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <span>12</span>

          <div>
            <p className={styles.eyebrow}>
              TAX AWARENESS
            </p>

            <h2>
              What about taxation?
            </h2>
          </div>
        </div>

        <div className={styles.taxBox}>
          <p>
            SWP withdrawals from mutual funds involve
            redemption of units. Tax treatment can depend on
            the type of mutual fund, the period for which
            units have been held, applicable tax rules and
            other circumstances.
          </p>

          <p>
            Therefore, tax should be considered separately
            when designing an SWP strategy. The calculator
            above does <strong>not</strong> deduct taxes.
          </p>

          <small>
            Tax rules can change. Consult a qualified tax
            professional for advice applicable to your
            circumstances.
          </small>
        </div>
      </section>

      {/* IMPLEMENTATION */}
      <section
        className={`${styles.section} ${styles.softSection}`}
      >
        <div className={styles.sectionHeading}>
          <span>13</span>

          <div>
            <p className={styles.eyebrow}>
              IMPLEMENTATION
            </p>

            <h2>
              How to start planning an SWP
            </h2>
          </div>
        </div>

        <div className={styles.implementation}>
          <div>
            <strong>01</strong>

            <h3>
              Identify the corpus
            </h3>

            <p>
              Understand how much capital is available.
            </p>
          </div>

          <div>
            <strong>02</strong>

            <h3>
              Calculate the cash-flow requirement
            </h3>

            <p>
              Determine your monthly or periodic requirement.
            </p>
          </div>

          <div>
            <strong>03</strong>

            <h3>
              Assess risk
            </h3>

            <p>
              Consider your risk profile and investment
              horizon.
            </p>
          </div>

          <div>
            <strong>04</strong>

            <h3>
              Select suitable investments
            </h3>

            <p>
              Evaluate investment options according to your
              requirements.
            </p>
          </div>

          <div>
            <strong>05</strong>

            <h3>
              Set the withdrawal plan
            </h3>

            <p>
              Choose amount and frequency according to the
              strategy.
            </p>
          </div>

          <div>
            <strong>06</strong>

            <h3>
              Review periodically
            </h3>

            <p>
              Review corpus, withdrawals and financial goals
              over time.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div>
          <span className={styles.badge}>
            PLAN YOUR CASH FLOW
          </span>

          <h2>
            Want to understand whether SWP fits your
            financial goals?
          </h2>

          <p>
            Share your requirement and we can discuss your
            corpus, withdrawal requirement, investment
            horizon and overall financial plan.
          </p>
        </div>

        <div className={styles.ctaActions}>
          <a
            href="#enquiry"
            className={styles.primaryButton}
          >
            Discuss Your Requirement
          </a>

          <Link
            href="/contact"
            className={styles.secondaryButton}
          >
            Contact Us
          </Link>
        </div>
      </section>

      {/* ENQUIRY */}
      <section
        id="enquiry"
        className={styles.enquirySection}
      >
        <EnquiryForm />
      </section>

      {/* DISCLAIMER */}
      <section className={styles.disclaimer}>
        <h3>Important Disclaimer</h3>

        <p>
          SWP is a withdrawal facility and does not
          guarantee regular or fixed returns. Mutual fund
          investments are subject to market risks. The
          examples and calculator on this page are for
          educational and illustrative purposes only and are
          not forecasts, guarantees or investment
          recommendations.
        </p>

        <p>
          Actual results depend on investment performance,
          withdrawal amount, market conditions, taxes, costs,
          timing and other factors.
        </p>
      </section>
    </main>
  );
}
