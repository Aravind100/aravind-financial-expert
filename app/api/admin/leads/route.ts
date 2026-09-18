import { NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { supabaseAdmin } from '../../../../lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

const ADMIN_EMAIL = (
  process.env.ADMIN_EMAIL ||
  'aravindchaudhary90@gmail.com'
).trim().toLowerCase()

export async function GET() {
  try {
    const authClient = await createClient()

    const { data, error: authError } =
      await authClient.auth.getUser()

    const email = data.user?.email?.trim().toLowerCase()

    if (
      authError ||
      !email ||
      email !== ADMIN_EMAIL
    ) {
      return NextResponse.json(
        { error: 'Unauthorized.' },
        { status: 401 }
      )
    }

    const admin = supabaseAdmin()

    const { data: leads, error } = await admin
      .from('leads')
      .select(
        'id,name,phone,email,service,message,status,created_at,follow_up_date,follow_up_notes'
      )
      .order('created_at', {
        ascending: false,
      })

    if (error) {
      console.error(
        'Admin leads fetch error:',
        error
      )

      return NextResponse.json(
        { error: 'Unable to load leads.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      leads: leads || [],
    })
  } catch (error) {
    console.error(
      'Admin API error:',
      error
    )

    return NextResponse.json(
      { error: 'Unable to load leads.' },
      { status: 500 }
    )
  }
}
