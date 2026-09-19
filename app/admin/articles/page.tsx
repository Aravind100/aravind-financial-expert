'use client'

import { useEffect, useState } from 'react'

type Article = {
  id: number
  title: string
  slug: string
  category: string
  excerpt: string | null
  content: string
  image_url: string | null
  tags: string[] | null
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

const CATEGORIES = [
  'Stock Research',
  'Market News',
  'Financial Updates',
  'Investment Education',
  'Insurance',
  'Loans',
  'Other',
]

const emptyForm = {
  title: '',
  slug: '',
  category: 'Stock Research',
  excerpt: '',
  content: '',
  image_url: '',
  tags: '',
  published: false,
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function loadArticles() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/articles', {
        cache: 'no-store',
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Unable to load articles.')
        setLoading(false)
        return
      }

      setArticles(data.articles || [])
    } catch {
      setError('Unable to connect to the server.')
    }

    setLoading(false)
  }

  useEffect(() => {
    loadArticles()
  }, [])

  function makeSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  function handleTitleChange(value: string) {
    setForm((current) => ({
      ...current,
      title: value,
      slug: editingId ? current.slug : makeSlug(value),
    }))
  }

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
    setError('')
    setMessage('')
  }

  function editArticle(article: Article) {
    setEditingId(article.id)

    setForm({
      title: article.title || '',
      slug: article.slug || '',
      category: article.category || 'Stock Research',
      excerpt: article.excerpt || '',
      content: article.content || '',
      image_url: article.image_url || '',
      tags: Array.isArray(article.tags)
        ? article.tags.join(', ')
        : '',
      published: Boolean(article.published),
    })

    setMessage('')
    setError('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  async function saveArticle() {
    setError('')
    setMessage('')

    if (!form.title.trim()) {
      setError('Please enter an article title.')
      return
    }

    if (!form.slug.trim()) {
      setError('Please enter a slug.')
      return
    }

    if (!form.content.trim()) {
      setError('Please enter article content.')
      return
    }

    setSaving(true)

    try {
      const payload = {
        id: editingId,
        title: form.title.trim(),
        slug: form.slug.trim(),
        category: form.category,
        excerpt: form.excerpt.trim(),
        content: form.content,
        image_url: form.image_url.trim(),
        tags: form.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        published: form.published,
      }

      const response = await fetch('/api/admin/articles', {
        method: editingId ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Unable to save article.')
        setSaving(false)
        return
      }

      setMessage(
        editingId
          ? 'Article updated successfully.'
          : 'Article created successfully.'
      )

      resetForm()
      await loadArticles()
    } catch {
      setError('Unable to save article.')
    }

    setSaving(false)
  }

  async function deleteArticle(id: number) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this article?'
    )

    if (!confirmed) return

    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/admin/articles', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Unable to delete article.')
        return
      }

      setMessage('Article deleted successfully.')

      if (editingId === id) {
        resetForm()
      }

      await loadArticles()
    } catch {
      setError('Unable to delete article.')
    }
  }

  async function togglePublished(article: Article) {
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/admin/articles', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: article.id,
          published: !article.published,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Unable to change publication status.')
        return
      }

      setMessage(
        article.published
          ? 'Article unpublished.'
          : 'Article published.'
      )

      await loadArticles()
    } catch {
      setError('Unable to change publication status.')
    }
  }

  return (
    <main className="articleAdmin">

      <div className="topBar">
        <div>
          <h1>Article Manager</h1>
          <p>
            Create and manage stock research, market news and financial
            updates.
          </p>
        </div>

        <a href="/admin" className="backBtn">
          ← Lead Dashboard
        </a>
      </div>

      {error && (
        <div className="errorBox">
          {error}
        </div>
      )}

      {message && (
        <div className="successBox">
          {message}
        </div>
      )}

      <section className="editorCard">

        <div className="editorHeader">
          <div>
            <h2>
              {editingId ? 'Edit Article' : 'Create New Article'}
            </h2>

            <p>
              {editingId
                ? 'Update your existing article.'
                : 'Publish a new article from your admin panel.'}
            </p>
          </div>

          {editingId && (
            <button
              className="cancelBtn"
              type="button"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="formGrid">

          <div className="field full">
            <label>Article Title *</label>

            <input
              value={form.title}
              onChange={(e) =>
                handleTitleChange(e.target.value)
              }
              placeholder="Example: Why Long-Term Equity Investing Matters"
            />
          </div>

          <div className="field">
            <label>Slug *</label>

            <input
              value={form.slug}
              onChange={(e) =>
                setForm({
                  ...form,
                  slug: makeSlug(e.target.value),
                })
              }
              placeholder="why-long-term-equity-investing-matters"
            />
          </div>

          <div className="field">
            <label>Category *</label>

            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value,
                })
              }
            >
              {CATEGORIES.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="field full">
            <label>Short Excerpt</label>

            <textarea
              value={form.excerpt}
              onChange={(e) =>
                setForm({
                  ...form,
                  excerpt: e.target.value,
                })
              }
              placeholder="Short description shown on the article listing page."
              rows={3}
            />
          </div>

          <div className="field full">
            <label>Article Content *</label>

            <textarea
              className="contentBox"
              value={form.content}
              onChange={(e) =>
                setForm({
                  ...form,
                  content: e.target.value,
                })
              }
              placeholder="Write your complete article here..."
              rows={15}
            />
          </div>

          <div className="field">
            <label>Image URL</label>

            <input
              value={form.image_url}
              onChange={(e) =>
                setForm({
                  ...form,
                  image_url: e.target.value,
                })
              }
              placeholder="https://..."
            />
          </div>

          <div className="field">
            <label>Tags</label>

            <input
              value={form.tags}
              onChange={(e) =>
                setForm({
                  ...form,
                  tags: e.target.value,
                })
              }
              placeholder="Stocks, Equity, Investing"
            />
          </div>

          <div className="publishBox full">

            <label className="checkboxLabel">

              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) =>
                  setForm({
                    ...form,
                    published: e.target.checked,
                  })
                }
              />

              <span>
                Publish this article immediately
              </span>

            </label>

            <p>
              If unchecked, the article will remain unpublished.
            </p>

          </div>

        </div>

        <div className="formActions">

          <button
            type="button"
            className="saveBtn"
            onClick={saveArticle}
            disabled={saving}
          >
            {saving
              ? 'Saving...'
              : editingId
              ? '💾 Update Article'
              : '📝 Save Article'}
          </button>

          <button
            type="button"
            className="clearBtn"
            onClick={resetForm}
            disabled={saving}
          >
            Clear
          </button>

        </div>

      </section>

      <section className="articlesCard">

        <div className="listHeader">
          <div>
            <h2>Articles</h2>
            <p>
              {articles.length} article
              {articles.length !== 1 ? 's' : ''}
            </p>
          </div>

          <button
            className="refreshBtn"
            onClick={loadArticles}
            disabled={loading}
          >
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <div className="empty">
            Loading articles...
          </div>
        ) : articles.length === 0 ? (
          <div className="empty">
            No articles yet. Create your first article above.
          </div>
        ) : (
          <div className="articleList">

            {articles.map((article) => (

              <div
                className="articleItem"
                key={article.id}
              >

                {article.image_url && (
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="articleImage"
                  />
                )}

                <div className="articleInfo">

                  <div className="articleMeta">
                    <span className="category">
                      {article.category}
                    </span>

                    <span
                      className={
                        article.published
                          ? 'published'
                          : 'draft'
                      }
                    >
                      {article.published
                        ? '● Published'
                        : '● Draft'}
                    </span>
                  </div>

                  <h3>{article.title}</h3>

                  <p>
                    {article.excerpt ||
                      'No excerpt added.'}
                  </p>

                  <div className="slug">
                    /articles/{article.slug}
                  </div>

                  <div className="articleActions">

                    <button
                      className="editBtn"
                      onClick={() =>
                        editArticle(article)
                      }
                    >
                      ✏️ Edit
                    </button>

                    <button
                      className="publishBtn"
                      onClick={() =>
                        togglePublished(article)
                      }
                    >
                      {article.published
                        ? '🙈 Unpublish'
                        : '📢 Publish'}
                    </button>

                    <button
                      className="deleteBtn"
                      onClick={() =>
                        deleteArticle(article.id)
                      }
                    >
                      🗑️ Delete
                    </button>

                    {article.published && (
                      <a
                        href={`/articles/${article.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="viewBtn"
                      >
                        👁️ View
                      </a>
                    )}

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </section>

      <style jsx>{`

        .articleAdmin {
          max-width: 1200px;
          margin: 0 auto;
          padding: 30px 20px 60px;
        }

        .topBar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 25px;
        }

        h1 {
          margin: 0;
          font-size: 32px;
        }

        .topBar p {
          margin: 7px 0 0;
          color: #64748b;
        }

        .backBtn {
          background: #eef2ff;
          color: #1d4ed8;
          text-decoration: none;
          padding: 11px 16px;
          border-radius: 9px;
          font-weight: 700;
          white-space: nowrap;
        }

        .errorBox,
        .successBox {
          padding: 13px 16px;
          border-radius: 10px;
          margin-bottom: 18px;
          font-weight: 600;
        }

        .errorBox {
          background: #fee2e2;
          color: #991b1b;
        }

        .successBox {
          background: #dcfce7;
          color: #166534;
        }

        .editorCard,
        .articlesCard {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 25px;
          box-shadow: 0 4px 18px rgba(0,0,0,0.05);
        }

        .editorHeader,
        .listHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-bottom: 22px;
        }

        .editorHeader h2,
        .listHeader h2 {
          margin: 0;
          font-size: 22px;
        }

        .editorHeader p,
        .listHeader p {
          margin: 5px 0 0;
          color: #64748b;
          font-size: 14px;
        }

        .formGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .field.full {
          grid-column: 1 / -1;
        }

        .field label {
          font-weight: 700;
          font-size: 14px;
        }

        .field input,
        .field select,
        .field textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #dbe2ea;
          border-radius: 9px;
          padding: 11px 12px;
          font: inherit;
          outline: none;
        }

        .field input:focus,
        .field select:focus,
        .field textarea:focus {
          border-color: #2563eb;
        }

        .contentBox {
          min-height: 300px;
          resize: vertical;
        }

        .publishBox {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 15px;
          border-radius: 10px;
        }

        .checkboxLabel {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          cursor: pointer;
        }

        .checkboxLabel input {
          width: 18px;
          height: 18px;
        }

        .publishBox p {
          margin: 8px 0 0 28px;
          color: #64748b;
          font-size: 13px;
        }

        .formActions {
          display: flex;
          gap: 10px;
          margin-top: 22px;
        }

        .saveBtn,
        .clearBtn,
        .cancelBtn,
        .refreshBtn,
        .editBtn,
        .publishBtn,
        .deleteBtn,
        .viewBtn {
          border: 0;
          border-radius: 8px;
          padding: 10px 14px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          font-size: 13px;
        }

        .saveBtn {
          background: #2563eb;
          color: white;
        }

        .clearBtn,
        .cancelBtn,
        .refreshBtn {
          background: #f1f5f9;
          color: #334155;
        }

        .articleList {
          display: grid;
          gap: 15px;
        }

        .articleItem {
          display: flex;
          gap: 18px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
        }

        .articleImage {
          width: 150px;
          height: 100px;
          object-fit: cover;
          border-radius: 9px;
          flex-shrink: 0;
        }

        .articleInfo {
          flex: 1;
          min-width: 0;
        }

        .articleMeta {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 7px;
        }

        .category,
        .published,
        .draft {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
        }

        .category {
          background: #eff6ff;
          color: #1d4ed8;
        }

        .published {
          background: #dcfce7;
          color: #166534;
        }

        .draft {
          background: #f1f5f9;
          color: #64748b;
        }

        .articleInfo h3 {
          margin: 5px 0;
          font-size: 18px;
        }

        .articleInfo p {
          margin: 5px 0;
          color: #64748b;
          line-height: 1.5;
        }

        .slug {
          color: #94a3b8;
          font-size: 12px;
          margin: 8px 0;
          word-break: break-word;
        }

        .articleActions {
          display: flex;
          gap: 7px;
          flex-wrap: wrap;
          margin-top: 12px;
        }

        .editBtn {
          background: #e0f2fe;
          color: #0369a1;
        }

        .publishBtn {
          background: #dcfce7;
          color: #166534;
        }

        .deleteBtn {
          background: #fee2e2;
          color: #991b1b;
        }

        .viewBtn {
          background: #f1f5f9;
          color: #334155;
        }

        .empty {
          text-align: center;
          padding: 35px;
          color: #64748b;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 700px) {

          .articleAdmin {
            padding: 20px 14px 40px;
          }

          .topBar,
          .editorHeader,
          .listHeader {
            display: block;
          }

          .backBtn {
            display: inline-block;
            margin-top: 15px;
          }

          .cancelBtn,
          .refreshBtn {
            margin-top: 12px;
          }

          .formGrid {
            grid-template-columns: 1fr;
          }

          .field.full {
            grid-column: auto;
          }

          .editorCard,
          .articlesCard {
            padding: 16px;
          }

          .articleItem {
            display: block;
          }

          .articleImage {
            width: 100%;
            height: 180px;
            margin-bottom: 12px;
          }

          .articleActions {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .articleActions button,
          .articleActions a {
            text-align: center;
          }

        }

      `}</style>

    </main>
  )
}
