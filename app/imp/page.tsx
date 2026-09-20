import Link from "next/link";
import EnquiryForm from "../../components/EnquiryForm";
import styles from "./IMP.module.css";

export const metadata = {
  title: "IMP | Intelligent Model Portfolio | Aravind Chaudhary",
  description:
    "Explore IMP — Intelligent Model Portfolio, a research-driven and disciplined approach to long-term investing.",
};

const performance = [
  {
    client: "Client 09",
    investment: "₹2.50 Lakh",
    value: "₹2.66 Lakh",
    returnValue: "6.40%",
    date: "9 July 2026",
  },
  {
    client: "Client 10",
    investment: "₹3.50 Lakh",
    value: "₹3.60 Lakh",
    returnValue: "2.86%",
    date: "5 August 2026",
  },
  {
    client: "Client 11",
    investment: "₹5.00 Lakh",
    value: "₹5.40 Lakh",
    returnValue: "8.00%",
    date: "13 July 2026",
  },
  {
    client: "Client 12",
    investment: "₹50.00 Lakh",
    value: "₹60.00 Lakh",
    returnValue: "20.00%",
    date: "12 May 2026",
  },
  {
    client: "Client 13",
    investment: "₹1.80 Crore",
    value: "₹2.10 Crore",
    returnValue: "16.67%",
    date: "1 May 2026",
  },
];

const testimonials = [
  {
    name: "Bhavesh Patel",
    title: "Confidence to Continue & Top Up",
    text: "The structured approach and regular monitoring have given me confidence in continuing with IMP. I am also considering increasing my investment through a top-up.",
  },
  {
    name: "Mukesh Thakkar",
    title: "A Disciplined Investment Approach",
    text: "I appreciate the research-driven approach and disciplined investment process. It gives me better clarity about how my investment is being approached.",
  },
  {
    name: "Nikita Patel",
    title: "Simple, Clear & Structured",
    text: "IMP has made my investment journey easier to understand. The structured approach and regular updates help me remain focused on my long-term financial goals.",
  },
  {
    name: "Vishnubhai Thakkar",
    title: "Positive Investment Experience",
    text: "My experience with IMP has been positive. I value the research and disciplined approach and am comfortable continuing my investment journey.",
  },
  {
    name: "Vimleshbhai Desai",
    title: "Looking to Increase My Investment",
    text: "The experience so far has given me confidence in the approach. I am interested in increasing my investment as part of my long-term wealth-building plan.",
  },
  {
    name: "Vikrambhai Chaudhary",
    title: "Research-Driven Investing",
    text: "I like the focus on research, discipline and long-term thinking. IMP provides a structured way to participate in the equity market.",
  },
];

const process = [
  {
    number: "01",
    title: "Understand",
    text: "Understand the investor's goals, time horizon, expectations and risk considerations.",
  },
  {
    number: "02",
    title: "Research",
    text: "Study businesses, sectors, valuations, market conditions and relevant investment opportunities.",
  },
  {
    number: "03",
    title: "Build",
    text: "Create a structured portfolio based on the selected investment approach and available opportunities.",
  },
  {
    number: "04",
    title: "Monitor",
    text: "Review portfolio developments and reassess investments as market and business conditions change.",
  },
  {
    number: "05",
    title: "Review & Evolve",
    text: "Investments can be reviewed over time as goals, portfolio conditions and investor requirements evolve.",
  },
];

const philosophy = [
  {
    icon: "01",
    title: "Research First",
    text: "Investment decisions should be supported by research rather than short-term market noise.",
  },
  {
    icon: "02",
    title: "Quality Matters",
    text: "Focus on understanding the underlying business, opportunity and long-term potential.",
  },
  {
    icon: "03",
    title: "Discipline",
    text: "A structured process can help investors avoid making decisions purely because of emotions or market headlines.",
  },
  {
    icon: "04",
    title: "Risk Awareness",
    text: "Every market-linked investment carries risk. Risk needs to be understood and managed within the overall strategy.",
  },
  {
    icon: "05",
    title: "Long-Term Thinking",
    text: "The objective is to build an approach that can support long-term wealth-creation goals.",
  },
  {
    icon: "06",
    title: "Continuous Review",
    text: "Markets and businesses change, so portfolios should be reviewed rather than treated as permanently fixed.",
  },
];

