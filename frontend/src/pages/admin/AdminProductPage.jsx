import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Package, Plus } from 'lucide-react'

import { adminProductApi } from '../../api/adminProductApi'
import { categoryApi } from '../../api/categoryApi'
import { brandApi } from '../../api/brandApi'

import AdminProductFilter from '../../components/admin/product/AdminProductFilter'
import AdminProductTable from '../../components/admin/product/AdminProductTable'

function AdminProductPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [pageData, setPageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    categoryId: searchParams.get('categoryId') || '',
    brandId: searchParams.get('brandId') || '',
    status: searchParams.get('status') || '',
  })

  const currentPage = Number(searchParams.get('page') || 0)
  const pageSize = Number(searchParams.get('size') || 10)

  const fetchFilterData = async () => {
    try {
      const [categoryData, brandData] = await Promise.all([
        categoryApi.getCategories(),
        brandApi.getBrands(),
      ])

      setCategories(normalizeList(categoryData))
      setBrands(normalizeList(brandData))
    } catch (error) {
      console.error(error.message)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    setMessage('')

    try {
      const params = {
        page: currentPage,
        size: pageSize,
      }

      const keyword = searchParams.get('keyword')
      const categoryId = searchParams.get('categoryId')
      const brandId = searchParams.get('brandId')
      const status = searchParams.get('status')

      if (keyword) params.keyword = keyword
      if (categoryId) params.categoryId = categoryId
      if (brandId) params.brandId = brandId
      if (status) params.status = status

      const data = await adminProductApi.getProducts(params)
      setPageData(data)
    } catch (error) {
      setMessage(error.message || 'Không thể tải danh sách sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFilterData()
  }, [])

  useEffect(() => {
    setFilters({
      keyword: searchParams.get('keyword') || '',
      categoryId: searchParams.get('categoryId') || '',
      brandId: searchParams.get('brandId') || '',
      status: searchParams.get('status') || '',
    })

    fetchProducts()
  }, [searchParams])

  const products = Array.isArray(pageData)
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

    if (filters.categoryId) {
      nextParams.categoryId = filters.categoryId
    }

    if (filters.brandId) {
      nextParams.brandId = filters.brandId
    }

    if (filters.status) {
      nextParams.status = filters.status
    }

    setSearchParams(nextParams)
  }

  const handleResetFilter = () => {
    setFilters({
      keyword: '',
      categoryId: '',
      brandId: '',
      status: '',
    })

    setSearchParams({
      page: '0',
      size: String(pageSize),
    })
  }

  const handleDeleteProduct = async (productId) => {
    const confirmed = window.confirm('Bạn có chắc muốn xóa sản phẩm này?')

    if (!confirmed) return

    setMessage('')
    setSuccessMessage('')

    try {
      await adminProductApi.deleteProduct(productId)
      setSuccessMessage('Xóa sản phẩm thành công')
      await fetchProducts()
    } catch (error) {
      setMessage(error.message || 'Không thể xóa sản phẩm')
    }
  }

  const handlePageChange = (page) => {
    const nextParams = {
      page: String(page),
      size: String(pageSize),
    }

    const keyword = searchParams.get('keyword')
    const categoryId = searchParams.get('categoryId')
    const brandId = searchParams.get('brandId')
    const status = searchParams.get('status')

    if (keyword) nextParams.keyword = keyword
    if (categoryId) nextParams.categoryId = categoryId
    if (brandId) nextParams.brandId = brandId
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
            <Package size={26} />
          </div>

          <div>
            <h2 className="text-2xl font-black text-gray-900">
              Quản lý sản phẩm
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Tạo, cập nhật và quản lý sản phẩm trong hệ thống.
            </p>
          </div>
        </div>

        <Link
          to="/admin/products/create"
          className="inline-flex items-center gap-2 rounded bg-red-600 px-5 py-3 font-black text-white hover:bg-red-700"
        >
          <Plus size={20} />
          Thêm sản phẩm
        </Link>
      </div>

      <div className="space-y-5">
        <AdminProductFilter
          filters={filters}
          setFilters={setFilters}
          categories={categories}
          brands={brands}
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

        <AdminProductTable
          products={products}
          loading={loading}
          onDelete={handleDeleteProduct}
        />

        <AdminProductPagination
          pageData={pageData}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}

function AdminProductPagination({ pageData, onPageChange }) {
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

function normalizeList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.items)) return data.items
  return []
}

export default AdminProductPage