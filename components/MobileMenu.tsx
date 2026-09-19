"use client";

import Link from "next/link";

export default function MobileMenu() {
  return (
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
  );
}
