import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Aravind Chaudhary | Financial Services",
  description: "Investment, insurance, loan and wealth solutions.",
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>
    <header className="header"><div className="nav">
      <Link className="brand" href="/">Aravind <span>Chaudhary</span></Link>
      <nav>
        <Link href="/investments">Investments</Link><Link href="/insurance">Insurance</Link>
        <Link href="/loans">Loans</Link><Link href="/imp">IMP</Link><Link href="/swp">SWP</Link>
        <Link href="/about">About</Link><Link href="/contact">Contact</Link>
      </nav>
      <a className="wa" href="https://wa.me/919173334069">WhatsApp</a>
    </div></header>
    <main>{children}</main>
    <footer><div><b>Aravind Chaudhary</b><p>Financial Services & Wealth Solutions</p></div>
      <div><a href="tel:+919173334069">+91 91733 34069</a><br/><a href="mailto:aravindchaudhary90@gmail.com">aravindchaudhary90@gmail.com</a></div>
      <div>© {new Date().getFullYear()} Aravind Chaudhary</div>
    </footer>
  </body></html>
}