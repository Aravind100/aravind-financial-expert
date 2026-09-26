import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

type IPO = {
  id: string;
  company_name: string;
  slug: string;
  status: string;
  issue_type: string;
  price_band_min: number | null;
  price_band_max: number | null;
  issue_size: number | null;
  lot_size: number | null;
  minimum_investment: number | null;
  open_date: string | null;
  close_date: string | null;
  listing_date: string | null;
  logo_url: string | null;
};

function formatDate(date: string | null) {
  if (!date) return "—";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return date;
  }

  return value.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatPrice(
  min: number | null,
  max: number | null
) {
  if (min === null && max === null) {
    return "Price band not announced";
  }

  if (min !== null && max !== null) {
    return `₹${min} – ₹${max}`;
  }

  return `₹${min ?? max}`;
}

function statusLabel(status: string) {
  switch (status) {
    case "open":
      return "Open";
    case "closed":
      return "Closed";
    case "listed":
      return "Listed";
    default:
      return "Upcoming";
  }
}

function statusClass(status: string) {
  switch (status) {
    case "open":
      return "ipo-status-open";

    case "closed":
      return "ipo-status-closed";

    case "listed":
      return "ipo-status-listed";

    default:
      return "ipo-status-upcoming";
  }
}

function IPOCard({ ipo }: { ipo: IPO }) {
  return (
    <article className="ipo-card">

      <div className="ipo-card-top">

        <div className="ipo-company-logo">

          {ipo.logo_url ? (
            <img
              src={ipo.logo_url}
              alt={`${ipo.company_name} logo`}
            />
          ) : (
            <span>
              {ipo.company_name
                .charAt(0)
                .toUpperCase()}
            </span>
          )}

        </div>

        <div className="ipo-card-heading">

          <div className="ipo-card-status-row">

            <span
              className={`ipo-status ${statusClass(
                ipo.status
              )}`}
            >
              {statusLabel(ipo.status)}
            </span>

            <span className="ipo-type">
              {ipo.issue_type}
            </span>

          </div>

          <h3>{ipo.company_name}</h3>

        </div>

      </div>

      <div className="ipo-card-price">

        <span>Price Band</span>

        <strong>
          {formatPrice(
            ipo.price_band_min,
            ipo.price_band_max
          )}
        </strong>

      </div>

      <div className="ipo-card-grid">

        <div>
          <span>Issue Size</span>

          <strong>
            {ipo.issue_size !== null
              ? `₹${ipo.issue_size} Cr`
              : "—"}
          </strong>
        </div>

        <div>
          <span>Lot Size</span>

          <strong>
            {ipo.lot_size !== null
              ? ipo.lot_size
              : "—"}
          </strong>
        </div>

        <div>
          <span>Open</span>

          <strong>
            {formatDate(ipo.open_date)}
          </strong>
        </div>

        <div>
          <span>Close</span>

          <strong>
            {formatDate(ipo.close_date)}
          </strong>
        </div>

      </div>

      {ipo.minimum_investment !== null && (
        <div className="ipo-minimum">

          <span>
            Minimum Investment
          </span>

          <strong>
            ₹{ipo.minimum_investment.toLocaleString(
              "en-IN"
            )}
          </strong>

        </div>
      )}

      <Link
        href={`/ipo/${ipo.slug}`}
        className="ipo-view-button"
      >
        View IPO Details →
      </Link>

    </article>
  );
}

