import Link from "next/link";
import EnquiryForm from "../../components/EnquiryForm";
import styles from "./IMP.module.css";

export const metadata = {
  title: "IMP | Intelligent Model Portfolio | Aravind Chaudhary",
  description:
    "Explore IMP - Intelligent Model Portfolio, a structured and research-driven approach to long-term investing.",
};

const process = [
  {
    number: "01",
    title: "Understand",
    text: "Understand the investor's goals, investment horizon, requirements and risk considerations.",
  },
  {
    number: "02",
    title: "Research",
    text: "Study businesses, sectors, market conditions, valuations and relevant investment opportunities.",
  },
  {
    number: "03",
    title: "Build",
    text: "Build a structured portfolio based on the selected investment approach and available opportunities.",
  },
  {
    number: "04",
    title: "Monitor",
    text: "Review portfolio developments and reassess investments as market and business conditions change.",
  },
  {
    number: "05",
    title: "Review",
    text: "Regularly review the portfolio and discuss changes as investment goals and market conditions evolve.",
  },
];

const philosophy = [
  {
    icon: "📊",
    title: "Research Driven",
    text: "Investment decisions are supported by research rather than short-term market noise.",
  },
  {
    icon: "🎯",
    title: "Focused Approach",
    text: "The portfolio approach focuses on identifying and understanding selected investment opportunities.",
  },
  {
    icon: "🧭",
    title: "Discipline",
    text: "A structured process can help investors avoid reacting emotionally to short-term market movements.",
  },
  {
    icon: "🛡️",
    title: "Risk Awareness",
    text: "Market-linked investments carry risk. Risk considerations remain an important part of the investment process.",
  },
  {
    icon: "📈",
    title: "Long-Term Thinking",
    text: "IMP is designed around a long-term perspective rather than short-term market predictions.",
  },
  {
    icon: "🔄",
    title: "Continuous Review",
    text: "Markets and businesses change, so investments need to be reviewed as circumstances evolve.",
  },
];

const performance = [
  {
    client: "Client 09",
    investment: "₹2,50,000",
    value: "₹2,66,000",
    returnValue: "6.40%",
    date: "9 July 2026",
  },
  {
    client: "Client 10",
    investment: "₹3,50,000",
    value: "₹3,60,000",
    returnValue: "2.86%",
    date: "5 August 2026",
  },
  {
    client: "Client 11",
    investment: "₹5,00,000",
    value: "₹5,40,000",
    returnValue: "8.00%",
    date: "13 July 2026",
  },
  {
    client: "Client 12",
    investment: "₹50,00,000",
    value: "₹60,00,000",
    returnValue: "20.00%",
    date: "12 May 2026",
  },
  {
    client: "Client 13",
    investment: "₹1,80,00,000",
    value: "₹2,10,00,000",
    returnValue: "16.67%",
    date: "1 May 2026",
  },
];

