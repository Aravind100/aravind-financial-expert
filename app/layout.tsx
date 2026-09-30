import "./globals.css";
import Link from "next/link";
import MobileMenu from "../components/MobileMenu";
import type { Metadata } from "next";

const BASE_URL = "https://aravind-financial-expert.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Aravind Financial Expert | Investments, Insurance & Financial Solutions",
    template: "%s | Aravind Financial Expert",
  },

  description:
    "Aravind Financial Expert provides information and solutions related to investments, equity, mutual funds, insurance, IPOs, financial planning, investor education and NISM exam preparation.",

  keywords: [
    "Aravind Chaudhary",
    "Aravind Financial Expert",
    "financial services",
    "investment solutions",
    "equity investment",
    "mutual funds",
    "insurance",
    "IPO",
    "financial planning",
    "NISM exam",
    "investor education",
  ],

  authors: [
    {
      name: "Aravind Chaudhary",
      url: `${BASE_URL}/about`,
    },
  ],

  creator: "Aravind Chaudhary",
  publisher: "Aravind Financial Expert",

  alternates: {
    canonical: BASE_URL,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "Aravind Financial Expert",
    title:
      "Aravind Financial Expert | Investments, Insurance & Financial Solutions",
    description:
      "Investment, equity, mutual funds, insurance, IPOs, financial education and other financial solutions.",
    locale: "en_IN",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Aravind Financial Expert | Investments, Insurance & Financial Solutions",
    description:
      "Investment, equity, mutual funds, insurance, IPOs, financial education and other financial solutions.",
  },

  category: "finance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "Aravind Financial Expert",
    url: BASE_URL,
    description:
      "Financial services and investor education covering investments, equity, mutual funds, insurance, IPOs and financial solutions.",
    founder: {
      "@type": "Person",
      name: "Aravind Chaudhary",
      url: `${BASE_URL}/about`,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-9173334069",
      contactType: "customer service",
      email: "aravindchaudhary90@gmail.com",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Gujarati"],
    },
    sameAs: [
      "https://www.linkedin.com/in/aravind-chaudhary-078788104/",
    ],
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${BASE_URL}/#aravind-chaudhary`,
    name: "Aravind Chaudhary",
    url: `${BASE_URL}/about`,
    worksFor: {
      "@id": `${BASE_URL}/#organization`,
    },
    sameAs: [
      "https://www.linkedin.com/in/aravind-chaudhary-078788104/",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: BASE_URL,
    name: "Aravind Financial Expert",
    description:
      "Financial services, investment information and investor education.",
    publisher: {
      "@id": `${BASE_URL}/#organization`,
    },
    inLanguage: "en-IN",
  };

  return (
    <html lang="en-IN">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              organizationSchema,
              personSchema,
              websiteSchema,
            ]).replace(/</g, "\\u003c"),
          }}
        />
      </head>

      <body>
        <header className="header">
          <div className="nav">

            <Link className="brand" href="/">
              Aravind <span>Chaudhary</span>
            </Link>

            {/* Desktop Menu */}
            <nav className="desktop-nav">
              <Link href="/investments">Investments</Link>
              <Link href="/insurance">Insurance</Link>
              <Link href="/ipo">IPO</Link>
              <Link href="/imp">IMP</Link>
              <Link href="/swp">SWP</Link>
              <Link href="/calculators">Calculators</Link>
              <Link href="/nism">NISM EXAM</Link>
              <Link href="/articles">Articles</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
            </nav>

            {/* Desktop WhatsApp Button */}
            <a
              className="desktop-whatsapp"
              href="https://wa.me/919173334069"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>

            {/* Mobile Hamburger Menu */}
            <MobileMenu />

          </div>
        </header>

        <main>{children}</main>

        <footer>
          <div>
            <b>Aravind Chaudhary</b>
            <p>Financial Services & Wealth Solutions</p>

            <p>
              <a href="tel:+919173334069">
                +91 91733 34069
              </a>
            </p>

            <p>
              <a href="mailto:aravindchaudhary90@gmail.com">
                aravindchaudhary90@gmail.com
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
