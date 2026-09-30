import type { Metadata } from "next";

const BASE_URL = "https://aravind-financial-expert.vercel.app";

export const metadata: Metadata = {
  title: "SWP Calculator | Systematic Withdrawal Plan",
  description:
    "Understand Systematic Withdrawal Plans (SWP), explore ₹50 Lakh and ₹1 Crore illustrations, and use the SWP calculator to estimate withdrawals and remaining corpus.",
  keywords: [
    "SWP",
    "SWP calculator",
    "Systematic Withdrawal Plan",
    "SWP investment",
    "SWP mutual fund",
    "SWP calculator India",
    "monthly withdrawal calculator",
    "retirement income planning",
    "mutual fund SWP",
    "Aravind Financial Expert",
  ],
  alternates: {
    canonical: `${BASE_URL}/swp`,
  },
  openGraph: {
    type: "website",
    url: `${BASE_URL}/swp`,
    title: "SWP Calculator | Systematic Withdrawal Plan",
    description:
      "Understand SWP, explore illustrative examples and calculate withdrawals and remaining corpus using the SWP calculator.",
    siteName: "Aravind Financial Expert",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "SWP Calculator | Systematic Withdrawal Plan",
    description:
      "Understand SWP and use an illustrative calculator to estimate withdrawals and remaining corpus.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SWPLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
