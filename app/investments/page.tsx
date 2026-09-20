import Link from "next/link"
import styles from "./Investments.module.css"


const products = [
  {
    icon: "📈",
    title: "Mutual Funds & SIP",
    tag: "START & GROW",
    ticket: "Scheme Specific",
    description:
      "Diversified market-linked investing through professionally managed mutual fund schemes.",
    suitable:
      "Investors looking for disciplined, diversified and goal-oriented investing.",
    points: [
      "Professional fund management",
      "Diversification",
      "SIP for regular investing",
      "Multiple categories and strategies",
    ],
  },
  {
    icon: "💹",
    title: "Equity / Demat",
    tag: "DIRECT INVESTING",
    ticket: "No Universal Minimum",
    description:
      "Invest directly in listed securities through a Demat and trading account.",
    suitable:
      "Investors who want direct participation in listed companies and securities.",
    points: [
      "Electronic holding of securities",
      "Direct equity participation",
      "Digital portfolio tracking",
      "Convenient buying and selling",
    ],
  },
  {
    icon: "🎯",
    title: "PMS",
    tag: "₹50 LAKH+",
    ticket: "₹50 Lakh",
    description:
      "A structured portfolio management approach based on a defined investment strategy.",
    suitable:
      "Eligible investors who understand portfolio and strategy-specific risks.",
    points: [
      "Defined investment strategy",
      "Professional portfolio management",
      "Focused portfolio construction",
      "Portfolio monitoring",
    ],
  },
  {
    icon: "🏛️",
    title: "AIF",
    tag: "ALTERNATIVE",
    ticket: "Generally ₹1 Crore",
    description:
      "Alternative investment structures offering strategy-specific opportunities beyond conventional products.",
    suitable:
      "Eligible investors with higher investment capacity and understanding of alternative investments.",
    points: [
      "Alternative strategies",
      "Potential diversification",
      "Private-market opportunities",
      "Strategy-specific portfolios",
    ],
  },
  {
    icon: "🔷",
    title: "SIF",
    tag: "SPECIALIZED",
    ticket: "₹10 Lakh",
    description:
      "Specialized investment strategies within the mutual-fund regulatory framework.",
    suitable:
      "Investors who understand specialized strategies, risks and liquidity.",
    points: [
      "Specialized strategies",
      "Structured approach",
      "Permitted investment opportunities",
      "Strategy-focused investing",
    ],
  },
]

const process = [
  {
    number: "01",
    title: "Understand",
    text: "Understand your financial goal, investment horizon and liquidity requirement.",
  },
  {
    number: "02",
    title: "Assess",
    text: "Consider your risk profile, investment capacity and existing portfolio.",
  },
  {
    number: "03",
    title: "Compare",
    text: "Compare strategy, risk, liquidity, cost and historical performance.",
  },
  {
    number: "04",
    title: "Implement",
    text: "Complete the appropriate investment and account-opening process.",
  },
  {
    number: "05",
    title: "Review",
    text: "Review your portfolio periodically as your goals and circumstances change.",
  },
]

