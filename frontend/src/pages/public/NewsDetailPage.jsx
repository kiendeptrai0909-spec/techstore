import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, CalendarDays, Newspaper } from 'lucide-react'

import { newsApi } from '../../api/newsApi'
import NewsSidebar from '../../components/news/NewsSidebar'

function NewsDetailPage() {
  const { slug } = useParams()

  const [news, setNews] = useState(null)
  const [latestNews, setLatestNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setMessage('')

      try {
        const [newsData, latestData] = await Promise.all([
          newsApi.getNewsBySlug(slug),
          newsApi.getNews({
            page: 0,
            size: 6,
          }),
        ])

        setNews(newsData)
        setLatestNews(normalizeList(latestData))
      } catch (error) {
        setMessage(error.message || 'Không thể tải bài viết')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug])

  if (loading) {
    return (
      <div className="bg-[#e9e9e9]">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="h-[720px] animate-pulse rounded bg-gray-200" />
            <div className="h-[420px] animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
    )
  }

  if (!news) {
    return (
      <div className="bg-[#e9e9e9]">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="rounded bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Newspaper size={40} />
            </div>

            <h1 className="mt-5 text-2xl font-black text-gray-900">
              Không tìm thấy bài viết
            </h1>

            {message && (
              <p className="mt-2 text-red-600">{message}</p>
            )}

            <Link
              to="/news"
              className="mt-5 inline-block rounded bg-red-600 px-6 py-3 font-black text-white hover:bg-red-700"
            >
              Quay lại tin tức
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const imageUrl =
    news.thumbnailUrl ||
    news.imageUrl ||
    'https://placehold.co/900x500?text=TechStore'

  return (
    <div className="bg-[#e9e9e9]">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-4 rounded-md bg-white p-4 shadow-sm">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
          >
            <ArrowLeft size={18} />
            Quay lại tin tức
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="rounded-md bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
              <CalendarDays size={18} />
              {news.createdAt
                ? new Date(news.createdAt).toLocaleString('vi-VN')
                : 'Đang cập nhật'}
            </div>

            <h1 className="text-3xl font-black leading-tight text-gray-900 md:text-4xl">
              {news.title}
            </h1>

            {news.summary && (
              <p className="mt-4 text-lg font-semibold leading-8 text-gray-600">
                {news.summary}
              </p>
            )}

            <div className="mt-6 overflow-hidden rounded-md border bg-gray-100">
              <img
                src={imageUrl}
                alt={news.title}
                className="w-full object-cover"
              />
            </div>

            <div className="mt-6 whitespace-pre-line text-base leading-8 text-gray-800">
              {news.content}
            </div>
          </article>

          <div className="lg:sticky lg:top-[150px] lg:self-start">
            <NewsSidebar news={latestNews} currentSlug={slug} />
          </div>
        </div>
      </div>
    </div>
  )
}

function normalizeList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.items)) return data.items
  if (Array.isArray(data?.data)) return data.data
  return []
}

export default NewsDetailPage