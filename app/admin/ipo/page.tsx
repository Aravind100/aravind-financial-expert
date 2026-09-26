import { redirect } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import IPOAdminForm from "@/components/IPOAdminForm";

export const dynamic = "force-dynamic";

const ADMIN_EMAIL = (
  process.env.ADMIN_EMAIL || "aravindchaudhary90@gmail.com"
)
  .trim()
  .toLowerCase();

export default async function IPOAdminPage() {
  const supabase = supabaseAdmin();

  const { data: ipos, error } = await supabase
    .from("ipos")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("IPO fetch error:", error);
  }

  return (
    <main className="admin">
      <div className="adminTop">
        <div>
          <h1>IPO Management</h1>

          <p className="muted">
            Add, manage and publish IPO information on your website.
          </p>
        </div>

        <div className="actions">
          <Link href="/admin" className="btn alt">
            ← Lead Dashboard
          </Link>

          <Link href="/ipo" className="btn alt">
            📈 View IPO Page
          </Link>
        </div>
      </div>

      <section className="ipo-admin-intro">
        <div>
          <span className="ipo-admin-eyebrow">
            IPO CONTENT MANAGEMENT
          </span>

          <h2>Manage IPO Information</h2>

          <p>
            Add factual IPO information, financial data, reservation details
            and company information from one place.
          </p>
        </div>
      </section>

      <IPOAdminForm initialIPOs={ipos || []} />

      {error && (
        <div className="errorBox">
          Unable to load existing IPO records.
        </div>
      )}
    </main>
  );
}
