import { NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { supabaseAdmin } from '../../../../lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

const ADMIN_EMAIL = (
  process.env.ADMIN_EMAIL || 'aravindchaudhary90@gmail.com'
)
  .trim()
  .toLowerCase()

async function checkAdmin() {
  const authClient = await createClient()

  const { data, error } = await authClient.auth.getUser()

  const email = data.user?.email?.trim().toLowerCase()

  if (error || !email || email !== ADMIN_EMAIL) {
    return false
  }

  return true
}

/* GET — Load all articles */
export async function GET() {
  try {
    const isAdmin = await checkAdmin()

    if (!isAdmin) {
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
    console.error('Articles API error:', error)

    return NextResponse.json(
      { error: 'Unable to load articles.' },
      { status: 500 }
    )
  }
}

/* POST — Create new article */
export async function POST(request: Request) {
  try {
    const isAdmin = await checkAdmin()

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized.' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const {
      title,
      slug,
      category,
      excerpt,
      content,
      image_url,
      tags,
      published,
      published_at,
    } = body

    if (!title || !slug || !content) {
      return NextResponse.json(
        {
          error:
            'Title, slug and content are required.',
        },
        { status: 400 }
      )
    }

    const admin = supabaseAdmin()

    const { data: article, error } = await admin
      .from('articles')
      .insert({
        title: String(title).trim(),
        slug: String(slug).trim(),
        category: category
          ? String(category).trim()
          : 'General',
        excerpt: excerpt
          ? String(excerpt).trim()
          : null,
        content: String(content),
        image_url: image_url
          ? String(image_url).trim()
          : null,
        tags: Array.isArray(tags) ? tags : [],
        published: Boolean(published),
        published_at:
          published && published_at
            ? published_at
            : published
              ? new Date().toISOString()
              : null,
      })
      .select()
      .single()

    if (error) {
      console.error('Article INSERT error:', error)

      return NextResponse.json(
        {
          error:
            error.code === '23505'
              ? 'This slug already exists.'
              : 'Unable to create article.',
        },
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
    console.error('Article POST error:', error)

    return NextResponse.json(
      { error: 'Unable to create article.' },
      { status: 500 }
    )
  }
}

/* PATCH — Update existing article */
export async function PATCH(request: Request) {
  try {
    const isAdmin = await checkAdmin()

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized.' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Article ID is required.' },
        { status: 400 }
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
      updates.excerpt = body.excerpt
        ? String(body.excerpt).trim()
        : null
    }

    if (body.content !== undefined) {
      updates.content = String(body.content)
    }

    if (body.image_url !== undefined) {
      updates.image_url = body.image_url
        ? String(body.image_url).trim()
        : null
    }

    if (body.tags !== undefined) {
      updates.tags = Array.isArray(body.tags)
        ? body.tags
        : []
    }

    if (body.published !== undefined) {
      updates.published = Boolean(body.published)

      if (body.published) {
        updates.published_at =
          body.published_at ||
          new Date().toISOString()
      } else {
        updates.published_at = null
      }
    }

    updates.updated_at = new Date().toISOString()

    const admin = supabaseAdmin()

    const { data: article, error } = await admin
      .from('articles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Article UPDATE error:', error)

      return NextResponse.json(
        { error: 'Unable to update article.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      article,
      message: 'Article updated successfully.',
    })
  } catch (error) {
    console.error('Article PATCH error:', error)

    return NextResponse.json(
      { error: 'Unable to update article.' },
      { status: 500 }
    )
  }
}

/* DELETE — Delete article */
export async function DELETE(request: Request) {
  try {
    const isAdmin = await checkAdmin()

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized.' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Article ID is required.' },
        { status: 400 }
      )
    }

    const admin = supabaseAdmin()

    const { error } = await admin
      .from('articles')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Article DELETE error:', error)

      return NextResponse.json(
        { error: 'Unable to delete article.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Article deleted successfully.',
    })
  } catch (error) {
    console.error('Article DELETE error:', error)

    return NextResponse.json(
      { error: 'Unable to delete article.' },
      { status: 500 }
    )
  }
}
