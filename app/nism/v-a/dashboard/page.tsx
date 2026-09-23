import Link from "next/link";
import NismStudyDashboard from "@/components/NismStudyDashboard";

export const metadata = {
  title: "NISM V-A Study Dashboard | Mock Test Progress",
  description:
    "Track NISM Series V-A mock test attempts, scores and study progress.",
};

export default function NismStudyDashboardPage() {
  return (
    <>
      <NismStudyDashboard />

      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "0 20px 40px",
        }}
      >
        <Link
          href="/nism/v-a"
          style={{
            color: "#1463d8",
            fontWeight: 800,
            textDecoration: "none",
          }}
        >
          ← Back to NISM V-A Preparation
        </Link>
      </div>
    </>
  );
}
