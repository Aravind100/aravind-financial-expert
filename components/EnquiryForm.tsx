'use client'

import { useState } from 'react'

function normalizeIndianPhone(phone: string) {
  let digits = phone.replace(/\D/g, '')

  // Remove Indian country code
  if (digits.startsWith('91') && digits.length === 12) {
    digits = digits.slice(2)
  }

  // Remove leading zero from an 11-digit Indian number
  if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1)
  }

  return digits
}

export default function EnquiryForm({
  service = 'General Enquiry',
}: {
  service?: string
}) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    service,
    message: '',
  })

  const [status, setStatus] = useState('')

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setStatus('Sending...')

    const cleanPhone = normalizeIndianPhone(form.phone)

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setStatus(
        'Please enter a valid 10-digit Indian mobile number.'
      )
      return
    }

    const cleanedForm = {
      ...form,
      phone: cleanPhone,
    }

    try {
      const r = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedForm),
      })

      const d = await r.json()

      setStatus(
        r.ok
          ? 'Thank you. Your enquiry has been received.'
          : d.error || 'Something went wrong.'
      )

      if (r.ok) {
        setForm({
          name: '',
          phone: '',
          email: '',
          service,
          message: '',
        })
      }
    } catch {
      setStatus(
        'Unable to connect to the server. Please try again.'
      )
    }
  }

  return (
    <form className="form" onSubmit={submit}>

      <input
        required
        placeholder="Full name"
        value={form.name}
        autoComplete="name"
        onChange={(e) =>
          setForm({
            ...form,
            name: e.target.value,
          })
        }
      />

      <input
        required
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        maxLength={13}
        placeholder="Mobile number"
        value={form.phone}
        onChange={(e) =>
          setForm({
            ...form,
            phone: e.target.value,
          })
        }
      />

      <input
        type="email"
        placeholder="Email"
        value={form.email}
        autoComplete="email"
        onChange={(e) =>
          setForm({
            ...form,
            email: e.target.value,
          })
        }
      />

      <select
        value={form.service}
        onChange={(e) =>
          setForm({
            ...form,
            service: e.target.value,
          })
        }
      >
        {[
          'General Enquiry',
          'Mutual Funds / SIP',
          'Equity / Demat',
          'PMS',
          'AIF',
          'IMP',
          'SWP',
          'Life / Term Insurance',
          'Health Insurance',
          'Home Loan',
          'Business Loan',
          'Personal Loan',
        ].map((item) => (
          <option
            key={item}
            value={item}
          >
            {item}
          </option>
        ))}
      </select>

      <textarea
        placeholder="How can we help?"
        value={form.message}
        onChange={(e) =>
          setForm({
            ...form,
            message: e.target.value,
          })
        }
      />

      <button
        className="btn"
        type="submit"
      >
        Send Enquiry
      </button>

      {status && (
        <div className="status">
          {status}
        </div>
      )}

    </form>
  )
}
