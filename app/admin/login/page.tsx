'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../lib/supabase/client'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('aravindchaudhary90@gmail.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const check = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      if (data.user?.email?.toLowerCase() === 'aravindchaudhary90@gmail.com') router.replace('/admin')
    }
    check()
  }, [router])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }

    if (data.user?.email?.toLowerCase() !== 'aravindchaudhary90@gmail.com') {
      await supabase.auth.signOut()
      setError('This account is not authorized for the admin dashboard.')
      setLoading(false)
      return
    }

    router.replace('/admin')
    router.refresh()
  }

  return (
    <main className="adminLogin">
      <div className="loginCard">
        <div className="loginIcon">🔐</div>
        <h1>Admin Login</h1>
        <p className="muted">Sign in to securely view customer enquiries.</p>
        <form onSubmit={handleSubmit} className="form">
          <label>Email address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
          {error && <div className="errorBox">{error}</div>}
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
        </form>
      </div>
    </main>
  )
}
