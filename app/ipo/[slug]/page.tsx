import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type IPO = {
  id: string;
  company_name: string;
  slug: string;
  status: string;
  issue_type: string;

  price_band_min: number | null;
  price_band_max: number | null;
  face_value: number | null;

  issue_size: number | null;
  fresh_issue: number | null;
  offer_for_sale: number | null;

  lot_size: number | null;
  minimum_investment: number | null;

  open_date: string | null;
  close_date: string | null;
  allotment_date: string | null;
  listing_date: string | null;

  registrar: string | null;
  lead_managers: string | null;

  company_overview: string | null;
  business_description: string | null;
  business_model: string | null;
  industry: string | null;

  competitive_strengths: string | null;
  risks: string | null;
  objects_of_issue: string | null;
  management: string | null;

  eps: number | null;
  pe_ratio: number | null;
  pb_ratio: number | null;
  roe: number | null;
  roce: number | null;
  debt_equity: number | null;

  retail_quota: number | null;
  nii_quota: number | null;
  qib_quota: number | null;
  employee_quota: number | null;
  other_quota: number | null;

  retail_lot_size: number | null;
  nii_lot_size: number | null;

  subscription_data: string | null;
  listing_information: string | null;

  logo_url: string | null;
  banner_url: string | null;

  is_published: boolean;
};

type QuarterlyResult = {
  id: string;
  quarter_label: string;
  revenue: number | null;
  ebitda: number | null;
  ebitda_margin: number | null;
  pat: number | null;
  eps: number | null;
  total_assets: number | null;
  total_debt: number | null;
  net_worth: number | null;
};

type ManagementPerson = {
  id: string;
  name: string;
  designation: string | null;
};

