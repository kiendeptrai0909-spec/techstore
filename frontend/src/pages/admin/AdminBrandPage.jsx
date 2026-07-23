import { useEffect, useState } from 'react'
import { Link, useSearchParams, useLocation } from 'react-router'
import { Edit, Plus, Award, Trash2 } from 'lucide-react'
import { brandApi } from '../../api/brandApi'
import AdminPagination from '../../components/admin/AdminPagination'

function AdminBrandPage() {
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

  const fetchBrands = async () => {
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

      const data = await brandApi.getAdminBrands(params)
      setPageData(data)
    } catch (error) {
      setMessage(error.message || 'Không thể tải thương hiệu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setFilters({
      keyword: searchParams.get('keyword') || '',
      status: searchParams.get('status') || '',
    })

    fetchBrands()
  }, [searchParams])

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage)
      window.history.replaceState({}, document.title)
      setTimeout(() => setSuccessMessage(''), 5000)
    }
  }, [location.state])

  const brands = Array.isArray(pageData)
    ? pageData
    : pageData?.content || []

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

  const handleDeleteBrand = async (brandId) => {
    const confirmed = window.confirm('Bạn có chắc muốn xóa thương hiệu này?')

    if (!confirmed) return

    setMessage('')
    setSuccessMessage('')

    try {
      await brandApi.deleteBrand(brandId)
      setSuccessMessage('Xóa thương hiệu thành công')
      await fetchBrands()
    } catch (error) {
      setMessage(error.message || 'Không thể xóa thương hiệu')
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <Award size={26} />
          </div>

          <div>
            <h2 className="text-2xl font-black text-gray-900">
              Quản lý thương hiệu
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Tạo, cập nhật và quản lý thương hiệu sản phẩm.
            </p>
          </div>
        </div>

        <Link
          to="/admin/brands/create"
          className="inline-flex items-center gap-2 rounded bg-red-600 px-5 py-3 font-black text-white hover:bg-red-700"
        >
          <Plus size={20} />
          Thêm thương hiệu
        </Link>
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
                placeholder="Tên thương hiệu, slug..."
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
                <option value="ACTIVE">Hiển thị</option>
                <option value="INACTIVE">Đang ẩn</option>
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
                <th className="px-4 py-3 font-bold">Thương hiệu</th>
                <th className="px-4 py-3 font-bold">Slug</th>
                <th className="px-4 py-3 font-bold">Trạng thái</th>
                <th className="px-4 py-3 text-right font-bold">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    Đang tải thương hiệu...
                  </td>
                </tr>
              ) : brands.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    Không có thương hiệu nào.
                  </td>
                </tr>
              ) : (
                brands.map((brand) => (
                  <tr key={brand.id} className="border-t">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded border bg-gray-50 text-gray-400">
                          <Award size={22} className="text-red-600" />
                        </div>

                        <div>
                          <div className="font-black text-gray-900">
                            {brand.name}
                          </div>
                          {brand.description && (
                            <div className="mt-1 line-clamp-1 text-gray-500">
                              {brand.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 font-semibold text-gray-700">
                      {brand.slug}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={
                          brand.status === 'INACTIVE'
                            ? 'inline-flex rounded-full border bg-gray-50 px-3 py-1 text-xs font-bold text-gray-600'
                            : 'inline-flex rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-600'
                        }
                      >
                        {brand.status === 'INACTIVE' ? 'Đang ẩn' : 'Hiển thị'}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/brands/edit/${brand.id}`}
                          className="flex h-9 w-9 items-center justify-center rounded border text-gray-600 hover:border-red-500 hover:text-red-600"
                        >
                          <Edit size={17} />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDeleteBrand(brand.id)}
                          className="flex h-9 w-9 items-center justify-center rounded border text-gray-600 hover:border-red-500 hover:text-red-600"
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
          onPageChange={(page) => {
            const nextParams = Object.fromEntries(searchParams.entries())
            nextParams.page = String(page)
            setSearchParams(nextParams)
          }}
        />
      </div>
    </div>
  )
}

export default AdminBrandPage
