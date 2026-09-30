import type { Metadata } from 'next'
import EnquiryForm from '../../components/EnquiryForm'

const BASE_URL = 'https://aravind-financial-expert.vercel.app'

export const metadata: Metadata = {
  title: 'Contact | Investment, Insurance & Financial Solutions',
  description:
    'Get in touch with Aravind Financial Expert for investment, insurance, IPO, financial solutions and general financial information. Submit your requirement or connect directly.',
  keywords: [
    'contact Aravind Chaudhary',
    'financial services contact',
    'investment enquiry',
    'insurance enquiry',
    'investment consultation',
    'financial solutions',
    'IPO enquiry',
    'Aravind Financial Expert',
  ],
  alternates: {
    canonical: `${BASE_URL}/contact`,
  },
  openGraph: {
    type: 'website',
    url: `${BASE_URL}/contact`,
    title: 'Contact | Investment, Insurance & Financial Solutions',
    description:
      'Share your financial requirement and explore relevant investment, insurance and financial solutions.',
    siteName: 'Aravind Financial Expert',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact | Aravind Financial Expert',
    description:
      'Get in touch for investment, insurance and financial solution enquiries.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ContactPage',
      '@id': `${BASE_URL}/contact#contactpage`,
      url: `${BASE_URL}/contact`,
      name: 'Contact | Aravind Financial Expert',
      description:
        'Contact Aravind Financial Expert for investment, insurance and financial solution enquiries.',
      isPartOf: {
        '@id': `${BASE_URL}/#website`,
      },
      breadcrumb: {
        '@id': `${BASE_URL}/contact#breadcrumb`,
      },
    },
    {
      '@type': 'Person',
      '@id': `${BASE_URL}/#person`,
      name: 'Aravind Chaudhary',
      url: `${BASE_URL}/about`,
      telephone: '+91 91733 34069',
      email: 'aravindchaudhary90@gmail.com',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91 91733 34069',
        email: 'aravindchaudhary90@gmail.com',
        contactType: 'customer service',
        availableLanguage: ['English', 'Hindi', 'Gujarati'],
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${BASE_URL}/contact#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: BASE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Contact',
          item: `${BASE_URL}/contact`,
        },
      ],
    },
  ],
}

const serviceAreas = [
  {
    icon: '📈',
    title: 'Investments & Wealth',
    text: 'Explore investment-related information and solutions based on your financial requirements.',
    items: [
      'Equity & Demat',
      'Mutual Funds & SIP',
      'PMS & AIF',
      'SIF',
      'IMP – Intelligent Model Portfolio',
    ],
  },
  {
    icon: '🛡️',
    title: 'Insurance & Protection',
    text: 'Understand different protection solutions and explore options for your personal and family needs.',
    items: [
      'Life Insurance',
      'Term Insurance',
      'Health Insurance',
      'General Insurance',
    ],
  },
  {
    icon: '🏠',
    title: 'Loans & Financing',
    text: 'Share your financing requirement and understand the relevant eligibility and documentation.',
    items: [
      'Home Loans',
      'Business Loans',
      'Personal Loans',
      'Business Financing',
    ],
  },
  {
    icon: '📚',
    title: 'Financial Information',
    text: 'Looking for financial awareness or want to understand a financial concept better?',
    items: [
      'Financial Awareness',
      'Investment Concepts',
      'IPO Information',
      'Market Updates',
    ],
  },
]

const steps = [
  {
    number: '01',
    title: 'Share your requirement',
    text: 'Tell us what you are looking for using the enquiry form.',
  },
  {
    number: '02',
    title: 'Understand your need',
    text: 'We can discuss your requirement, objective and the information you are looking for.',
  },
  {
    number: '03',
    title: 'Explore available options',
    text: 'Understand relevant financial products, solutions, features and associated risks.',
  },
  {
    number: '04',
    title: 'Take the next step',
    text: 'After understanding the available information, you can decide how you want to proceed.',
  },
]

