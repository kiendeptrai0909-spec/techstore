import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Newspaper, Plus } from 'lucide-react'

import { adminNewsApi } from '../../api/adminNewsApi'
import AdminNewsFilter from '../../components/admin/news/AdminNewsFilter'
import AdminNewsTable from '../../components/admin/news/AdminNewsTable'

function AdminNewsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [pageData, setPageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    status: searchParams.get('status') || '',
  })

  const currentPage = Number(searchParams.get('page') || 0)
  const pageSize = Number(searchParams.get('size') || 10)

  const fetchNews = async () => {
    setLoading(true)
    setMessage('')

    try {
      const params = {
        page: currentPage,
        size: pageSize,
      }

      const keyword = searchParams.get('keyword')
      const status = searchParams.get('status')

      if (keyword) params.keyword = keyword
      if (status) params.status = status

      const data = await adminNewsApi.getNews(params)
      setPageData(data)
    } catch (error) {
      setMessage(error.message || 'Không thể tải danh sách bài viết')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setFilters({
      keyword: searchParams.get('keyword') || '',
      status: searchParams.get('status') || '',
    })

    fetchNews()
  }, [searchParams])

  const news = Array.isArray(pageData)
    ? pageData
    : pageData?.content || []
  const filteredNews = news.filter((item) => {
    const keyword = filters.keyword.trim().toLowerCase()

    const matchKeyword =
      !keyword ||
      item.title?.toLowerCase().includes(keyword) ||
      item.slug?.toLowerCase().includes(keyword) ||
      item.summary?.toLowerCase().includes(keyword) ||
      item.content?.toLowerCase().includes(keyword) ||
      item.author?.toLowerCase().includes(keyword)

    const matchStatus =
      !filters.status || item.status === filters.status

    return matchKeyword && matchStatus
  })
  const handleSubmitFilter = (event) => {
    event.preventDefault()

    const nextParams = {
      page: '0',
      size: String(pageSize),
    }

    if (filters.keyword.trim()) {
      nextParams.keyword = filters.keyword.trim()
    }

    if (filters.status) {
      nextParams.status = filters.status
    }

    setSearchParams(nextParams)
  }

  const handleResetFilter = () => {
    setFilters({
      keyword: '',
      status: '',
    })

    setSearchParams({
      page: '0',
      size: String(pageSize),
    })
  }

  const handleDeleteNews = async (newsId) => {
    const confirmed = window.confirm('Bạn có chắc muốn xóa bài viết này?')

    if (!confirmed) return

    setMessage('')
    setSuccessMessage('')

    try {
      await adminNewsApi.deleteNews(newsId)
      setSuccessMessage('Xóa bài viết thành công')
      await fetchNews()
    } catch (error) {
      setMessage(error.message || 'Không thể xóa bài viết')
    }
  }

  const handlePageChange = (page) => {
    const nextParams = {
      page: String(page),
      size: String(pageSize),
    }

    const keyword = searchParams.get('keyword')
    const status = searchParams.get('status')

    if (keyword) nextParams.keyword = keyword
    if (status) nextParams.status = status

    setSearchParams(nextParams)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <Newspaper size={26} />
          </div>

          <div>
            <h2 className="text-2xl font-black text-gray-900">
              Quản lý tin tức
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Tạo, chỉnh sửa và xuất bản bài viết tin tức công nghệ.
            </p>
          </div>
        </div>

        <Link
          to="/admin/news/create"
          className="inline-flex items-center gap-2 rounded bg-red-600 px-5 py-3 font-black text-white hover:bg-red-700"
        >
          <Plus size={20} />
          Thêm bài viết
        </Link>
      </div>

      <div className="space-y-5">
        <AdminNewsFilter
          filters={filters}
          setFilters={setFilters}
          onSubmit={handleSubmitFilter}
          onReset={handleResetFilter}
        />

        {message && (
          <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {message}
          </div>
        )}

        {successMessage && (
          <div className="rounded border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
            {successMessage}
          </div>
        )}

        <AdminNewsTable
          news={filteredNews}
          loading={loading}
          onDelete={handleDeleteNews}
        />

        <AdminNewsPagination
          pageData={pageData}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}

function AdminNewsPagination({ pageData, onPageChange }) {
  if (!pageData || pageData.totalPages <= 1) {
    return null
  }

  const currentPage = pageData.number || 0
  const totalPages = pageData.totalPages || 0

  return (
    <div className="flex items-center justify-center gap-2">
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

export default AdminNewsPage