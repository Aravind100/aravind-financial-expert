import Link from "next/link";
import EnquiryForm from "../../components/EnquiryForm";
import styles from "./Insurance.module.css";

const lifeInsurers = [
  {
    name: "LIC",
    logo: "/insurers/lic.svg",
    category: "Life Insurance",
    product: "Life insurance & term protection",
    description:
      "Life protection solutions designed around financial security, family responsibilities and long-term needs.",
  },
  {
    name: "HDFC Life",
    logo: "/insurers/hdfc-life.svg",
    category: "Life Insurance",
    product: "Click 2 Protect Supreme Plus",
    description:
      "A pure-risk/savings life insurance plan with multiple protection options, subject to policy terms.",
  },
  {
    name: "SBI Life",
    logo: "/insurers/sbi-life.svg",
    category: "Life Insurance",
    product: "Term insurance solutions",
    description:
      "Life protection options designed to provide financial support to nominees subject to policy terms.",
  },
  {
    name: "ICICI Prudential Life",
    logo: "/insurers/icici-prudential-life.svg",
    category: "Life Insurance",
    product: "Protection & life insurance solutions",
    description:
      "Life insurance solutions across protection and long-term financial needs.",
  },
  {
    name: "Tata AIA",
    logo: "/insurers/tata-aia.svg",
    category: "Life Insurance",
    product: "Protection & life insurance",
    description:
      "Life insurance solutions covering different protection and financial planning requirements.",
  },
  {
    name: "Aditya Birla Sun Life",
    logo: "/insurers/aditya-birla-sun-life.svg",
    category: "Life Insurance",
    product: "Life & protection solutions",
    description:
      "Insurance solutions designed for protection and long-term financial requirements.",
  },
];

const healthInsurers = [
  {
    name: "Star Health",
    logo: "/insurers/star-health.svg",
    category: "Health Insurance",
    product: "Family Health Optima",
    description:
      "Health insurance designed for family coverage, subject to policy terms, exclusions and waiting periods.",
  },
  {
    name: "HDFC ERGO",
    logo: "/insurers/hdfc-ergo.svg",
    category: "Health Insurance",
    product: "my:Optima Secure",
    description:
      "Health insurance product with policy-specific benefits such as Secure Benefit and restoration features.",
  },
  {
    name: "ICICI Lombard",
    logo: "/insurers/icici-lombard.svg",
    category: "Health Insurance",
    product: "Complete Health Insurance",
    description:
      "Health insurance covering specified hospitalisation and related benefits according to policy wording.",
  },
  {
    name: "Aditya Birla Health",
    logo: "/insurers/aditya-birla-health.svg",
    category: "Health Insurance",
    product: "Health insurance solutions",
    description:
      "Health protection solutions for individuals and families, subject to product terms.",
  },
  {
    name: "Care Health",
    logo: "/insurers/care-health.svg",
    category: "Health Insurance",
    product: "Health insurance solutions",
    description:
      "Individual and family health insurance options with policy-specific benefits and conditions.",
  },
  {
    name: "Niva Bupa",
    logo: "/insurers/niva-bupa.svg",
    category: "Health Insurance",
    product: "Health insurance solutions",
    description:
      "Health protection options for individuals and families, subject to applicable terms.",
  },
];

const generalInsurers = [
  {
    name: "Tata AIG",
    logo: "/insurers/tata-aig.svg",
    category: "General Insurance",
    product: "Motor, travel & general insurance",
    description:
      "General insurance solutions including motor, travel and other protection categories.",
  },
  {
    name: "ICICI Lombard",
    logo: "/insurers/icici-lombard.svg",
    category: "General Insurance",
    product: "Motor & general insurance",
    description:
      "General insurance solutions across motor and other risk-protection categories.",
  },
  {
    name: "HDFC ERGO",
    logo: "/insurers/hdfc-ergo.svg",
    category: "General Insurance",
    product: "Motor & general insurance",
    description:
      "General insurance products covering different personal and asset-related risks.",
  },
  {
    name: "Bajaj General",
    logo: "/insurers/bajaj-general.svg",
    category: "General Insurance",
    product: "Motor & general insurance",
    description:
      "General insurance solutions across motor and other personal/general risk categories.",
  },
  {
    name: "SBI General",
    logo: "/insurers/sbi-general.svg",
    category: "General Insurance",
    product: "Motor & general insurance",
    description:
      "General insurance products for vehicle and other protection requirements.",
  },
  {
    name: "Go Digit",
    logo: "/insurers/go-digit.svg",
    category: "General Insurance",
    product: "Motor & general insurance",
    description:
      "Digital-first general insurance solutions across multiple protection categories.",
  },
];

