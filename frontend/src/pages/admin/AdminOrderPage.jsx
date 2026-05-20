import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { ShoppingBag } from 'lucide-react'

import { adminOrderApi } from '../../api/adminOrderApi'
import AdminOrderFilter from '../../components/admin/order/AdminOrderFilter'
import AdminOrderTable from '../../components/admin/order/AdminOrderTable'

function AdminOrderPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [pageData, setPageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    status: searchParams.get('status') || '',
    size: searchParams.get('size') || '10',
  })

  const currentPage = Number(searchParams.get('page') || 0)
  const pageSize = Number(searchParams.get('size') || filters.size || 10)

  useEffect(() => {
    setFilters({
      keyword: searchParams.get('keyword') || '',
      status: searchParams.get('status') || '',
      size: searchParams.get('size') || '10',
    })
  }, [searchParams])

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setMessage('')

      try {
        const params = {
          page: currentPage,
          size: pageSize,
        }

        const keyword = searchParams.get('keyword')
        const status = searchParams.get('status')

        if (keyword) {
          params.keyword = keyword
        }

        if (status) {
          params.status = status
        }

        const data = await adminOrderApi.getOrders(params)
        setPageData(data)
      } catch (error) {
        setMessage(error.message || 'Không thể tải danh sách đơn hàng')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [currentPage, pageSize, searchParams])

  const orders = Array.isArray(pageData)
    ? pageData
    : pageData?.content || []

  const handleSubmitFilter = (event) => {
    event.preventDefault()

    const nextParams = {
      page: '0',
      size: String(filters.size || 10),
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
      size: '10',
    })

    setSearchParams({
      page: '0',
      size: '10',
    })
  }

  const handlePageChange = (page) => {
    const nextParams = {
      page: String(page),
      size: String(pageSize),
    }

    const keyword = searchParams.get('keyword')
    const status = searchParams.get('status')

    if (keyword) {
      nextParams.keyword = keyword
    }

    if (status) {
      nextParams.status = status
    }

    setSearchParams(nextParams)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <ShoppingBag size={26} />
        </div>

        <div>
          <h2 className="text-2xl font-black text-gray-900">
            Quản lý đơn hàng
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Theo dõi và cập nhật trạng thái đơn hàng của khách hàng.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <AdminOrderFilter
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

        <AdminOrderTable orders={orders} loading={loading} />

        <AdminOrderPagination
          pageData={pageData}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}

function AdminOrderPagination({ pageData, onPageChange }) {
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

export default AdminOrderPage