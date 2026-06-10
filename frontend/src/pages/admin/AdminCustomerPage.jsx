import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Eye, Lock, Unlock, Users } from 'lucide-react'
import { adminCustomerApi } from '../../api/adminCustomerApi'

function AdminCustomerPage() {
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

  const fetchCustomers = async () => {
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

      const data = await adminCustomerApi.getCustomers(params)
      setPageData(data)
    } catch (error) {
      setMessage(error.message || 'Không thể tải danh sách khách hàng')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setFilters({
      keyword: searchParams.get('keyword') || '',
      status: searchParams.get('status') || '',
    })

    fetchCustomers()
  }, [searchParams])

  const customers = Array.isArray(pageData)
    ? pageData
    : pageData?.content || []

  const filteredCustomers = customers.filter((customer) => {
    const keyword = filters.keyword.trim().toLowerCase()

    const fullName = customer.fullName || customer.name || ''
    const email = customer.email || ''
    const phone = customer.phone || ''

    const matchKeyword =
      !keyword ||
      fullName.toLowerCase().includes(keyword) ||
      email.toLowerCase().includes(keyword) ||
      phone.toLowerCase().includes(keyword)

    const matchStatus =
      !filters.status || customer.status === filters.status

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

  const handleToggleStatus = async (customer) => {
  const nextStatus = customer.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE'

  const confirmed = window.confirm(
    nextStatus === 'BLOCKED'
      ? 'Bạn có chắc muốn khóa tài khoản khách hàng này?'
      : 'Bạn có chắc muốn mở khóa tài khoản khách hàng này?'
  )

    if (!confirmed) return

    setMessage('')
    setSuccessMessage('')

    try {
      await adminCustomerApi.updateCustomerStatus(customer.id, {
        status: nextStatus,
      })

      setSuccessMessage(
  nextStatus === 'BLOCKED'
    ? 'Khóa tài khoản khách hàng thành công'
    : 'Mở khóa tài khoản khách hàng thành công'
)

      await fetchCustomers()
    } catch (error) {
      setMessage(error.message || 'Không thể cập nhật trạng thái khách hàng')
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
            <Users size={26} />
          </div>

          <div>
            <h2 className="text-2xl font-black text-gray-900">
              Quản lý khách hàng
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Xem và quản lý tài khoản khách hàng.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <form
            onSubmit={handleSubmitFilter}
            className="grid gap-4 lg:grid-cols-[1fr_220px_140px]"
          >
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Tìm kiếm
              </label>

              <input
                value={filters.keyword}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    keyword: event.target.value,
                  }))
                }
                placeholder="Tên, email, số điện thoại..."
                className="h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Trạng thái
              </label>

              <select
                value={filters.status}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: event.target.value,
                  }))
                }
                className="h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500"
              >
                <option value="">Tất cả</option>
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="BLOCKED">Đã khóa</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="h-11 flex-1 rounded bg-red-600 px-4 text-sm font-black text-white hover:bg-red-700"
              >
                Lọc
              </button>

              <button
                type="button"
                onClick={handleResetFilter}
                className="h-11 rounded border px-4 text-sm font-bold text-gray-700 hover:border-red-500 hover:text-red-600"
              >
                Xóa
              </button>
            </div>
          </form>
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
                <th className="px-4 py-3 font-bold">Khách hàng</th>
                <th className="px-4 py-3 font-bold">Email</th>
                <th className="px-4 py-3 font-bold">Số điện thoại</th>
                <th className="px-4 py-3 font-bold">Trạng thái</th>
                <th className="px-4 py-3 font-bold">Ngày tạo</th>
                <th className="px-4 py-3 text-right font-bold">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Đang tải khách hàng...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Không có khách hàng nào.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-t">
                    <td className="px-4 py-4">
                      <div className="font-black text-gray-900">
                        {customer.fullName || customer.name || 'Khách hàng'}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        ID: {customer.id}
                      </div>
                    </td>

                    <td className="px-4 py-4 font-semibold text-gray-700">
                      {customer.email || 'Chưa cập nhật'}
                    </td>

                    <td className="px-4 py-4">
                      {customer.phone || 'Chưa cập nhật'}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={
                          customer.status === 'BLOCKED'
                            ? 'inline-flex rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-600'
                            : 'inline-flex rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-600'
                        }
                      >
                        {customer.status === 'BLOCKED'
                          ? 'Đã khóa'
                          : 'Hoạt động'}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {customer.createdAt
                        ? new Date(customer.createdAt).toLocaleString('vi-VN')
                        : ''}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/customers/${customer.id}`}
                          className="flex h-9 w-9 items-center justify-center rounded border text-gray-600 hover:border-red-500 hover:text-red-600"
                          title="Xem chi tiết"
                        >
                          <Eye size={17} />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(customer)}
                          className="flex h-9 w-9 items-center justify-center rounded border text-gray-600 hover:border-red-500 hover:text-red-600"
                          title={
                            customer.status === 'ACTIVE'
                              ? 'Khóa tài khoản'
                              : 'Mở khóa tài khoản'
                          }
                        >
                          {customer.status === 'ACTIVE' ? (
                            <Lock size={17} />
                          ) : (
                            <Unlock size={17} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <AdminCustomerPagination
          pageData={pageData}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}

function AdminCustomerPagination({ pageData, onPageChange }) {
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

export default AdminCustomerPage