export default async function IPOPage() {
  const supabase = supabaseAdmin();

  const { data: ipos, error } = await supabase
    .from("ipos")
    .select(
      `
        id,
        company_name,
        slug,
        status,
        issue_type,
        price_band_min,
        price_band_max,
        issue_size,
        lot_size,
        minimum_investment,
        open_date,
        close_date,
        listing_date,
        logo_url
      `
    )
    .eq("is_published", true)
    .order("open_date", {
      ascending: true,
      nullsFirst: false,
    });

  if (error) {
    console.error("IPO page fetch error:", error);
  }

  const allIPOs: IPO[] = ipos || [];

  const upcomingIPOs = allIPOs.filter(
    (ipo) => ipo.status === "upcoming"
  );

  const openIPOs = allIPOs.filter(
    (ipo) => ipo.status === "open"
  );

  const closedIPOs = allIPOs.filter(
    (ipo) => ipo.status === "closed"
  );

  const listedIPOs = allIPOs.filter(
    (ipo) => ipo.status === "listed"
  );

  return (
    <main className="ipo-page">

      {/* ================================= */}
      {/* HERO */}
      {/* ================================= */}

      <section className="ipo-hero">

        <div className="ipo-hero-inner">

          <div className="ipo-eyebrow">
            IPO INFORMATION CENTRE
          </div>

          <h1>
            Initial Public Offerings
            <span>
              Explore • Compare • Understand
            </span>
          </h1>

          <p>
            Explore IPO details including price bands,
            issue size, important dates, company
            information, financial results and
            reservation details.
          </p>

        </div>

      </section>

      {/* ================================= */}
      {/* INTRO */}
      {/* ================================= */}

      <section className="ipo-intro-section">

        <div className="ipo-container">

          <div className="ipo-intro-grid">

            <div>

              <span className="ipo-section-label">
                IPO DASHBOARD
              </span>

              <h2>
                IPO information in one place
              </h2>

            </div>

            <div>

              <p>
                This section provides factual
                information about IPOs based on
                available issue documents and
                company disclosures.
              </p>

              <p>
                Review the issue structure, pricing,
                timeline, financial information,
                reservation and company profile
                before making your own decisions.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ================================= */}
      {/* OPEN IPOs */}
      {/* ================================= */}

      {openIPOs.length > 0 && (
        <section className="ipo-section">

          <div className="ipo-container">

            <div className="ipo-section-heading">

              <div>
                <span className="ipo-section-label">
                  CURRENTLY OPEN
                </span>

                <h2>
                  Open IPOs
                </h2>
              </div>

              <span className="ipo-count">
                {openIPOs.length} IPO
                {openIPOs.length !== 1
                  ? "s"
                  : ""}
              </span>

            </div>

            <div className="ipo-card-grid">

              {openIPOs.map((ipo) => (
                <IPOCard
                  key={ipo.id}
                  ipo={ipo}
                />
              ))}

            </div>

          </div>

        </section>
      )}

      {/* ================================= */}
      {/* UPCOMING */}
      {/* ================================= */}

      {upcomingIPOs.length > 0 && (
        <section className="ipo-section ipo-section-alt">

          <div className="ipo-container">

            <div className="ipo-section-heading">

              <div>
                <span className="ipo-section-label">
                  COMING SOON
                </span>

                <h2>
                  Upcoming IPOs
                </h2>
              </div>

              <span className="ipo-count">
                {upcomingIPOs.length} IPO
                {upcomingIPOs.length !== 1
                  ? "s"
                  : ""}
              </span>

            </div>

            <div className="ipo-card-grid">

              {upcomingIPOs.map((ipo) => (
                <IPOCard
                  key={ipo.id}
                  ipo={ipo}
                />
              ))}

            </div>

          </div>

        </section>
      )}

      {/* ================================= */}
      {/* CLOSED */}
      {/* ================================= */}

      {closedIPOs.length > 0 && (
        <section className="ipo-section">

          <div className="ipo-container">

            <div className="ipo-section-heading">

              <div>
                <span className="ipo-section-label">
                  RECENTLY CLOSED
                </span>

                <h2>
                  Closed IPOs
                </h2>
              </div>

              <span className="ipo-count">
                {closedIPOs.length} IPO
                {closedIPOs.length !== 1
                  ? "s"
                  : ""}
              </span>

            </div>

            <div className="ipo-card-grid">

              {closedIPOs.map((ipo) => (
                <IPOCard
                  key={ipo.id}
                  ipo={ipo}
                />
              ))}

            </div>

          </div>

        </section>
      )}

      {/* ================================= */}
      {/* LISTED */}
      {/* ================================= */}

      {listedIPOs.length > 0 && (
        <section className="ipo-section ipo-section-alt">

          <div className="ipo-container">

            <div className="ipo-section-heading">

              <div>
                <span className="ipo-section-label">
                  LISTED
                </span>

                <h2>
                  Recently Listed IPOs
                </h2>
              </div>

              <span className="ipo-count">
                {listedIPOs.length} IPO
                {listedIPOs.length !== 1
                  ? "s"
                  : ""}
              </span>

            </div>

            <div className="ipo-card-grid">

              {listedIPOs.map((ipo) => (
                <IPOCard
                  key={ipo.id}
                  ipo={ipo}
                />
              ))}

            </div>

          </div>

        </section>
      )}

      {/* ================================= */}
      {/* EMPTY STATE */}
      {/* ================================= */}

      {allIPOs.length === 0 && (
        <section className="ipo-empty-section">

          <div className="ipo-container">

            <div className="ipo-empty-card">

              <div className="ipo-empty-icon">
                📈
              </div>

              <h2>
                IPO information will appear here
              </h2>

              <p>
                IPOs will be displayed here once
                they are added and published from
                the admin panel.
              </p>

            </div>

          </div>

        </section>
      )}

      {/* ================================= */}
      {/* DISCLAIMER */}
      {/* ================================= */}

      <section className="ipo-disclaimer">

        <div className="ipo-container">

          <p>
            <strong>Important:</strong>{" "}
            IPO information is provided for
            educational and informational purposes.
            Issue details, dates, pricing, reservation,
            financial information and subscription data
            should be verified from the relevant official
            offer documents and exchange disclosures.
            Nothing on this page should be interpreted
            as a recommendation to apply for or avoid
            an IPO.
          </p>

        </div>

      </section>

    </main>
  );
}