export default function IMPPage() {
  return (
    <main className={styles.page}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroGlowOne}></div>
        <div className={styles.heroGlowTwo}></div>

        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <div className={styles.eyebrow}>
                INTELLIGENT MODEL PORTFOLIO
              </div>

              <h1>
                Let Your Money
                <span> Work Smarter.</span>
              </h1>

              <p className={styles.heroLead}>
                A structured, research-driven investment approach designed to
                help investors participate in the equity market with greater
                discipline, clarity and long-term perspective.
              </p>

              <div className={styles.heroButtons}>
                <Link href="#enquire" className={styles.primaryButton}>
                  Explore IMP
                  <span>→</span>
                </Link>

                <Link href="#performance" className={styles.secondaryButton}>
                  View Performance
                </Link>
              </div>

              <div className={styles.heroNote}>
                <span>✓</span>
                Research-driven &nbsp;•&nbsp; Disciplined &nbsp;•&nbsp;
                Long-term focused
              </div>
            </div>

            <div className={styles.heroCard}>
              <div className={styles.heroCardTop}>
                <span>IMP</span>
                <span className={styles.liveDot}>●</span>
              </div>

              <div className={styles.heroCardTitle}>
                Intelligent
                <br />
                Model Portfolio
              </div>

              <div className={styles.heroCardLine}></div>

              <div className={styles.heroMiniStats}>
                <div>
                  <strong>50+</strong>
                  <span>Investor Relationships*</span>
                </div>

                <div>
                  <strong>Research</strong>
                  <span>Driven Approach</span>
                </div>
              </div>

              <div className={styles.heroQuote}>
                “Disciplined investing starts with informed decisions.”
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className={styles.trustStrip}>
        <div className={styles.container}>
          <div className={styles.trustGrid}>
            <div>
              <strong>50+</strong>
              <span>Investor Relationships*</span>
            </div>

            <div>
              <strong>Research</strong>
              <span>Driven Approach</span>
            </div>

            <div>
              <strong>Long-Term</strong>
              <span>Wealth Focus</span>
            </div>

            <div>
              <strong>Disciplined</strong>
              <span>Investment Process</span>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IS IMP */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionLabel}>UNDERSTANDING IMP</span>
            <h2>
              What is <span>IMP?</span>
            </h2>
            <p>
              IMP stands for Intelligent Model Portfolio — a structured
              approach to investing that combines research, portfolio
              construction, monitoring and long-term thinking.
            </p>
          </div>

          <div className={styles.introGrid}>
            <div className={styles.introMain}>
              <h3>
                Investing is not just about finding a stock.
                <br />
                It is about building a process.
              </h3>

              <p>
                Markets constantly move. Businesses evolve. Investor emotions
                change. IMP is designed around a disciplined process that
                focuses on understanding opportunities rather than simply
                reacting to market movements.
              </p>

              <p>
                The approach aims to bring together research, portfolio
                discipline and continuous review so investors can make more
                informed long-term decisions.
              </p>

              <div className={styles.highlightBox}>
                <span>IMP Philosophy</span>
                <strong>
                  Research → Discipline → Strategy → Review → Long-Term
                  Perspective
                </strong>
              </div>
            </div>

            <div className={styles.introSide}>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>01</div>
                <h4>Not Market Noise</h4>
                <p>
                  The focus is on research and a structured investment
                  approach rather than reacting to every market headline.
                </p>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>02</div>
                <h4>Not a Return Promise</h4>
                <p>
                  Market-linked investments carry risk. IMP does not guarantee
                  returns or eliminate investment risk.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={`${styles.section} ${styles.darkSection}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionLabel}>THE PROCESS</span>
            <h2>
              How <span>IMP Works</span>
            </h2>
            <p>
              A simple framework designed to bring structure and discipline to
              the investment journey.
            </p>
          </div>

          <div className={styles.processGrid}>
            {process.map((item) => (
              <div className={styles.processCard} key={item.number}>
                <div className={styles.processNumber}>{item.number}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY IMP */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionLabel}>WHY A STRUCTURED APPROACH</span>
            <h2>
              Built Around <span>Intelligent Investing</span>
            </h2>
            <p>
              IMP focuses on the process behind an investment decision — not
              simply the investment itself.
            </p>
          </div>

          <div className={styles.philosophyGrid}>
            {philosophy.map((item) => (
              <div className={styles.philosophyCard} key={item.number}>
                <div className={styles.philosophyNumber}>{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PERFORMANCE */}
      <section
        id="performance"
        className={`${styles.section} ${styles.performanceSection}`}
      >
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionLabel}>CLIENT PERFORMANCE SNAPSHOTS</span>
            <h2>
              Real Client <span>Performance</span>
            </h2>
            <p>
              Selected client investment snapshots supplied for this page.
            </p>
          </div>

          <div className={styles.performanceGrid}>
            {performance.map((item) => (
              <div className={styles.performanceCard} key={item.client}>
                <div className={styles.performanceTop}>
                  <span>{item.client}</span>
                  <span className={styles.returnBadge}>
                    {item.returnValue}
                  </span>
                </div>

                <div className={styles.performanceValues}>
                  <div>
                    <span>Investment</span>
                    <strong>{item.investment}</strong>
                  </div>

                  <div className={styles.arrow}>→</div>

                  <div>
                    <span>Value Shown</span>
                    <strong>{item.value}</strong>
                  </div>
                </div>

                <div className={styles.performanceDate}>
                  Investment date: <strong>{item.date}</strong>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.performanceNote}>
            <strong>Important:</strong> These figures are based on client
            information supplied for this website page. The valuation date and
            benchmark were not supplied with the figures. Past performance is
            not indicative of future results. Market-linked investments are
            subject to market risks.
          </div>
        </div>
      </section>

      {/* TOP UP */}
      <section className={styles.topupSection}>
        <div className={styles.container}>
          <div className={styles.topupGrid}>
            <div>
              <span className={styles.sectionLabel}>CONTINUE YOUR JOURNEY</span>
              <h2>
                Happy With Your IMP Experience?
                <span> Explore a Top-Up.</span>
              </h2>

              <p>
                As your financial goals and investment capacity evolve, you may
                wish to review whether additional investment is appropriate for
                your overall financial plan.
              </p>
            </div>

            <div className={styles.topupAction}>
              <Link href="#enquire" className={styles.primaryButton}>
                Discuss Top-Up
                <span>→</span>
              </Link>

              <small>
                Top-up decisions should be based on your financial goals,
                suitability and risk considerations.
              </small>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionLabel}>INVESTOR EXPERIENCE</span>
            <h2>
              What IMP Investors <span>Value</span>
            </h2>

            <p>
              Feedback themes from IMP investors, presented as draft summaries
              for client approval before publication.
            </p>
          </div>

          <div className={styles.testimonialGrid}>
            {testimonials.map((item) => (
              <article className={styles.testimonialCard} key={item.name}>
                <div className={styles.quoteMark}>“</div>

                <div className={styles.stars}>★★★★★</div>

                <h3>{item.title}</h3>

                <p>{item.text}</p>

                <div className={styles.testimonialPerson}>
                  <div className={styles.avatar}>
                    {item.name.charAt(0)}
                  </div>

                  <div>
                    <strong>{item.name}</strong>
                    <span>IMP Investor</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.testimonialNote}>
            <strong>Client approval:</strong> Testimonial wording should be
            reviewed and approved by the respective client before publication.
          </div>
        </div>
      </section>

      {/* WHO IS IT FOR */}
      <section className={`${styles.section} ${styles.softSection}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionLabel}>IS IMP RIGHT FOR YOU?</span>
            <h2>
              IMP May Be Relevant For <span>Investors Who...</span>
            </h2>
          </div>

          <div className={styles.suitabilityGrid}>
            <div>
              <span>✓</span>
              Want a structured approach to equity investing
            </div>

            <div>
              <span>✓</span>
              Prefer research over short-term market noise
            </div>

            <div>
              <span>✓</span>
              Have a long-term investment perspective
            </div>

            <div>
              <span>✓</span>
              Want regular portfolio review and monitoring
            </div>

            <div>
              <span>✓</span>
              Understand that equity investments carry market risk
            </div>

            <div>
              <span>✓</span>
              Want to discuss portfolio allocation before investing
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="enquire" className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaBox}>
            <div>
              <span className={styles.sectionLabel}>READY TO EXPLORE IMP?</span>

              <h2>
                Your Money Deserves
                <br />
                <span>an Intelligent Approach.</span>
              </h2>

              <p>
                Share your investment requirements and let&apos;s understand
                whether the IMP approach is suitable for your financial goals.
              </p>

              <div className={styles.ctaPoints}>
                <span>✓ Understand</span>
                <span>✓ Analyse</span>
                <span>✓ Plan</span>
                <span>✓ Invest</span>
                <span>✓ Review</span>
              </div>
            </div>

            <div className={styles.ctaMiniCard}>
              <strong>IMP</strong>
              <span>Intelligent Model Portfolio</span>
              <small>Research • Discipline • Long-Term Perspective</small>
            </div>
          </div>

          <div className={styles.formWrapper}>
            <EnquiryForm />
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className={styles.disclaimer}>
        <div className={styles.container}>
          <h3>Important Information</h3>

          <p>
            IMP is a market-linked investment approach. Investments are
            subject to market risks and there is no assurance that any
            investment objective will be achieved. Past performance is not
            indicative of future results. Investors should consider their
            financial goals, risk profile, investment horizon and suitability
            before making any investment decision.
          </p>

          <p>
            Performance figures displayed on this page are based on information
            supplied for the website and should not be interpreted as a promise,
            guarantee or projection of future returns.
          </p>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className={styles.bottomBar}>
        <div className={styles.container}>
          <span>
            Want to know whether IMP fits your investment requirements?
          </span>

          <Link href="#enquire">Start a Conversation →</Link>
        </div>
      </section>
    </main>
  );
}
