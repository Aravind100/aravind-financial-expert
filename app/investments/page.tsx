export default function Investments() {
  return (
    <>
      {/* EXISTING HERO — DESIGN PRESERVED */}
      <section className="pageHero">
        <div>
          <h1>Investments</h1>
          <p className="muted">
            Explore investment solutions based on goals, risk and time horizon.
          </p>
        </div>
      </section>

      {/* EXISTING INVESTMENT CARDS — DESIGN PRESERVED */}
      <section className="grid">

        <div className="card">
          <h3>Mutual Funds & SIP</h3>

          <p className="muted">
            Mutual Funds pool money from multiple investors and invest it across
            securities according to a defined investment objective.
          </p>

          <p>
            <strong>Minimum Investment:</strong> Scheme-specific. SIPs can be
            started with relatively small amounts depending on the scheme.
          </p>

          <p>
            <strong>Advantages:</strong>
          </p>

          <ul>
            <li>Professional fund management</li>
            <li>Diversification across securities</li>
            <li>SIP option for disciplined investing</li>
            <li>Suitable for different financial goals</li>
          </ul>

          <p>
            <strong>Suitable for:</strong> Investors looking for diversified
            market-linked investing with a defined investment strategy.
          </p>

          <p>
            <strong>How it works:</strong> You invest either through a lump sum
            or SIP. The fund invests the money according to its mandate and the
            value of your investment changes with the underlying securities.
          </p>
        </div>

        <div className="card">
          <h3>Equity / Demat</h3>

          <p className="muted">
            A Demat account allows securities such as shares to be held
            electronically. It can be linked with a trading account for buying
            and selling securities.
          </p>

          <p>
            <strong>Minimum Investment:</strong> No universal minimum investment
            requirement for opening a Demat account. Brokerage and other charges
            depend on the provider and transaction.
          </p>

          <p>
            <strong>Advantages:</strong>
          </p>

          <ul>
            <li>Electronic holding of securities</li>
            <li>Easy access to portfolio information</li>
            <li>Convenient buying, selling and transfers</li>
            <li>Reduced paperwork</li>
            <li>Portfolio tracking through digital platforms</li>
          </ul>

          <p>
            <strong>Suitable for:</strong> Investors interested in direct
            equity and other securities available through the relevant platform.
          </p>

          <p>
            <strong>How it works:</strong> Securities purchased through the
            trading account are credited electronically to the Demat account.
            When securities are sold, the relevant holdings are debited.
          </p>
        </div>

        <div className="card">
          <h3>PMS</h3>

          <p className="muted">
            Portfolio Management Services provide a structured portfolio
            management approach where an eligible portfolio manager manages
            securities according to an agreed investment strategy.
          </p>

          <p>
            <strong>Minimum Investment:</strong> ₹50 lakh under the current PMS
            regulatory framework. :contentReference[oaicite:0]{index=0}
          </p>

          <p>
            <strong>Advantages:</strong>
          </p>

          <ul>
            <li>Portfolio management based on a defined strategy</li>
            <li>Direct ownership of securities in the investor's account</li>
            <li>Focused portfolio construction</li>
            <li>Regular portfolio monitoring</li>
          </ul>

          <p>
            <strong>Suitable for:</strong> Investors who meet the applicable
            investment threshold and are comfortable with equity-market and
            strategy-specific risks.
          </p>

          <p>
            <strong>How it works:</strong> The investor selects a suitable
            portfolio management strategy, completes the required documentation
            and invests according to the applicable terms. The portfolio is then
            managed according to that strategy.
          </p>
        </div>

        <div className="card">
          <h3>AIF</h3>

          <p className="muted">
            Alternative Investment Funds are privately pooled investment
            vehicles that invest according to their specific category,
            strategy and placement memorandum.
          </p>

          <p>
            <strong>Minimum Investment:</strong> Generally ₹1 crore for an AIF,
            subject to applicable regulatory provisions and exceptions such as
            those applicable to certain accredited investors. :contentReference[oaicite:1]{index=1}
          </p>

          <p>
            <strong>Advantages:</strong>
          </p>

          <ul>
            <li>Access to alternative investment strategies</li>
            <li>Potential diversification beyond traditional products</li>
            <li>Strategies can include private-market opportunities</li>
            <li>Different risk-return structures depending on the fund</li>
          </ul>

          <p>
            <strong>Suitable for:</strong> Eligible investors with higher
            investment capacity who understand the liquidity, risk and
            complexity associated with alternative investments.
          </p>

          <p>
            <strong>How it works:</strong> Investors commit capital to an AIF
            according to its fund documents. The fund deploys capital according
            to its stated strategy and applicable regulations.
          </p>
        </div>

        <div className="card">
          <h3>SIF — Specialized Investment Fund</h3>

          <p className="muted">
            Specialized Investment Funds provide investment strategies within
            the mutual-fund regulatory framework with strategies that can be
            more specialized than conventional mutual-fund offerings.
          </p>

          <p>
            <strong>Minimum Investment:</strong> The regulatory minimum threshold
            is generally ₹10 lakh across SIF investment strategies, subject to
            applicable provisions and exceptions. :contentReference[oaicite:2]{index=2}
          </p>

          <p>
            <strong>Advantages:</strong>
          </p>

          <ul>
            <li>Specialized investment strategies</li>
            <li>Strategies may use equity and other permitted instruments</li>
            <li>Potentially suitable for sophisticated investors</li>
            <li>Structured investment approach</li>
          </ul>

          <p>
            <strong>Suitable for:</strong> Investors who understand specialized
            strategies, market risk and the characteristics of the particular
            SIF.
          </p>

          <p>
            <strong>How it works:</strong> Investors purchase units of a
            registered SIF strategy and the fund manager manages the portfolio
            according to the strategy's stated mandate.
          </p>
        </div>

      </section>


      {/* QUICK COMPARISON */}
      <section className="grid">

        <div className="card">
          <h3>Which Investment Solution May Fit?</h3>

          <p className="muted">
            The right product depends on investment amount, financial goals,
            liquidity requirements, risk tolerance and investment horizon.
          </p>

          <ul>
            <li>
              <strong>Starting / Regular Investing:</strong> Mutual Funds & SIP
            </li>
            <li>
              <strong>Direct Stock Investing:</strong> Equity / Demat
            </li>
            <li>
              <strong>₹50 Lakh+:</strong> PMS may be considered
            </li>
            <li>
              <strong>₹1 Crore+:</strong> AIF may be considered
            </li>
            <li>
              <strong>₹10 Lakh+:</strong> SIF may be considered, subject to
              applicable rules
            </li>
          </ul>

          <p className="muted">
            These are broad categories, not recommendations. Suitability should
            be assessed before investing.
          </p>
        </div>

        <div className="card">
          <h3>How We Approach Investments</h3>

          <p>
            <strong>1. Understand</strong>
            <br />
            Understand your financial objective, time horizon and liquidity
            requirement.
          </p>

          <p>
            <strong>2. Assess</strong>
            <br />
            Consider your risk profile, investment capacity and existing
            portfolio.
          </p>

          <p>
            <strong>3. Compare</strong>
            <br />
            Compare products based on strategy, risk, liquidity, cost and
            historical performance.
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
            Monitor the portfolio and review it when your financial situation
            or goals change.
          </p>
        </div>

      </section>


      {/* DEMAT SECTION */}
      <section className="grid">

        <div className="card">
          <h3>Benefits of a Motilal Oswal Demat & Trading Account</h3>

          <p className="muted">
            Motilal Oswal describes its platform as providing access to multiple
            investment and trading products through a single ecosystem.
            :contentReference[oaicite:3]{index=3}
          </p>

          <ul>
            <li>Access to equity and other market segments</li>
            <li>Digital portfolio and transaction access</li>
            <li>Trading across supported devices</li>
            <li>Research and market information</li>
            <li>Advisory and call-and-trade support</li>
            <li>Online account and portfolio management</li>
          </ul>

          <p className="muted">
            Features, charges, eligibility and services may change. Please
            verify the latest terms before opening an account.
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
          <h3>Why Have a Demat Account?</h3>

          <p className="muted">
            A Demat account holds securities electronically instead of physical
            certificates.
          </p>

          <ul>
            <li>Electronic holding of securities</li>
            <li>Convenient portfolio tracking</li>
            <li>Easy transfer of securities</li>
            <li>Reduced paperwork</li>
            <li>Digital access to holdings and transactions</li>
            <li>Can support a diversified investment portfolio</li>
          </ul>

          <p className="muted">
            A Demat account itself does not generate returns. Investment returns
            depend on the securities and investment decisions made through the
            account.
          </p>
        </div>

      </section>


      {/* PAST PERFORMANCE */}
      <section className="pageHero">
        <div>
          <h2>Past-Performance Examples</h2>

          <p className="muted">
            Historical performance can help investors understand how a strategy
            has behaved in the past. It should not be treated as a forecast or
            guarantee of future returns.
          </p>
        </div>
      </section>


      <section className="grid">

        <div className="card">
          <h3>PMS — Aequitas India Opportunities</h3>

          <p className="muted">
            A published Aequitas PMS presentation reported performance as of
            28 February 2026. The presentation states that one-year and longer
            period returns were presented on a compounded annual basis and that
            individual client portfolios can differ because of timing of
            inflows/outflows and portfolio constraints. :contentReference[oaicite:4]{index=4}
          </p>

          <p>
            <strong>Reported historical examples:</strong>
          </p>

          <ul>
            <li>1 Year: approximately 34%</li>
            <li>3 Years: approximately 34%</li>
            <li>5 Years: approximately 35%</li>
            <li>10 Years: approximately 15%</li>
          </ul>

          <p className="muted">
            Source date: 28 February 2026. Historical performance only.
          </p>
        </div>


        <div className="card">
          <h3>SIF — Recent Performance Data</h3>

          <p className="muted">
            SIF performance is still based on relatively short track records
            for many strategies. For example, the SIF India performance dashboard
            reports strategy-level returns as of 18 September 2026. :contentReference[oaicite:5]{index=5}
          </p>

          <p>
            <strong>Examples from the dashboard:</strong>
          </p>

          <ul>
            <li>
              qSIF Hybrid Long-Short: 30.67% since inception
            </li>
            <li>
              qSIF Active Asset Allocator Long-Short: 31.89% since inception
            </li>
            <li>
              qSIF Equity Ex-Top 100 Long-Short: 14.59% since inception
            </li>
          </ul>

          <p className="muted">
            Since-inception periods differ between strategies, so these figures
            should not be treated as directly comparable annual returns.
          </p>
        </div>


        <div className="card">
          <h3>Mutual Funds — Historical Performance</h3>

          <p className="muted">
            Mutual-fund performance should be compared using the appropriate
            period, benchmark, category and return methodology.
          </p>

          <p>
            Recent market reporting, for example, has highlighted long-term
            performance data for several Flexi Cap funds, but historical returns
            vary by period and should not be treated as future-return estimates.
            :contentReference[oaicite:6]{index=6}
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
            <li>Fund-manager and strategy consistency</li>
            <li>Long-term performance across different market cycles</li>
          </ul>
        </div>


        <div className="card">
          <h3>AIF — Strategy-Specific Evaluation</h3>

          <p className="muted">
            AIFs can follow very different strategies, structures and liquidity
            terms. Therefore, a single return number is not sufficient for
            comparing AIF opportunities.
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
            AIF performance should be reviewed from the latest fund documents
            and disclosures before making an investment decision.
          </p>
        </div>

      </section>


      {/* SIMPLE DECISION CARD */}
      <section className="grid">

        <div className="card">
          <h3>Investment Selection Starts With Your Goal</h3>

          <p className="muted">
            Instead of starting with a product, start with the financial
            objective.
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
            Once the objective, time horizon, liquidity requirement and risk
            profile are understood, suitable investment categories can be
            evaluated.
          </p>
        </div>


        <div className="card">
          <h3>Need Help Understanding Your Options?</h3>

          <p className="muted">
            Share your investment requirement and we can help you understand
            the available investment categories, their features, risks and
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
            <strong>Important:</strong> Investments are subject to market risks.
            Past performance does not indicate future results. Minimum
            investment amounts, product features, charges, eligibility and
            regulatory requirements can change. Investors should review the
            latest official product documents and assess suitability before
            investing.
          </p>
        </div>
      </section>
    </>
  )
}
