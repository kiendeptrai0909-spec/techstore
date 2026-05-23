import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Edit, Plus, Tags, Trash2 } from 'lucide-react'
import { adminCategoryApi } from '../../api/adminCategoryApi'

function AdminCategoryPage() {
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

  const fetchCategories = async () => {
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

      const data = await adminCategoryApi.getCategories(params)
      setPageData(data)
    } catch (error) {
      setMessage(error.message || 'Không thể tải danh mục')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setFilters({
      keyword: searchParams.get('keyword') || '',
      status: searchParams.get('status') || '',
    })

    fetchCategories()
  }, [searchParams])

  const categories = Array.isArray(pageData)
    ? pageData
    : pageData?.content || []

  const filteredCategories = categories.filter((category) => {
    const keyword = filters.keyword.trim().toLowerCase()

    const matchKeyword =
      !keyword ||
      category.name?.toLowerCase().includes(keyword) ||
      category.slug?.toLowerCase().includes(keyword) ||
      category.description?.toLowerCase().includes(keyword)

    const matchStatus =
      !filters.status || category.status === filters.status

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

  const handleDeleteCategory = async (categoryId) => {
    const confirmed = window.confirm('Bạn có chắc muốn xóa danh mục này?')

    if (!confirmed) return

    setMessage('')
    setSuccessMessage('')

    try {
      await adminCategoryApi.deleteCategory(categoryId)
      setSuccessMessage('Xóa danh mục thành công')
      await fetchCategories()
    } catch (error) {
      setMessage(error.message || 'Không thể xóa danh mục')
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <Tags size={26} />
          </div>

          <div>
            <h2 className="text-2xl font-black text-gray-900">
              Quản lý danh mục
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Tạo, cập nhật và quản lý danh mục sản phẩm.
            </p>
          </div>
        </div>

        <Link
          to="/admin/categories/create"
          className="inline-flex items-center gap-2 rounded bg-red-600 px-5 py-3 font-black text-white hover:bg-red-700"
        >
          <Plus size={20} />
          Thêm danh mục
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
                placeholder="Tên danh mục, slug..."
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
                <option value="ACTIVE">Đang hiển thị</option>
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
                <th className="px-4 py-3 font-bold">Danh mục</th>
                <th className="px-4 py-3 font-bold">Slug</th>
                <th className="px-4 py-3 font-bold">Thứ tự</th>
                <th className="px-4 py-3 font-bold">Trạng thái</th>
                <th className="px-4 py-3 text-right font-bold">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    Đang tải danh mục...
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    Không có danh mục nào.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="border-t">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded border bg-gray-50">
                          {category.imageUrl ? (
                            <img
                              src={category.imageUrl}
                              alt={category.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Tags size={22} className="text-gray-400" />
                          )}
                        </div>

                        <div>
                          <div className="font-black text-gray-900">
                            {category.name}
                          </div>
                          {category.description && (
                            <div className="mt-1 line-clamp-1 text-gray-500">
                              {category.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 font-semibold text-gray-700">
                      {category.slug}
                    </td>

                    <td className="px-4 py-4 font-bold">
                      {category.sortOrder ?? 0}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={
                          category.status === 'INACTIVE'
                            ? 'inline-flex rounded-full border bg-gray-50 px-3 py-1 text-xs font-bold text-gray-600'
                            : 'inline-flex rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-600'
                        }
                      >
                        {category.status === 'INACTIVE' ? 'Đang ẩn' : 'Hiển thị'}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/categories/${category.id}/edit`}
                          className="flex h-9 w-9 items-center justify-center rounded border text-gray-600 hover:border-red-500 hover:text-red-600"
                        >
                          <Edit size={17} />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(category.id)}
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
      </div>
    </div>
  )
}

export default AdminCategoryPage