import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

const ADMIN_EMAIL = (
  process.env.ADMIN_EMAIL || 'aravindchaudhary90@gmail.com'
).trim().toLowerCase()

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()

    const { data, error: authError } =
      await supabase.auth.getUser()

    if (authError || !data.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (
      data.user.email.trim().toLowerCase() !==
      ADMIN_EMAIL
    ) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()

    const id = Number(body.id)
    const status = String(body.status || '').trim()

    const follow_up_date =
      body.follow_up_date
        ? String(body.follow_up_date).trim()
        : null

    const follow_up_notes =
      body.follow_up_notes !== undefined
        ? String(body.follow_up_notes || '').trim() || null
        : null

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

    const updateData: {
      status: string
      follow_up_date?: string | null
      follow_up_notes?: string | null
    } = {
      status,
    }

    if (body.follow_up_date !== undefined) {
      updateData.follow_up_date = follow_up_date
    }

    if (body.follow_up_notes !== undefined) {
      updateData.follow_up_notes = follow_up_notes
    }

    const { data: lead, error } = await admin
      .from('leads')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error(
        'Lead update error:',
        error
      )

      return NextResponse.json(
        { error: 'Unable to update lead.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      lead,
    })
  } catch (error) {
    console.error(
      'Lead status API error:',
      error
    )

    return NextResponse.json(
      { error: 'Server error.' },
      { status: 500 }
    )
  }
}

