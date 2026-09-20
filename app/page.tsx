import Link from "next/link";


const investmentSolutions = [
  {
    icon: "📈",
    title: "Mutual Funds & SIP",
    text: "Explore professionally managed mutual-fund options and systematic investing concepts.",
    href: "/investments",
  },
  {
    icon: "📊",
    title: "Equity & Demat",
    text: "Explore equity investing, Demat accounts, market information and research-based investing.",
    href: "/investments",
  },
  {
    icon: "💼",
    title: "PMS",
    text: "Understand Portfolio Management Services, their structure, suitability and associated risks.",
    href: "/investments",
  },
  {
    icon: "🏦",
    title: "AIF",
    text: "Learn about Alternative Investment Funds and their different investment strategies.",
    href: "/investments",
  },
  {
    icon: "🧩",
    title: "SIF",
    text: "Explore Specialized Investment Funds and understand how they differ from traditional mutual funds.",
    href: "/investments",
  },
  {
    icon: "🧠",
    title: "IMP",
    text: "Explore Intelligent Model Portfolio and its research-driven portfolio approach.",
    href: "/imp",
  },
];

const protectionSolutions = [
  {
    icon: "🛡️",
    title: "Life Insurance",
    text: "Protection planning for individuals and families.",
  },
  {
    icon: "❤️",
    title: "Health Insurance",
    text: "Understand health protection and medical-cost planning.",
  },
  {
    icon: "🔐",
    title: "Term Insurance",
    text: "Explore pure life protection and financial security concepts.",
  },
  {
    icon: "🏠",
    title: "General Insurance",
    text: "Explore protection solutions for different assets and requirements.",
  },
];

const loanSolutions = [
  {
    icon: "🏡",
    title: "Home Loan",
    text: "Financing solutions for purchasing or constructing a home.",
  },
  {
    icon: "💼",
    title: "Business Loan",
    text: "Explore financing options for eligible business requirements.",
  },
  {
    icon: "💳",
    title: "Personal Loan",
    text: "Understand personal financing options and eligibility requirements.",
  },
];

const goals = [
  {
    icon: "🌱",
    title: "Build Wealth",
    text: "Explore long-term investment and wealth-building concepts.",
  },
  {
    icon: "🎓",
    title: "Plan Future Goals",
    text: "Organise investments around important financial milestones.",
  },
  {
    icon: "💰",
    title: "Create Regular Income",
    text: "Understand SWP and other income-planning concepts.",
  },
  {
    icon: "🛡️",
    title: "Protect Your Family",
    text: "Explore life, health and other protection solutions.",
  },
];

const process = [
  {
    number: "01",
    title: "Understand",
    text: "Start with your requirement, financial objective and time horizon.",
  },
  {
    number: "02",
    title: "Explore",
    text: "Understand available financial products, features and structures.",
  },
  {
    number: "03",
    title: "Compare",
    text: "Look at relevant options, risks, costs and suitability.",
  },
  {
    number: "04",
    title: "Plan",
    text: "Build a financial approach around your requirements.",
  },
  {
    number: "05",
    title: "Review",
    text: "Keep learning and reviewing your financial decisions over time.",
  },
];

