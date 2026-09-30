import type { Metadata } from 'next'
import Link from 'next/link'
import { supabaseAdmin } from '../../lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://aravind-financial-expert.vercel.app'

export const metadata: Metadata = {
  title: 'Articles | Stock Research, Market Updates & Financial Insights',
  description:
    'Explore stock research, market updates, financial awareness and educational articles covering investments, equity, mutual funds and personal finance.',
  keywords: [
    'stock research',
    'stock market articles',
    'market updates',
    'financial insights',
    'investment articles',
    'equity research',
    'mutual fund articles',
    'financial awareness',
    'Indian stock market',
    'investment education',
    'Aravind Financial Expert',
  ],
  alternates: {
    canonical: `${BASE_URL}/articles`,
  },
  openGraph: {
    type: 'website',
    url: `${BASE_URL}/articles`,
    title:
      'Articles | Stock Research, Market Updates & Financial Insights',
    description:
      'Explore stock research, market updates, financial awareness and educational articles covering investments, equity, mutual funds and personal finance.',
    siteName: 'Aravind Financial Expert',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Articles | Stock Research, Market Updates & Financial Insights',
    description:
      'Explore stock research, market updates and educational financial articles.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

type Article = {
  id: number
  title: string
  slug: string
  category: string
  excerpt: string | null
  image_url: string | null
  tags: string[] | null
  published_at: string | null
  created_at: string
}

export default async function ArticlesPage() {
  const supabase = supabaseAdmin()

  const { data: articles, error } = await supabase
    .from('articles')
    .select(
      'id,title,slug,category,excerpt,image_url,tags,published_at,created_at'
    )
    .eq('published', true)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Articles page error:', error)

    return (
      <main className="articlesPage">
        <div className="articlesContainer">
          <h1>Articles & Market Updates</h1>
          <p className="error">
            Unable to load articles right now.
          </p>
        </div>
      </main>
    )
  }

  /*
   * Structured data
   *
   * This describes the Articles page and the published
   * articles currently visible on the page.
   */
  const articleItems =
    articles?.map((article: Article, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${BASE_URL}/articles/${article.slug}`,
      name: article.title,
    })) ?? []

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${BASE_URL}/articles#collection`,
        url: `${BASE_URL}/articles`,
        name:
          'Articles | Stock Research, Market Updates & Financial Insights',
        description:
          'Stock research, market updates, financial awareness and educational articles covering investments, equity, mutual funds and personal finance.',
        isPartOf: {
          '@id': `${BASE_URL}/#website`,
        },
        breadcrumb: {
          '@id': `${BASE_URL}/articles#breadcrumb`,
        },
      },
      {
        '@type': 'ItemList',
        '@id': `${BASE_URL}/articles#article-list`,
        name: 'Financial Articles and Market Updates',
        itemListElement: articleItems,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${BASE_URL}/articles#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: BASE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Articles',
            item: `${BASE_URL}/articles`,
          },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(
            /</g,
            '\\u003c'
          ),
        }}
      />

      <main className="articlesPage">
        <section className="articlesHero">
          <div className="articlesContainer">
            <div className="eyebrow">
              Financial Insights
            </div>

            <h1>
              Articles, Stock Research & Market Updates
            </h1>

            <p>
              Research, financial awareness, market updates and
              educational articles to help you understand
              financial markets and investment topics.
            </p>
          </div>
        </section>

        <section className="articlesSection">
          <div className="articlesContainer">

            {articles && articles.length > 0 ? (
              <div className="articleGrid">

                {articles.map((article: Article) => (
                  <article
                    className="articleCard"
                    key={article.id}
                  >

                    {article.image_url && (
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="articleImage"
                      />
                    )}

                    <div className="articleContent">

                      <div className="articleCategory">
                        {article.category}
                      </div>

                      <h2>
                        {article.title}
                      </h2>

                      {article.excerpt && (
                        <p className="articleExcerpt">
                          {article.excerpt}
                        </p>
                      )}

                      {article.published_at && (
                        <div className="articleDate">
                          {new Date(
                            article.published_at
                          ).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                      )}

                      <Link
                        href={`/articles/${article.slug}`}
                        className="readMore"
                      >
                        Read Article →
                      </Link>

                    </div>

                  </article>
                ))}

              </div>
            ) : (
              <div className="emptyState">
                <h2>No articles published yet</h2>

                <p>
                  New stock research, market updates and
                  financial articles will appear here.
                </p>
              </div>
            )}

          </div>
        </section>

        <style>{`

          .articlesPage {
            min-height: 100vh;
            background: #f7f9fc;
          }

          .articlesContainer {
            width: min(1180px, 92%);
            margin: 0 auto;
          }

          .articlesHero {
            padding: 70px 0 60px;
            background:
              linear-gradient(
                135deg,
                #eef5ff 0%,
                #ffffff 100%
              );
            border-bottom: 1px solid #e5e7eb;
          }

          .eyebrow {
            display: inline-block;
            margin-bottom: 14px;
            padding: 7px 13px;
            border-radius: 999px;
            background: #e8f1ff;
            color: #1557a6;
            font-size: 13px;
            font-weight: 700;
          }

          .articlesHero h1 {
            max-width: 850px;
            margin: 0;
            font-size: clamp(32px, 5vw, 54px);
            line-height: 1.1;
            color: #0f172a;
          }

          .articlesHero p {
            max-width: 760px;
            margin: 20px 0 0;
            color: #64748b;
            font-size: 18px;
            line-height: 1.7;
          }

          .articlesSection {
            padding: 55px 0 80px;
          }

          .articleGrid {
            display: grid;
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
            gap: 24px;
          }

          .articleCard {
            overflow: hidden;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 18px;
            box-shadow:
              0 8px 25px rgba(15, 23, 42, 0.06);
            transition:
              transform 0.2s ease,
              box-shadow 0.2s ease;
          }

          .articleCard:hover {
            transform: translateY(-4px);
            box-shadow:
              0 14px 35px rgba(15, 23, 42, 0.10);
          }

          .articleImage {
            width: 100%;
            height: 210px;
            object-fit: cover;
            display: block;
          }

          .articleContent {
            padding: 22px;
          }

          .articleCategory {
            display: inline-block;
            margin-bottom: 10px;
            color: #1557a6;
            font-size: 13px;
            font-weight: 800;
          }

          .articleCard h2 {
            margin: 0;
            color: #0f172a;
            font-size: 22px;
            line-height: 1.3;
          }

          .articleExcerpt {
            margin: 12px 0 0;
            color: #64748b;
            line-height: 1.6;
            font-size: 15px;
          }

          .articleDate {
            margin-top: 16px;
            color: #94a3b8;
            font-size: 13px;
          }

          .readMore {
            display: inline-block;
            margin-top: 18px;
            color: #1557a6;
            font-weight: 800;
            text-decoration: none;
          }

          .readMore:hover {
            text-decoration: underline;
          }

          .emptyState {
            padding: 60px 20px;
            text-align: center;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 18px;
          }

          .emptyState h2 {
            margin: 0;
            color: #0f172a;
          }

          .emptyState p {
            margin-top: 10px;
            color: #64748b;
          }

          .error {
            padding: 20px;
            color: #b91c1c;
            background: #fee2e2;
            border-radius: 10px;
          }

          @media (max-width: 900px) {
            .articleGrid {
              grid-template-columns:
                repeat(2, minmax(0, 1fr));
            }
          }

          @media (max-width: 600px) {
            .articlesHero {
              padding: 45px 0;
            }

            .articlesHero p {
              font-size: 16px;
            }

            .articlesSection {
              padding: 35px 0 60px;
            }

            .articleGrid {
              grid-template-columns: 1fr;
            }
          }

        `}</style>
      </main>
    </>
  )
}