function InsurerCard({
  item,
}: {
  item: {
    name: string;
    logo: string;
    category: string;
    product: string;
    description: string;
  };
}) {
  return (
    <div className={styles.insurerCard}>
      <div className={styles.logoBox}>
        <img
          src={item.logo}
          alt={`${item.name} logo`}
          onError={(e) => {
            e.currentTarget.style.display = "none";
            const fallback = e.currentTarget.nextElementSibling;
            if (fallback) {
              (fallback as HTMLElement).style.display = "flex";
            }
          }}
        />
        <span className={styles.logoFallback}>
          {item.name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 3)}
        </span>
      </div>

      <span className={styles.insurerCategory}>{item.category}</span>

      <h3>{item.name}</h3>

      <strong>{item.product}</strong>

      <p>{item.description}</p>

      <small>
        Product availability, features and terms may change. Refer to the
        insurer&apos;s current approved product documents.
      </small>
    </div>
  );
}

export default function InsurancePage() {
  return (
    <main className={styles.page}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>INSURANCE AWARENESS</span>

            <h1>
              Protect What You&apos;ve
              <span> Worked Hard to Build.</span>
            </h1>

            <p>
              Insurance is designed to protect your family, health, income,
              vehicle, property and other financial interests from unexpected
              events.
            </p>

            <div className={styles.heroButtons}>
              <Link href="#insurance-types" className={styles.primaryButton}>
                Explore Insurance
              </Link>

              <Link href="#contact" className={styles.secondaryButton}>
                Contact for Information
              </Link>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.shieldCircle}>🛡️</div>

            <div className={styles.heroCard}>
              <strong>PROTECTION</strong>
              <span>Today&apos;s protection for tomorrow&apos;s uncertainties.</span>
            </div>

            <div className={styles.heroMiniCards}>
              <div>❤️ Life</div>
              <div>🏥 Health</div>
              <div>🚗 General</div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <span>WHY INSURANCE?</span>
            <h2>One unexpected event can affect years of financial planning.</h2>
            <p>
              Insurance helps transfer specified financial risks to an
              insurer in exchange for a premium, subject to the policy terms,
              conditions, exclusions and applicable regulations.
            </p>
          </div>

          <div className={styles.reasonGrid}>
            <div className={styles.reasonCard}>
              <span>01</span>
              <h3>Protect Income</h3>
              <p>
                Life insurance can help provide financial support to
                dependents if the insured person dies during the policy term.
              </p>
            </div>

            <div className={styles.reasonCard}>
              <span>02</span>
              <h3>Protect Health</h3>
              <p>
                Health insurance can help manage eligible hospitalisation and
                medical expenses according to the selected policy.
              </p>
            </div>

            <div className={styles.reasonCard}>
              <span>03</span>
              <h3>Protect Assets</h3>
              <p>
                General insurance can help protect vehicles, property,
                travel-related risks and other insured assets.
              </p>
            </div>

            <div className={styles.reasonCard}>
              <span>04</span>
              <h3>Protect Financial Goals</h3>
              <p>
                Appropriate insurance can reduce the possibility that an
                unexpected event forces you to liquidate long-term investments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INFLATION */}
      <section className={styles.inflationSection}>
        <div className={styles.container}>
          <div className={styles.inflationGrid}>
            <div>
              <span className={styles.lightEyebrow}>THINK BEYOND TODAY</span>

              <h2>
                The cost of protection should be reviewed as life changes.
              </h2>

              <p>
                Inflation can increase the future cost of healthcare,
                household expenses, repairs, replacement materials and other
                financial commitments.
              </p>

              <p>
                That is why insurance planning should not be treated as a
                one-time activity. Your cover may need review when your income,
                family responsibilities, liabilities or assets change.
              </p>
            </div>

            <div className={styles.inflationVisual}>
              <div className={styles.costRow}>
                <span>Today</span>
                <strong>₹</strong>
                <p>Current cost</p>
              </div>

              <div className={styles.arrow}>→</div>

              <div className={styles.costRow}>
                <span>Future</span>
                <strong>₹₹</strong>
                <p>Potentially higher cost</p>
              </div>

              <div className={styles.inflationMessage}>
                <strong>Review your protection periodically.</strong>
                <span>
                  Don&apos;t plan tomorrow&apos;s protection only using
                  yesterday&apos;s expenses.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE TYPES */}
      <section id="insurance-types" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <span>THREE IMPORTANT CATEGORIES</span>
            <h2>Understand the role of each type of insurance.</h2>
          </div>

          <div className={styles.typeGrid}>
            <article className={styles.typeCard}>
              <div className={styles.typeIcon}>❤️</div>
              <span>01</span>
              <h3>Life Insurance</h3>

              <p>
                Primarily designed to provide financial protection to
                beneficiaries/nominees in the event covered by the policy.
              </p>

              <h4>Why consider it?</h4>

              <ul>
                <li>Family income protection</li>
                <li>Children&apos;s future responsibilities</li>
                <li>Loan and liability protection</li>
                <li>Financial continuity for dependents</li>
                <li>Long-term protection planning</li>
              </ul>

              <div className={styles.highlight}>
                Your family&apos;s financial needs continue even when your
                income does not.
              </div>
            </article>

            <article className={styles.typeCard}>
              <div className={styles.typeIcon}>🏥</div>
              <span>02</span>
              <h3>Health Insurance</h3>

              <p>
                Designed to provide coverage for specified healthcare and
                hospitalisation expenses according to policy terms.
              </p>

              <h4>Why consider it?</h4>

              <ul>
                <li>Hospitalisation expenses</li>
                <li>Day-care procedures where covered</li>
                <li>Pre/post-hospitalisation benefits where covered</li>
                <li>Cashless treatment at eligible network hospitals</li>
                <li>Family medical-risk protection</li>
              </ul>

              <div className={styles.highlight}>
                Medical expenses can become a major financial burden without
                adequate protection.
              </div>
            </article>

            <article className={styles.typeCard}>
              <div className={styles.typeIcon}>🚗</div>
              <span>03</span>
              <h3>General Insurance</h3>

              <p>
                Covers a wide range of non-life risks depending on the
                selected policy.
              </p>

              <h4>Common categories</h4>

              <ul>
                <li>Motor insurance</li>
                <li>Home/property insurance</li>
                <li>Travel insurance</li>
                <li>Personal accident</li>
                <li>Business and commercial insurance</li>
              </ul>

              <div className={styles.highlight}>
                Protect valuable assets against specified unexpected risks.
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* LIFE DETAILS */}
      <section className={styles.detailSection}>
        <div className={styles.container}>
          <div className={styles.detailGrid}>
            <div className={styles.detailNumber}>01</div>

            <div>
              <span className={styles.sectionLabel}>LIFE INSURANCE</span>
              <h2>Protect the people who depend on you.</h2>

              <p>
                Life insurance planning should consider your income,
                dependents, liabilities, future responsibilities and existing
                assets.
              </p>

              <div className={styles.infoGrid}>
                <div>
                  <h3>Term Insurance</h3>
                  <p>
                    Primarily provides life protection for a specified period.
                    Benefits depend on the policy terms and conditions.
                  </p>
                </div>

                <div>
                  <h3>Savings-Oriented Life Products</h3>
                  <p>
                    Certain life insurance products combine insurance with
                    savings-related features. Benefits depend on the specific
                    product.
                  </p>
                </div>

                <div>
                  <h3>ULIP</h3>
                  <p>
                    Unit-linked insurance products combine insurance and
                    investment components. Investment risk in the investment
                    portfolio is borne by the policyholder.
                  </p>
                </div>

                <div>
                  <h3>Riders</h3>
                  <p>
                    Additional benefits may be available through riders,
                    subject to eligibility, additional premium and policy
                    conditions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HEALTH DETAILS */}
      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <div className={styles.detailGrid}>
            <div className={styles.detailNumber}>02</div>

            <div>
              <span className={styles.sectionLabel}>HEALTH INSURANCE</span>
              <h2>Medical protection is an important part of financial planning.</h2>

              <p>
                A health policy should be evaluated not only on premium but
                also on coverage, exclusions, waiting periods, room-rent
                conditions, co-payment, sub-limits, network hospitals and
                restoration/recharge features where applicable.
              </p>

              <div className={styles.checkGrid}>
                <div>✓ Individual cover</div>
                <div>✓ Family floater</div>
                <div>✓ Senior citizen options</div>
                <div>✓ Super top-up</div>
                <div>✓ Critical illness options</div>
                <div>✓ Personal accident cover</div>
              </div>

              <div className={styles.warningBox}>
                <strong>Important:</strong>
                <p>
                  A higher sum insured does not automatically mean every
                  medical expense will be payable. Coverage depends on the
                  policy wording, exclusions, waiting periods, limits and
                  other applicable conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GENERAL */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <span>GENERAL INSURANCE</span>
            <h2>Protect the assets and risks around your everyday life.</h2>
          </div>

          <div className={styles.generalGrid}>
            <div>
              <span>🚗</span>
              <h3>Motor Insurance</h3>
              <p>
                Protection options for cars and two-wheelers including
                third-party and broader own-damage/comprehensive covers as
                applicable.
              </p>
            </div>

            <div>
              <span>🏠</span>
              <h3>Home & Property</h3>
              <p>
                Protection against specified risks affecting property,
                contents or other insured interests.
              </p>
            </div>

            <div>
              <span>✈️</span>
              <h3>Travel Insurance</h3>
              <p>
                Can provide protection for specified travel-related risks,
                depending on the selected plan and destination.
              </p>
            </div>

            <div>
              <span>👤</span>
              <h3>Personal Accident</h3>
              <p>
                Provides benefits for specified accidental events according
                to the policy terms.
              </p>
            </div>

            <div>
              <span>🏢</span>
              <h3>Business Insurance</h3>
              <p>
                Insurance solutions can address selected risks faced by
                shops, offices, businesses and commercial operations.
              </p>
            </div>

            <div>
              <span>💻</span>
              <h3>Specialised Risks</h3>
              <p>
                Depending on insurer and eligibility, specialised covers may
                include cyber, liability, marine and other commercial risks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT TO CHECK */}
      <section className={styles.checkSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <span>BEFORE BUYING</span>
            <h2>Don&apos;t compare only the premium.</h2>
            <p>
              Compare the protection offered and understand the policy
              conditions.
            </p>
          </div>

          <div className={styles.checklist}>
            <div>
              <strong>01</strong>
              <span>Coverage / Sum Insured</span>
            </div>

            <div>
              <strong>02</strong>
              <span>Policy Term</span>
            </div>

            <div>
              <strong>03</strong>
              <span>Waiting Periods</span>
            </div>

            <div>
              <strong>04</strong>
              <span>Exclusions</span>
            </div>

            <div>
              <strong>05</strong>
              <span>Deductibles / Co-payment</span>
            </div>

            <div>
              <strong>06</strong>
              <span>Sub-limits / Conditions</span>
            </div>

            <div>
              <strong>07</strong>
              <span>Claim Process</span>
            </div>

            <div>
              <strong>08</strong>
              <span>Renewal Conditions</span>
            </div>
          </div>
        </div>
      </section>

      {/* INSURERS */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <span>SELECTED INSURERS & PRODUCT EXAMPLES</span>
            <h2>Explore insurance companies and product categories.</h2>
            <p>
              The examples below are for awareness and comparison of
              categories. They are not rankings or recommendations.
            </p>
          </div>

          <h3 className={styles.groupTitle}>Life Insurance</h3>

          <div className={styles.insurerGrid}>
            {lifeInsurers.map((item) => (
              <InsurerCard key={item.name} item={item} />
            ))}
          </div>

          <h3 className={styles.groupTitle}>Health Insurance</h3>

          <div className={styles.insurerGrid}>
            {healthInsurers.map((item) => (
              <InsurerCard key={item.name} item={item} />
            ))}
          </div>

          <h3 className={styles.groupTitle}>General Insurance</h3>

          <div className={styles.insurerGrid}>
            {generalInsurers.map((item) => (
              <InsurerCard key={item.name} item={item} />
            ))}
          </div>

          <div className={styles.sourceNote}>
            <strong>Product information:</strong> Product names and features
            can change. Always verify the current insurer website,
            prospectus, Customer Information Sheet and policy wording before
            making a purchase.
          </div>
        </div>
      </section>

      {/* SIMPLE WORKFLOW */}
      <section className={styles.workflowSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <span>OUR SIMPLE PROCESS</span>
            <h2>Understand first. Choose carefully.</h2>
          </div>

          <div className={styles.workflow}>
            <div>
              <span>01</span>
              <h3>Understand</h3>
              <p>Your family, health, assets and financial responsibilities.</p>
            </div>

            <div>
              <span>02</span>
              <h3>Assess</h3>
              <p>Existing insurance, gaps, liabilities and future needs.</p>
            </div>

            <div>
              <span>03</span>
              <h3>Compare</h3>
              <p>Relevant products, features, exclusions and conditions.</p>
            </div>

            <div>
              <span>04</span>
              <h3>Decide</h3>
              <p>Select according to your requirements and suitability.</p>
            </div>

            <div>
              <span>05</span>
              <h3>Review</h3>
              <p>Revisit your protection when your circumstances change.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaBox}>
            <span>NEED HELP UNDERSTANDING INSURANCE?</span>

            <h2>Let&apos;s understand your requirements first.</h2>

            <p>
              Share your requirement and get information about relevant
              insurance categories and available options.
            </p>

            <div className={styles.contactDetails}>
              <a href="tel:+919173334069">📞 +91 91733 34069</a>
              <a href="mailto:aravindchaudhary90@gmail.com">
                ✉️ aravindchaudhary90@gmail.com
              </a>
            </div>

            <div className={styles.ctaButtons}>
              <a
                href="https://wa.me/919173334069?text=Hello%20Aravind%2C%20I%20would%20like%20information%20about%20insurance."
                target="_blank"
                rel="noreferrer"
                className={styles.whatsappButton}
              >
                WhatsApp for Information
              </a>

              <a href="tel:+919173334069" className={styles.callButton}>
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ENQUIRY FORM */}
      <section className={styles.formSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <span>INSURANCE ENQUIRY</span>
            <h2>Tell us what you need.</h2>
          </div>

          <EnquiryForm />
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className={styles.disclaimer}>
        <div className={styles.container}>
          <strong>Important Insurance Disclaimer</strong>

          <p>
            Insurance products are subject to applicable regulations and the
            terms, conditions, exclusions, waiting periods, limits and
            eligibility requirements specified in the respective policy
            documents. Product names, features, premiums, benefits and UINs
            may change. Information on this page is provided for general
            awareness and should not be treated as a representation that any
            particular product is suitable for every person.
          </p>

          <p>
            Please read the policy wording, prospectus and Customer Information
            Sheet carefully before purchasing. No product on this page is
            represented as universally best, guaranteed, risk-free or suitable
            for everyone.
          </p>

          <p>
            <strong>
              Insurance is the subject matter of solicitation.
            </strong>
          </p>
        </div>
      </section>
    </main>
  );
}