const testimonials = [
  {
    name: "Bhavesh Patel",
    title: "Confidence to Continue",
    text: "The structured approach and regular monitoring have given me confidence in continuing with IMP. I am also considering increasing my investment through a top-up.",
  },
  {
    name: "Mukesh Thakkar",
    title: "A Disciplined Approach",
    text: "I appreciate the research-driven approach and disciplined investment process. It gives me better clarity about how my investment is being approached.",
  },
  {
    name: "Nikita Patel",
    title: "Simple & Structured",
    text: "IMP has made my investment journey easier to understand. The structured approach and regular updates help me remain focused on my long-term goals.",
  },
  {
    name: "Vishnubhai Thakkar",
    title: "Positive Experience",
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

export default function IMPPage() {
  return (
    <main className={styles.impPage}>

      {/* ================= HERO ================= */}
      <section className={styles.hero}>
        <div className={`${styles.container} ${styles.heroGrid}`}>
          <div>
            <p className={styles.eyebrow}>
              IMP | INTELLIGENT MODEL PORTFOLIO
            </p>

            <h1 className={styles.heroTitle}>
              Let your money
              <br />
              <span>work smarter.</span>
            </h1>

            <p className={styles.heroText}>
              IMP is a structured, research-driven investment approach designed
              to help investors participate in the equity market with
              discipline, clarity and a long-term perspective.
            </p>

            <div className={styles.heroButtons}>
              <Link href="#enquire" className={styles.primaryButton}>
                Explore IMP
              </Link>

              <Link href="#performance" className={styles.secondaryButton}>
                View Performance
              </Link>
            </div>
          </div>

          <div className={styles.heroCard}>
            <p className={styles.cardLabel}>INTELLIGENT INVESTING</p>

            <h2>
              Research.
              <br />
              Discipline.
              <br />
              Long-term thinking.
            </h2>

            <div className={styles.divider} />

            <div className={styles.miniStats}>
              <div>
                <strong>50+</strong>
                <span>Client relationships*</span>
              </div>

              <div>
                <strong>Research</strong>
                <span>Driven approach</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= INTRODUCTION ================= */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionIntro}>
            <p className={styles.sectionLabel}>UNDERSTANDING IMP</p>

            <h2>
              Investing is not just about
              <br />
              finding a stock.
            </h2>
          </div>

          <div className={styles.twoColumn}>
            <div>
              <p>
                IMP stands for Intelligent Model Portfolio. It is a structured
                approach that combines research, portfolio construction,
                monitoring and long-term thinking.
              </p>

              <p>
                The objective is to bring more structure to the investment
                journey and help investors understand what they own, why they
                own it and how the portfolio is being reviewed.
              </p>
            </div>

            <div>
              <p>
                Markets continuously change. Businesses evolve. Investor
                emotions also change. A disciplined process can help investors
                focus on research and long-term objectives rather than reacting
                to every market movement.
              </p>

              <div className={styles.highlightBox}>
                <strong>
                  Research → Strategy → Discipline → Review
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className={styles.lightSection}>
        <div className={styles.container}>
          <div className={styles.centerHeading}>
            <p className={styles.sectionLabel}>HOW IT WORKS</p>

            <h2>A structured investment process.</h2>

            <p>
              Five simple stages designed to bring discipline to the investment
              journey.
            </p>
          </div>

          <div className={styles.processGrid}>
            {process.map((item) => (
              <div className={styles.simpleCard} key={item.number}>
                <span className={styles.number}>{item.number}</span>

                <h3>{item.title}</h3>

                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PHILOSOPHY ================= */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.centerHeading}>
            <p className={styles.sectionLabel}>IMP PHILOSOPHY</p>

            <h2>
              Intelligent investing starts with a process.
            </h2>
          </div>

          <div className={styles.philosophyGrid}>
            {philosophy.map((item) => (
              <div className={styles.focusItem} key={item.title}>
                <div className={styles.focusIcon}>{item.icon}</div>

                <h3>{item.title}</h3>

                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PERFORMANCE ================= */}
      <section id="performance" className={styles.lightSection}>
        <div className={styles.container}>
          <div className={styles.centerHeading}>
            <p className={styles.sectionLabel}>CLIENT PERFORMANCE</p>

            <h2>Selected client performance snapshots.</h2>

            <p>
              Figures supplied for the IMP page.
            </p>
          </div>

          <div className={styles.performanceGrid}>
            {performance.map((item) => (
              <div className={styles.performanceCard} key={item.client}>
                <div className={styles.performanceHeader}>
                  <strong>{item.client}</strong>

                  <span>{item.returnValue}</span>
                </div>

                <div className={styles.performanceValues}>
                  <div>
                    <small>INVESTMENT</small>
                    <strong>{item.investment}</strong>
                  </div>

                  <span className={styles.arrow}>→</span>

                  <div>
                    <small>VALUE SHOWN</small>
                    <strong>{item.value}</strong>
                  </div>
                </div>

                <small className={styles.date}>
                  Investment date: <strong>{item.date}</strong>
                </small>
              </div>
            ))}
          </div>

          <div className={styles.note}>
            <strong>Important:</strong> Performance figures displayed here are
            based on information supplied for this page. The valuation date and
            benchmark were not supplied with the figures. Past performance is
            not indicative of future results. Market-linked investments are
            subject to market risks.
          </div>
        </div>
      </section>

      {/* ================= INVESTOR EXPERIENCE ================= */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.centerHeading}>
            <p className={styles.sectionLabel}>INVESTOR EXPERIENCE</p>

            <h2>What IMP investors value.</h2>

            <p>
              Investor experience and feedback from the IMP community.
            </p>
          </div>

          <div className={styles.testimonialGrid}>
            {testimonials.map((item) => (
              <div className={styles.testimonialCard} key={item.name}>
                <div className={styles.stars}>★★★★★</div>

                <h3>{item.title}</h3>

                <p>{item.text}</p>

                <div className={styles.person}>
                  <strong>{item.name}</strong>
                  <span>IMP Investor</span>
                </div>
              </div>
            ))}
          </div>

          <p className={styles.approvalNote}>
            Testimonial wording should be reviewed and approved by the
            respective client before publication.
          </p>
        </div>
      </section>

      {/* ================= TOP UP ================= */}
      <section className={styles.topupSection}>
        <div className={styles.container}>
          <div className={styles.centerHeading}>
            <p className={styles.sectionLabel}>CONTINUE YOUR INVESTMENT JOURNEY</p>

            <h2>Happy with your IMP experience?</h2>

            <p>
              If your financial goals and investment capacity have changed, you
              can discuss whether an additional investment or top-up is
              appropriate for your overall financial plan.
            </p>

            <Link href="#enquire" className={styles.primaryButton}>
              Discuss IMP Top-Up
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section id="enquire" className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <p>LET&apos;S CONNECT</p>

            <h2>Want to explore IMP?</h2>

            <p>
              Share your investment requirements and let&apos;s understand
              whether the IMP approach is suitable for your financial goals.
            </p>
          </div>

          <div className={styles.formBox}>
            <EnquiryForm />
          </div>
        </div>
      </section>

      {/* ================= DISCLAIMER ================= */}
      <section className={styles.disclaimer}>
        <div className={styles.container}>
          <h3>Important Information</h3>

          <p>
            IMP is a market-linked investment approach. Investments are subject
            to market risks and there is no assurance that any investment
            objective will be achieved. Past performance is not indicative of
            future results. Investors should consider their financial goals,
            risk profile, investment horizon and suitability before making any
            investment decision.
          </p>
        </div>
      </section>

    </main>
  );
}
