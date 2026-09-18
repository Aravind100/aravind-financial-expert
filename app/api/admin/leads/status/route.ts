import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

const ADMIN_EMAIL = (
  process.env.ADMIN_EMAIL || 'aravindchaudhary90@gmail.com'
).trim().toLowerCase()

export async function PATCH(request: Request) {
  try {
    // Verify logged-in user
    const supabase = await createClient()
    const { data, error: authError } = await supabase.auth.getUser()

    if (authError || !data.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify admin email
    if (data.user.email.trim().toLowerCase() !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()

    const id = Number(body.id)
    const status = String(body.status || '').trim()

    if (!Number.isInteger(id) || !status) {
      return NextResponse.json(
        { error: 'Invalid lead ID or status.' },
        { status: 400 }
      )
    }

    const allowedStatuses = [
      'New',
      'Contacted',
      'Follow-up',
      'Converted',
      'Closed',
    ]

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status.' },
        { status: 400 }
      )
    }

    const admin = supabaseAdmin()

    const { data: lead, error } = await admin
      .from('leads')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Lead status update error:', error)

      return NextResponse.json(
        { error: 'Unable to update lead status.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      lead,
    })
  } catch (error) {
    console.error('Status API error:', error)

    return NextResponse.json(
      { error: 'Server error.' },
      { status: 500 }
    )
  }
}
