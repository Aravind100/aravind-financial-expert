import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="about-page">

      {/* HERO */}
      <section className="about-hero">
        <div className="about-hero-content">

          <div className="about-photo-wrap">
            <img
              src="/aravind-chaudhary.png"
              alt="Aravind Chaudhary - Financial Services Professional"
              className="about-photo"
            />
          </div>

          <div className="about-intro">

            <span className="about-eyebrow">
              FINANCIAL SERVICES & WEALTH SOLUTIONS
            </span>

            <h1>
              Meet <span>Aravind Chaudhary</span>
            </h1>

            <h2>
              Helping people understand finance and make more informed
              financial decisions.
            </h2>

            <p>
              I am a financial-services professional focused on helping
              individuals, families, investors and entrepreneurs understand
              financial products, investment opportunities and protection
              solutions in a simpler and more structured way.
            </p>

            <p>
              My professional journey has given me exposure to technology,
              insurance, financial services, business development and
              relationship management. This experience has shaped my approach:
              financial decisions should begin with understanding the
              requirement, evaluating available options and understanding the
              associated risks.
            </p>

            <div className="about-buttons">
              <Link href="/contact" className="about-primary-btn">
                Send Your Requirement
              </Link>

              <a
                href="https://wa.me/919173334069"
                target="_blank"
                rel="noopener noreferrer"
                className="about-secondary-btn"
              >
                Connect on WhatsApp
              </a>
            </div>

          </div>
        </div>
      </section>


      {/* ABOUT ME */}
      <section className="about-section">
        <div className="about-container">

          <div className="section-heading">
            <span>ABOUT ME</span>
            <h2>Finance should be easier to understand.</h2>
          </div>

          <div className="about-text-grid">

            <div>
              <p>
                Financial decisions can often feel complicated because there
                are many products, options, risks and terms to understand.
                My objective is to make that information easier to explore
                and understand.
              </p>

              <p>
                I work with individuals, families, investors and business
                owners to understand their financial requirements and explore
                relevant financial solutions.
              </p>
            </div>

            <div>
              <p>
                My approach is focused on education, information and
                relationship building. Instead of looking at a financial
                product in isolation, I believe it is important to first
                understand the requirement and then evaluate suitable options.
              </p>

              <p>
                Through this website, I am building a single platform where
                people can explore financial information, investment concepts,
                insurance awareness and various financial solutions.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* AREAS OF FOCUS */}
      <section className="about-section about-light">
        <div className="about-container">

          <div className="section-heading center">
            <span>AREAS OF FOCUS</span>
            <h2>Financial solutions across different needs.</h2>
            <p>
              Explore information and solutions across investment, protection
              and financing requirements.
            </p>
          </div>

          <div className="focus-grid">

            <div className="focus-card">
              <div className="focus-icon">📈</div>
              <h3>Investments & Wealth</h3>
              <ul>
                <li>Equity & Demat</li>
                <li>Mutual Funds</li>
                <li>SIP</li>
                <li>PMS</li>
                <li>AIF</li>
                <li>SIF</li>
                <li>IMP – Intelligent Model Portfolio</li>
              </ul>
            </div>

            <div className="focus-card">
              <div className="focus-icon">🛡️</div>
              <h3>Insurance & Protection</h3>
              <ul>
                <li>Life Insurance</li>
                <li>Term Insurance</li>
                <li>Health Insurance</li>
                <li>General Insurance</li>
                <li>Protection planning</li>
              </ul>
            </div>

            <div className="focus-card">
              <div className="focus-icon">🏠</div>
              <h3>Loans & Financing</h3>
              <ul>
                <li>Home Loans</li>
                <li>Business Loans</li>
                <li>Personal Loans</li>
                <li>Financing requirements</li>
                <li>Business financial solutions</li>
              </ul>
            </div>

            <div className="focus-card">
              <div className="focus-icon">📚</div>
              <h3>Financial Awareness</h3>
              <ul>
                <li>Investor education</li>
                <li>Financial awareness</li>
                <li>Investment concepts</li>
                <li>Market information</li>
                <li>Understanding financial products</li>
              </ul>
            </div>

          </div>
        </div>
      </section>


      {/* MY APPROACH */}
      <section className="about-section">
        <div className="about-container">

          <div className="section-heading center">
            <span>MY APPROACH</span>
            <h2>Understand. Analyse. Educate. Guide. Support.</h2>
          </div>

          <div className="approach-grid">

            <div className="approach-card">
              <strong>01</strong>
              <h3>Understand</h3>
              <p>
                Understand your financial requirement, objective, time horizon
                and priorities.
              </p>
            </div>

            <div className="approach-card">
              <strong>02</strong>
              <h3>Analyse</h3>
              <p>
                Explore available options and understand their features,
                benefits, risks and suitability.
              </p>
            </div>

            <div className="approach-card">
              <strong>03</strong>
              <h3>Educate</h3>
              <p>
                Make complex financial concepts easier to understand so you
                can make informed decisions.
              </p>
            </div>

            <div className="approach-card">
              <strong>04</strong>
              <h3>Guide</h3>
              <p>
                Help you navigate relevant financial solutions based on your
                requirements.
              </p>
            </div>

            <div className="approach-card">
              <strong>05</strong>
              <h3>Support</h3>
              <p>
                Build a long-term relationship with ongoing communication and
                financial awareness.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* PROFESSIONAL JOURNEY */}
      <section className="about-section about-dark">
        <div className="about-container">

          <div className="journey-content">

            <div className="section-heading">
              <span>PROFESSIONAL JOURNEY</span>
              <h2>A journey across technology, insurance and financial services.</h2>
            </div>

            <p>
              My professional journey has included exposure to multiple
              industries and functions, including technology, foreign
              education, insurance and financial services.
            </p>

            <p>
              These experiences have helped me develop an understanding of
              customer requirements, relationship management, business
              development and financial-services distribution.
            </p>

            <p>
              Today, my focus is on creating awareness around financial
              products and helping people explore financial solutions through
              a structured and customer-focused approach.
            </p>

          </div>
        </div>
      </section>


      {/* PERSONAL PHILOSOPHY */}
      <section className="about-section">
        <div className="about-container">

          <div className="philosophy-box">

            <span>MY PHILOSOPHY</span>

            <h2>
              "Better financial decisions begin with better financial
              understanding."
            </h2>

            <p>
              My goal is not simply to introduce financial products. It is to
              make financial information easier to understand, help people ask
              the right questions and provide access to relevant financial
              solutions.
            </p>

          </div>

        </div>
      </section>


      {/* CTA */}
      <section className="about-cta">

        <div className="about-cta-content">

          <span>LET'S CONNECT</span>

          <h2>
            Have a financial requirement?
          </h2>

          <p>
            Whether you are exploring investments, insurance, loans or simply
            looking for financial information, feel free to reach out.
          </p>

          <div className="about-buttons">

            <Link href="/contact" className="about-primary-btn">
              Send Your Requirement
            </Link>

            <a
              href="tel:+919173334069"
              className="about-secondary-btn"
            >
              Call Me
            </a>

          </div>

        </div>

      </section>

    </main>
  );
}
