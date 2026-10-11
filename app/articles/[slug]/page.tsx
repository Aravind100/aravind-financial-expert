import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://aravind-financial-expert.vercel.app'

type Article = {
  id: number
  title: string
  slug: string
  category: string
  excerpt: string | null
  content: string
  image_url: string | null
  tags: string[] | null
  published_at: string | null
  created_at: string
}

/**
 * Supports both plain-text articles and formatted HTML saved by the admin editor.
 * Keep article HTML limited to content authored by trusted administrators.
 */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function prepareArticleHtml(content: string) {
  const hasFormatting = /<\/?(?:p|h[1-6]|ul|ol|li|strong|b|em|i|a|blockquote|table|thead|tbody|tr|th|td|br|hr|div)\b/i.test(content)

  let html = hasFormatting
    ? content
    : content
        .trim()
        .split(/\n\s*\n+/)
        .filter(Boolean)
        .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br />')}</p>`)
        .join('\n')

  // Remove executable/embedded content and unsafe inline event handlers.
  html = html
    .replace(/<(script|style|iframe|object|embed|form)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '')
    .replace(/<(script|style|iframe|object|embed|form)\b[^>]*\/?\s*>/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s+(href|src)\s*=\s*(["'])\s*javascript:[\s\S]*?\2/gi, ' $1="#"')

  return html
}

async function getArticle(
  slug: string
): Promise<Article | null> {
  const supabase = supabaseAdmin()

  const { data: article, error } = await supabase
    .from('articles')
    .select(
      'id,title,slug,category,excerpt,content,image_url,tags,published_at,created_at'
    )
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()

  if (error) {
    console.error('Article fetch error:', error)
    return null
  }

  return article as Article | null
}

function getAbsoluteImageUrl(
  imageUrl: string | null
) {
  if (!imageUrl) return undefined

  if (
    imageUrl.startsWith('http://') ||
    imageUrl.startsWith('https://')
  ) {
    return imageUrl
  }

  return `${BASE_URL}${
    imageUrl.startsWith('/') ? '' : '/'
  }${imageUrl}`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  const article = await getArticle(slug)

  if (!article) {
    return {
      title:
        'Article Not Found | Aravind Financial Expert',
      description:
        'The requested article could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const description =
    article.excerpt ||
    article.content
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 155)

  const canonicalUrl =
    `${BASE_URL}/articles/${article.slug}`

  const imageUrl =
    getAbsoluteImageUrl(article.image_url)

  return {
    title:
      `${article.title} | Aravind Financial Expert`,

    description,

    keywords: article.tags || [
      article.category,
      'investment',
      'financial education',
      'Indian stock market',
      'Aravind Financial Expert',
    ],

    authors: [
      {
        name: 'Aravind Chaudhary',
        url: `${BASE_URL}/about`,
      },
    ],

    creator: 'Aravind Chaudhary',

    publisher: 'Aravind Financial Expert',

    alternates: {
      canonical: canonicalUrl,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },

    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title: article.title,
      description,
      siteName: 'Aravind Financial Expert',
      locale: 'en_IN',

      publishedTime:
        article.published_at ||
        article.created_at,

      modifiedTime:
        article.published_at ||
        article.created_at,

      authors: ['Aravind Chaudhary'],

      section: article.category,

      tags: article.tags || [],

      ...(imageUrl
        ? {
            images: [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: article.title,
              },
            ],
          }
        : {}),
    },

    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,

      ...(imageUrl
        ? {
            images: [imageUrl],
          }
        : {}),
    },
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const article = await getArticle(slug)

  if (!article) {
    notFound()
  }

  const typedArticle = article as Article

  const canonicalUrl =
    `${BASE_URL}/articles/${typedArticle.slug}`

  const imageUrl =
    getAbsoluteImageUrl(
      typedArticle.image_url
    )

  const publishedDate =
    typedArticle.published_at ||
    typedArticle.created_at

  /*
   * Article structured data for Google.
   */
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',

    headline: typedArticle.title,

    description:
      typedArticle.excerpt ||
      typedArticle.content
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 155),

    url: canonicalUrl,

    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },

    author: {
      '@type': 'Person',
      name: 'Aravind Chaudhary',
      url: `${BASE_URL}/about`,
    },

    publisher: {
      '@type': 'Organization',
      name: 'Aravind Financial Expert',
      url: BASE_URL,
    },

    datePublished: publishedDate,

    dateModified: publishedDate,

    ...(imageUrl
      ? {
          image: [imageUrl],
        }
      : {}),

    ...(typedArticle.tags &&
    typedArticle.tags.length > 0
      ? {
          keywords:
            typedArticle.tags.join(', '),
        }
      : {}),

    articleSection:
      typedArticle.category,
  }

  const safeArticleSchema =
    JSON.stringify(articleSchema)
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(/&/g, '\\u0026')

  return (
    <main className="articlePage">

      {/* Google Article Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeArticleSchema,
        }}
      />

      <article className="articleContainer">

        <Link
          href="/articles"
          className="backLink"
        >
          ← Back to Articles
        </Link>

        <div className="articleHeader">

          <div className="articleCategory">
            {typedArticle.category}
          </div>

          <h1>
            {typedArticle.title}
          </h1>

          {typedArticle.excerpt && (
            <p className="articleExcerpt">
              {typedArticle.excerpt}
            </p>
          )}

          <div className="articleMeta">
            <span>📅 {typedArticle.published_at
              ? new Date(
                  typedArticle.published_at
                ).toLocaleDateString(
                  'en-IN',
                  {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  }
                )
              : new Date(
                  typedArticle.created_at
                ).toLocaleDateString(
                  'en-IN',
                  {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  }
                )}</span>
            <span className="articleReadTime">
              ⏱ {Math.max(1, Math.ceil(typedArticle.content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length / 220))} min read
            </span>
          </div>

        </div>

        {typedArticle.image_url && (
          <img
            src={typedArticle.image_url}
            alt={typedArticle.title}
            className="articleImage"
          />
        )}

        {/* Article Content */}
        <div
          className="articleBody"
          dangerouslySetInnerHTML={{
            __html: prepareArticleHtml(typedArticle.content),
          }}
        />

        {typedArticle.tags &&
          typedArticle.tags.length > 0 && (
            <div className="articleTags">

              {typedArticle.tags.map((tag) => (
                <span key={tag}>
                  #{tag}
                </span>
              ))}

            </div>
          )}

        <div className="articleDisclaimer">

          <strong>Disclaimer:</strong>{' '}

          The information provided in this
          article is for educational and
          informational purposes only. It should
          not be considered investment advice.
          Investors should evaluate their financial
          objectives and risk tolerance and consult
          a qualified professional where
          appropriate.

        </div>

        <div className="articleBottom">

          <Link
            href="/articles"
            className="backButton"
          >
            ← View All Articles
          </Link>

        </div>

      </article>



    </main>
  )
}
