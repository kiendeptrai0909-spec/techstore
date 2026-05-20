import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { SlidersHorizontal } from 'lucide-react'

import { productApi } from '../../api/productApi'
import { categoryApi } from '../../api/categoryApi'
import { brandApi } from '../../api/brandApi'

import ProductFilterSidebar from '../../components/product/ProductFilterSidebar'
import ProductGrid from '../../components/product/ProductGrid'
import ProductPagination from '../../components/product/ProductPagination'

function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [pageData, setPageData] = useState(null)
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    categoryId: searchParams.get('categoryId') || '',
    brandId: searchParams.get('brandId') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  })

  const currentPage = Number(searchParams.get('page') || 0)
  const pageSize = Number(searchParams.get('size') || 12)

  const queryObject = useMemo(() => {
    return {
      keyword: searchParams.get('keyword') || '',
      categoryId: searchParams.get('categoryId') || '',
      brandId: searchParams.get('brandId') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      page: currentPage,
      size: pageSize,
    }
  }, [searchParams, currentPage, pageSize])

  useEffect(() => {
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

    fetchFilterData()
  }, [])

  useEffect(() => {
    setFilters({
      keyword: searchParams.get('keyword') || '',
      categoryId: searchParams.get('categoryId') || '',
      brandId: searchParams.get('brandId') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
    })
  }, [searchParams])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)

      try {
        const params = buildProductParams(queryObject)
        const data = await productApi.getProducts(params)

        setPageData(data)
      } catch (error) {
        console.error(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [queryObject])

  const handleSubmitFilter = (event) => {
    event.preventDefault()

    const nextParams = buildSearchParams({
      ...filters,
      page: 0,
      size: pageSize,
    })

    setSearchParams(nextParams)
  }

  const handleResetFilter = () => {
    setFilters({
      keyword: '',
      categoryId: '',
      brandId: '',
      minPrice: '',
      maxPrice: '',
    })

    setSearchParams({
      page: '0',
      size: String(pageSize),
    })
  }

  const handlePageChange = (page) => {
    const nextParams = buildSearchParams({
      ...queryObject,
      page,
      size: pageSize,
    })

    setSearchParams(nextParams)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const products = pageData?.content || []

  return (
    <div className="bg-[#e9e9e9]">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-4 rounded-md bg-white p-4 shadow-sm">
          <h1 className="text-2xl font-black text-gray-900">
            Danh sách sản phẩm
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Tìm kiếm, lọc và lựa chọn sản phẩm công nghệ phù hợp với bạn.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
          <ProductFilterSidebar
            categories={categories}
            brands={brands}
            filters={filters}
            setFilters={setFilters}
            onSubmit={handleSubmitFilter}
            onReset={handleResetFilter}
          />

          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 font-bold">
                <SlidersHorizontal size={20} className="text-red-600" />
                <span>
                  {pageData?.totalElements ?? 0} sản phẩm
                </span>
              </div>

              <div className="text-sm text-gray-500">
                Trang {(pageData?.number || 0) + 1}
                {' / '}
                {pageData?.totalPages || 1}
              </div>
            </div>

            <ProductGrid products={products} loading={loading} />

            <ProductPagination
              pageData={pageData}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function normalizeList(data) {
  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data?.content)) {
    return data.content
  }

  return []
}

function buildProductParams(query) {
  const params = {
    page: query.page ?? 0,
    size: query.size ?? 12,
  }

  if (query.keyword) {
    params.keyword = query.keyword
  }

  if (query.categoryId) {
    params.categoryId = query.categoryId
  }

  if (query.brandId) {
    params.brandId = query.brandId
  }

  if (query.minPrice) {
    params.minPrice = query.minPrice
  }

  if (query.maxPrice) {
    params.maxPrice = query.maxPrice
  }

  return params
}

function buildSearchParams(query) {
  const params = {}

  if (query.keyword) {
    params.keyword = query.keyword.trim()
  }

  if (query.categoryId) {
    params.categoryId = query.categoryId
  }

  if (query.brandId) {
    params.brandId = query.brandId
  }

  if (query.minPrice) {
    params.minPrice = query.minPrice
  }

  if (query.maxPrice) {
    params.maxPrice = query.maxPrice
  }

  params.page = String(query.page ?? 0)
  params.size = String(query.size ?? 12)

  return params
}

export default ProductListPage