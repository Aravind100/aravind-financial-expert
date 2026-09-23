import Link from "next/link";

export const metadata = {
  title: "NISM Series V-A Preparation | Mutual Fund Distributors",
  description:
    "NISM-Series-V-A Mutual Fund Distributors preparation with chapter-wise study, practice questions and mock tests.",
};

const chapters = [
  {
    number: "01",
    title: "Investment Landscape",
    description:
      "Investors, financial goals, savings, investments, asset classes, investment risks, risk profiling and asset allocation.",
  },
  {
    number: "02",
    title: "Concept & Role of a Mutual Fund",
    description:
      "Understand mutual-fund concepts, classification and the role of mutual funds.",
  },
  {
    number: "03",
    title: "Legal Structure of Mutual Funds in India",
    description:
      "Understand the structure of mutual funds, key constituents, AMC structure and service providers.",
  },
  {
    number: "04",
    title: "Legal & Regulatory Framework",
    description:
      "Learn about regulators, regulatory requirements and distributor-related responsibilities.",
  },
  {
    number: "05",
    title: "Scheme Related Information",
    description:
      "Understand important information and concepts related to mutual-fund schemes.",
  },
  {
    number: "06",
    title: "Fund Distribution & Investor Services",
    description:
      "Understand distribution channels and important investor-service concepts.",
  },
  {
    number: "07",
    title: "NAV, Valuation & Pricing",
    description:
      "Learn important concepts related to NAV, valuation and pricing of mutual-fund units.",
  },
  {
    number: "08",
    title: "Taxation",
    description:
      "Understand taxation-related concepts relevant to mutual-fund investing.",
  },
  {
    number: "09",
    title: "Investor Services",
    description:
      "Learn important concepts relating to transactions and services provided to investors.",
  },
  {
    number: "10",
    title: "Risk, Return & Performance",
    description:
      "Understand investment risk, returns and performance-related concepts.",
  },
  {
    number: "11",
    title: "Scheme Selection",
    description:
      "Understand factors involved in evaluating and selecting suitable mutual-fund schemes.",
  },
  {
    number: "12",
    title: "Financial Planning",
    description:
      "Understand financial planning as an approach to investing in mutual funds and building long-term investor relationships.",
  },
];

export default function NISMVA() {
  return (
    <main className="nism-prep-page">

      <section className="nism-hero">
        <div className="nism-hero-inner">

          <div className="nism-eyebrow">
            NISM SERIES V-A
          </div>

          <h1>
            Mutual Fund Distributors
            <span>Exam Preparation</span>
          </h1>

          <p>
            Prepare chapter by chapter, practice concepts and test your
            understanding through independent practice resources.
          </p>

          <div className="nism-hero-buttons">

            <a
              href="https://www.nism.ac.in/mutual-fund-distributors"
              target="_blank"
              rel="noopener noreferrer"
              className="nism-secondary-btn"
            >
              Official NISM Information
            </a>

            <a
              href="https://www.nism.ac.in/wp-content/uploads/2021/03/NISM-Series-V-A-Mutual-Fund-Distributor-Annexure-1-SyllabusOutlines.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="nism-secondary-btn"
            >
              View Curriculum
            </a>

          </div>

        </div>
      </section>


      <section className="nism-section">
        <div className="nism-container">

          <div className="nism-section-heading">
            <div className="nism-small-title">
              CHAPTER-WISE PREPARATION
            </div>

            <h2>Study the syllabus systematically</h2>

            <p>
              Select a topic to study the concepts and practice questions
              associated with that area.
            </p>
          </div>


          <div className="nism-topic-grid">

            {chapters.map((chapter) => (
              <div className="nism-topic" key={chapter.number}>

                <span>{chapter.number}</span>

                <h3>{chapter.title}</h3>

                <p>{chapter.description}</p>

                <button type="button" className="nism-coming-btn">
                  Practice Questions — Coming Soon
                </button>

              </div>
            ))}

          </div>

        </div>
      </section>


      <section className="nism-mock-section">
        <div className="nism-container">

          <div className="nism-mock-box">

            <div>
              <div className="nism-small-title">
                FULL-LENGTH PRACTICE
              </div>

              <h2>
                10 Independent Mock Tests
              </h2>

              <p>
                Each test will contain 100 questions selected from our
                question bank. The system will generate a different
                combination of questions for new attempts.
              </p>
            </div>

            <Link
  href="/nism/v-a/mock-tests"
  className="nism-primary-btn"
>
  View Mock Tests →
</Link>

          </div>

        </div>
      </section>


      <section className="nism-section nism-light">
        <div className="nism-container">

          <div className="nism-section-heading">
            <div className="nism-small-title">
              OFFICIAL RESOURCES
            </div>

            <h2>Study from official NISM resources</h2>

            <p>
              Always refer to NISM's official website for the latest
              examination information, registration details, curriculum and
              study material.
            </p>
          </div>

          <div className="nism-card-grid">

            <a
              className="nism-feature-card"
              href="https://www.nism.ac.in/mutual-fund-distributors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="nism-card-icon">🌐</div>

              <h3>Official NISM Page</h3>

              <p>
                Examination details, objectives and official resources.
              </p>

              <span>Open NISM →</span>
            </a>


            <a
              className="nism-feature-card"
              href="https://cert.nism.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="nism-card-icon">📝</div>

              <h3>Certification Portal</h3>

              <p>
                Visit the official NISM certification portal for
                registration-related information.
              </p>

              <span>Open Certification Portal →</span>
            </a>

          </div>

        </div>
      </section>


      <section className="nism-cta">
        <div className="nism-container">

          <div>
            <div className="nism-small-title">
              NEXT STEP
            </div>

            <h2>
              Practice questions and mock tests are coming next.
            </h2>

            <p>
              The question bank will be connected to Supabase so that
              randomized tests and results can be generated automatically.
            </p>
          </div>

          <Link href="/" className="nism-primary-btn">
            Back to Home
          </Link>

        </div>
      </section>

    </main>
  );
}
