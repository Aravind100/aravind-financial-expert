import Link from "next/link";

export const metadata = {
  title: "NISM V-A Practice by Unit | Mutual Fund Distributors",
  description:
    "Practice NISM Series V-A Mutual Fund Distributors questions unit by unit.",
};

const units = [
  {
    number: 1,
    title: "Investment Landscape",
    description:
      "Financial goals, savings and investments, asset classes, investment risks, risk profiling and asset allocation.",
  },
  {
    number: 2,
    title: "Concept and Role of a Mutual Fund",
    description:
      "Understand mutual funds, their role, classification and development of the mutual fund industry.",
  },
  {
    number: 3,
    title: "Legal Structure of Mutual Funds in India",
    description:
      "Learn about mutual fund structure, key constituents, AMCs and service providers.",
  },
  {
    number: 4,
    title: "Legal and Regulatory Framework",
    description:
      "Study regulators, SEBI, distributor due diligence, investor grievances and the AMFI Code of Conduct.",
  },
  {
    number: 5,
    title: "Scheme Related Information",
    description:
      "Understand mandatory documents and other important scheme-related disclosures.",
  },
  {
    number: 6,
    title: "Fund Distribution and Channel Management Practices",
    description:
      "Learn distribution channels, distributor roles, commissions, due diligence and distributor-related practices.",
  },
  {
    number: 7,
    title: "Net Asset Value, TER and Pricing of Units",
    description:
      "Understand NAV calculation, valuation principles, expenses and pricing-related concepts.",
  },
  {
    number: 8,
    title: "Taxation",
    description:
      "Practice concepts related to taxation applicable to mutual fund investments and distribution.",
  },
  {
    number: 9,
    title: "Investor Services",
    description:
      "Understand investor transactions, services, processes and important servicing-related concepts.",
  },
  {
    number: 10,
    title: "Risk, Return and Performance of Funds",
    description:
      "Study risk factors, returns, performance drivers, risk measures and performance representation.",
  },
  {
    number: 11,
    title: "Mutual Fund Scheme Performance",
    description:
      "Understand benchmarks, performance measurement, tracking error and scheme performance disclosure.",
  },
  {
    number: 12,
    title: "Mutual Fund Scheme Selection",
    description:
      "Practice scheme selection based on investor needs, preferences, risk profile and investment strategy.",
  },
];

export default function NismPracticePage() {
  return (
    <main className="nism-practice-page">

      {/* HERO */}

      <section className="nism-practice-hero">
        <div className="nism-practice-container">

          <div className="nism-practice-eyebrow">
            NISM SERIES V-A
          </div>

          <h1>
            Practice by Unit
          </h1>

          <p>
            Strengthen your NISM V-A preparation by practicing
            questions from individual curriculum units before
            attempting the full-length mock tests.
          </p>

          <div className="nism-practice-buttons">

            <Link
              href="/nism/v-a/mock-tests"
              className="nism-primary-btn"
            >
              📝 Full Mock Tests
            </Link>

            <Link
              href="/nism/v-a"
              className="nism-secondary-btn"
            >
              ← Back to Preparation
            </Link>

          </div>

        </div>
      </section>


      {/* UNIT SELECTION */}

      <section className="nism-practice-section">

        <div className="nism-practice-container">

          <div className="nism-practice-heading">

            <div className="nism-small-title">
              SELECT A UNIT
            </div>

            <h2>
              Choose what you want to practice
            </h2>

            <p>
              Start with one unit, strengthen your
              understanding and then move to the next.
            </p>

          </div>


          <div className="nism-practice-grid">

            {units.map((unit) => (

              <div
                className="nism-practice-card"
                key={unit.number}
              >

                <div className="nism-practice-card-top">

                  <span className="nism-practice-number">
                    {String(unit.number).padStart(2, "0")}
                  </span>

                  <span className="nism-practice-status">
                    Practice
                  </span>

                </div>


                <h3>
                  {unit.title}
                </h3>


                <p>
                  {unit.description}
                </p>


                <button
                  type="button"
                  className="nism-practice-card-button"
                  disabled
                >
                  Start Practice →
                </button>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* HOW IT WILL WORK */}

      <section className="nism-practice-info">

        <div className="nism-practice-container">

          <div className="nism-practice-heading">

            <div className="nism-small-title">
              HOW IT WILL WORK
            </div>

            <h2>
              Learn → Practice → Review
            </h2>

          </div>


          <div className="nism-practice-steps">

            <div className="nism-practice-step">

              <span>01</span>

              <h3>
                Choose a Unit
              </h3>

              <p>
                Select the NISM V-A unit you want to
                practice.
              </p>

            </div>


            <div className="nism-practice-step">

              <span>02</span>

              <h3>
                Choose Questions
              </h3>

              <p>
                Practice a selected number of questions
                from that unit.
              </p>

            </div>


            <div className="nism-practice-step">

              <span>03</span>

              <h3>
                Check Your Answers
              </h3>

              <p>
                Review your answer, the correct answer
                and the explanation.
              </p>

            </div>


            <div className="nism-practice-step">

              <span>04</span>

              <h3>
                Improve
              </h3>

              <p>
                Revisit weak areas and attempt the
                practice set again.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* MOCK TEST CTA */}

      <section className="nism-practice-cta">

        <div className="nism-practice-container">

          <div>

            <div className="nism-small-title">
              READY FOR THE FULL TEST?
            </div>

            <h2>
              Test yourself with 100 questions.
            </h2>

            <p>
              Once you are comfortable with individual
              units, take a full-length NISM V-A practice
              mock test.
            </p>

          </div>


          <Link
            href="/nism/v-a/mock-tests"
            className="nism-primary-btn"
          >
            View Mock Tests →
          </Link>

        </div>

      </section>


      {/* DISCLAIMER */}

      <section className="nism-practice-disclaimer">

        <div className="nism-practice-container">

          <p>
            <strong>Important:</strong> The questions and
            practice tests on this website are independent
            educational resources. They are not official NISM
            examination questions and are not endorsed by NISM.
            Candidates should refer to official NISM resources
            for the latest examination information.
          </p>

        </div>

      </section>

    </main>
  );
}
