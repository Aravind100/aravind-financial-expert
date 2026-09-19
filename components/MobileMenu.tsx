"use client";

import Link from "next/link";

export default function MobileMenu() {
  const closeMenu = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const details = event.currentTarget.closest("details");

    if (details) {
      details.open = false;
    }
  };

  return (
    <details className="mobile-menu">
      <summary aria-label="Open navigation menu">
        <span className="hamburger-icon">☰</span>
      </summary>

      <div className="mobile-menu-panel">
        <Link href="/investments" onClick={closeMenu}>
          Investments
        </Link>

        <Link href="/insurance" onClick={closeMenu}>
          Insurance
        </Link>

        <Link href="/loans" onClick={closeMenu}>
          Loans
        </Link>

        <Link href="/imp" onClick={closeMenu}>
          IMP
        </Link>

        <Link href="/swp" onClick={closeMenu}>
          SWP
        </Link>

        <Link href="/articles" onClick={closeMenu}>
          Articles
        </Link>

        <Link href="/about" onClick={closeMenu}>
          About
        </Link>

        <Link href="/contact" onClick={closeMenu}>
          Contact
        </Link>
      </div>
    </details>
  );
}
