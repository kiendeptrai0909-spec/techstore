import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { Newspaper, Search } from 'lucide-react'

import { newsApi } from '../../api/newsApi'
import NewsCard from '../../components/news/NewsCard'

function NewsListPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [pageData, setPageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [keywordInput, setKeywordInput] = useState(
    searchParams.get('keyword') || ''
  )

  const currentPage = Number(searchParams.get('page') || 0)
  const pageSize = Number(searchParams.get('size') || 9)

  const queryObject = useMemo(() => {
    return {
      page: currentPage,
      size: pageSize,
      keyword: searchParams.get('keyword') || '',
    }
  }, [currentPage, pageSize, searchParams])

  useEffect(() => {
    setKeywordInput(searchParams.get('keyword') || '')
  }, [searchParams])

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      setMessage('')

      try {
        const params = {
          page: queryObject.page,
          size: queryObject.size,
        }

        if (queryObject.keyword) {
          params.keyword = queryObject.keyword
        }

        const data = await newsApi.getNews(params)
        setPageData(data)
      } catch (error) {
        setMessage(error.message || 'Không thể tải danh sách tin tức')
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [queryObject])

  const news = Array.isArray(pageData)
    ? pageData
    : pageData?.content || []

  const handleSearch = (event) => {
    event.preventDefault()

    const nextParams = {
      page: '0',
      size: String(pageSize),
    }

    if (keywordInput.trim()) {
      nextParams.keyword = keywordInput.trim()
    }

    setSearchParams(nextParams)
  }

  const handlePageChange = (page) => {
    const nextParams = {
      page: String(page),
      size: String(pageSize),
    }

    const keyword = searchParams.get('keyword')

    if (keyword) {
      nextParams.keyword = keyword
    }

    setSearchParams(nextParams)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <div className="bg-[#e9e9e9]">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-5 rounded-md bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                <Newspaper size={30} />
              </div>

              <div>
                <h1 className="text-3xl font-black text-gray-900">
                  Tin tức công nghệ
                </h1>

                <p className="mt-1 text-gray-500">
                  Cập nhật tin tức, kinh nghiệm mua hàng và kiến thức công nghệ.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSearch}
            className="mt-6 flex h-12 overflow-hidden rounded border bg-white focus-within:border-red-500"
          >
            <div className="flex h-full w-12 items-center justify-center text-gray-500">
              <Search size={20} />
            </div>

            <input
              value={keywordInput}
              onChange={(event) => setKeywordInput(event.target.value)}
              placeholder="Tìm kiếm bài viết..."
              className="h-full flex-1 px-2 text-sm outline-none"
            />

            <button
              type="submit"
              className="h-full bg-red-600 px-6 text-sm font-black text-white hover:bg-red-700"
            >
              Tìm kiếm
            </button>
          </form>
        </div>

        {message && (
          <div className="mb-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {message}
          </div>
        )}

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded bg-gray-200"
              />
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="rounded-md bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-black text-gray-900">
              Không tìm thấy bài viết
            </h2>
            <p className="mt-2 text-gray-500">
              Vui lòng thử từ khóa tìm kiếm khác.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {news.map((item) => (
                <NewsCard key={item.id || item.slug} news={item} />
              ))}
            </div>

            <NewsPagination
              pageData={pageData}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  )
}

function NewsPagination({ pageData, onPageChange }) {
  if (!pageData || pageData.totalPages <= 1) {
    return null
  }

  const currentPage = pageData.number || 0
  const totalPages = pageData.totalPages || 0

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded border bg-white px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50 hover:border-red-500 hover:text-red-600"
      >
        Trước
      </button>

      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index)}
          className={
            index === currentPage
              ? 'rounded border border-red-600 bg-red-600 px-4 py-2 text-sm font-black text-white'
              : 'rounded border bg-white px-4 py-2 text-sm font-bold hover:border-red-500 hover:text-red-600'
          }
        >
          {index + 1}
        </button>
      ))}

      <button
        disabled={currentPage >= totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded border bg-white px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50 hover:border-red-500 hover:text-red-600"
      >
        Sau
      </button>
    </div>
  )
}

export default NewsListPage