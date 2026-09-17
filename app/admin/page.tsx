import { redirect } from 'next/navigation'
import AdminDashboard from './AdminDashboard'
import { createClient } from '../../lib/supabase/server'

export const dynamic = 'force-dynamic'

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'aravindchaudhary90@gmail.com').trim().toLowerCase()

export default async function AdminPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  const email = data.user?.email?.trim().toLowerCase()

  if (error || !email) redirect('/admin/login')
  if (email !== ADMIN_EMAIL) {
    await supabase.auth.signOut()
    redirect('/admin/login')
  }

  return <AdminDashboard email={email} />
}
