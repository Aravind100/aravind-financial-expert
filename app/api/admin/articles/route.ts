import { NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { supabaseAdmin } from '../../../../lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

const ADMIN_EMAIL = (
  process.env.ADMIN_EMAIL || 'aravindchaudhary90@gmail.com'
)
  .trim()
  .toLowerCase()

async function isAdmin() {
  const authClient = await createClient()

  const { data, error } = await authClient.auth.getUser()

  const email = data.user?.email?.trim().toLowerCase()

  if (error || !email || email !== ADMIN_EMAIL) {
    return false
  }

  return true
}

/* =========================
   GET ARTICLES
========================= */

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: 'Unauthorized.' },
        { status: 401 }
      )
    }

    const admin = supabaseAdmin()

    const { data: articles, error } = await admin
      .from('articles')
      .select(
        'id,title,slug,category,excerpt,content,image_url,tags,published,published_at,created_at,updated_at'
      )
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Articles GET error:', error)

      return NextResponse.json(
        { error: 'Unable to load articles.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      articles: articles || [],
    })
  } catch (error) {
    console.error('Articles GET API error:', error)

    return NextResponse.json(
      { error: 'Unable to load articles.' },
      { status: 500 }
    )
  }
}

/* =========================
   CREATE ARTICLE
========================= */

export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: 'Unauthorized.' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const title = String(body.title || '').trim()
    const slug = String(body.slug || '').trim()
    const category = String(body.category || '').trim()
    const excerpt = String(body.excerpt || '').trim()
    const content = String(body.content || '').trim()
    const image_url = String(body.image_url || '').trim()

    const tags = Array.isArray(body.tags)
      ? body.tags
          .map((tag: unknown) => String(tag).trim())
          .filter(Boolean)
      : []

    const published = Boolean(body.published)

    if (!title) {
      return NextResponse.json(
        { error: 'Article title is required.' },
        { status: 400 }
      )
    }

    if (!slug) {
      return NextResponse.json(
        { error: 'Article slug is required.' },
        { status: 400 }
      )
    }

    if (!content) {
      return NextResponse.json(
        { error: 'Article content is required.' },
        { status: 400 }
      )
    }

    const admin = supabaseAdmin()

    const { data: existing } = await admin
      .from('articles')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        {
          error:
            'An article with this slug already exists. Please use a different slug.',
        },
        { status: 409 }
      )
    }

    const now = new Date().toISOString()

    const { data: article, error } = await admin
      .from('articles')
      .insert({
        title,
        slug,
        category,
        excerpt: excerpt || null,
        content,
        image_url: image_url || null,
        tags,
        published,
        published_at: published ? now : null,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single()

    if (error) {
      console.error('Articles POST error:', error)

      return NextResponse.json(
        { error: error.message || 'Unable to create article.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        article,
        message: 'Article created successfully.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Articles POST API error:', error)

    return NextResponse.json(
      { error: 'Unable to create article.' },
      { status: 500 }
    )
  }
}

/* =========================
   UPDATE ARTICLE
========================= */

export async function PATCH(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: 'Unauthorized.' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const id = Number(body.id)

    if (!id || Number.isNaN(id)) {
      return NextResponse.json(
        { error: 'Valid article ID is required.' },
        { status: 400 }
      )
    }

    const admin = supabaseAdmin()

    const { data: currentArticle, error: currentError } =
      await admin
        .from('articles')
        .select(
          'id,title,slug,category,excerpt,content,image_url,tags,published,published_at'
        )
        .eq('id', id)
        .maybeSingle()

    if (currentError) {
      console.error(
        'Current article fetch error:',
        currentError
      )

      return NextResponse.json(
        { error: 'Unable to find article.' },
        { status: 500 }
      )
    }

    if (!currentArticle) {
      return NextResponse.json(
        { error: 'Article not found.' },
        { status: 404 }
      )
    }

    const updates: Record<string, unknown> = {}

    if (body.title !== undefined) {
      updates.title = String(body.title).trim()
    }

    if (body.slug !== undefined) {
      updates.slug = String(body.slug).trim()
    }

    if (body.category !== undefined) {
      updates.category = String(body.category).trim()
    }

    if (body.excerpt !== undefined) {
      const value = String(body.excerpt).trim()
      updates.excerpt = value || null
    }

    if (body.content !== undefined) {
      updates.content = String(body.content).trim()
    }

    if (body.image_url !== undefined) {
      const value = String(body.image_url).trim()
      updates.image_url = value || null
    }

    if (body.tags !== undefined) {
      updates.tags = Array.isArray(body.tags)
        ? body.tags
            .map((tag: unknown) => String(tag).trim())
            .filter(Boolean)
        : []
    }

    if (body.published !== undefined) {
      const published = Boolean(body.published)

      updates.published = published

      if (published && !currentArticle.published_at) {
        updates.published_at = new Date().toISOString()
      }

      if (!published) {
        updates.published_at = null
      }
    }

    if (
      updates.slug &&
      updates.slug !== currentArticle.slug
    ) {
      const { data: duplicate } = await admin
        .from('articles')
        .select('id')
        .eq('slug', updates.slug)
        .neq('id', id)
        .maybeSingle()

      if (duplicate) {
        return NextResponse.json(
          {
            error:
              'Another article already uses this slug.',
          },
          { status: 409 }
        )
      }
    }

    updates.updated_at = new Date().toISOString()

    const { data: article, error } = await admin
      .from('articles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Articles PATCH error:', error)

      return NextResponse.json(
        { error: error.message || 'Unable to update article.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      article,
      message: 'Article updated successfully.',
    })
  } catch (error) {
    console.error('Articles PATCH API error:', error)

    return NextResponse.json(
      { error: 'Unable to update article.' },
      { status: 500 }
    )
  }
}

/* =========================
   DELETE ARTICLE
========================= */

export async function DELETE(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: 'Unauthorized.' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const id = Number(body.id)

    if (!id || Number.isNaN(id)) {
      return NextResponse.json(
        { error: 'Valid article ID is required.' },
        { status: 400 }
      )
    }

    const admin = supabaseAdmin()

    const { error } = await admin
      .from('articles')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Articles DELETE error:', error)

      return NextResponse.json(
        { error: error.message || 'Unable to delete article.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Article deleted successfully.',
    })
  } catch (error) {
    console.error('Articles DELETE API error:', error)

    return NextResponse.json(
      { error: 'Unable to delete article.' },
      { status: 500 }
    )
  }
}
