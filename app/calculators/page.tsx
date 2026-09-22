import Link from "next/link";

const investmentCalculators = [
  {
    icon: "📈",
    title: "SIP Calculator",
    description:
      "Estimate the potential future value of regular monthly SIP investments based on your assumptions.",
    href: "/calculators/sip",
    status: "Available",
  },
  {
    icon: "💰",
    title: "Lumpsum Calculator",
    description:
      "Estimate the potential value of a one-time investment over a selected investment period.",
    href: "/calculators/lumpsum",
    status: "Available",
  },
  {
    icon: "🚀",
    title: "Step-Up SIP Calculator",
    description:
      "Understand how increasing your SIP contribution periodically can affect the investment illustration.",
    href: "/calculators/step-up-sip",
    status: "Coming Soon",
  },
  {
    icon: "📊",
    title: "CAGR Calculator",
    description:
      "Calculate the annualized growth rate between an initial investment and its final value.",
    href: "/calculators/cagr",
    status: "Coming Soon",
  },
  {
    icon: "🧮",
    title: "XIRR Calculator",
    description:
      "Calculate annualized returns when investments or withdrawals happen on different dates.",
    href: "/calculators/xirr",
    status: "Coming Soon",
  },
];

const planningCalculators = [
  {
    icon: "🎯",
    title: "Goal Planning Calculator",
    description:
      "Estimate the investment required to work toward a future financial goal.",
    href: "#",
  },
  {
    icon: "🏖️",
    title: "Retirement Calculator",
    description:
      "Explore retirement corpus requirements using your current assumptions and goals.",
    href: "#",
  },
  {
    icon: "📉",
    title: "Inflation Calculator",
    description:
      "Understand how inflation can affect the future purchasing power of money.",
    href: "#",
  },
  {
    icon: "💵",
    title: "Future Value Calculator",
    description:
      "Estimate the future value of money based on investment amount, return and time.",
    href: "#",
  },
  {
    icon: "📈",
    title: "Compound Interest Calculator",
    description:
      "Illustrate how investment growth can compound over time under assumed returns.",
    href: "#",
  },
];

const loanCalculators = [
  {
    icon: "🏠",
    title: "EMI Calculator",
    description:
      "Calculate estimated monthly EMI, total interest and total repayment for a loan.",
    href: "#",
  },
  {
    icon: "🏡",
    title: "Home Loan Calculator",
    description:
      "Explore estimated EMI and repayment scenarios for a home loan.",
    href: "#",
  },
  {
    icon: "💳",
    title: "Loan Eligibility Calculator",
    description:
      "Explore an indicative loan eligibility estimate using income and existing obligations.",
    href: "#",
  },
];

const protectionCalculators = [
  {
    icon: "🛡️",
    title: "Insurance Need Calculator",
    description:
      "Estimate an indicative level of life insurance protection based on selected financial inputs.",
    href: "#",
  },
  {
    icon: "💼",
    title: "Net Worth Calculator",
    description:
      "Organise assets and liabilities to understand your current estimated net worth.",
    href: "#",
  },
];

function CalculatorCard({
  icon,
  title,
  description,
  href,
  status,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
  status?: string;
}) {
  const isAvailable = href !== "#";

  return (
    <Link
      href={href}
      className={`card calculatorCard ${
        !isAvailable ? "calculatorComingSoon" : ""
      }`}
    >
      <div className="calculatorIcon">{icon}</div>

      <div className="calculatorCardTop">
        <h3>{title}</h3>

        {status && (
          <span
            className={
              status === "Available"
                ? "calculatorStatus available"
                : "calculatorStatus"
            }
          >
            {status}
          </span>
        )}
      </div>

      <p className="muted">{description}</p>

      <span className="calculatorArrow">
        {isAvailable ? "Calculate →" : "Coming Soon"}
      </span>
    </Link>
  );
}

export const metadata = {
  title: "Financial Calculators | SIP, CAGR, XIRR, EMI & More",
  description:
    "Explore financial calculators for SIP, investments, financial planning, loans and insurance. Use simple calculators to understand your financial numbers.",
};

