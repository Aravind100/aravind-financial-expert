'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'
import Link from "next/link";

type Lead = {
  id: number
  name: string
  phone: string
  email: string | null
  service: string
  message: string | null
  status: string
  created_at: string
  follow_up_date: string | null
  follow_up_notes: string | null
}

type FollowUpDraft = {
  date: string
  notes: string
}

const STATUSES = [
  'New',
  'Contacted',
  'Follow-up',
  'Converted',
  'Closed',
]

function whatsappNumber(phone: string) {
  const digits = phone.replace(/\D/g, '')

  if (digits.startsWith('91')) return digits

  if (digits.length === 10) {
    return `91${digits}`
  }

  return digits
}

function formatDate(date: string | null) {
  if (!date) return ''

  const parts = date.split('-')

  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`
  }

  return date
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
  const [savingFollowUpId, setSavingFollowUpId] = useState<number | null>(
    null
  )

  const [followUpDrafts, setFollowUpDrafts] = useState<
    Record<number, FollowUpDraft>
  >({})

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

      const loadedLeads: Lead[] = data.leads || []

      setLeads(loadedLeads)

      const drafts: Record<number, FollowUpDraft> = {}

      loadedLeads.forEach((lead) => {
        drafts[lead.id] = {
          date: lead.follow_up_date || '',
          notes: lead.follow_up_notes || '',
        }
      })

      setFollowUpDrafts(drafts)
    } catch {
      setError('Unable to connect to the server.')
    }

    setLoading(false)
  }

  useEffect(() => {
    loadLeads()
  }, [])

  async function updateStatus(id: number, status: string) {
    const previousLeads = leads

    setUpdatingId(id)
    setError('')

    setLeads((current) =>
      current.map((lead) =>
        lead.id === id
          ? {
              ...lead,
              status,
            }
          : lead
      )
    )

    try {
      const lead = leads.find((item) => item.id === id)

      const response = await fetch('/api/admin/leads/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          status,
          follow_up_date: lead?.follow_up_date || null,
          follow_up_notes: lead?.follow_up_notes || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setLeads(previousLeads)
        setError(data.error || 'Unable to update status.')
      }
    } catch {
      setLeads(previousLeads)
      setError('Unable to update status.')
    }

    setUpdatingId(null)
  }

  function updateFollowUpDraft(
    id: number,
    field: 'date' | 'notes',
    value: string
  ) {
    setFollowUpDrafts((current) => ({
      ...current,
      [id]: {
        date: current[id]?.date || '',
        notes: current[id]?.notes || '',
        [field]: value,
      },
    }))
  }

  async function saveFollowUp(id: number) {
    const previousLeads = leads

    const draft = followUpDrafts[id] || {
      date: '',
      notes: '',
    }

    setSavingFollowUpId(id)
    setError('')

    setLeads((current) =>
      current.map((lead) =>
        lead.id === id
          ? {
              ...lead,
              follow_up_date: draft.date || null,
              follow_up_notes: draft.notes || null,
            }
          : lead
      )
    )

    try {
      const lead = leads.find((item) => item.id === id)

      const response = await fetch('/api/admin/leads/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          status: lead?.status || 'New',
          follow_up_date: draft.date || null,
          follow_up_notes: draft.notes || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setLeads(previousLeads)

        setError(
          data.error || 'Unable to save follow-up details.'
        )

        setSavingFollowUpId(null)
        return
      }

      if (data.lead) {
        setLeads((current) =>
          current.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...data.lead,
                }
              : item
          )
        )
      }
    } catch {
      setLeads(previousLeads)
      setError('Unable to save follow-up details.')
    }

    setSavingFollowUpId(null)
  }

  async function logout() {
    const supabase = createClient()

    await supabase.auth.signOut()

    router.replace('/admin/login')
    router.refresh()
  }

  const filteredLeads = useMemo(() => {
    const q = search.trim().toLowerCase()

    if (!q) {
      return leads
    }

    return leads.filter((lead) =>
      [
        lead.name,
        lead.phone,
        lead.email,
        lead.service,
        lead.message,
        lead.status,
        lead.follow_up_notes,
        lead.follow_up_date,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(q)
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

      <div className="adminTop">
        <div>
          <h1>Lead Dashboard</h1>

          <p className="muted">
            Signed in as {email}
          </p>
        </div>

        <div className="actions">

          <button
            type="button"
            className="btn alt"
            onClick={loadLeads}
            disabled={loading}
          >
            🔄 Refresh
          </button>

          <Link
    href="/admin/ipo"
    className="btn alt"
  >
    📈 IPO Management
  </Link>

          <button
            type="button"
            className="btn"
            onClick={logout}
          >
            🔐 Sign out
          </button>

        </div>
      </div>

      <div className="leadStats">

        <div className="statCard">
          <div className="statIcon">📊</div>

          <div>
            <strong>{total}</strong>
            <span>Total Leads</span>
          </div>
        </div>

        <div className="statCard">
          <div className="statIcon">🆕</div>

          <div>
            <strong>{newCount}</strong>
            <span>New</span>
          </div>
        </div>

        <div className="statCard">
          <div className="statIcon">📞</div>

          <div>
            <strong>{contactedCount}</strong>
            <span>Contacted</span>
          </div>
        </div>

        <div className="statCard">
          <div className="statIcon">🔄</div>

          <div>
            <strong>{followUpCount}</strong>
            <span>Follow-up</span>
          </div>
        </div>

        <div className="statCard">
          <div className="statIcon">✅</div>

          <div>
            <strong>{convertedCount}</strong>
            <span>Converted</span>
          </div>
        </div>

      </div>

      <div className="adminTools">

        <input
          className="searchInput"
          placeholder="🔎 Search name, phone, email, service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
                  <span>Enquiry Date</span>
                  <span>Follow-up</span>
                  <span>Actions</span>
                </div>

                {filteredLeads.map((lead) => {

                  const draft = followUpDrafts[lead.id] || {
                    date: lead.follow_up_date || '',
                    notes: lead.follow_up_notes || '',
                  }

                  return (
                    <div
                      className="lead"
                      key={lead.id}
                    >

                      <span>
                        <b>{lead.name}</b>
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
                        <b>{lead.service}</b>
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

                          {STATUSES.map((status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          ))}

                        </select>

                      </span>

                      <span>
                        {new Date(
                          lead.created_at
                        ).toLocaleString()}
                      </span>

                      <span className="followUpCell">

                        <label>
                          Date
                        </label>

                        <input
                          type="date"
                          value={draft.date}
                          onChange={(e) =>
                            updateFollowUpDraft(
                              lead.id,
                              'date',
                              e.target.value
                            )
                          }
                        />

                        <label>
                          Notes
                        </label>

                        <textarea
                          value={draft.notes}
                          onChange={(e) =>
                            updateFollowUpDraft(
                              lead.id,
                              'notes',
                              e.target.value
                            )
                          }
                          placeholder="Follow-up notes..."
                          rows={3}
                        />

                        <button
                          type="button"
                          className="saveFollowUpBtn"
                          onClick={() =>
                            saveFollowUp(lead.id)
                          }
                          disabled={
                            savingFollowUpId === lead.id
                          }
                        >
                          {savingFollowUpId === lead.id
                            ? 'Saving...'
                            : '💾 Save Follow-up'}
                        </button>

                        {lead.follow_up_date && (
                          <small className="savedInfo">
                            Saved: {formatDate(
                              lead.follow_up_date
                            )}
                          </small>
                        )}

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
                })}

              </div>

            </div>

          </div>
        )}

      {/* MOBILE */}

      {!loading &&
        filteredLeads.length > 0 && (
          <div className="mobileLeads">

            {filteredLeads.map((lead) => {

              const draft = followUpDrafts[lead.id] || {
                date: lead.follow_up_date || '',
                notes: lead.follow_up_notes || '',
              }

              return (
                <div
                  className="mobileLeadCard"
                  key={lead.id}
                >

                  <div className="mobileLeadTop">

                    <div>
                      <h2>{lead.name}</h2>

                      <div className="mobileService">
                        {lead.service}
                      </div>
                    </div>

                  </div>

                  <div className="mobileInfo">

                    <div>
                      <strong>📞 Phone</strong>

                      <a href={`tel:${lead.phone}`}>
                        {lead.phone}
                      </a>
                    </div>

                    {lead.email && (
                      <div>
                        <strong>✉️ Email</strong>

                        <a
                          href={`mailto:${lead.email}`}
                        >
                          {lead.email}
                        </a>
                      </div>
                    )}

                    <div>
                      <strong>📝 Message</strong>

                      <p>
                        {lead.message || '-'}
                      </p>
                    </div>

                    <div>
                      <strong>📅 Enquiry</strong>

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

                        {STATUSES.map((status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        ))}

                      </select>

                    </div>

                    <div className="mobileFollowUp">

                      <strong>
                        📅 Follow-up Date
                      </strong>

                      <input
                        type="date"
                        value={draft.date}
                        onChange={(e) =>
                          updateFollowUpDraft(
                            lead.id,
                            'date',
                            e.target.value
                          )
                        }
                      />

                      <strong>
                        📝 Follow-up Notes
                      </strong>

                      <textarea
                        value={draft.notes}
                        onChange={(e) =>
                          updateFollowUpDraft(
                            lead.id,
                            'notes',
                            e.target.value
                          )
                        }
                        placeholder="Enter follow-up notes..."
                        rows={4}
                      />

                      <button
                        type="button"
                        className="mobileSaveFollowUp"
                        onClick={() =>
                          saveFollowUp(lead.id)
                        }
                        disabled={
                          savingFollowUpId === lead.id
                        }
                      >
                        {savingFollowUpId === lead.id
                          ? 'Saving...'
                          : '💾 Save Follow-up'}
                      </button>

                      {lead.follow_up_date && (
                        <div className="savedMobile">
                          Saved date: {formatDate(
                            lead.follow_up_date
                          )}
                        </div>
                      )}

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
            })}

          </div>
        )}

      <style jsx>{`

        .leadStats {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
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
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.05);
          min-width: 0;
        }

        .statIcon {
          font-size: 25px;
          flex-shrink: 0;
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

        .followUpCell {
          min-width: 210px;
        }

        .followUpCell label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          margin: 5px 0 3px;
        }

        .followUpCell input,
        .followUpCell textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #dbe2ea;
          border-radius: 7px;
          padding: 7px;
          font-family: inherit;
          font-size: 12px;
        }

        .followUpCell textarea {
          resize: vertical;
        }

        .saveFollowUpBtn {
          width: 100%;
          margin-top: 7px;
          border: none;
          border-radius: 7px;
          padding: 9px;
          background: #1769aa;
          color: white;
          font-weight: 700;
          cursor: pointer;
        }

        .saveFollowUpBtn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .savedInfo {
          display: block;
          margin-top: 5px;
          color: #12833a;
          font-weight: 600;
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
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        }

        .mobileLeadTop {
          border-bottom: 1px solid #eee;
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
          min-height: 44px;
        }

        .mobileFollowUp {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 13px;
          margin-top: 10px;
        }

        .mobileFollowUp input,
        .mobileFollowUp textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #dbe2ea;
          border-radius: 8px;
          padding: 10px;
          margin: 5px 0 12px;
          font-family: inherit;
          font-size: 14px;
        }

        .mobileFollowUp textarea {
          resize: vertical;
        }

        .mobileSaveFollowUp {
          width: 100%;
          border: none;
          border-radius: 9px;
          padding: 12px;
          background: #1769aa;
          color: white;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
        }

        .mobileSaveFollowUp:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .savedMobile {
          color: #12833a;
          font-size: 12px;
          font-weight: 600;
          margin-top: 8px;
        }

        .mobileActions {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-top: 16px;
        }

        .mobileAction {
          text-align: center;
          padding: 12px 6px;
          border-radius: 9px;
          text-decoration: none;
          font-weight: 700;
          font-size: 13px;
          min-height: 44px;
          box-sizing: border-box;
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

        @media (max-width: 1200px) {

          .leadTableWrap {
            overflow-x: auto;
          }

          .leadTable {
            min-width: 1700px;
          }

        }

        @media (max-width: 900px) {

          .leadStats {
            grid-template-columns: repeat(3, 1fr);
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
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
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
            min-height: 44px;
          }

          .adminTools {
            display: block;
          }

          .searchInput {
            width: 100%;
            box-sizing: border-box;
            min-height: 44px;
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

          .statIcon {
            font-size: 21px;
          }

          .statCard strong {
            font-size: 21px;
          }

          .statCard span {
            font-size: 12px;
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