export default function Home() {
  return (
    <>
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="hero homeHero">
        <div className="homeHeroContent">
          <div>
            <div className="pill">FINANCIAL SERVICES & WEALTH SOLUTIONS</div>

            <h1>
              Your financial goals.
              <br />
              <span>One trusted solution.</span>
            </h1>

            <p>
              Explore investments, insurance, loans and financial knowledge
              through one simple platform designed to help you understand your
              options and make more informed financial decisions.
            </p>

            <div className="actions">
              <Link className="btn" href="/contact">
                Start a Conversation
              </Link>

              <Link className="btn alt" href="/investments">
                Explore Investments
              </Link>

              <a
                className="btn alt"
                href="https://wa.me/919173334069"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp Me
              </a>
            </div>

            <div className="homeHeroHighlights">
              <span>✓ Investments</span>
              <span>✓ Insurance</span>
              <span>✓ Loans</span>
              <span>✓ Financial Knowledge</span>
            </div>
          </div>

          <div className="card heroCard homeProfileCard">
            <div className="profileBadge">FINANCIAL SERVICES</div>

            <h2>Aravind Chaudhary</h2>

            <p className="muted">
              Financial Services & Wealth Solutions
            </p>

            <hr />

            <p className="profileIntro">
              Helping individuals, families, investors and entrepreneurs
              explore financial solutions with simple information and
              structured guidance.
            </p>

            <div className="profileMiniGrid">
              <div>
                <strong>Invest</strong>
                <span>Grow & Plan</span>
              </div>

              <div>
                <strong>Protect</strong>
                <span>Secure & Prepare</span>
              </div>

              <div>
                <strong>Finance</strong>
                <span>Fund Your Goals</span>
              </div>

              <div>
                <strong>Learn</strong>
                <span>Understand Better</span>
              </div>
            </div>

            <a className="btn homeCallBtn" href="tel:+919173334069">
              Call +91 91733 34069
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="section homeIntro">
        <div className="homeSectionHeading">
          <div>
            <div className="homeEyebrow">ONE PLATFORM</div>

            <h2>
              Financial information made easier to explore.
            </h2>
          </div>

          <p className="muted">
            From everyday financial awareness to sophisticated investment
            concepts, explore information and solutions across different
            financial needs.
          </p>
        </div>

        <div className="homeStats">
          <div className="homeStat card">
            <strong>01</strong>
            <h3>Explore</h3>
            <p className="muted">
              Understand different financial products and concepts.
            </p>
          </div>

          <div className="homeStat card">
            <strong>02</strong>
            <h3>Compare</h3>
            <p className="muted">
              Look at features, risks, costs and suitability.
            </p>
          </div>

          <div className="homeStat card">
            <strong>03</strong>
            <h3>Plan</h3>
            <p className="muted">
              Connect financial solutions with your goals.
            </p>
          </div>

          <div className="homeStat card">
            <strong>04</strong>
            <h3>Review</h3>
            <p className="muted">
              Keep learning and reviewing your financial journey.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          INVESTMENTS
      ===================================================== */}

      <section className="homeLightSection">
        <div className="section">
          <div className="homeSectionHeading">
            <div>
              <div className="homeEyebrow">INVESTMENTS & WEALTH</div>

              <h2>
                Explore investment solutions
              </h2>
            </div>

            <Link className="smallArrowLink" href="/investments">
              View Investments →
            </Link>
          </div>

          <p className="muted homeSectionIntro">
            Understand traditional and advanced investment concepts, from
            Mutual Funds and SIP to Equity, PMS, AIF, SIF and model portfolio
            approaches.
          </p>

          <div className="homeCardsGrid">
            {investmentSolutions.map((item) => (
              <Link
                href={item.href}
                className="card homeInfoCard"
                key={item.title}
              >
                <div className="homeCardIcon">{item.icon}</div>

                <h3>{item.title}</h3>

                <p className="muted">{item.text}</p>

                <span className="homeCardLink">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          IMP + SWP
      ===================================================== */}

      <section className="section">
        <div className="featuredGrid">
          <Link href="/imp" className="featuredCard featuredIMP">
            <div className="featuredTag">FEATURED SOLUTION</div>

            <div className="featuredIcon">🧠</div>

            <h2>IMP — Intelligent Model Portfolio</h2>

            <p>
              Explore the IMP approach, portfolio philosophy, performance
              information, investor journey and enquiry options.
            </p>

            <span>Explore IMP →</span>
          </Link>

          <Link href="/swp" className="featuredCard featuredSWP">
            <div className="featuredTag">PLANNING TOOL</div>

            <div className="featuredIcon">💰</div>

            <h2>SWP — Systematic Withdrawal Plan</h2>

            <p>
              Learn how SWP works, explore ₹50 lakh and ₹1 crore examples and
              use the interactive SWP calculator.
            </p>

            <span>Explore SWP Calculator →</span>
          </Link>
        </div>
      </section>

      {/* =====================================================
          INSURANCE
      ===================================================== */}

      <section className="homeBlueSection">
        <div className="section">
          <div className="homeSectionHeading lightHeading">
            <div>
              <div className="homeEyebrow">PROTECTION</div>

              <h2>
                Protect what you have built.
              </h2>
            </div>

            <Link className="lightArrowLink" href="/insurance">
              Explore Insurance →
            </Link>
          </div>

          <p className="homeLightIntro">
            Financial planning is not only about growth. Protection can be an
            important part of preparing for unexpected financial events.
          </p>

          <div className="homeCardsGrid">
            {protectionSolutions.map((item) => (
              <Link
                href="/insurance"
                className="homeInfoCard lightCard"
                key={item.title}
              >
                <div className="homeCardIcon">{item.icon}</div>

                <h3>{item.title}</h3>

                <p>{item.text}</p>

                <span className="homeCardLink">
                  Learn More →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          LOANS
      ===================================================== */}

      <section className="section">
        <div className="homeSectionHeading">
          <div>
            <div className="homeEyebrow">FINANCING</div>

            <h2>
              Financing for important goals.
            </h2>
          </div>

          <Link className="smallArrowLink" href="/loans">
            Explore Loans →
          </Link>
        </div>

        <p className="muted homeSectionIntro">
          Understand financing options, eligibility requirements and
          documentation before applying.
        </p>

        <div className="homeCardsGrid threeCards">
          {loanSolutions.map((item) => (
            <Link
              href="/loans"
              className="card homeInfoCard"
              key={item.title}
            >
              <div className="homeCardIcon">{item.icon}</div>

              <h3>{item.title}</h3>

              <p className="muted">{item.text}</p>

              <span className="homeCardLink">
                Learn More →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* =====================================================
          FINANCIAL GOALS
      ===================================================== */}

      <section className="homeLightSection">
        <div className="section">
          <div className="homeCenteredHeading">
            <div className="homeEyebrow">YOUR FINANCIAL JOURNEY</div>

            <h2>
              Different goals. Different financial needs.
            </h2>

            <p className="muted">
              Financial decisions become easier to organise when you start
              with the goal you are trying to achieve.
            </p>
          </div>

          <div className="goalGrid">
            {goals.map((goal) => (
              <div className="card goalCard" key={goal.title}>
                <div className="goalIcon">{goal.icon}</div>

                <h3>{goal.title}</h3>

                <p className="muted">{goal.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW WE APPROACH
      ===================================================== */}

      <section className="section">
        <div className="homeCenteredHeading">
          <div className="homeEyebrow">OUR APPROACH</div>

          <h2>
            Understand first. Decide with information.
          </h2>

          <p className="muted">
            The objective is to make financial information easier to
            understand before taking a financial decision.
          </p>
        </div>

        <div className="processGrid">
          {process.map((item) => (
            <div className="processCard" key={item.number}>
              <div className="processNumber">
                {item.number}
              </div>

              <h3>{item.title}</h3>

              <p className="muted">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          ARTICLES
      ===================================================== */}

      <section className="homeArticleSection">
        <div className="section">
          <div className="homeSectionHeading">
            <div>
              <div className="homeEyebrow">ARTICLES & INSIGHTS</div>

              <h2>
                Learn. Explore. Stay informed.
              </h2>
            </div>

            <Link className="smallArrowLink" href="/articles">
              View All Articles →
            </Link>
          </div>

          <p className="muted homeSectionIntro">
            Explore practical articles covering investments, SIP, equity,
            insurance, loans, SWP and other financial topics.
          </p>

          <div className="articlePreviewGrid">
            <Link href="/articles" className="articlePreview card">
              <div className="articleNumber">01</div>

              <h3>Investment Insights</h3>

              <p className="muted">
                Understand investment concepts, market-related information
                and long-term wealth-building principles.
              </p>

              <span>Read Articles →</span>
            </Link>

            <Link href="/articles" className="articlePreview card">
              <div className="articleNumber">02</div>

              <h3>Financial Planning</h3>

              <p className="muted">
                Learn about SIP, SWP, retirement planning and different
                approaches to organising your finances.
              </p>

              <span>Read Articles →</span>
            </Link>

            <Link href="/articles" className="articlePreview card">
              <div className="articleNumber">03</div>

              <h3>Insurance & Protection</h3>

              <p className="muted">
                Explore insurance concepts and understand why protection can
                form an important part of financial planning.
              </p>

              <span>Read Articles →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="homeFinalCTA">
        <div>
          <div className="homeEyebrow">LET'S CONNECT</div>

          <h2>
            Have a financial requirement?
          </h2>

          <p>
            Whether you are exploring investments, insurance, loans or simply
            looking for financial information, send your requirement and
            let's start a conversation.
          </p>

          <div className="actions">
            <Link className="btn" href="/contact">
              Send Your Requirement
            </Link>

            <a
              className="btn alt"
              href="https://wa.me/919173334069"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp Me
            </a>

            <a
              className="btn alt"
              href="tel:+919173334069"
            >
              Call Me
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================
          DISCLAIMER
      ===================================================== */}

      <section className="homeDisclaimer">
        <p>
          Information on this website is provided for educational and
          informational purposes. Financial products are subject to applicable
          terms, conditions, risks and eligibility requirements. Please
          understand the relevant product documents and risks before making
          financial decisions.
        </p>
      </section>
    </>
  );
}
