'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'

type Lead = {
  id: number
  name: string
  phone: string
  email: string | null
  service: string
  message: string | null
  status: string
  created_at: string
}

const STATUSES = ['New', 'Contacted', 'Follow-up', 'Converted', 'Closed']

export default function AdminDashboard({ email }: { email: string }) {
  const router = useRouter()

  const [leads, setLeads] = useState<Lead[]>([])
  const [search, setSearch] = useState('')
  const [serviceFilter, setServiceFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadLeads() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/leads', {
        cache: 'no-store',
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Unable to load leads.')
        setLoading(false)
        return
      }

      setLeads(data.leads || [])
    } catch {
      setError('Unable to connect to the lead server.')
    }

    setLoading(false)
  }

  useEffect(() => {
    loadLeads()
  }, [])

  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/admin/login')
    router.refresh()
  }

  const services = useMemo(() => {
    const unique = Array.from(
      new Set(leads.map((lead) => lead.service).filter(Boolean))
    )

    return unique.sort()
  }, [leads])

  const filteredLeads = useMemo(() => {
    const q = search.trim().toLowerCase()

    return leads.filter((lead) => {
      const matchesSearch =
        !q ||
        [
          lead.name,
          lead.phone,
          lead.email,
          lead.service,
          lead.message,
          lead.status,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(q)
          )

      const matchesService =
        serviceFilter === 'All' ||
        lead.service === serviceFilter

      const matchesStatus =
        statusFilter === 'All' ||
        lead.status === statusFilter

      return matchesSearch && matchesService && matchesStatus
    })
  }, [leads, search, serviceFilter, statusFilter])

  const total = leads.length
  const newLeads = leads.filter((l) => l.status === 'New').length
  const contacted = leads.filter((l) => l.status === 'Contacted').length
  const followUp = leads.filter((l) => l.status === 'Follow-up').length
  const converted = leads.filter((l) => l.status === 'Converted').length
  const closed = leads.filter((l) => l.status === 'Closed').length

  function statusClass(status: string) {
    return `statusBadge status-${status
      .toLowerCase()
      .replace(/\s+/g, '-')}`
  }

  return (
    <main className="admin crmDashboard">

      {/* HEADER */}
      <div className="adminTop">
        <div>
          <h1>Lead Dashboard</h1>
          <p className="muted">
            Signed in as {email}
          </p>
        </div>

        <div className="actions">
          <button
            className="btn alt"
            onClick={loadLeads}
            disabled={loading}
          >
            🔄 Refresh
          </button>

          <button
            className="btn"
            onClick={logout}
          >
            🚪 Sign out
          </button>
        </div>
      </div>

      {/* STATISTICS */}
      <div className="crmStats">

        <div className="statCard">
          <div className="statIcon">📊</div>
          <div>
            <div className="statNumber">{total}</div>
            <div className="statLabel">Total Leads</div>
          </div>
        </div>

        <div className="statCard">
          <div className="statIcon">🆕</div>
          <div>
            <div className="statNumber">{newLeads}</div>
            <div className="statLabel">New</div>
          </div>
        </div>

        <div className="statCard">
          <div className="statIcon">📞</div>
          <div>
            <div className="statNumber">{contacted}</div>
            <div className="statLabel">Contacted</div>
          </div>
        </div>

        <div className="statCard">
          <div className="statIcon">🔄</div>
          <div>
            <div className="statNumber">{followUp}</div>
            <div className="statLabel">Follow-up</div>
          </div>
        </div>

        <div className="statCard">
          <div className="statIcon">✅</div>
          <div>
            <div className="statNumber">{converted}</div>
            <div className="statLabel">Converted</div>
          </div>
        </div>

        <div className="statCard">
          <div className="statIcon">🔒</div>
          <div>
            <div className="statNumber">{closed}</div>
            <div className="statLabel">Closed</div>
          </div>
        </div>

      </div>

      {/* FILTERS */}
      <div className="crmFilters">

        <input
          className="searchInput"
          placeholder="🔎 Search name, phone, email, service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="crmSelect"
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
        >
          <option value="All">All Services</option>

          {services.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>

        <select
          className="crmSelect"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>

          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <div className="leadCount">
          Showing {filteredLeads.length} of {total} leads
        </div>

      </div>

      {/* ERROR */}
      {error && (
        <div className="errorBox">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="emptyCard">
          Loading enquiries...
        </div>
      )}

      {/* EMPTY */}
      {!loading &&
        !error &&
        filteredLeads.length === 0 && (
          <div className="emptyCard">
            No enquiries found.
          </div>
        )}

      {/* DESKTOP TABLE */}
                    {lead.email ? (
                      <a
                        className="actionLink"
                        href={`mailto:${lead.email}`}
                      >
                        ✉️ {lead.email}
                      </a>
                    ) : (
                      '-'
                    )}
                  </span>

                  <span>
                    <b>{lead.service}</b>
                  </span>

                  <span className="messageCell">
                    {lead.message || '-'}
                  </span>

                  <span>
                    <span className={statusClass(lead.status)}>
                      {lead.status}
                    </span>
                  </span>

                  <span>
                    {new Date(
                      lead.created_at
                    ).toLocaleString()}
                  </span>

                  <span className="crmActions">

                    <a
                      className="smallBtn callBtn"
                      href={`tel:${lead.phone}`}
                    >
                      📞 Call
                    </a>

                    <a
                      className="smallBtn whatsappBtn"
                      href={`https://wa.me/${lead.phone.replace(
                        /[^0-9]/g,
                        ''
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      💬 WhatsApp
                    </a>

                    {lead.email && (
                      <a
                        className="smallBtn emailBtn"
                        href={`mailto:${lead.email}`}
                      >
                        ✉️ Email
                      </a>
                    )}

                  </span>

                </div>
              ))}

            </div>
          </div>
        )}

      {/* MOBILE CARDS */}
      {!loading &&
        filteredLeads.length > 0 && (
          <div className="mobileLeadCards">

            {filteredLeads.map((lead) => (
              <div
                className="mobileLeadCard"
                key={`mobile-${lead.id}`}
              >

                <div className="mobileLeadHeader">
                  <div>
                    <h3>{lead.name}</h3>
                    <p>{lead.service}</p>
                  </div>

                  <span className={statusClass(lead.status)}>
                    {lead.status}
                  </span>
                </div>

                <div className="mobileLeadInfo">

                  <div>
                    📞
                    <a href={`tel:${lead.phone}`}>
                      {lead.phone}
                    </a>
                  </div>

                  {lead.email && (
                    <div>
                      ✉️
                      <a href={`mailto:${lead.email}`}>
                        {lead.email}
                      </a>
                    </div>
                  )}

                  {lead.message && (
                    <div>
                      💬 {lead.message}
                    </div>
                  )}

                  <div>
                    📅{' '}
                    {new Date(
                      lead.created_at
                    ).toLocaleString()}
                  </div>

                </div>

                <div className="mobileLeadActions">

                  <a
                    href={`tel:${lead.phone}`}
                    className="smallBtn callBtn"
                  >
                    📞 Call
                  </a>

                  <a
                    href={`https://wa.me/${lead.phone.replace(
                      /[^0-9]/g,
                      ''
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="smallBtn whatsappBtn"
                  >
                    💬 WhatsApp
                  </a>

                  {lead.email && (
                    <a
                      href={`mailto:${lead.email}`}
                      className="smallBtn emailBtn"
                    >
                      ✉️ Email
                    </a>
                  )}

                </div>

              </div>
            ))}

          </div>
        )}

      {/* SELF-CONTAINED CRM STYLES */}
      <style jsx>{`

        .crmStats {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 14px;
          margin: 24px 0;
        }

        .statCard {
          border: 1px solid #e3e8f0;
          border-radius: 14px;
          padding: 18px;
          background: #ffffff;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 4px 14px rgba(0,0,0,.04);
        }

        .statIcon {
          font-size: 24px;
        }

        .statNumber {
          font-size: 25px;
          font-weight: 800;
          color: #172554;
        }

        .statLabel {
          font-size: 13px;
          color: #64748b;
        }

        .crmFilters {
          display: flex;
          gap: 12px;
          align-items: center;
          margin: 20px 0;
          flex-wrap: wrap;
        }

        .crmSelect {
          min-height: 46px;
          padding: 0 14px;
          border: 1px solid #d8dee9;
          border-radius: 10px;
          background: white;
          font-size: 14px;
        }

        .crmActions {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .statusBadge {
          display: inline-block;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
          background: #eef2ff;
        }

        .status-New {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .status-Contacted {
          background: #fef3c7;
          color: #92400e;
        }

        .status-Follow-up {
          background: #ede9fe;
          color: #6d28d9;
        }

        .status-Converted {
          background: #dcfce7;
          color: #166534;
        }

        .status-Closed {
          background: #e5e7eb;
          color: #374151;
        }

        .mobileLeadCards {
          display: none;
        }

        .mobileLeadCard {
          border: 1px solid #e3e8f0;
          border-radius: 16px;
          padding: 18px;
          margin-bottom: 14px;
          background: white;
          box-shadow: 0 4px 14px rgba(0,0,0,.05);
        }

        .mobileLeadHeader {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
        }

        .mobileLeadHeader h3 {
          margin: 0 0 4px;
        }

        .mobileLeadHeader p {
          margin: 0;
          color: #64748b;
          font-size: 13px;
        }

        .mobileLeadInfo {
          display: grid;
          gap: 9px;
          font-size: 14px;
          color: #475569;
        }

        .mobileLeadInfo a {
          margin-left: 7px;
          color: #2563eb;
          text-decoration: none;
        }

        .mobileLeadActions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 16px;
        }

        .callBtn {
          background: #eff6ff;
        }

        .whatsappBtn {
          background: #ecfdf5;
        }

        .emailBtn {
          background: #f5f3ff;
        }

        @media (max-width: 1100px) {
          .crmStats {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 700px) {
          .crmStats {
            grid-template-columns: repeat(2, 1fr);
          }

          .crmFilters {
            display: grid;
            grid-template-columns: 1fr;
          }

          .crmSelect,
          .searchInput {
            width: 100%;
            box-sizing: border-box;
          }

          .leadTableWrap {
            display: none;
          }

          .mobileLeadCards {
            display: block;
          }

          .statCard {
            padding: 14px;
          }

          .statNumber {
            font-size: 21px;
          }
        }

      `}</style>

    </main>
  )
}
