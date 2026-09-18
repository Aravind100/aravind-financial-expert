import { NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { supabaseAdmin } from '../../../../lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

const ADMIN_EMAIL = (
  process.env.ADMIN_EMAIL || 'aravindchaudhary90@gmail.com'
)
  .trim()
  .toLowerCase()

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

    const { data: articles, error } = await admin
      .from('articles')
      .select('*')
      .order('created_at', {
        ascending: false,
      })

    if (error) {
      console.error(
        'Admin articles fetch error:',
        error
      )

      return NextResponse.json(
        { error: 'Unable to load articles.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      articles: articles || [],
    })
  } catch (error) {
    console.error(
      'Admin articles API error:',
      error
    )

    return NextResponse.json(
      { error: 'Unable to load articles.' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request
) {
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

    const body = await request.json()

    const title = String(
      body.title || ''
    ).trim()

    const category = String(
      body.category || 'Market News'
    ).trim()

    const content = String(
      body.content || ''
    ).trim()

    const image_url = body.image_url
      ? String(body.image_url).trim()
      : null

    const published =
      body.published !== false

    if (!title || !content) {
      return NextResponse.json(
        {
          error:
            'Title and content are required.',
        },
        { status: 400 }
      )
    }

    const admin = supabaseAdmin()

    const { data: article, error } =
      await admin
        .from('articles')
        .insert({
          title,
          category,
          content,
          image_url,
          published,
        })
        .select()
        .single()

    if (error) {
      console.error(
        'Article create error:',
        error
      )

      return NextResponse.json(
        {
          error:
            'Unable to create article.',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      article,
    })
  } catch (error) {
    console.error(
      'Admin article POST error:',
      error
    )

    return NextResponse.json(
      {
        error:
          'Unable to create article.',
      },
      { status: 500 }
    )
  }
}