export default function Investments() {
  return (
    <main className={styles.page}>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>
            INVESTMENT SOLUTIONS
          </span>

          <h1>
            Invest With
            <span> Knowledge. Strategy. Discipline.</span>
          </h1>

          <p>
            Explore Mutual Funds, SIP, Equity, Demat, PMS, AIF and SIF
            solutions based on your goals, risk profile and investment
            horizon.
          </p>

          <div className={styles.heroButtons}>
            <a
              href="https://wa.me/919173334069?text=Hello%20Aravind%2C%20I%20want%20to%20discuss%20investment%20options."
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryButton}
            >
              Discuss Your Investment
            </a>

            <a
              href="#investment-options"
              className={styles.secondaryButton}
            >
              Explore Options ↓
            </a>
          </div>
        </div>
      </section>


      {/* INTRO */}
      <section className={styles.intro}>
        <div>
          <span className={styles.sectionLabel}>
            EXPLORE
          </span>

          <h2>
            Different Goals.
            <br />
            Different Investment Solutions.
          </h2>
        </div>

        <p>
          There is no single investment product that is suitable for every
          investor. The right approach depends on your financial objective,
          investment amount, risk tolerance, liquidity needs and time horizon.
        </p>
      </section>


      {/* PRODUCT CARDS */}
      <section
        id="investment-options"
        className={styles.productsSection}
      >
        <div className={styles.sectionHeading}>
          <span className={styles.sectionLabel}>
            INVESTMENT OPTIONS
          </span>

          <h2>
            Explore Your Investment Universe
          </h2>

          <p>
            Understand what each investment category does before making an
            investment decision.
          </p>
        </div>


        <div className={styles.productGrid}>

          {products.map((product) => (
            <article
              className={styles.productCard}
              key={product.title}
            >
              <div className={styles.cardTop}>
                <div className={styles.productIcon}>
                  {product.icon}
                </div>

                <span className={styles.productTag}>
                  {product.tag}
                </span>
              </div>

              <h3>{product.title}</h3>

              <p className={styles.description}>
                {product.description}
              </p>

              <div className={styles.ticketBox}>
                <span>MINIMUM / TYPICAL TICKET</span>
                <strong>{product.ticket}</strong>
              </div>

              <div className={styles.cardBlock}>
                <h4>Key Benefits</h4>

                <ul>
                  {product.points.map((point) => (
                    <li key={point}>
                      <span>✓</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.suitableBox}>
                <strong>Suitable for</strong>
                <p>{product.suitable}</p>
              </div>

              <div className={styles.howItWorks}>
                <span>HOW IT WORKS</span>
                <p>
                  Select a suitable strategy, complete the required
                  documentation and invest according to the applicable
                  product terms.
                </p>
              </div>
            </article>
          ))}

        </div>
      </section>


      {/* QUICK COMPARISON */}
      <section className={styles.compareSection}>

        <div className={styles.sectionHeading}>
          <span className={styles.sectionLabel}>
            QUICK VIEW
          </span>

          <h2>Investment Options At A Glance</h2>
        </div>

        <div className={styles.compareGrid}>

          <div className={styles.compareCard}>
            <span>01</span>
            <strong>Mutual Funds & SIP</strong>
            <p>Regular & diversified investing</p>
          </div>

          <div className={styles.compareCard}>
            <span>02</span>
            <strong>Equity / Demat</strong>
            <p>Direct market participation</p>
          </div>

          <div className={styles.compareCard}>
            <span>03</span>
            <strong>PMS</strong>
            <p>₹50 lakh+ portfolio approach</p>
          </div>

          <div className={styles.compareCard}>
            <span>04</span>
            <strong>AIF</strong>
            <p>Alternative investment strategies</p>
          </div>

          <div className={styles.compareCard}>
            <span>05</span>
            <strong>SIF</strong>
            <p>Specialized investment strategies</p>
          </div>

        </div>
      </section>


      {/* PROCESS */}
      <section className={styles.processSection}>

        <div className={styles.sectionHeading}>
          <span className={styles.sectionLabel}>
            OUR APPROACH
          </span>

          <h2>
            From Goal To Investment
          </h2>

          <p>
            A simple process designed to make investment decisions easier to
            understand.
          </p>
        </div>

        <div className={styles.processGrid}>
          {process.map((item) => (
            <div
              className={styles.processCard}
              key={item.number}
            >
              <span>{item.number}</span>

              <h3>{item.title}</h3>

              <p>{item.text}</p>
            </div>
          ))}
        </div>

      </section>


      {/* DEMAT */}
      <section className={styles.dematSection}>

        <div className={styles.dematContent}>

          <span className={styles.sectionLabel}>
            EQUITY & DEMAT
          </span>

          <h2>
            Want To Start Your Direct
            <br />
            Equity Journey?
          </h2>

          <p>
            A Demat account enables you to hold eligible securities
            electronically. A trading account can be used to buy and sell
            securities through the applicable platform.
          </p>

          <div className={styles.dematFeatures}>

            <div>
              <strong>✓</strong>
              <span>Electronic holding</span>
            </div>

            <div>
              <strong>✓</strong>
              <span>Portfolio tracking</span>
            </div>

            <div>
              <strong>✓</strong>
              <span>Digital transactions</span>
            </div>

            <div>
              <strong>✓</strong>
              <span>Research & market access</span>
            </div>

          </div>

          <p className={styles.smallNote}>
            Features, charges, eligibility and services depend on the
            selected provider and applicable terms.
          </p>

          <a
            href="https://wa.me/919173334069?text=Hello%20Aravind%2C%20I%20want%20to%20open%20a%20Demat%20account."
            target="_blank"
            rel="noopener noreferrer"
            className={styles.primaryButton}
          >
            Open Demat Account
          </a>

        </div>

        <div className={styles.dematVisual}>
          <div className={styles.visualCircle}>
            <span>₹</span>
          </div>

          <div className={styles.floatingCard}>
            <small>INVESTMENT</small>
            <strong>Knowledge → Strategy → Action</strong>
          </div>
        </div>

      </section>


      {/* PAST PERFORMANCE */}
      <section className={styles.performanceSection}>

        <div className={styles.sectionHeading}>
          <span className={styles.sectionLabel}>
            RESEARCH & COMPARISON
          </span>

          <h2>
            Past Performance Matters —
            <br />
            But Context Matters More.
          </h2>

          <p>
            Historical performance can provide context, but different products
            have different strategies, risk levels, benchmarks and time periods.
          </p>
        </div>


        <div className={styles.performanceGrid}>

          <div className={styles.performanceCard}>
            <div className={styles.performanceIcon}>📊</div>

            <h3>PMS</h3>

            <p>
              Review performance across multiple periods and compare it with
              the relevant benchmark and strategy.
            </p>

            <ul>
              <li>1-year performance</li>
              <li>3-year performance</li>
              <li>5-year performance</li>
              <li>Risk & volatility</li>
            </ul>
          </div>


          <div className={styles.performanceCard}>
            <div className={styles.performanceIcon}>🏛️</div>

            <h3>AIF</h3>

            <p>
              AIF strategies can differ significantly, so evaluation should be
              strategy-specific.
            </p>

            <ul>
              <li>Fund strategy</li>
              <li>Track record</li>
              <li>Liquidity</li>
              <li>Fees & risk</li>
            </ul>
          </div>


          <div className={styles.performanceCard}>
            <div className={styles.performanceIcon}>🔷</div>

            <h3>SIF</h3>

            <p>
              Consider the strategy, benchmark, inception period and market
              conditions when reviewing historical returns.
            </p>

            <ul>
              <li>Strategy objective</li>
              <li>Benchmark</li>
              <li>Since inception</li>
              <li>Risk profile</li>
            </ul>
          </div>


          <div className={styles.performanceCard}>
            <div className={styles.performanceIcon}>📈</div>

            <h3>Mutual Funds</h3>

            <p>
              Evaluate funds using category, benchmark, costs, portfolio and
              performance across market cycles.
            </p>

            <ul>
              <li>Category</li>
              <li>Benchmark</li>
              <li>Expense ratio</li>
              <li>Market-cycle performance</li>
            </ul>
          </div>

        </div>

      </section>


      {/* GOAL SECTION */}
      <section className={styles.goalSection}>

        <div>
          <span className={styles.sectionLabel}>
            START WITH WHY
          </span>

          <h2>
            Your Investment Should
            <br />
            Have A Purpose.
          </h2>

          <p>
            Whether the goal is wealth creation, retirement, children's
            education, regular income or portfolio diversification, the
            investment strategy should begin with the objective.
          </p>
        </div>


        <div className={styles.goalGrid}>

          <span>Wealth Creation</span>
          <span>Retirement</span>
          <span>Education</span>
          <span>Regular Income</span>
          <span>Portfolio Diversification</span>
          <span>Direct Equity</span>

        </div>

      </section>


      {/* CTA */}
      <section className={styles.ctaSection}>

        <span className={styles.sectionLabel}>
          LET'S TALK
        </span>

        <h2>
          Not Sure Which Investment
          <br />
          Option Is Right For You?
        </h2>

        <p>
          Share your investment requirement and understand the available
          investment categories, their features, risks and suitability.
        </p>

        <div className={styles.ctaButtons}>

          <a
            href="https://wa.me/919173334069?text=Hello%20Aravind%2C%20I%20want%20to%20discuss%20investment%20options."
            target="_blank"
            rel="noopener noreferrer"
            className={styles.primaryButton}
          >
            WhatsApp Us
          </a>

          <a
            href="tel:+919173334069"
            className={styles.secondaryButtonDark}
          >
            Call +91 91733 34069
          </a>

        </div>

      </section>


      {/* DISCLAIMER */}
      <section className={styles.disclaimer}>

        <strong>Important:</strong>{" "}

        Investments are subject to market risks. Past performance does not
        indicate future results. Minimum investment amounts, product features,
        charges, eligibility and regulatory requirements may change. Investors
        should review the latest official product documents and assess
        suitability before investing.

      </section>

    </main>
  )
}
