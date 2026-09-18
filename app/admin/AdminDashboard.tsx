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

const STATUSES = [
  'New',
  'Contacted',
  'Follow-up',
  'Converted',
]

function whatsappNumber(phone: string) {
  const digits = phone.replace(/\D/g, '')

  if (digits.startsWith('91')) return digits
  if (digits.length === 10) return `91${digits}`

  return digits
}

export default function AdminDashboard({
  email,
}: {
  email: string
}) {
  const router = useRouter()

  const [leads, setLeads] = useState<Lead[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  async function loadLeads() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        '/api/admin/leads',
        {
          cache: 'no-store',
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(
          data.error ||
          'Unable to load leads.'
        )

        setLoading(false)
        return
      }

      setLeads(data.leads || [])
    } catch {
      setError(
        'Unable to connect to the server.'
      )
    }

    setLoading(false)
  }

  useEffect(() => {
    loadLeads()
  }, [])

  async function updateStatus(
    id: number,
    status: string
  ) {
    const previousLeads = leads

    setUpdatingId(id)
    setError('')

    setLeads((current) =>
      current.map((lead) =>
        lead.id === id
          ? { ...lead, status }
          : lead
      )
    )

    try {
      const response = await fetch(
        '/api/admin/leads/status',
        {
          method: 'PATCH',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            id,
            status,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setLeads(previousLeads)

        setError(
          data.error ||
          'Unable to update status.'
        )
      }
    } catch {
      setLeads(previousLeads)

      setError(
        'Unable to update status.'
      )
    }

    setUpdatingId(null)
  }

  async function logout() {
    const supabase = createClient()

    await supabase.auth.signOut()

    router.replace('/admin/login')
    router.refresh()
  }

  const filteredLeads = useMemo(() => {
    const q = search.trim().toLowerCase()

    if (!q) return leads

    return leads.filter((lead) =>
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
          String(value)
            .toLowerCase()
            .includes(q)
        )
    )
  }, [leads, search])

  const total = leads.length

  const newCount = leads.filter(
    (lead) => lead.status === 'New'
  ).length

  const contactedCount = leads.filter(
    (lead) => lead.status === 'Contacted'
  ).length

  const followUpCount = leads.filter(
    (lead) => lead.status === 'Follow-up'
  ).length

  const convertedCount = leads.filter(
    (lead) => lead.status === 'Converted'
  ).length

  return (
    <main className="admin">

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
            🔐 Sign out
          </button>

        </div>
      </div>

      {/* COUNTERS */}

      <div className="leadStats">

        <div className="statCard">
          <div className="statIcon">
            📊
          </div>

          <div>
            <strong>{total}</strong>
            <span>Total Leads</span>
          </div>
        </div>

        <div className="statCard">
          <div className="statIcon">
            🆕
          </div>

          <div>
            <strong>{newCount}</strong>
            <span>New</span>
          </div>
        </div>

        <div className="statCard">
          <div className="statIcon">
            📞
          </div>

          <div>
            <strong>{contactedCount}</strong>
            <span>Contacted</span>
          </div>
        </div>

        <div className="statCard">
          <div className="statIcon">
            🔄
          </div>

          <div>
            <strong>{followUpCount}</strong>
            <span>Follow-up</span>
          </div>
        </div>

        <div className="statCard">
          <div className="statIcon">
            ✅
          </div>

          <div>
            <strong>{convertedCount}</strong>
            <span>Converted</span>
          </div>
        </div>

      </div>

      {/* SEARCH */}

      <div className="adminTools">

        <input
          className="searchInput"
          placeholder="🔎 Search name, phone, email, service..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <div className="leadCount">
          Showing {filteredLeads.length} of {total} leads
        </div>

      </div>

      {error && (
        <div className="errorBox">
          {error}
        </div>
      )}

      {loading && (
        <p className="muted">
          Loading enquiries...
        </p>
      )}

      {!loading &&
        !error &&
        filteredLeads.length === 0 && (
          <div className="emptyCard">
            No enquiries found.
          </div>
        )}

      {/* DESKTOP */}

      {!loading &&
        filteredLeads.length > 0 && (

          <div className="desktopLeads">

            <div className="leadTableWrap">

              <div className="leadTable">

                <div className="lead leadHead">

                  <span>Name</span>
                  <span>Phone</span>
                  <span>Email</span>
                  <span>Service</span>
                  <span>Message</span>
                  <span>Status</span>
                  <span>Date</span>
                  <span>Actions</span>

                </div>

                {filteredLeads.map(
                  (lead) => (

                    <div
                      className="lead"
                      key={lead.id}
                    >

                      <span>
                        <b>
                          {lead.name}
                        </b>
                      </span>

                      <span>
                        <a
                          className="actionLink"
                          href={`tel:${lead.phone}`}
                        >
                          📞 {lead.phone}
                        </a>
                      </span>

                      <span>
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
                        <b>
                          {lead.service}
                        </b>
                      </span>

                      <span className="messageCell">
                        {lead.message || '-'}
                      </span>

                      <span>

                        <select
                          className={`statusSelect status-${lead.status
                            .toLowerCase()
                            .replace(/\s+/g, '-')}`}
                          value={lead.status}
                          disabled={
                            updatingId === lead.id
                          }
                          onChange={(e) =>
                            updateStatus(
                              lead.id,
                              e.target.value
                            )
                          }
                        >

                          {STATUSES.map(
                            (status) => (
                              <option
                                key={status}
                                value={status}
                              >
                                {status}
                              </option>
                            )
                          )}

                        </select>

                      </span>

                      <span>
                        {new Date(
                          lead.created_at
                        ).toLocaleString()}
                      </span>

                      <span className="actionButtons">

                        <a
                          className="smallBtn callBtn"
                          href={`tel:${lead.phone}`}
                        >
                          📞 Call
                        </a>

                        <a
                          className="smallBtn whatsappBtn"
                          href={`https://wa.me/${whatsappNumber(
                            lead.phone
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
                  )
                )}

              </div>

            </div>

          </div>
        )}

      {/* MOBILE */}

      {!loading &&
        filteredLeads.length > 0 && (

          <div className="mobileLeads">

            {filteredLeads.map(
              (lead) => (

                <div
                  className="mobileLeadCard"
                  key={lead.id}
                >

                  <div className="mobileLeadTop">

                    <div>
                      <h2>
                        {lead.name}
                      </h2>

                      <div className="mobileService">
                        {lead.service}
                      </div>
                    </div>

                  </div>

                  <div className="mobileInfo">

                    <div>
                      <strong>
                        📞 Phone
                      </strong>

                      <a
                        href={`tel:${lead.phone}`}
                      >
                        {lead.phone}
                      </a>
                    </div>

                    {lead.email && (
                      <div>
                        <strong>
                          ✉️ Email
                        </strong>

                        <a
                          href={`mailto:${lead.email}`}
                        >
                          {lead.email}
                        </a>
                      </div>
                    )}

                    <div>
                      <strong>
                        📝 Message
                      </strong>

                      <p>
                        {lead.message || '-'}
                      </p>
                    </div>

                    <div>
                      <strong>
                        📅 Enquiry
                      </strong>

                      <p>
                        {new Date(
                          lead.created_at
                        ).toLocaleString()}
                      </p>
                    </div>

                    <div className="mobileStatus">

                      <strong>
                        📌 Lead Status
                      </strong>

                      <select
                        className="mobileStatusSelect"
                        value={lead.status}
                        disabled={
                          updatingId === lead.id
                        }
                        onChange={(e) =>
                          updateStatus(
                            lead.id,
                            e.target.value
                          )
                        }
                      >

                        {STATUSES.map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          )
                        )}

                      </select>

                    </div>

                  </div>

                  <div className="mobileActions">

                    <a
                      className="mobileAction call"
                      href={`tel:${lead.phone}`}
                    >
                      📞 Call
                    </a>

                    <a
                      className="mobileAction whatsapp"
                      href={`https://wa.me/${whatsappNumber(
                        lead.phone
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      💬 WhatsApp
                    </a>

                    {lead.email && (
                      <a
                        className="mobileAction email"
                        href={`mailto:${lead.email}`}
                      >
                        ✉️ Email
                      </a>
                    )}

                  </div>

                </div>
              )
            )}

          </div>
        )}

      <style jsx>{`

        .leadStats {
          display: grid;
          grid-template-columns:
            repeat(5, 1fr);
          gap: 14px;
          margin: 25px 0;
        }

        .statCard {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow:
            0 3px 12px
            rgba(0,0,0,0.05);
        }

        .statIcon {
          font-size: 25px;
        }

        .statCard strong {
          display: block;
          font-size: 25px;
        }

        .statCard span {
          display: block;
          color: #64748b;
          font-size: 13px;
        }

        .actionButtons {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .smallBtn {
          display: inline-block;
          padding: 7px 10px;
          border-radius: 7px;
          text-decoration: none;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }

        .callBtn {
          background: #e8f1ff;
          color: #1257a6;
        }

        .whatsappBtn {
          background: #e8f8ed;
          color: #12833a;
        }

        .emailBtn {
          background: #f0edff;
          color: #5b43a5;
        }

        .statusSelect,
        .mobileStatusSelect {
          border: 1px solid #dbe2ea;
          border-radius: 8px;
          padding: 7px 10px;
          background: white;
          font-weight: 600;
          cursor: pointer;
        }

        .mobileLeads {
          display: none;
        }

        .mobileLeadCard {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 18px;
          margin-bottom: 14px;
          box-shadow:
            0 4px 16px
            rgba(0,0,0,0.06);
        }

        .mobileLeadTop {
          border-bottom:
            1px solid #eee;
          padding-bottom: 14px;
        }

        .mobileLeadTop h2 {
          margin: 0 0 6px;
          font-size: 20px;
        }

        .mobileService {
          font-weight: 700;
          color: #315f9e;
          font-size: 14px;
        }

        .mobileInfo {
          padding-top: 14px;
        }

        .mobileInfo > div {
          margin-bottom: 14px;
        }

        .mobileInfo strong {
          display: block;
          font-size: 13px;
          margin-bottom: 4px;
        }

        .mobileInfo a {
          color: #1769aa;
          text-decoration: none;
          word-break: break-word;
        }

        .mobileInfo p {
          margin: 0;
          word-break: break-word;
        }

        .mobileStatusSelect {
          width: 100%;
          box-sizing: border-box;
          margin-top: 5px;
          padding: 11px;
        }

        .mobileActions {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 8px;
          margin-top: 16px;
        }

        .mobileAction {
          text-align: center;
          padding: 11px 6px;
          border-radius: 9px;
          text-decoration: none;
          font-weight: 700;
          font-size: 13px;
        }

        .mobileAction.call {
          background: #e8f1ff;
          color: #1257a6;
        }

        .mobileAction.whatsapp {
          background: #e8f8ed;
          color: #12833a;
        }

        .mobileAction.email {
          background: #f0edff;
          color: #5b43a5;
        }

        @media (max-width: 900px) {

          .leadStats {
            grid-template-columns:
              repeat(3, 1fr);
          }

        }

        @media (max-width: 768px) {

          .desktopLeads {
            display: none;
          }

          .mobileLeads {
            display: block;
          }

          .leadStats {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .adminTop {
            display: block;
          }

          .adminTop .actions {
            margin-top: 15px;
            display: flex;
            gap: 8px;
          }

          .adminTop .btn {
            flex: 1;
          }

          .adminTools {
            display: block;
          }

          .searchInput {
            width: 100%;
            box-sizing: border-box;
          }

          .leadCount {
            margin-top: 10px;
          }

        }

        @media (max-width: 430px) {

          .leadStats {
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          .statCard {
            padding: 13px;
          }

          .statCard strong {
            font-size: 21px;
          }

          .mobileLeadCard {
            padding: 15px;
          }

          .mobileActions {
            grid-template-columns: 1fr;
          }

        }

      `}</style>

    </main>
  )
}
