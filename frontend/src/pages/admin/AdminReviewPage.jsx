import { useEffect, useState } from 'react'
import { Link, useSearchParams, useLocation } from 'react-router'
import { Check, Eye, EyeOff, Star, Trash2, MessageSquare } from 'lucide-react'
import { adminReviewApi } from '../../api/adminReviewApi'
import AdminPagination from '../../components/admin/AdminPagination'

function AdminReviewPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()

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

  const fetchReviews = async () => {
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

      const data = await adminReviewApi.getReviews(params)
      setPageData(data)
    } catch (error) {
      setMessage(error.message || 'Không thể tải danh sách đánh giá')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setFilters({
      keyword: searchParams.get('keyword') || '',
      status: searchParams.get('status') || '',
    })

    fetchReviews()
  }, [searchParams])

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage)
      window.history.replaceState({}, document.title)
      setTimeout(() => setSuccessMessage(''), 5000)
    }
  }, [location.state])

  const reviews = Array.isArray(pageData)
    ? pageData
    : pageData?.content || []

  const handleKeywordChange = (keyword) => {
    setFilters((prev) => ({ ...prev, keyword }))
    const nextParams = {
      page: '0',
      size: String(pageSize),
    }
    if (keyword.trim()) nextParams.keyword = keyword.trim()
    if (filters.status) nextParams.status = filters.status
    setSearchParams(nextParams)
  }

  const handleStatusChange = (status) => {
    setFilters((prev) => ({ ...prev, status }))
    const nextParams = {
      page: '0',
      size: String(pageSize),
    }
    if (filters.keyword.trim()) nextParams.keyword = filters.keyword.trim()
    if (status) nextParams.status = status
    setSearchParams(nextParams)
  }

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

  const handleApproveReview = async (reviewId) => {
    const confirmed = window.confirm('Bạn có chắc muốn duyệt đánh giá này?')

    if (!confirmed) return

    setMessage('')
    setSuccessMessage('')

    try {
      await adminReviewApi.approveReview(reviewId)
      setSuccessMessage('Duyệt đánh giá thành công')
      await fetchReviews()
    } catch (error) {
      setMessage(error.message || 'Không thể duyệt đánh giá')
    }
  }

  const handleHideReview = async (reviewId) => {
    const confirmed = window.confirm('Bạn có chắc muốn ẩn đánh giá này?')

    if (!confirmed) return

    setMessage('')
    setSuccessMessage('')

    try {
      await adminReviewApi.hideReview(reviewId)
      setSuccessMessage('Ẩn đánh giá thành công')
      await fetchReviews()
    } catch (error) {
      setMessage(error.message || 'Không thể ẩn đánh giá')
    }
  }

  const handleDeleteReview = async (reviewId) => {
    const confirmed = window.confirm('Bạn có chắc muốn xóa đánh giá này?')

    if (!confirmed) return

    setMessage('')
    setSuccessMessage('')

    try {
      await adminReviewApi.deleteReview(reviewId)
      setSuccessMessage('Xóa đánh giá thành công')
      await fetchReviews()
    } catch (error) {
      setMessage(error.message || 'Không thể xóa đánh giá')
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return 'inline-flex rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-600'
      case 'VISIBLE':
        return 'inline-flex rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-600'
      case 'HIDDEN':
        return 'inline-flex rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-600'
      default:
        return 'inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-bold text-gray-600'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ duyệt'
      case 'VISIBLE':
        return 'Đã duyệt'
      case 'HIDDEN':
        return 'Đã ẩn'
      default:
        return status || 'N/A'
    }
  }

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }
          />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <MessageSquare size={26} />
          </div>

          <div>
            <h2 className="text-2xl font-black text-gray-900">
              Quản lý đánh giá
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Duyệt, ẩn hoặc xóa đánh giá của khách hàng.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_220px_100px]">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Tìm kiếm
              </label>

              <input
                value={filters.keyword}
                onChange={(event) => handleKeywordChange(event.target.value)}
                placeholder="Tên khách hàng, tên sản phẩm..."
                className="h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Trạng thái
              </label>

              <select
                value={filters.status}
                onChange={(event) => handleStatusChange(event.target.value)}
                className="h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500"
              >
                <option value="">Tất cả</option>
                <option value="PENDING">Chờ duyệt</option>
                <option value="VISIBLE">Đã duyệt</option>
                <option value="HIDDEN">Đã ẩn</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleResetFilter}
                className="h-11 w-full rounded border text-sm font-bold text-gray-700 hover:border-red-500 hover:text-red-600"
              >
                Xóa lọc
              </button>
            </div>
          </div>
        </div>

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

        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 font-bold">Sản phẩm</th>
                <th className="px-4 py-3 font-bold">Khách hàng</th>
                <th className="px-4 py-3 font-bold">Đánh giá</th>
                <th className="px-4 py-3 font-bold">Nội dung</th>
                <th className="px-4 py-3 font-bold">Trạng thái</th>
                <th className="px-4 py-3 font-bold">Ngày tạo</th>
                <th className="px-4 py-3 text-right font-bold">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Đang tải đánh giá...
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Không có đánh giá nào.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="border-t">
                    <td className="px-4 py-4">
                      <div className="font-black text-gray-900">
                        {review.productName || 'Sản phẩm'}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        ID: {review.productId}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-semibold text-gray-900">
                        {review.userFullName || review.userEmail || 'Khách hàng'}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {review.userEmail || ''}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      {renderStars(review.rating)}
                    </td>

                    <td className="px-4 py-4">
                      <div className="max-w-xs truncate text-gray-600">
                        {review.comment || 'Không có nội dung'}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className={getStatusBadge(review.status)}>
                        {getStatusText(review.status)}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleString('vi-VN')
                        : ''}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        {review.status === 'PENDING' && (
                          <button
                            type="button"
                            onClick={() => handleApproveReview(review.id)}
                            className="flex h-9 w-9 items-center justify-center rounded border text-gray-600 hover:border-green-500 hover:text-green-600"
                            title="Duyệt"
                          >
                            <Check size={17} />
                          </button>
                        )}

                        {review.status === 'VISIBLE' && (
                          <button
                            type="button"
                            onClick={() => handleHideReview(review.id)}
                            className="flex h-9 w-9 items-center justify-center rounded border text-gray-600 hover:border-yellow-500 hover:text-yellow-600"
                            title="Ẩn"
                          >
                            <EyeOff size={17} />
                          </button>
                        )}

                        {review.status === 'HIDDEN' && (
                          <button
                            type="button"
                            onClick={() => handleApproveReview(review.id)}
                            className="flex h-9 w-9 items-center justify-center rounded border text-gray-600 hover:border-green-500 hover:text-green-600"
                            title="Hiện lại"
                          >
                            <Eye size={17} />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteReview(review.id)}
                          className="flex h-9 w-9 items-center justify-center rounded border text-gray-600 hover:border-red-500 hover:text-red-600"
                          title="Xóa"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <AdminPagination
          pageData={pageData}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}


export default AdminReviewPage
