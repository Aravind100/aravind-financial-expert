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

/*
 * Converts article HTML fragments into clean article text
 * while preserving clickable <a href=""> links.
 *
 * This is intentionally NOT rendering the complete article
 * with dangerouslySetInnerHTML because existing articles
 * contain a mixture of normal text and HTML fragments.
 */
function renderArticleContent(content: string) {
  /*
   * Extract all anchor tags first.
   *
   * This also handles anchors where the opening tag,
   * link text and closing tag are separated by line breaks.
   */
  const links: {
    text: string
    href: string
  }[] = []

  const LINK_PLACEHOLDER_PREFIX = '___ARTICLE_LINK_'
  const LINK_PLACEHOLDER_SUFFIX = '___'

  let processedContent = content

  processedContent = processedContent.replace(
    /<a\s+[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
    (_match, href, linkText) => {
      const cleanText = String(linkText)
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim()

      const index = links.length

      links.push({
        href: String(href).trim(),
        text: cleanText,
      })

      return `${LINK_PLACEHOLDER_PREFIX}${index}${LINK_PLACEHOLDER_SUFFIX}`
    }
  )

  /*
   * Remove remaining HTML tags.
   *
   * This prevents <p>, </p>, <strong>, etc. from appearing
   * visibly in the article.
   */
  processedContent = processedContent.replace(
    /<[^>]*>/g,
    ''
  )

  /*
   * Decode the most common HTML entities.
   */
  processedContent = processedContent
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")

  /*
   * Preserve the original article's paragraph structure.
   */
  const paragraphs = processedContent
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return paragraphs.map((paragraph, paragraphIndex) => {
    const parts = paragraph.split(
      /(___ARTICLE_LINK_\d+___)/
    )

    return (
      <p key={paragraphIndex}>
        {parts.map((part, partIndex) => {
          const match = part.match(
            /^___ARTICLE_LINK_(\d+)___$/
          )

          if (!match) {
            return part
          }

          const linkIndex = Number(match[1])
          const link = links[linkIndex]

          if (!link) {
            return null
          }

          /*
           * External links open in a new tab.
           */
          return (
            <a
              key={`${paragraphIndex}-${partIndex}`}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.text || link.href}
            </a>
          )
        })}
      </p>
    )
  })
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

            {typedArticle.published_at
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
                )}

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
        <div className="articleBody">
          {renderArticleContent(
            typedArticle.content
          )}
        </div>

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

      <style>{`

        .articlePage {
          min-height: 100vh;
          background: #f7f9fc;
          padding: 50px 0 80px;
        }

        .articleContainer {
          width: min(900px, 92%);
          margin: 0 auto;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          padding: 40px;
          box-shadow:
            0 10px 35px rgba(
              15,
              23,
              42,
              0.06
            );
        }

        .backLink {
          display: inline-block;
          margin-bottom: 30px;
          color: #1557a6;
          font-weight: 700;
          text-decoration: none;
        }

        .backLink:hover {
          text-decoration: underline;
        }

        .articleHeader {
          border-bottom:
            1px solid #e5e7eb;
          padding-bottom: 30px;
        }

        .articleCategory {
          display: inline-block;
          margin-bottom: 14px;
          padding: 7px 13px;
          border-radius: 999px;
          background: #e8f1ff;
          color: #1557a6;
          font-size: 13px;
          font-weight: 800;
        }

        .articleHeader h1 {
          margin: 0;
          color: #0f172a;
          font-size:
            clamp(32px, 5vw, 52px);
          line-height: 1.12;
        }

        .articleExcerpt {
          margin: 20px 0 0;
          color: #64748b;
          font-size: 19px;
          line-height: 1.7;
        }

        .articleMeta {
          margin-top: 20px;
          color: #94a3b8;
          font-size: 14px;
        }

        .articleImage {
          width: 100%;
          max-height: 480px;
          object-fit: cover;
          border-radius: 14px;
          margin: 35px 0;
        }

        .articleBody {
          color: #334155;
          font-size: 18px;
          line-height: 1.9;
        }

        .articleBody p {
          margin: 0 0 18px;
          white-space: pre-wrap;
        }

        /*
         * Article links
         */
        .articleBody a {
          color: #1557a6;
          text-decoration: underline;
          font-weight: 600;
          cursor: pointer;
        }

        .articleBody a:hover {
          color: #0f3f7a;
        }

        .articleTags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 35px;
          padding-top: 25px;
          border-top:
            1px solid #e5e7eb;
        }

        .articleTags span {
          padding: 7px 11px;
          border-radius: 999px;
          background: #f1f5f9;
          color: #475569;
          font-size: 13px;
          font-weight: 600;
        }

        .articleDisclaimer {
          margin-top: 35px;
          padding: 18px;
          border-radius: 10px;
          background: #fff7ed;
          color: #7c2d12;
          font-size: 13px;
          line-height: 1.6;
        }

        .articleBottom {
          margin-top: 35px;
          padding-top: 25px;
          border-top:
            1px solid #e5e7eb;
        }

        .backButton {
          display: inline-block;
          padding: 11px 17px;
          border-radius: 9px;
          background: #1557a6;
          color: #ffffff;
          text-decoration: none;
          font-weight: 700;
        }

        .backButton:hover {
          background: #0f3f7a;
        }

        @media (max-width: 600px) {

          .articlePage {
            padding: 25px 0 50px;
          }

          .articleContainer {
            width: 90%;
            padding: 24px;
            border-radius: 15px;
          }

          .articleHeader h1 {
            font-size: 32px;
          }

          .articleExcerpt {
            font-size: 17px;
          }

          .articleBody {
            font-size: 16px;
            line-height: 1.8;
          }

        }

      `}</style>

    </main>
  )
}
