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

export default function AdminDashboard({ email }: { email: string }) {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadLeads() {
    setLoading(true)
    setError('')
    const response = await fetch('/api/admin/leads', { cache: 'no-store' })
    const data = await response.json()
    if (!response.ok) {
      setError(data.error || 'Unable to load leads.')
      setLoading(false)
      return
    }
    setLeads(data.leads || [])
    setLoading(false)
  }

  useEffect(() => { loadLeads() }, [])

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
      [lead.name, lead.phone, lead.email, lead.service, lead.message]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    )
  }, [leads, search])

  return (
    <main className="admin">
      <div className="adminTop">
        <div><h1>Lead Dashboard</h1><p className="muted">Signed in as {email}</p></div>
        <div className="actions"><button className="btn alt" onClick={loadLeads}>Refresh</button><button className="btn" onClick={logout}>Sign out</button></div>
      </div>
      <div className="adminTools">
        <input className="searchInput" placeholder="Search name, phone, email or service…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="leadCount">{filteredLeads.length} lead{filteredLeads.length === 1 ? '' : 's'}</div>
      </div>
      {error && <div className="errorBox">{error}</div>}
      {loading && <p className="muted">Loading enquiries…</p>}
      {!loading && !error && filteredLeads.length === 0 && <div className="emptyCard">No enquiries found.</div>}
      {!loading && filteredLeads.length > 0 && (
        <div className="leadTableWrap"><div className="leadTable">
          <div className="lead leadHead"><span>Name</span><span>Phone</span><span>Email</span><span>Service</span><span>Message</span><span>Status</span><span>Date</span><span>Actions</span></div>
          {filteredLeads.map((lead) => (
            <div className="lead" key={lead.id}>
              <span><b>{lead.name}</b></span>
              <span><a className="actionLink" href={`tel:${lead.phone}`}>📞 {lead.phone}</a></span>
              <span>{lead.email ? <a className="actionLink" href={`mailto:${lead.email}`}>{lead.email}</a> : '-'}</span>
              <span>{lead.service}</span>
              <span className="messageCell">{lead.message || '-'}</span>
              <span className="pill">{lead.status}</span>
              <span>{new Date(lead.created_at).toLocaleString()}</span>
              <span><a className="smallBtn" href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer">WhatsApp</a></span>
            </div>
          ))}
        </div></div>
      )}
    </main>
  )
}