type SubscriptionRow = {
  id: string;
  category: string;
  subscription_times: number | null;
  updated_on: string | null;
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

function formatNumber(value: number | null) {
  if (value === null || value === undefined) {
    return "—";
  }

  return value.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
}

function formatCrore(value: number | null) {
  if (value === null || value === undefined) {
    return "—";
  }

  return `₹${formatNumber(value)} Cr`;
}

function formatPercent(value: number | null) {
  if (value === null || value === undefined) {
    return "—";
  }

  return `${formatNumber(value)}%`;
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

function renderText(text: string | null) {
  if (!text) {
    return (
      <p className="ipo-detail-muted">
        Information will be updated when available.
      </p>
    );
  }

  return text.split("\n").map((paragraph, index) => (
    <p key={index}>{paragraph}</p>
  ));
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="ipo-detail-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="ipo-info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default async function IPOViewPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const supabase = supabaseAdmin();

  const { data: ipo, error } = await supabase
    .from("ipos")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("IPO details fetch error:", error);
  }

  if (!ipo) {
    notFound();
  }

  const [
    quarterlyResponse,
    managementResponse,
    subscriptionResponse,
  ] = await Promise.all([
    supabase
      .from("ipo_quarterly_results")
      .select("*")
      .eq("ipo_id", ipo.id)
      .order("created_at", {
        ascending: true,
      }),

    supabase
      .from("ipo_management")
      .select("*")
      .eq("ipo_id", ipo.id)
      .order("created_at", {
        ascending: true,
      }),

    supabase
      .from("ipo_subscription")
      .select("*")
      .eq("ipo_id", ipo.id)
      .order("category", {
        ascending: true,
      }),
  ]);

  const quarterlyResults: QuarterlyResult[] =
    quarterlyResponse.data || [];

  const management: ManagementPerson[] =
    managementResponse.data || [];

  const subscriptionData: SubscriptionRow[] =
    subscriptionResponse.data || [];

  return (
    <main className="ipo-detail-page">

      {/* ================================= */}
      {/* HERO */}
      {/* ================================= */}

      <section className="ipo-detail-hero">

        <div className="ipo-container">

          <Link
            href="/ipo"
            className="ipo-back-link"
          >
            ← Back to IPOs
          </Link>

          <div className="ipo-detail-hero-grid">

            <div className="ipo-detail-logo">

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

            <div className="ipo-detail-heading">

              <div className="ipo-detail-badges">

                <span className="ipo-detail-status">
                  {statusLabel(ipo.status)}
                </span>

                <span className="ipo-detail-type">
                  {ipo.issue_type}
                </span>

              </div>

              <h1>{ipo.company_name}</h1>

              {ipo.industry && (
                <p className="ipo-detail-industry">
                  {ipo.industry}
                </p>
              )}

            </div>

          </div>

        </div>

      </section>

      {/* ================================= */}
      {/* QUICK OVERVIEW */}
      {/* ================================= */}

      <section className="ipo-detail-section">

        <div className="ipo-container">

          <div className="ipo-detail-section-heading">
            <span>IPO OVERVIEW</span>
            <h2>Key Issue Details</h2>
          </div>

          <div className="ipo-detail-metrics">

            <Metric
              label="Price Band"
              value={
                ipo.price_band_min !== null &&
                ipo.price_band_max !== null
                  ? `₹${formatNumber(
                      ipo.price_band_min
                    )} – ₹${formatNumber(
                      ipo.price_band_max
                    )}`
                  : "—"
              }
            />

            <Metric
              label="Issue Size"
              value={formatCrore(
                ipo.issue_size
              )}
            />

            <Metric
              label="Lot Size"
              value={
                ipo.lot_size !== null
                  ? `${formatNumber(
                      ipo.lot_size
                    )} shares`
                  : "—"
              }
            />

            <Metric
              label="Minimum Investment"
              value={
                ipo.minimum_investment !== null
                  ? `₹${formatNumber(
                      ipo.minimum_investment
                    )}`
                  : "—"
              }
            />

            <Metric
              label="Face Value"
              value={
                ipo.face_value !== null
                  ? `₹${formatNumber(
                      ipo.face_value
                    )}`
                  : "—"
              }
            />

            <Metric
              label="Issue Type"
              value={ipo.issue_type}
            />

          </div>

        </div>

      </section>

      {/* ================================= */}
      {/* TIMELINE */}
      {/* ================================= */}

      <section className="ipo-detail-section ipo-detail-section-alt">

        <div className="ipo-container">

          <div className="ipo-detail-section-heading">
            <span>IMPORTANT DATES</span>
            <h2>IPO Timeline</h2>
          </div>

          <div className="ipo-timeline-grid">

            <div>
              <span>Issue Opens</span>
              <strong>
                {formatDate(ipo.open_date)}
              </strong>
            </div>

            <div>
              <span>Issue Closes</span>
              <strong>
                {formatDate(ipo.close_date)}
              </strong>
            </div>

            <div>
              <span>Allotment</span>
              <strong>
                {formatDate(
                  ipo.allotment_date
                )}
              </strong>
            </div>

            <div>
              <span>Listing</span>
              <strong>
                {formatDate(
                  ipo.listing_date
                )}
              </strong>
            </div>

          </div>

        </div>

      </section>

      {/* ================================= */}
      {/* ISSUE STRUCTURE */}
      {/* ================================= */}

      <section className="ipo-detail-section">

        <div className="ipo-container">

          <div className="ipo-detail-section-heading">
            <span>ISSUE STRUCTURE</span>
            <h2>Issue Composition</h2>
          </div>

          <div className="ipo-info-card">

            <InfoRow
              label="Total Issue Size"
              value={formatCrore(
                ipo.issue_size
              )}
            />

            <InfoRow
              label="Fresh Issue"
              value={formatCrore(
                ipo.fresh_issue
              )}
            />

            <InfoRow
              label="Offer for Sale"
              value={formatCrore(
                ipo.offer_for_sale
              )}
            />

            <InfoRow
              label="Retail Lot"
              value={
                ipo.retail_lot_size !== null
                  ? `${formatNumber(
                      ipo.retail_lot_size
                    )} shares`
                  : "—"
              }
            />

            <InfoRow
              label="NII / HNI Lot"
              value={
                ipo.nii_lot_size !== null
                  ? `${formatNumber(
                      ipo.nii_lot_size
                    )} shares`
                  : "—"
              }
            />

          </div>

        </div>

      </section>

      {/* ================================= */}
      {/* COMPANY */}
      {/* ================================= */}

      <section className="ipo-detail-section ipo-detail-section-alt">

        <div className="ipo-container">

          <div className="ipo-detail-section-heading">
            <span>COMPANY</span>
            <h2>About the Company</h2>
          </div>

          <div className="ipo-detail-content">

            {renderText(
              ipo.company_overview
            )}

          </div>

          <div className="ipo-detail-two-column">

            <div className="ipo-detail-content-card">

              <h3>Business</h3>

              {renderText(
                ipo.business_description
              )}

            </div>

            <div className="ipo-detail-content-card">

              <h3>Business Model</h3>

              {renderText(
                ipo.business_model
              )}

            </div>

          </div>

        </div>

      </section>

      {/* ================================= */}
      {/* OBJECTS OF ISSUE */}
      {/* ================================= */}

      <section className="ipo-detail-section">

        <div className="ipo-container">

          <div className="ipo-detail-section-heading">
            <span>USE OF PROCEEDS</span>
            <h2>Objects of the Issue</h2>
          </div>

          <div className="ipo-detail-content">
            {renderText(
              ipo.objects_of_issue
            )}
          </div>

        </div>

      </section>

      {/* ================================= */}
      {/* FINANCIAL RESULTS */}
      {/* ================================= */}

      <section className="ipo-detail-section ipo-detail-section-alt">

        <div className="ipo-container">

          <div className="ipo-detail-section-heading">
            <span>FINANCIAL PERFORMANCE</span>
            <h2>Last 4 Quarters</h2>
          </div>

          {quarterlyResults.length > 0 ? (
            <div className="ipo-results-table-wrap">

              <table className="ipo-results-table">

                <thead>
                  <tr>
                    <th>Quarter</th>
                    <th>Revenue</th>
                    <th>EBITDA</th>
                    <th>Margin</th>
                    <th>PAT</th>
                    <th>EPS</th>
                  </tr>
                </thead>

                <tbody>

                  {quarterlyResults
                    .slice(-4)
                    .map((result) => (
                      <tr key={result.id}>

                        <td>
                          {result.quarter_label}
                        </td>

                        <td>
                          {formatCrore(
                            result.revenue
                          )}
                        </td>

                        <td>
                          {formatCrore(
                            result.ebitda
                          )}
                        </td>

                        <td>
                          {formatPercent(
                            result.ebitda_margin
                          )}
                        </td>

                        <td>
                          {formatCrore(
                            result.pat
                          )}
                        </td>

                        <td>
                          {formatNumber(
                            result.eps
                          )}
                        </td>

                      </tr>
                    ))}

                </tbody>

              </table>

            </div>
          ) : (
            <div className="ipo-empty-inline">
              Quarterly financial information will
              be displayed here once added.
            </div>
          )}

        </div>

      </section>

      {/* ================================= */}
      {/* VALUATION */}
      {/* ================================= */}

      <section className="ipo-detail-section">

        <div className="ipo-container">

          <div className="ipo-detail-section-heading">
            <span>VALUATION</span>
            <h2>Key Financial Metrics</h2>
          </div>

          <div className="ipo-detail-metrics">

            <Metric
              label="EPS"
              value={formatNumber(ipo.eps)}
            />

            <Metric
              label="P/E"
              value={formatNumber(
                ipo.pe_ratio
              )}
            />

            <Metric
              label="P/B"
              value={formatNumber(
                ipo.pb_ratio
              )}
            />

            <Metric
              label="ROE"
              value={formatPercent(
                ipo.roe
              )}
            />

            <Metric
              label="ROCE"
              value={formatPercent(
                ipo.roce
              )}
            />

            <Metric
              label="Debt / Equity"
              value={formatNumber(
                ipo.debt_equity
              )}
            />

          </div>

        </div>

      </section>

      {/* ================================= */}
      {/* RESERVATION */}
      {/* ================================= */}

      <section className="ipo-detail-section ipo-detail-section-alt">

        <div className="ipo-container">

          <div className="ipo-detail-section-heading">
            <span>RESERVATION</span>
            <h2>IPO Reservation</h2>
          </div>

          <div className="ipo-reservation-grid">

            <Metric
              label="QIB"
              value={formatPercent(
                ipo.qib_quota
              )}
            />

            <Metric
              label="NII / HNI"
              value={formatPercent(
                ipo.nii_quota
              )}
            />

            <Metric
              label="Retail"
              value={formatPercent(
                ipo.retail_quota
              )}
            />

            <Metric
              label="Employee"
              value={formatPercent(
                ipo.employee_quota
              )}
            />

            <Metric
              label="Other"
              value={formatPercent(
                ipo.other_quota
              )}
            />

          </div>

        </div>

      </section>

      {/* ================================= */}
      {/* MANAGEMENT */}
      {/* ================================= */}

      <section className="ipo-detail-section">

        <div className="ipo-container">

          <div className="ipo-detail-section-heading">
            <span>LEADERSHIP</span>
            <h2>Management</h2>
          </div>

          {management.length > 0 ? (
            <div className="ipo-management-grid">

              {management.map((person) => (
                <div
                  className="ipo-management-card"
                  key={person.id}
                >
                  <strong>
                    {person.name}
                  </strong>

                  {person.designation && (
                    <span>
                      {person.designation}
                    </span>
                  )}
                </div>
              ))}

            </div>
          ) : (
            <div className="ipo-detail-content">
              {renderText(
                ipo.management
              )}
            </div>
          )}

        </div>

      </section>

      {/* ================================= */}
      {/* STRENGTHS & RISKS */}
      {/* ================================= */}

      <section className="ipo-detail-section ipo-detail-section-alt">

        <div className="ipo-container">

          <div className="ipo-detail-section-heading">
            <span>ANALYSIS</span>
            <h2>Strengths & Risks</h2>
          </div>

          <div className="ipo-detail-two-column">

            <div className="ipo-detail-content-card">

              <h3>
                Key Strengths
              </h3>

              {renderText(
                ipo.competitive_strengths
              )}

            </div>

            <div className="ipo-detail-content-card ipo-risk-card">

              <h3>
                Key Risks
              </h3>

              {renderText(
                ipo.risks
              )}

            </div>

          </div>

        </div>

      </section>

      {/* ================================= */}
      {/* SUBSCRIPTION */}
      {/* ================================= */}

      <section className="ipo-detail-section">

        <div className="ipo-container">

          <div className="ipo-detail-section-heading">
            <span>SUBSCRIPTION</span>
            <h2>Subscription Information</h2>
          </div>

          {subscriptionData.length > 0 ? (
            <div className="ipo-results-table-wrap">

              <table className="ipo-results-table">

                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Subscription</th>
                    <th>Updated</th>
                  </tr>
                </thead>

                <tbody>

                  {subscriptionData.map(
                    (row) => (
                      <tr key={row.id}>

                        <td>
                          {row.category}
                        </td>

                        <td>
                          {row.subscription_times !==
                          null
                            ? `${formatNumber(
                                row.subscription_times
                              )}x`
                            : "—"}
                        </td>

                        <td>
                          {formatDate(
                            row.updated_on
                          )}
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          ) : (
            <div className="ipo-detail-content">

              {renderText(
                ipo.subscription_data
              )}

            </div>
          )}

        </div>

      </section>

      {/* ================================= */}
      {/* LISTING */}
      {/* ================================= */}

      <section className="ipo-detail-section ipo-detail-section-alt">

        <div className="ipo-container">

          <div className="ipo-detail-section-heading">
            <span>LISTING</span>
            <h2>Listing Information</h2>
          </div>

          <div className="ipo-detail-content">

            {renderText(
              ipo.listing_information
            )}

          </div>

        </div>

      </section>

      {/* ================================= */}
      {/* CONTACT / CTA */}
      {/* ================================= */}

      <section className="ipo-detail-cta">

        <div className="ipo-container">

          <h2>
            Need help understanding an IPO?
          </h2>

          <p>
            You can contact us for general
            information and financial guidance.
          </p>

          <div className="ipo-detail-cta-buttons">

            <a
              href="https://wa.me/919173334069"
              target="_blank"
              rel="noopener noreferrer"
              className="ipo-detail-whatsapp"
            >
              💬 WhatsApp
            </a>

            <a
              href="tel:+919173334069"
              className="ipo-detail-call"
            >
              📞 Call
            </a>

          </div>

        </div>

      </section>

      {/* ================================= */}
      {/* DISCLAIMER */}
      {/* ================================= */}

      <section className="ipo-detail-disclaimer">

        <div className="ipo-container">

          <p>
            <strong>Disclaimer:</strong>{" "}
            IPO information is provided for
            educational and informational purposes.
            Investors should independently verify
            the latest information from the company's
            official offer documents, stock exchange
            disclosures and other authoritative sources.
            Past financial performance does not guarantee
            future performance. Nothing on this page
            constitutes an investment recommendation or
            guarantee of returns.
          </p>

        </div>

      </section>

    </main>
  );
}
