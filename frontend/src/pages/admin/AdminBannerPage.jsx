import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Image, Plus } from 'lucide-react'

import { adminBannerApi } from '../../api/adminBannerApi'
import AdminBannerFilter from '../../components/admin/banner/AdminBannerFilter'
import AdminBannerTable from '../../components/admin/banner/AdminBannerTable'

function AdminBannerPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [pageData, setPageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    position: searchParams.get('position') || '',
    status: searchParams.get('status') || '',
  })

  const currentPage = Number(searchParams.get('page') || 0)
  const pageSize = Number(searchParams.get('size') || 10)

  const fetchBanners = async () => {
    setLoading(true)
    setMessage('')

    try {
      const params = {
        page: currentPage,
        size: pageSize,
      }

      const keyword = searchParams.get('keyword')
      const position = searchParams.get('position')
      const status = searchParams.get('status')

      if (keyword) params.keyword = keyword
      if (position) params.position = position
      if (status) params.status = status

      const data = await adminBannerApi.getBanners(params)
      setPageData(data)
    } catch (error) {
      setMessage(error.message || 'Không thể tải danh sách banner')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setFilters({
      keyword: searchParams.get('keyword') || '',
      position: searchParams.get('position') || '',
      status: searchParams.get('status') || '',
    })

    fetchBanners()
  }, [searchParams])

  const banners = Array.isArray(pageData)
    ? pageData
    : pageData?.content || []
  const filteredBanners = banners.filter((banner) => {
    const keyword = filters.keyword.trim().toLowerCase()

    const matchKeyword =
      !keyword ||
      banner.title?.toLowerCase().includes(keyword) ||
      banner.linkUrl?.toLowerCase().includes(keyword) ||
      banner.imageUrl?.toLowerCase().includes(keyword)

    const matchPosition =
      !filters.position || banner.position === filters.position

    const matchStatus =
      !filters.status || banner.status === filters.status

    return matchKeyword && matchPosition && matchStatus
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

    if (filters.position) {
      nextParams.position = filters.position
    }

    if (filters.status) {
      nextParams.status = filters.status
    }

    setSearchParams(nextParams)
  }

  const handleResetFilter = () => {
    setFilters({
      keyword: '',
      position: '',
      status: '',
    })

    setSearchParams({
      page: '0',
      size: String(pageSize),
    })
  }

  const handleDeleteBanner = async (bannerId) => {
    const confirmed = window.confirm('Bạn có chắc muốn xóa banner này?')

    if (!confirmed) return

    setMessage('')
    setSuccessMessage('')

    try {
      await adminBannerApi.deleteBanner(bannerId)
      setSuccessMessage('Xóa banner thành công')
      await fetchBanners()
    } catch (error) {
      setMessage(error.message || 'Không thể xóa banner')
    }
  }

  const handlePageChange = (page) => {
    const nextParams = {
      page: String(page),
      size: String(pageSize),
    }

    const keyword = searchParams.get('keyword')
    const position = searchParams.get('position')
    const status = searchParams.get('status')

    if (keyword) nextParams.keyword = keyword
    if (position) nextParams.position = position
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
            <Image size={26} />
          </div>

          <div>
            <h2 className="text-2xl font-black text-gray-900">
              Quản lý banner
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Tạo, cập nhật và quản lý banner hiển thị trên website.
            </p>
          </div>
        </div>

        <Link
          to="/admin/banners/create"
          className="inline-flex items-center gap-2 rounded bg-red-600 px-5 py-3 font-black text-white hover:bg-red-700"
        >
          <Plus size={20} />
          Thêm banner
        </Link>
      </div>

      <div className="space-y-5">
        <AdminBannerFilter
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

        <AdminBannerTable
          banners={filteredBanners}
          loading={loading}
          onDelete={handleDeleteBanner}
        />

        <AdminBannerPagination
          pageData={pageData}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}

function AdminBannerPagination({ pageData, onPageChange }) {
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

export default AdminBannerPage