export default function Contact() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(
            /</g,
            '\\u003c'
          ),
        }}
      />

      <main className="contactPage">

        {/* HERO */}
        <section className="contactHero">
          <div className="contactContainer">
            <div className="contactHeroGrid">

              <div className="contactHeroContent">
                <span className="contactEyebrow">
                  LET'S CONNECT
                </span>

                <h1>
                  Let's talk about your
                  <span> financial goals.</span>
                </h1>

                <p>
                  Have a question about investments, insurance,
                  IPOs or other financial solutions? Share your
                  requirement and explore the information and
                  options relevant to your needs.
                </p>

                <div className="heroActions">
                  <a
                    href="https://wa.me/919173334069"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="primaryButton"
                  >
                    💬 WhatsApp Me
                  </a>

                  <a
                    href="tel:+919173334069"
                    className="secondaryButton"
                  >
                    📞 Call +91 91733 34069
                  </a>
                </div>
              </div>

              <div className="contactHighlightCard">
                <div className="highlightIcon">💡</div>

                <h2>
                  Have a financial requirement?
                </h2>

                <p>
                  Whether you are exploring an investment,
                  insurance protection, IPO information or
                  financing requirement, start by sharing
                  what you are looking for.
                </p>

                <div className="highlightLine" />

                <strong>
                  Better financial decisions begin with better
                  financial understanding.
                </strong>
              </div>

            </div>
          </div>
        </section>

        {/* CONTACT OPTIONS */}
        <section className="contactOptions">
          <div className="contactContainer">

            <div className="sectionIntro">
              <span>CONTACT DIRECTLY</span>
              <h2>Choose the way that works for you</h2>
              <p>
                You can contact Aravind directly or submit your
                requirement through the enquiry form.
              </p>
            </div>

            <div className="contactCards">

              <a
                href="tel:+919173334069"
                className="contactCard"
              >
                <div className="contactCardIcon">📞</div>
                <div>
                  <span>CALL</span>
                  <h3>+91 91733 34069</h3>
                  <p>Discuss your requirement directly</p>
                </div>
              </a>

              <a
                href="https://wa.me/919173334069"
                target="_blank"
                rel="noopener noreferrer"
                className="contactCard"
              >
                <div className="contactCardIcon">💬</div>
                <div>
                  <span>WHATSAPP</span>
                  <h3>Chat on WhatsApp</h3>
                  <p>Send your requirement quickly</p>
                </div>
              </a>

              <a
                href="mailto:aravindchaudhary90@gmail.com"
                className="contactCard"
              >
                <div className="contactCardIcon">✉️</div>
                <div>
                  <span>EMAIL</span>
                  <h3>Email Me</h3>
                  <p>aravindchaudhary90@gmail.com</p>
                </div>
              </a>

            </div>
          </div>
        </section>

        {/* SERVICE AREAS */}
        <section className="serviceSection">
          <div className="contactContainer">

            <div className="sectionIntro center">
              <span>HOW CAN I HELP?</span>

              <h2>
                Financial solutions across different needs
              </h2>

              <p>
                Explore the areas covered through the website
                and share the requirement you would like to
                discuss.
              </p>
            </div>

            <div className="serviceGrid">
              {serviceAreas.map((service) => (
                <div
                  className="serviceCard"
                  key={service.title}
                >
                  <div className="serviceIcon">
                    {service.icon}
                  </div>

                  <h3>{service.title}</h3>

                  <p>{service.text}</p>

                  <ul>
                    {service.items.map((item) => (
                      <li key={item}>
                        <span>✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ENQUIRY */}
        <section className="enquirySection">
          <div className="contactContainer">

            <div className="enquiryGrid">

              <div className="enquiryInfo">
                <span className="sectionLabel">
                  SEND AN ENQUIRY
                </span>

                <h2>
                  Tell us what you're looking for.
                </h2>

                <p>
                  Share a few details about your requirement.
                  This helps us understand what information or
                  financial solution you are exploring.
                </p>

                <div className="enquiryPoints">
                  <div>
                    <span>✓</span>
                    Investment-related enquiries
                  </div>

                  <div>
                    <span>✓</span>
                    Insurance and protection requirements
                  </div>

                  <div>
                    <span>✓</span>
                    IPO and market information
                  </div>

                  <div>
                    <span>✓</span>
                    Loan and financing requirements
                  </div>

                  <div>
                    <span>✓</span>
                    General financial information
                  </div>
                </div>

                <div className="directContact">
                  <small>
                    Prefer to contact directly?
                  </small>

                  <a href="tel:+919173334069">
                    📞 +91 91733 34069
                  </a>

                  <a href="mailto:aravindchaudhary90@gmail.com">
                    ✉️ aravindchaudhary90@gmail.com
                  </a>
                </div>
              </div>

              <div className="formCard">
                <div className="formHeader">
                  <span>YOUR REQUIREMENT</span>
                  <h3>Send us a message</h3>
                  <p>
                    Fill in your details and share what you
                    would like to know.
                  </p>
                </div>

                <EnquiryForm />
              </div>

            </div>

          </div>
        </section>

        {/* PROCESS */}
        <section className="processSection">
          <div className="contactContainer">

            <div className="sectionIntro center">
              <span>WHAT HAPPENS NEXT?</span>

              <h2>
                A simple way to start the conversation
              </h2>

              <p>
                Start with your requirement. The next steps
                depend on what you are looking for.
              </p>
            </div>

            <div className="processGrid">
              {steps.map((step) => (
                <div
                  className="processCard"
                  key={step.number}
                >
                  <strong>{step.number}</strong>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* CTA */}
        <section className="finalCta">
          <div className="finalCtaInner">

            <span>READY TO CONNECT?</span>

            <h2>
              Start with a conversation.
            </h2>

            <p>
              Share your financial requirement or simply ask
              a question. Let's begin with understanding what
              you need.
            </p>

            <div className="heroActions">
              <a
                href="https://wa.me/919173334069"
                target="_blank"
                rel="noopener noreferrer"
                className="ctaWhite"
              >
                💬 WhatsApp
              </a>

              <a
                href="tel:+919173334069"
                className="ctaOutline"
              >
                📞 Call Me
              </a>
            </div>

          </div>
        </section>

        {/* DISCLAIMER */}
        <section className="contactDisclaimer">
          <div className="contactContainer">
            <h3>Important Information</h3>

            <p>
              Information shared through this website is
              intended for general financial awareness and
              educational purposes. Financial products and
              investments involve risks, and past performance
              does not guarantee future results. Product
              features, eligibility, terms and availability
              may vary. Please understand the relevant product
              information and associated risks before making
              any financial decision.
            </p>
          </div>
        </section>

        <style>{`

          .contactPage {
            min-height: 100vh;
            background: #f7f9fc;
            color: #0f172a;
          }

          .contactContainer {
            width: min(1180px, 92%);
            margin: 0 auto;
          }

          /* HERO */

          .contactHero {
            padding: 80px 0;
            background:
              radial-gradient(
                circle at 85% 20%,
                rgba(37, 99, 235, 0.10),
                transparent 35%
              ),
              linear-gradient(
                135deg,
                #eef5ff 0%,
                #ffffff 65%
              );
            border-bottom: 1px solid #e2e8f0;
          }

          .contactHeroGrid {
            display: grid;
            grid-template-columns:
              minmax(0, 1.3fr)
              minmax(320px, 0.7fr);
            gap: 55px;
            align-items: center;
          }

          .contactEyebrow,
          .sectionIntro > span,
          .sectionLabel,
          .formHeader > span,
          .finalCta > span {
            display: inline-block;
            color: #1557a6;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 1.5px;
          }

          .contactHero h1 {
            max-width: 800px;
            margin: 16px 0 20px;
            font-size: clamp(40px, 6vw, 68px);
            line-height: 1.05;
            letter-spacing: -2px;
          }

          .contactHero h1 span {
            color: #1557a6;
          }

          .contactHeroContent > p {
            max-width: 720px;
            color: #64748b;
            font-size: 19px;
            line-height: 1.75;
            margin: 0;
          }

          .heroActions {
            display: flex;
            flex-wrap: wrap;
            gap: 14px;
            margin-top: 30px;
          }

          .primaryButton,
          .secondaryButton,
          .ctaWhite,
          .ctaOutline {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 48px;
            padding: 0 22px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 800;
            transition: 0.2s ease;
          }

          .primaryButton {
            color: #ffffff;
            background: #1557a6;
          }

          .primaryButton:hover {
            transform: translateY(-2px);
            background: #104782;
          }

          .secondaryButton {
            color: #1557a6;
            background: #ffffff;
            border: 1px solid #cbd5e1;
          }

          .secondaryButton:hover {
            transform: translateY(-2px);
            border-color: #1557a6;
          }

          .contactHighlightCard {
            padding: 34px;
            border-radius: 24px;
            background: #0f172a;
            color: #ffffff;
            box-shadow:
              0 25px 60px rgba(15, 23, 42, 0.18);
          }

          .highlightIcon {
            font-size: 35px;
            margin-bottom: 18px;
          }

          .contactHighlightCard h2 {
            margin: 0;
            font-size: 28px;
            line-height: 1.25;
          }

          .contactHighlightCard p {
            margin: 16px 0 0;
            color: #cbd5e1;
            line-height: 1.7;
          }

          .highlightLine {
            height: 1px;
            margin: 24px 0;
            background: #334155;
          }

          .contactHighlightCard strong {
            display: block;
            color: #e2e8f0;
            line-height: 1.6;
          }

          /* SECTION */

          .contactOptions,
          .serviceSection,
          .processSection {
            padding: 80px 0;
          }

          .sectionIntro {
            max-width: 760px;
            margin-bottom: 38px;
          }

          .sectionIntro.center {
            margin-left: auto;
            margin-right: auto;
            text-align: center;
          }

          .sectionIntro h2 {
            margin: 10px 0 12px;
            font-size: clamp(30px, 4vw, 44px);
            line-height: 1.15;
          }

          .sectionIntro p {
            margin: 0;
            color: #64748b;
            font-size: 17px;
            line-height: 1.7;
          }

          /* CONTACT CARDS */

          .contactCards {
            display: grid;
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
            gap: 20px;
          }

          .contactCard {
            display: flex;
            align-items: center;
            gap: 18px;
            padding: 24px;
            color: inherit;
            text-decoration: none;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 18px;
            box-shadow:
              0 8px 25px rgba(15, 23, 42, 0.05);
            transition: 0.2s ease;
          }

          .contactCard:hover {
            transform: translateY(-4px);
            border-color: #bfd3f0;
            box-shadow:
              0 15px 35px rgba(15, 23, 42, 0.09);
          }

          .contactCardIcon {
            width: 52px;
            height: 52px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 14px;
            background: #eef5ff;
            font-size: 23px;
          }

          .contactCard span {
            color: #1557a6;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 1px;
          }

          .contactCard h3 {
            margin: 5px 0;
            font-size: 17px;
          }

          .contactCard p {
            margin: 0;
            color: #64748b;
            font-size: 13px;
          }

          /* SERVICES */

          .serviceSection {
            background: #ffffff;
            border-top: 1px solid #e5e7eb;
            border-bottom: 1px solid #e5e7eb;
          }

          .serviceGrid {
            display: grid;
            grid-template-columns:
              repeat(4, minmax(0, 1fr));
            gap: 20px;
          }

          .serviceCard {
            padding: 26px;
            border: 1px solid #e2e8f0;
            border-radius: 18px;
            background: #f8fafc;
          }

          .serviceIcon {
            font-size: 30px;
            margin-bottom: 15px;
          }

          .serviceCard h3 {
            margin: 0;
            font-size: 20px;
          }

          .serviceCard > p {
            color: #64748b;
            line-height: 1.6;
            font-size: 14px;
          }

          .serviceCard ul {
            padding: 0;
            margin: 18px 0 0;
            list-style: none;
          }

          .serviceCard li {
            display: flex;
            gap: 8px;
            margin: 9px 0;
            color: #334155;
            font-size: 14px;
          }

          .serviceCard li span {
            color: #1557a6;
            font-weight: 900;
          }

          /* ENQUIRY */

          .enquirySection {
            padding: 90px 0;
            background: #f1f5f9;
          }

          .enquiryGrid {
            display: grid;
            grid-template-columns:
              minmax(0, 0.85fr)
              minmax(0, 1.15fr);
            gap: 45px;
            align-items: start;
          }

          .enquiryInfo {
            padding-top: 15px;
          }

          .enquiryInfo h2 {
            max-width: 550px;
            margin: 12px 0 18px;
            font-size: clamp(32px, 4vw, 48px);
            line-height: 1.12;
          }

          .enquiryInfo > p {
            max-width: 550px;
            color: #64748b;
            line-height: 1.75;
            font-size: 17px;
          }

          .enquiryPoints {
            margin-top: 28px;
          }

          .enquiryPoints div {
            display: flex;
            gap: 10px;
            margin: 13px 0;
            color: #334155;
            font-weight: 600;
          }

          .enquiryPoints span {
            color: #1557a6;
            font-weight: 900;
          }

          .directContact {
            margin-top: 35px;
            padding-top: 25px;
            border-top: 1px solid #cbd5e1;
          }

          .directContact small {
            display: block;
            margin-bottom: 10px;
            color: #64748b;
          }

          .directContact a {
            display: block;
            margin: 7px 0;
            color: #1557a6;
            font-weight: 700;
            text-decoration: none;
          }

          .formCard {
            padding: 30px;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            box-shadow:
              0 15px 45px rgba(15, 23, 42, 0.08);
          }

          .formHeader {
            margin-bottom: 25px;
          }

          .formHeader h3 {
            margin: 7px 0;
            font-size: 27px;
          }

          .formHeader p {
            margin: 0;
            color: #64748b;
          }

          /* PROCESS */

          .processGrid {
            display: grid;
            grid-template-columns:
              repeat(4, minmax(0, 1fr));
            gap: 20px;
          }

          .processCard {
            padding: 25px;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 18px;
          }

          .processCard > strong {
            color: #1557a6;
            font-size: 13px;
            letter-spacing: 1px;
          }

          .processCard h3 {
            margin: 14px 0 8px;
            font-size: 19px;
          }

          .processCard p {
            margin: 0;
            color: #64748b;
            line-height: 1.65;
            font-size: 14px;
          }

          /* CTA */

          .finalCta {
            padding: 85px 20px;
            text-align: center;
            background: #0f172a;
            color: #ffffff;
          }

          .finalCta > span {
            color: #93c5fd;
          }

          .finalCta h2 {
            margin: 12px 0;
            font-size: clamp(34px, 5vw, 52px);
          }

          .finalCta p {
            max-width: 650px;
            margin: 0 auto;
            color: #cbd5e1;
            line-height: 1.7;
            font-size: 17px;
          }

          .finalCta .heroActions {
            justify-content: center;
          }

          .ctaWhite {
            color: #0f172a;
            background: #ffffff;
          }

          .ctaOutline {
            color: #ffffff;
            border: 1px solid #64748b;
          }

          /* DISCLAIMER */

          .contactDisclaimer {
            padding: 35px 0;
            background: #f8fafc;
          }

          .contactDisclaimer h3 {
            margin: 0 0 8px;
            font-size: 15px;
          }

          .contactDisclaimer p {
            max-width: 1000px;
            margin: 0;
            color: #64748b;
            font-size: 13px;
            line-height: 1.7;
          }

          /* RESPONSIVE */

          @media (max-width: 1000px) {
            .contactHeroGrid {
              grid-template-columns: 1fr;
            }

            .serviceGrid {
              grid-template-columns:
                repeat(2, minmax(0, 1fr));
            }

            .processGrid {
              grid-template-columns:
                repeat(2, minmax(0, 1fr));
            }
          }

          @media (max-width: 800px) {
            .contactCards {
              grid-template-columns: 1fr;
            }

            .enquiryGrid {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 600px) {
            .contactHero {
              padding: 55px 0;
            }

            .contactHero h1 {
              letter-spacing: -1px;
            }

            .contactHeroContent > p {
              font-size: 16px;
            }

            .heroActions {
              flex-direction: column;
            }

            .primaryButton,
            .secondaryButton,
            .ctaWhite,
            .ctaOutline {
              width: 100%;
            }

            .contactOptions,
            .serviceSection,
            .processSection {
              padding: 55px 0;
            }

            .serviceGrid,
            .processGrid {
              grid-template-columns: 1fr;
            }

            .enquirySection {
              padding: 55px 0;
            }

            .formCard {
              padding: 20px;
            }

            .contactHighlightCard {
              padding: 26px;
            }
          }

        `}</style>
      </main>
    </>
  )
}
