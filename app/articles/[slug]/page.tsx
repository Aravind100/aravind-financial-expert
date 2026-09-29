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

async function getArticle(slug: string): Promise<Article | null> {
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

function getAbsoluteImageUrl(imageUrl: string | null) {
  if (!imageUrl) return undefined

  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }

  return `${BASE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
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
      title: 'Article Not Found | Aravind Financial Expert',
      description: 'The requested article could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const description =
    article.excerpt ||
    article.content
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 155)

  const canonicalUrl = `${BASE_URL}/articles/${article.slug}`
  const imageUrl = getAbsoluteImageUrl(article.image_url)

  return {
    title: `${article.title} | Aravind Financial Expert`,

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
        article.published_at || article.created_at,

      modifiedTime:
        article.published_at || article.created_at,

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
    getAbsoluteImageUrl(typedArticle.image_url)

  const publishedDate =
    typedArticle.published_at ||
    typedArticle.created_at

  /*
   * Article structured data for Google.
   * The replace() calls safely prevent HTML/script
   * characters inside article fields from breaking
   * the JSON-LD script.
   */
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',

    headline: typedArticle.title,

    description:
      typedArticle.excerpt ||
      typedArticle.content
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
          keywords: typedArticle.tags.join(', '),
        }
      : {}),

    articleSection: typedArticle.category,
  }

  const safeArticleSchema = JSON.stringify(
    articleSchema
  )
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
                ).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })
              : new Date(
                  typedArticle.created_at
                ).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
          </div>

        </div>

        {typedArticle.image_url && (
          <img
            src={typedArticle.image_url}
            alt={typedArticle.title}
            className="articleImage"
          />
        )}

        <div className="articleBody">
          {typedArticle.content
            .split('\n')
            .map((paragraph, index) => {

              const text = paragraph.trim()

              if (!text) {
                return (
                  <div
                    key={index}
                    className="articleSpace"
                  />
                )
              }

              return (
                <p key={index}>
                  {text}
                </p>
              )
            })}
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
          The information provided in this article
          is for educational and informational
          purposes only. It should not be considered
          investment advice. Investors should
          evaluate their financial objectives and
          risk tolerance and consult a qualified
          professional where appropriate.
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
            0 10px 35px rgba(15, 23, 42, 0.06);
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
          border-bottom: 1px solid #e5e7eb;
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
          font-size: clamp(32px, 5vw, 52px);
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

        .articleSpace {
          height: 8px;
        }

        .articleTags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 35px;
          padding-top: 25px;
          border-top: 1px solid #e5e7eb;
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
          border-top: 1px solid #e5e7eb;
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
