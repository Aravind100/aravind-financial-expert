export default function Investments() {
  return (
    <>
      {/* HERO - EXISTING DESIGN PRESERVED */}
      <section className="pageHero">
        <div>
          <h1>Investments</h1>
          <p className="muted">
            Explore investment solutions based on goals, risk and time horizon.
          </p>
        </div>
      </section>

      {/* MAIN INVESTMENT CARDS */}
      <section className="grid">

        {/* MUTUAL FUNDS & SIP */}
        <div className="card">
          <h3>Mutual Funds & SIP</h3>

          <p className="muted">
            Mutual Funds pool money from multiple investors and invest it
            according to a defined investment objective and strategy.
          </p>

          <p>
            <strong>Minimum Investment:</strong> Depends on the scheme.
            SIP minimums vary between schemes.
          </p>

          <p>
            <strong>Advantages</strong>
          </p>

          <ul>
            <li>Professional fund management</li>
            <li>Diversification across securities</li>
            <li>SIP facility for regular investing</li>
            <li>Suitable for different financial goals</li>
            <li>Options across different risk categories</li>
          </ul>

          <p>
            <strong>Suitable for:</strong> Investors looking for diversified
            market-linked investments and disciplined long-term investing.
          </p>

          <p>
            <strong>How it works:</strong> You invest through a lump sum or
            SIP. The fund invests the money according to its stated strategy.
            The value of your investment changes with the market value of the
            underlying investments.
          </p>
        </div>


        {/* EQUITY / DEMAT */}
        <div className="card">
          <h3>Equity / Demat</h3>

          <p className="muted">
            A Demat account allows securities to be held electronically.
            A trading account can be linked with the Demat account to buy and
            sell securities.
          </p>

          <p>
            <strong>Minimum Investment:</strong> There is no universal
            minimum investment requirement for opening a Demat account.
          </p>

          <p>
            <strong>Advantages</strong>
          </p>

          <ul>
            <li>Electronic holding of securities</li>
            <li>Convenient portfolio tracking</li>
            <li>Easy buying and selling of securities</li>
            <li>Reduced paperwork</li>
            <li>Digital access to holdings</li>
            <li>Easy transfer of eligible securities</li>
          </ul>

          <p>
            <strong>Suitable for:</strong> Investors interested in direct
            equity and other securities available through the chosen platform.
          </p>

          <p>
            <strong>How it works:</strong> Securities purchased through the
            trading account are credited to the Demat account. When securities
            are sold or transferred, the corresponding holdings are debited.
          </p>
        </div>


        {/* PMS */}
        <div className="card">
          <h3>PMS</h3>

          <p className="muted">
            Portfolio Management Services provide a structured portfolio
            management arrangement where a registered portfolio manager manages
            securities according to an agreed strategy.
          </p>

          <p>
            <strong>Minimum Investment:</strong> ₹50 lakh under the current
            PMS framework.
          </p>

          <p>
            <strong>Advantages</strong>
          </p>

          <ul>
            <li>Defined investment strategy</li>
            <li>Professional portfolio management</li>
            <li>Direct ownership of securities</li>
            <li>Focused portfolio construction</li>
            <li>Portfolio monitoring and review</li>
          </ul>

          <p>
            <strong>Suitable for:</strong> Investors meeting the applicable
            investment threshold who understand equity-market and
            strategy-specific risks.
          </p>

          <p>
            <strong>How it works:</strong> The investor selects an applicable
            PMS strategy and completes the required documentation. The
            portfolio manager manages the portfolio according to the agreed
            strategy and applicable regulations.
          </p>

          <p className="muted">
            PMS minimum investment threshold is based on SEBI's applicable
            framework.
          </p>
        </div>


        {/* AIF */}
        <div className="card">
          <h3>AIF</h3>

          <p className="muted">
            Alternative Investment Funds are privately pooled investment
            vehicles that invest according to their category, strategy and
            fund documents.
          </p>

          <p>
            <strong>Minimum Investment:</strong> Generally ₹1 crore, subject
            to applicable regulatory provisions and exceptions.
          </p>

          <p>
            <strong>Advantages</strong>
          </p>

          <ul>
            <li>Access to alternative investment strategies</li>
            <li>Potential diversification beyond traditional products</li>
            <li>Access to selected private-market opportunities</li>
            <li>Different strategies for different investment objectives</li>
          </ul>

          <p>
            <strong>Suitable for:</strong> Eligible investors with sufficient
            investment capacity who understand the risks, liquidity conditions
            and complexity associated with alternative investments.
          </p>

          <p>
            <strong>How it works:</strong> Investors commit capital to a fund
            according to its documents. The fund manager deploys capital
            according to the stated strategy and applicable regulations.
          </p>
        </div>


        {/* SIF */}
        <div className="card">
          <h3>SIF - Specialized Investment Fund</h3>

          <p className="muted">
            Specialized Investment Funds offer specialized investment
            strategies within the mutual-fund regulatory framework.
          </p>

          <p>
            <strong>Minimum Investment:</strong> The current minimum investment
            threshold is ₹10 lakh at the PAN level, subject to applicable rules.
          </p>

          <p>
            <strong>Advantages</strong>
          </p>

          <ul>
            <li>Specialized investment strategies</li>
            <li>Structured investment approach</li>
            <li>Exposure to permitted asset classes and strategies</li>
            <li>Potential diversification for suitable investors</li>
          </ul>

          <p>
            <strong>Suitable for:</strong> Investors who understand specialized
            strategies, market risks, liquidity and the characteristics of the
            particular SIF.
          </p>

          <p>
            <strong>How it works:</strong> Investors purchase units of a
            registered SIF investment strategy. The fund manager manages the
            portfolio according to the strategy's stated mandate.
          </p>
        </div>

      </section>


      {/* INVESTMENT COMPARISON */}
      <section className="grid">

        <div className="card">
          <h3>Investment Options at a Glance</h3>

          <p className="muted">
            Different investment products serve different objectives,
            investment amounts, risk levels and time horizons.
          </p>

          <ul>
            <li>
              <strong>Mutual Funds & SIP:</strong> Regular and diversified
              market-linked investing
            </li>

            <li>
              <strong>Equity / Demat:</strong> Direct participation in listed
              securities
            </li>

            <li>
              <strong>PMS:</strong> Structured portfolio management for
              eligible investors
            </li>

            <li>
              <strong>AIF:</strong> Alternative investment strategies for
              eligible investors
            </li>

            <li>
              <strong>SIF:</strong> Specialized investment strategies with
              applicable minimum investment requirements
            </li>
          </ul>

          <p className="muted">
            Product suitability depends on the investor's financial goals,
            risk profile, liquidity requirement and investment horizon.
          </p>
        </div>


        <div className="card">
          <h3>How We Approach Investments</h3>

          <p>
            <strong>1. Understand</strong>
            <br />
            Understand your financial goals, income, existing investments and
            time horizon.
          </p>

          <p>
            <strong>2. Assess</strong>
            <br />
            Consider risk profile, liquidity requirements and investment
            capacity.
          </p>

          <p>
            <strong>3. Compare</strong>
            <br />
            Compare strategy, risk, liquidity, cost and historical performance.
          </p>

          <p>
            <strong>4. Implement</strong>
            <br />
            Select the appropriate investment route and complete the required
            documentation.
          </p>

          <p>
            <strong>5. Review</strong>
            <br />
            Review the portfolio periodically as goals and market conditions
            change.
          </p>
        </div>

      </section>


      {/* DEMAT SECTION */}
      <section className="grid">

        <div className="card">
          <h3>Motilal Oswal Demat & Trading Account</h3>

          <p className="muted">
            A Demat account allows securities to be held electronically.
            Motilal Oswal provides Demat and trading services along with access
            to multiple investment and market segments.
          </p>

          <p>
            <strong>Key Features</strong>
          </p>

          <ul>
            <li>Access to equity and supported market segments</li>
            <li>Trading across supported devices</li>
            <li>Research and market information</li>
            <li>Advisory and call-and-trade support</li>
            <li>Digital portfolio access</li>
            <li>Multiple investment products through the platform</li>
          </ul>

          <p className="muted">
            Features, charges, eligibility and offers can change. Please check
            the latest official terms before opening an account.
          </p>

          <p>
            <strong>Want to open a Demat account?</strong>
          </p>

          <p>
            Contact us for assistance with the account-opening process.
          </p>

          <p>
            📞 <strong>+91 91733 34069</strong>
            <br />
            ✉️ <strong>aravindchaudhary90@gmail.com</strong>
          </p>

          <a
            href="https://wa.me/919173334069?text=Hello%20Aravind%2C%20I%20want%20to%20open%20a%20Demat%20account."
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Demat Account
          </a>
        </div>


        <div className="card">
          <h3>Benefits of a Demat Account</h3>

          <p className="muted">
            A Demat account works as an electronic holding account for
            securities and removes the need to maintain physical certificates.
          </p>

          <ul>
            <li>Electronic holding of securities</li>
            <li>Convenient portfolio tracking</li>
            <li>Easy transfer of eligible securities</li>
            <li>Reduced paperwork</li>
            <li>Online access to holdings</li>
            <li>Convenient transaction records</li>
          </ul>

          <p>
            <strong>Important:</strong> A Demat account itself does not generate
            investment returns. Returns depend on the securities purchased and
            their market performance.
          </p>
        </div>

      </section>


      {/* PAST PERFORMANCE */}
      <section className="pageHero">
        <div>
          <h2>Past-Performance Examples</h2>

          <p className="muted">
            Historical performance can help investors understand how different
            strategies have performed in the past. It should not be considered
            a prediction or guarantee of future returns.
          </p>
        </div>
      </section>


      <section className="grid">

        <div className="card">
          <h3>PMS - Historical Performance</h3>

          <p className="muted">
            PMS strategies can have significantly different investment
            objectives, portfolios, risk levels and performance periods.
          </p>

          <p>
            When evaluating PMS performance, consider:
          </p>

          <ul>
            <li>1-year, 3-year and 5-year performance</li>
            <li>Performance across different market cycles</li>
            <li>Benchmark comparison</li>
            <li>Risk and volatility</li>
            <li>Portfolio concentration</li>
            <li>Investment strategy</li>
            <li>Fees and other applicable charges</li>
          </ul>

          <p className="muted">
            Always refer to the latest official PMS performance disclosure
            before making an investment decision.
          </p>
        </div>


        <div className="card">
          <h3>AIF - Historical Performance</h3>

          <p className="muted">
            AIF strategies can be very different from one another. Therefore,
            AIF performance should be evaluated strategy-by-strategy rather
            than using one return number for all AIFs.
          </p>

          <p>
            <strong>Important factors:</strong>
          </p>

          <ul>
            <li>Category and investment strategy</li>
            <li>Fund vintage and track record</li>
            <li>Portfolio construction</li>
            <li>Liquidity and lock-in provisions</li>
            <li>Fees and carried interest</li>
            <li>Risk and concentration</li>
            <li>Exit strategy</li>
          </ul>

          <p className="muted">
            Latest fund documents and disclosures should be reviewed before
            investing.
          </p>
        </div>


        <div className="card">
          <h3>SIF - Historical Performance</h3>

          <p className="muted">
            SIF is a relatively newer investment category, and different
            strategies may have different inception dates.
          </p>

          <p>
            Performance should therefore be reviewed along with:
          </p>

          <ul>
            <li>Since-inception period</li>
            <li>Benchmark</li>
            <li>Strategy objective</li>
            <li>Portfolio composition</li>
            <li>Risk level</li>
            <li>Market-cycle performance</li>
          </ul>

          <p className="muted">
            Since-inception returns from different strategies may cover
            different time periods and should not automatically be compared
            as equivalent annual returns.
          </p>
        </div>


        <div className="card">
          <h3>Mutual Funds - Historical Performance</h3>

          <p className="muted">
            Mutual funds should be evaluated using the appropriate category,
            benchmark and time period rather than looking at a single recent
            return.
          </p>

          <p>
            <strong>Before selecting a fund, consider:</strong>
          </p>

          <ul>
            <li>Investment objective</li>
            <li>Risk level</li>
            <li>Benchmark</li>
            <li>Expense ratio</li>
            <li>Portfolio composition</li>
            <li>Fund-management approach</li>
            <li>Performance across market cycles</li>
          </ul>

          <p className="muted">
            Past performance does not guarantee future performance.
          </p>
        </div>

      </section>


      {/* GOAL BASED INVESTING */}
      <section className="grid">

        <div className="card">
          <h3>Start With Your Financial Goal</h3>

          <p className="muted">
            Investment selection should start with the objective rather than
            simply choosing a product.
          </p>

          <ul>
            <li>Wealth creation</li>
            <li>Retirement planning</li>
            <li>Children's education</li>
            <li>Long-term capital growth</li>
            <li>Regular income</li>
            <li>Portfolio diversification</li>
            <li>Direct equity participation</li>
          </ul>

          <p>
            Once your objective, time horizon, liquidity requirement and risk
            profile are understood, suitable investment categories can be
            evaluated.
          </p>
        </div>


        <div className="card">
          <h3>Need Help Understanding Your Options?</h3>

          <p className="muted">
            Share your investment requirement and get help understanding
            available investment categories, their features, risks and
            suitability.
          </p>

          <p>
            📞 <strong>+91 91733 34069</strong>
            <br />
            ✉️ <strong>aravindchaudhary90@gmail.com</strong>
          </p>

          <a
            href="https://wa.me/919173334069?text=Hello%20Aravind%2C%20I%20want%20to%20discuss%20investment%20options."
            target="_blank"
            rel="noopener noreferrer"
          >
            Discuss Investment Options
          </a>
        </div>

      </section>


      {/* DISCLAIMER */}
      <section className="pageHero">
        <div>
          <p className="muted">
            <strong>Important:</strong> Investments are subject to market
            risks. Past performance does not indicate future results. Minimum
            investment amounts, product features, charges, eligibility and
            regulatory requirements may change. Investors should review the
            latest official product documents and assess suitability before
            investing.
          </p>
        </div>
      </section>
    </>
  )
}
