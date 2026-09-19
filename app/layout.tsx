import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Aravind Chaudhary | Financial Services",
  description: "Investment, insurance, loan and wealth solutions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
              <Link href="/loans">Loans</Link>
              <Link href="/imp">IMP</Link>
              <Link href="/swp">SWP</Link>
              <Link href="/articles">Articles</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
            </nav>

            {/* Mobile Hamburger Menu */}
            <details className="mobile-menu">
              <summary aria-label="Open navigation menu">
                <span className="hamburger-icon">☰</span>
              </summary>

              <div className="mobile-menu-panel">
                <Link href="/investments">Investments</Link>
                <Link href="/insurance">Insurance</Link>
                <Link href="/loans">Loans</Link>
                <Link href="/imp">IMP</Link>
                <Link href="/swp">SWP</Link>
                <Link href="/articles">Articles</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
              </div>
            </details>

          </div>
        </header>

        <main>{children}</main>

        <footer>
          <div>
            <b>Aravind Chaudhary</b>
            <p>Financial Services & Wealth Solutions</p>
            <p>
              <a href="tel:+919173334069">+91 91733 34069</a>
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