export default function CalculatorsPage() {
  return (
    <>
      {/* HERO */}
      <section className="pageHero calculatorHero">
        <div>
          <div className="calculatorEyebrow">
            FINANCIAL PLANNING TOOLS
          </div>

          <h1>Financial Calculators</h1>

          <p>
            Plan better. Calculate smarter. Understand your numbers.
          </p>

          <p className="calculatorHeroText">
            Explore simple, interactive calculators designed to help you
            understand investments, financial planning, loans and protection
            requirements using your own assumptions.
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section className="section calculatorIntro">
        <div className="calculatorIntroGrid">
          <div>
            <div className="calculatorEyebrow">
              WHY USE CALCULATORS?
            </div>

            <h2>Turn financial questions into numbers.</h2>
          </div>

          <div>
            <p className="muted">
              Financial calculators can help you understand how different
              assumptions about investment amount, time, return, inflation or
              loan repayment can affect an illustration.
            </p>

            <p className="muted">
              Use the results as an educational starting point. Actual
              investment returns, loan terms, expenses, taxes and product
              outcomes may differ.
            </p>
          </div>
        </div>
      </section>

      {/* INVESTMENT CALCULATORS */}
      <section className="calculatorSection calculatorLight">
        <div className="section">
          <div className="calculatorSectionHeading">
            <div>
              <div className="calculatorEyebrow">
                INVESTMENT CALCULATORS
              </div>

              <h2>Calculate your investment illustrations</h2>

              <p className="muted">
                Explore SIP, lumpsum, Step-Up SIP, CAGR and XIRR calculations.
              </p>
            </div>
          </div>

          <div className="calculatorGrid">
            {investmentCalculators.map((calculator) => (
              <CalculatorCard
                key={calculator.title}
                {...calculator}
              />
            ))}
          </div>
        </div>
      </section>

      {/* PLANNING */}
      <section className="calculatorSection">
        <div className="section">
          <div className="calculatorSectionHeading">
            <div>
              <div className="calculatorEyebrow">
                FINANCIAL PLANNING
              </div>

              <h2>Plan for future financial goals</h2>

              <p className="muted">
                Tools to help you explore long-term financial planning
                scenarios.
              </p>
            </div>
          </div>

          <div className="calculatorGrid">
            {planningCalculators.map((calculator) => (
              <CalculatorCard
                key={calculator.title}
                {...calculator}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SWP */}
      <section className="calculatorFeatured">
        <div className="section">
          <div className="calculatorFeaturedBox">
            <div>
              <div className="calculatorFeaturedIcon">💰</div>

              <div className="calculatorEyebrow">
                WITHDRAWAL PLANNING
              </div>

              <h2>SWP Calculator</h2>

              <p>
                Explore Systematic Withdrawal Plan scenarios, including
                investment corpus, monthly withdrawals, assumed returns,
                investment period and annual withdrawal increases.
              </p>
            </div>

            <Link className="btn" href="/swp">
              Open SWP Calculator →
            </Link>
          </div>
        </div>
      </section>

      {/* LOANS */}
      <section className="calculatorSection calculatorLight">
        <div className="section">
          <div className="calculatorSectionHeading">
            <div>
              <div className="calculatorEyebrow">
                LOAN CALCULATORS
              </div>

              <h2>Understand your loan numbers</h2>

              <p className="muted">
                Calculate indicative EMI, repayment and loan-related figures.
              </p>
            </div>
          </div>

          <div className="calculatorGrid calculatorThree">
            {loanCalculators.map((calculator) => (
              <CalculatorCard
                key={calculator.title}
                {...calculator}
              />
            ))}
          </div>
        </div>
      </section>

      {/* PROTECTION */}
      <section className="calculatorSection">
        <div className="section">
          <div className="calculatorSectionHeading">
            <div>
              <div className="calculatorEyebrow">
                PROTECTION & PERSONAL FINANCE
              </div>

              <h2>Understand your financial position</h2>

              <p className="muted">
                Additional tools for protection planning and personal financial
                awareness.
              </p>
            </div>
          </div>

          <div className="calculatorGrid calculatorThree">
            {protectionCalculators.map((calculator) => (
              <CalculatorCard
                key={calculator.title}
                {...calculator}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="calculatorCTA">
        <div>
          <div className="calculatorEyebrow">
            NEED HELP UNDERSTANDING YOUR NUMBERS?
          </div>

          <h2>Use the calculator. Then understand the decision.</h2>

          <p>
            Calculators provide illustrations based on the information you
            enter. If you have a specific financial requirement, you can also
            share your requirement for further discussion.
          </p>

          <div className="actions calculatorActions">
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
      <section className="calculatorDisclaimer">
        <p>
          Calculators on this website are intended for educational and
          illustrative purposes. Results depend on the assumptions and inputs
          entered by the user and should not be considered a guarantee,
          prediction or assurance of future returns, income or financial
          outcomes. Investment products are subject to market risks. Loan
          calculations are indicative and actual terms depend on the relevant
          lender and applicant profile.
        </p>
      </section>
    </>
  );
}
