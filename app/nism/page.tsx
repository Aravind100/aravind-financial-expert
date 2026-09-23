import Link from "next/link";

export const metadata = {
  title: "NISM Series V-A | Mutual Fund Distributors Exam Preparation",
  description:
    "Prepare for the NISM-Series-V-A Mutual Fund Distributors Certification Examination with study resources, chapter-wise preparation and independent practice tests.",
};


export default function NISMPage() {
  return (
    <main className="nism-page">

      {/* HERO */}
      <section className="nism-hero">
        <div className="nism-hero-inner">

          <div className="nism-eyebrow">
            NISM EXAM PREPARATION
          </div>

          <h1>
            NISM-Series-V-A
            <span>Mutual Fund Distributors</span>
          </h1>

          <p>
            Build your understanding of mutual funds, investment concepts,
            regulations, distribution, taxation, risk and financial planning
            with structured exam preparation resources.
          </p>

          <div className="nism-hero-buttons">
            <Link href="/nism/v-a" className="nism-primary-btn">
              Start Preparation
            </Link>

            <a
              href="https://www.nism.ac.in/mutual-fund-distributors"
              target="_blank"
              rel="noopener noreferrer"
              className="nism-secondary-btn"
            >
              Official NISM Information
            </a>
          </div>

        </div>
      </section>


      {/* EXAM SNAPSHOT */}
      <section className="nism-section">
        <div className="nism-container">

          <div className="nism-section-heading">
            <div className="nism-small-title">
              EXAM AT A GLANCE
            </div>

            <h2>Know the examination structure</h2>

            <p>
              The current NISM-Series-V-A examination structure provides a
              100-question, 100-mark examination to be completed in 2 hours.
            </p>
          </div>

          <div className="nism-stats-grid">

            <div className="nism-stat-card">
              <strong>100</strong>
              <span>Questions</span>
            </div>

            <div className="nism-stat-card">
              <strong>100</strong>
              <span>Total Marks</span>
            </div>

            <div className="nism-stat-card">
              <strong>120</strong>
              <span>Minutes</span>
            </div>

            <div className="nism-stat-card">
              <strong>50%</strong>
              <span>Passing Score</span>
            </div>

            <div className="nism-stat-card">
              <strong>0</strong>
              <span>Negative Marking</span>
            </div>

          </div>

        </div>
      </section>


      {/* PREPARATION OPTIONS */}
      <section className="nism-section nism-light">
        <div className="nism-container">

          <div className="nism-section-heading">
            <div className="nism-small-title">
              PREPARE SMARTER
            </div>

            <h2>Everything in one place</h2>

            <p>
              Use the preparation section to study concepts, practice
              questions and test your understanding.
            </p>
          </div>


          <div className="nism-card-grid">

            <div className="nism-feature-card">
              <div className="nism-card-icon">📚</div>

              <h3>Study Material</h3>

              <p>
                Access the official NISM study-material resources and
                preparation information.
              </p>

              <a
                href="https://www.nism.ac.in/mutual-fund-distributors"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Official Resources →
              </a>
            </div>


            <div className="nism-feature-card">
              <div className="nism-card-icon">📖</div>

              <h3>Chapter-wise Preparation</h3>

              <p>
                Study the major areas of the NISM-Series-V-A curriculum in
                an organized manner.
              </p>

              <Link href="/nism/v-a">
                Explore Chapters →
              </Link>
            </div>


            <div className="nism-feature-card">
              <div className="nism-card-icon">📝</div>

              <h3>Practice Questions</h3>

              <p>
                Practice original questions designed around the examination
                objectives and concepts.
              </p>

              <Link href="/nism/v-a">
                Practice Questions →
              </Link>
            </div>


            <div className="nism-feature-card">
              <div className="nism-card-icon">🎯</div>

              <h3>10 Mock Tests</h3>

              <p>
                Take independent practice mock tests with randomized
                questions from the question bank.
              </p>

              <Link href="/nism/v-a">
                View Mock Tests →
              </Link>
            </div>


            <div className="nism-feature-card">
              <div className="nism-card-icon">⏱️</div>

              <h3>Timed Practice</h3>

              <p>
                Practice under a 120-minute timer to become familiar with
                managing time during a full-length practice test.
              </p>

              <Link href="/nism/v-a">
                Start Timed Practice →
              </Link>
            </div>


            <div className="nism-feature-card">
              <div className="nism-card-icon">📊</div>

              <h3>Performance Analysis</h3>

              <p>
                Review your score, correct answers, incorrect answers and
                chapter-wise performance after completing a test.
              </p>

              <Link href="/nism/v-a">
                View Preparation →
              </Link>
            </div>

          </div>

        </div>
      </section>


      {/* CURRICULUM */}
      <section className="nism-section">
        <div className="nism-container">

          <div className="nism-section-heading">
            <div className="nism-small-title">
              CURRICULUM
            </div>

            <h2>What you will study</h2>

            <p>
              The NISM V-A curriculum covers the investment landscape,
              mutual-fund concepts, legal structure, regulation,
              distribution and other areas relevant to mutual-fund
              distribution.
            </p>
          </div>


          <div className="nism-topic-grid">

            <div className="nism-topic">
              <span>01</span>
              <h3>Investment Landscape</h3>
              <p>
                Financial goals, savings, investments, asset classes,
                investment risks, risk profiling and asset allocation.
              </p>
            </div>


            <div className="nism-topic">
              <span>02</span>
              <h3>Concept & Role of Mutual Funds</h3>
              <p>
                Mutual-fund concepts, classification and the role of mutual
                funds in the investment landscape.
              </p>
            </div>


            <div className="nism-topic">
              <span>03</span>
              <h3>Legal Structure</h3>
              <p>
                Structure of mutual funds, key constituents, AMC structure
                and service providers.
              </p>
            </div>


            <div className="nism-topic">
              <span>04</span>
              <h3>Legal & Regulatory Framework</h3>
              <p>
                Regulatory framework, regulators and distributor-related
                requirements.
              </p>
            </div>


            <div className="nism-topic">
              <span>05</span>
              <h3>Scheme Related Concepts</h3>
              <p>
                Important scheme-related concepts and information investors
                and distributors should understand.
              </p>
            </div>


            <div className="nism-topic">
              <span>06</span>
              <h3>Distribution & Investor Services</h3>
              <p>
                Distribution concepts, channels and investor servicing
                considerations.
              </p>
            </div>


            <div className="nism-topic">
              <span>07</span>
              <h3>NAV, Valuation & Related Concepts</h3>
              <p>
                Important concepts associated with valuation, NAV and
                mutual-fund operations.
              </p>
            </div>


            <div className="nism-topic">
              <span>08</span>
              <h3>Taxation & Financial Planning</h3>
              <p>
                Taxation-related concepts and the role of financial
                planning in mutual-fund investing.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* MOCK TEST FEATURE */}
      <section className="nism-mock-section">
        <div className="nism-container">

          <div className="nism-mock-box">

            <div>
              <div className="nism-small-title">
                PRACTICE MOCK TESTS
              </div>

              <h2>
                10 Mock Tests.
                <span> Different Questions.</span>
              </h2>

              <p>
                Our practice system will use a large question bank to
                generate randomized full-length tests. Each new attempt can
                receive a different combination of questions.
              </p>
            </div>

            <Link href="/nism/v-a" className="nism-primary-btn">
              Explore Mock Tests
            </Link>

          </div>

        </div>
      </section>


      {/* IMPORTANT NOTE */}
      <section className="nism-section nism-light">
        <div className="nism-container">

          <div className="nism-note">

            <h3>Important</h3>

            <p>
              The practice material and mock tests provided on this website
              are independent educational resources. They are not official
              NISM examination papers and should not be considered an
              endorsement or certification by NISM.
            </p>

          </div>

        </div>
      </section>


      {/* CTA */}
      <section className="nism-cta">
        <div className="nism-container">

          <div>
            <div className="nism-small-title">
              NISM SERIES V-A
            </div>

            <h2>
              Start your Mutual Fund Distributor preparation.
            </h2>

            <p>
              Learn the concepts. Practice the questions. Test your
              understanding.
            </p>
          </div>

          <Link href="/nism/v-a" className="nism-primary-btn">
            Start Preparation
          </Link>

        </div>
      </section>


      {/* DISCLAIMER */}
      <section className="nism-disclaimer">
        <div className="nism-container">
          <p>
            <strong>Disclaimer:</strong> This website provides independent
            educational and practice resources. It is not affiliated with,
            sponsored by, or endorsed by NISM unless explicitly stated.
            Candidates should refer to official NISM resources for the
            latest examination rules, syllabus, registration information
            and study material.
          </p>
        </div>
      </section>

    </main>
  );
}
