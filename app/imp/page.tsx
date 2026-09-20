import Link from "next/link";
import EnquiryForm from "../../components/EnquiryForm";

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
    client: "Client 1",
    investment: "₹2,50,000",
    value: "₹2,66,000",
    returnValue: "6.40%",
    date: "9 July 2026",
  },
  {
    client: "Client 2",
    investment: "₹3,50,000",
    value: "₹3,60,000",
    returnValue: "2.86%",
    date: "5 August 2026",
  },
  {
    client: "Client 3",
    investment: "₹5,00,000",
    value: "₹5,40,000",
    returnValue: "8.00%",
    date: "13 July 2026",
  },
  {
    client: "Client 4",
    investment: "₹50,00,000",
    value: "₹60,00,000",
    returnValue: "20.00%",
    date: "12 May 2026",
  },
  {
    client: "Client 5",
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
    <main>

      {/* HERO */}
      <section
        style={{
          padding: "70px 20px",
          background:
            "linear-gradient(135deg, #f5fbff 0%, #ffffff 55%, #eef7ff 100%)",
          borderBottom: "1px solid #e5edf5",
        }}
      >
        <div
          style={{
            maxWidth: "1180px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: "50px",
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                color: "#2474c6",
                fontWeight: 700,
                letterSpacing: "1.5px",
                fontSize: "13px",
                marginBottom: "15px",
              }}
            >
              IMP | INTELLIGENT MODEL PORTFOLIO
            </p>

            <h1
              style={{
                fontSize: "clamp(42px, 6vw, 68px)",
                lineHeight: 1.08,
                color: "#071b35",
                margin: "0 0 22px",
                letterSpacing: "-2px",
              }}
            >
              Let your money
              <br />
              <span style={{ color: "#2474c6" }}>work smarter.</span>
            </h1>

            <p
              style={{
                maxWidth: "680px",
                color: "#50657a",
                fontSize: "18px",
                lineHeight: 1.8,
                marginBottom: "28px",
              }}
            >
              IMP is a structured, research-driven investment approach designed
              to help investors participate in the equity market with
              discipline, clarity and a long-term perspective.
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="#enquire"
                style={{
                  display: "inline-block",
                  background: "#2474c6",
                  color: "#ffffff",
                  padding: "13px 23px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                Explore IMP
              </Link>

              <Link
                href="#performance"
                style={{
                  display: "inline-block",
                  background: "#ffffff",
                  color: "#2474c6",
                  padding: "12px 23px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: 700,
                  border: "1px solid #2474c6",
                }}
              >
                View Performance
              </Link>
            </div>
          </div>

          <div
            style={{
              background: "#ffffff",
              border: "1px solid #dfe9f2",
              borderRadius: "18px",
              padding: "35px",
              boxShadow: "0 12px 35px rgba(20,70,110,0.08)",
            }}
          >
            <p
              style={{
                color: "#2474c6",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "1px",
                margin: 0,
              }}
            >
              INTELLIGENT INVESTING
            </p>

            <h2
              style={{
                color: "#071b35",
                fontSize: "30px",
                lineHeight: 1.25,
                margin: "15px 0",
              }}
            >
              Research.
              <br />
              Discipline.
              <br />
              Long-term thinking.
            </h2>

            <div
              style={{
                height: "1px",
                background: "#e5edf5",
                margin: "25px 0",
              }}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <div>
                <strong
                  style={{
                    display: "block",
                    color: "#2474c6",
                    fontSize: "25px",
                  }}
                >
                  50+
                </strong>
                <span style={{ color: "#68798a", fontSize: "12px" }}>
                  Client relationships*
                </span>
              </div>

              <div>
                <strong
                  style={{
                    display: "block",
                    color: "#2474c6",
                    fontSize: "20px",
                  }}
                >
                  Research
                </strong>
                <span style={{ color: "#68798a", fontSize: "12px" }}>
                  Driven approach
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section style={{ padding: "85px 20px" }}>
        <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
          <div style={{ maxWidth: "800px", marginBottom: "45px" }}>
            <p
              style={{
                color: "#2474c6",
                fontWeight: 700,
                fontSize: "13px",
                letterSpacing: "1.5px",
              }}
            >
              UNDERSTANDING IMP
            </p>

            <h2
              style={{
                color: "#071b35",
                fontSize: "clamp(34px, 5vw, 52px)",
                lineHeight: 1.15,
                margin: "12px 0 20px",
              }}
            >
              Investing is not just about
              <br />
              finding a stock.
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "55px",
            }}
          >
            <div>
              <p
                style={{
                  color: "#52677b",
                  lineHeight: 1.85,
                  fontSize: "16px",
                }}
              >
                IMP stands for Intelligent Model Portfolio. It is a structured
                approach that combines research, portfolio construction,
                monitoring and long-term thinking.
              </p>

              <p
                style={{
                  color: "#52677b",
                  lineHeight: 1.85,
                  fontSize: "16px",
                }}
              >
                The objective is to bring more structure to the investment
                journey and help investors understand what they own, why they
                own it and how the portfolio is being reviewed.
              </p>
            </div>

            <div>
              <p
                style={{
                  color: "#52677b",
                  lineHeight: 1.85,
                  fontSize: "16px",
                }}
              >
                Markets continuously change. Businesses evolve. Investor
                emotions also change. A disciplined process can help investors
                focus on research and long-term objectives rather than reacting
                to every market movement.
              </p>

              <div
                style={{
                  marginTop: "25px",
                  padding: "20px",
                  background: "#f3f8fd",
                  borderLeft: "4px solid #2474c6",
                  borderRadius: "5px",
                }}
              >
                <strong style={{ color: "#071b35" }}>
                  Research → Strategy → Discipline → Review
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        style={{
          padding: "85px 20px",
          background: "#f7fbff",
          borderTop: "1px solid #edf2f6",
          borderBottom: "1px solid #edf2f6",
        }}
      >
        <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <p
              style={{
                color: "#2474c6",
                fontWeight: 700,
                fontSize: "13px",
                letterSpacing: "1.5px",
              }}
            >
              HOW IT WORKS
            </p>

            <h2
              style={{
                color: "#071b35",
                fontSize: "clamp(34px, 5vw, 50px)",
                margin: "12px 0",
              }}
            >
              A structured investment process.
            </h2>

            <p style={{ color: "#607487", fontSize: "16px" }}>
              Five simple stages designed to bring discipline to the investment
              journey.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "18px",
            }}
          >
            {process.map((item) => (
              <div
                key={item.number}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e0e9f1",
                  borderRadius: "12px",
                  padding: "25px 20px",
                }}
              >
                <span
                  style={{
                    color: "#2474c6",
                    fontWeight: 800,
                    fontSize: "12px",
                  }}
                >
                  {item.number}
                </span>

                <h3
                  style={{
                    color: "#071b35",
                    fontSize: "20px",
                    margin: "30px 0 10px",
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    color: "#66798b",
                    fontSize: "13px",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section style={{ padding: "85px 20px" }}>
        <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <p
              style={{
                color: "#2474c6",
                fontWeight: 700,
                fontSize: "13px",
                letterSpacing: "1.5px",
              }}
            >
              IMP PHILOSOPHY
            </p>

            <h2
              style={{
                color: "#071b35",
                fontSize: "clamp(34px, 5vw, 50px)",
                margin: "12px 0",
              }}
            >
              Intelligent investing starts with a process.
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "35px",
            }}
          >
            {philosophy.map((item) => (
              <div key={item.title}>
                <div style={{ fontSize: "27px", marginBottom: "12px" }}>
                  {item.icon}
                </div>

                <h3
                  style={{
                    color: "#163d65",
                    fontSize: "19px",
                    margin: "0 0 8px",
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    color: "#718396",
                    fontSize: "14px",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PERFORMANCE */}
      <section
        id="performance"
        style={{
          padding: "85px 20px",
          background: "#f7fbff",
          borderTop: "1px solid #edf2f6",
          borderBottom: "1px solid #edf2f6",
        }}
      >
        <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <p
              style={{
                color: "#2474c6",
                fontWeight: 700,
                fontSize: "13px",
                letterSpacing: "1.5px",
              }}
            >
              CLIENT PERFORMANCE
            </p>

            <h2
              style={{
                color: "#071b35",
                fontSize: "clamp(34px, 5vw, 50px)",
                margin: "12px 0",
              }}
            >
              Selected client performance snapshots.
            </h2>

            <p style={{ color: "#68798a" }}>
              Figures supplied for the IMP page.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "18px",
            }}
          >
            {performance.map((item) => (
              <div
                key={item.client}
                style={{
                  background: "#ffffff",
                  border: "1px solid #dfe8f0",
                  borderRadius: "12px",
                  padding: "25px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #edf1f5",
                    paddingBottom: "15px",
                  }}
                >
                  <strong style={{ color: "#163d65" }}>
                    {item.client}
                  </strong>

                  <span
                    style={{
                      color: "#2474c6",
                      fontWeight: 800,
                      fontSize: "14px",
                    }}
                  >
                    {item.returnValue}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 25px 1fr",
                    gap: "8px",
                    alignItems: "center",
                    padding: "22px 0",
                  }}
                >
                  <div>
                    <small
                      style={{
                        display: "block",
                        color: "#81909d",
                        fontSize: "10px",
                        marginBottom: "5px",
                      }}
                    >
                      INVESTMENT
                    </small>

                    <strong style={{ color: "#071b35" }}>
                      {item.investment}
                    </strong>
                  </div>

                  <div
                    style={{
                      color: "#2474c6",
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    →
                  </div>

                  <div>
                    <small
                      style={{
                        display: "block",
                        color: "#81909d",
                        fontSize: "10px",
                        marginBottom: "5px",
                      }}
                    >
                      VALUE SHOWN
                    </small>

                    <strong style={{ color: "#071b35" }}>
                      {item.value}
                    </strong>
                  </div>
                </div>

                <small style={{ color: "#81909d" }}>
                  Investment date:{" "}
                  <strong style={{ color: "#516678" }}>
                    {item.date}
                  </strong>
                </small>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "25px",
              padding: "18px 20px",
              background: "#ffffff",
              border: "1px solid #e0e8ef",
              borderRadius: "8px",
              color: "#66798b",
              fontSize: "12px",
              lineHeight: 1.7,
            }}
          >
            <strong style={{ color: "#163d65" }}>Important:</strong>{" "}
            Performance figures displayed here are based on information
            supplied for this page. The valuation date and benchmark were not
            supplied with the figures. Past performance is not indicative of
            future results. Market-linked investments are subject to market
            risks.
          </div>
        </div>
      </section>

      {/* INVESTOR EXPERIENCE */}
      <section style={{ padding: "85px 20px" }}>
        <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <p
              style={{
                color: "#2474c6",
                fontWeight: 700,
                fontSize: "13px",
                letterSpacing: "1.5px",
              }}
            >
              INVESTOR EXPERIENCE
            </p>

            <h2
              style={{
                color: "#071b35",
                fontSize: "clamp(34px, 5vw, 50px)",
                margin: "12px 0",
              }}
            >
              What IMP investors value.
            </h2>

            <p style={{ color: "#68798a" }}>
              Investor experience and feedback from the IMP community.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
            }}
          >
            {testimonials.map((item) => (
              <div
                key={item.name}
                style={{
                  border: "1px solid #dfe8f0",
                  borderRadius: "12px",
                  padding: "28px",
                  background: "#ffffff",
                }}
              >
                <div
                  style={{
                    color: "#2474c6",
                    fontSize: "22px",
                    marginBottom: "15px",
                  }}
                >
                  ★★★★★
                </div>

                <h3
                  style={{
                    color: "#163d65",
                    fontSize: "18px",
                    margin: "0 0 12px",
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    color: "#66798b",
                    fontSize: "14px",
                    lineHeight: 1.75,
                    margin: 0,
                  }}
                >
                  “{item.text}”
                </p>

                <div
                  style={{
                    borderTop: "1px solid #edf1f5",
                    marginTop: "20px",
                    paddingTop: "15px",
                  }}
                >
                  <strong
                    style={{
                      display: "block",
                      color: "#071b35",
                      fontSize: "13px",
                    }}
                  >
                    {item.name}
                  </strong>

                  <small style={{ color: "#81909d" }}>
                    IMP Investor
                  </small>
                </div>
              </div>
            ))}
          </div>

          <p
            style={{
              textAlign: "center",
              color: "#8997a3",
              fontSize: "11px",
              marginTop: "22px",
            }}
          >
            Testimonial wording should be reviewed and approved by the
            respective client before publication.
          </p>
        </div>
      </section>

      {/* TOP UP */}
      <section
        style={{
          padding: "70px 20px",
          background: "#f3f8fd",
          borderTop: "1px solid #e2edf6",
          borderBottom: "1px solid #e2edf6",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "#2474c6",
              fontWeight: 700,
              fontSize: "13px",
              letterSpacing: "1.5px",
            }}
          >
            CONTINUE YOUR INVESTMENT JOURNEY
          </p>

          <h2
            style={{
              color: "#071b35",
              fontSize: "clamp(32px, 5vw, 48px)",
              margin: "12px 0 18px",
            }}
          >
            Happy with your IMP experience?
          </h2>

          <p
            style={{
              maxWidth: "700px",
              margin: "0 auto 25px",
              color: "#66798b",
              lineHeight: 1.8,
            }}
          >
            If your financial goals and investment capacity have changed, you
            can discuss whether an additional investment or top-up is
            appropriate for your overall financial plan.
          </p>

          <Link
            href="#enquire"
            style={{
              display: "inline-block",
              background: "#2474c6",
              color: "#ffffff",
              padding: "13px 25px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Discuss IMP Top-Up
          </Link>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        id="enquire"
        style={{
          padding: "80px 20px",
          background:
            "linear-gradient(135deg, #1478d4 0%, #2489df 100%)",
          color: "#ffffff",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <p
            style={{
              fontWeight: 700,
              letterSpacing: "1.5px",
              fontSize: "13px",
              marginBottom: "10px",
            }}
          >
            LET&apos;S CONNECT
          </p>

          <h2
            style={{
              fontSize: "clamp(34px, 5vw, 52px)",
              margin: "0 0 18px",
            }}
          >
            Want to explore IMP?
          </h2>

          <p
            style={{
              maxWidth: "700px",
              margin: "0 auto 30px",
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.88)",
            }}
          >
            Share your investment requirements and let&apos;s understand
            whether the IMP approach is suitable for your financial goals.
          </p>

          <div
            style={{
              maxWidth: "850px",
              margin: "0 auto",
              background: "#ffffff",
              borderRadius: "12px",
              padding: "25px",
              textAlign: "left",
              color: "#071b35",
            }}
          >
            <EnquiryForm />
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section
        style={{
          padding: "35px 20px",
          background: "#f7f8fa",
          borderTop: "1px solid #e5e9ed",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h3
            style={{
              color: "#163d65",
              fontSize: "15px",
              marginBottom: "10px",
            }}
          >
            Important Information
          </h3>

          <p
            style={{
              color: "#788692",
              fontSize: "11px",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
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
