import { useEffect, useState } from 'react'
import { Link, useSearchParams, useLocation } from 'react-router'
import { Plus, Ticket } from 'lucide-react'

import { adminCouponApi } from '../../api/adminCouponApi'
import AdminCouponFilter from '../../components/admin/coupon/AdminCouponFilter'
import AdminCouponTable from '../../components/admin/coupon/AdminCouponTable'

function AdminCouponPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()

  const [pageData, setPageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    discountType: searchParams.get('discountType') || '',
    status: searchParams.get('status') || '',
  })

  const currentPage = Number(searchParams.get('page') || 0)
  const pageSize = Number(searchParams.get('size') || 10)

  const fetchCoupons = async () => {
    setLoading(true)
    setMessage('')

    try {
      const params = {
        page: currentPage,
        size: pageSize,
      }

      const keyword = searchParams.get('keyword')
      const discountType = searchParams.get('discountType')
      const status = searchParams.get('status')

      if (keyword) params.keyword = keyword
      if (discountType) params.discountType = discountType
      if (status) params.status = status

      const data = await adminCouponApi.getCoupons(params)
      setPageData(data)
    } catch (error) {
      setMessage(error.message || 'Không thể tải danh sách coupon')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setFilters({
      keyword: searchParams.get('keyword') || '',
      discountType: searchParams.get('discountType') || '',
      status: searchParams.get('status') || '',
    })

    fetchCoupons()
  }, [searchParams])

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage)
      window.history.replaceState({}, document.title)
      setTimeout(() => setSuccessMessage(''), 5000)
    }
  }, [location.state])

  const coupons = Array.isArray(pageData)
    ? pageData
    : pageData?.content || []
  const filteredCoupons = coupons.filter((coupon) => {
    const keyword = (searchParams.get('keyword') || '').trim().toLowerCase()

    const matchKeyword =
      !keyword ||
      coupon.code?.toLowerCase().includes(keyword) ||
      coupon.name?.toLowerCase().includes(keyword) ||
      coupon.description?.toLowerCase().includes(keyword)

    const discountTypeParam = searchParams.get('discountType') || ''
    const matchDiscountType =
      !discountTypeParam || coupon.discountType === discountTypeParam

    const statusParam = searchParams.get('status') || ''
    const matchStatus =
      !statusParam || coupon.status === statusParam

    return matchKeyword && matchDiscountType && matchStatus
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

    if (filters.discountType) {
      nextParams.discountType = filters.discountType
    }

    if (filters.status) {
      nextParams.status = filters.status
    }

    setSearchParams(nextParams)
  }

  const handleResetFilter = () => {
    setFilters({
      keyword: '',
      discountType: '',
      status: '',
    })

    setSearchParams({
      page: '0',
      size: String(pageSize),
    })
  }

  const handleDeleteCoupon = async (couponId) => {
    const confirmed = window.confirm('Bạn có chắc muốn xóa coupon này?')

    if (!confirmed) return

    setMessage('')
    setSuccessMessage('')

    try {
      await adminCouponApi.deleteCoupon(couponId)
      setSuccessMessage('Xóa coupon thành công')
      await fetchCoupons()
    } catch (error) {
      setMessage(error.message || 'Không thể xóa coupon')
    }
  }

  const handlePageChange = (page) => {
    const nextParams = {
      page: String(page),
      size: String(pageSize),
    }

    const keyword = searchParams.get('keyword')
    const discountType = searchParams.get('discountType')
    const status = searchParams.get('status')

    if (keyword) nextParams.keyword = keyword
    if (discountType) nextParams.discountType = discountType
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
            <Ticket size={26} />
          </div>

          <div>
            <h2 className="text-2xl font-black text-gray-900">
              Quản lý coupon
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Tạo và quản lý mã giảm giá cho khách hàng.
            </p>
          </div>
        </div>

        <Link
          to="/admin/coupons/create"
          className="inline-flex items-center gap-2 rounded bg-red-600 px-5 py-3 font-black text-white hover:bg-red-700"
        >
          <Plus size={20} />
          Thêm coupon
        </Link>
      </div>

      <div className="space-y-5">
        <AdminCouponFilter
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

        <AdminCouponTable
          coupons={filteredCoupons}
          loading={loading}
          onDelete={handleDeleteCoupon}
        />

        <AdminCouponPagination
          pageData={pageData}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}

function AdminCouponPagination({ pageData, onPageChange }) {
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

export default AdminCouponPage