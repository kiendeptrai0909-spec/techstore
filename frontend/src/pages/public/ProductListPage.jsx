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
  const [searchParams, setSearchParams] = useSearchParams()//làm việc với query parameters trên URL

  const [categories, setCategories] = useState([])//lưu danh sách danh mục sản phẩm
  const [brands, setBrands] = useState([])//lưu danh sách thương hiệu sản phẩm
  const [pageData, setPageData] = useState(null)//lưu dữ liệu phân trang sản phẩm
  const [loading, setLoading] = useState(true)//lưu trạng thái tải dữ liệu sản phẩm

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    categoryId: searchParams.get('categoryId') || '',
    brandId: searchParams.get('brandId') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  })//lưu tất cả điều kiện tìm kiếm, lấy giá trị từ URL

  const currentPage = Number(searchParams.get('page') || 0)//lấy trang hiện tại từ URL
  const pageSize = Number(searchParams.get('size') || 12)//lấy số lượng sản phẩm trên mỗi trang từ URL
//mục đích: biết người dùng xem trang nào và muốn hiển thị bao nhiêu sản phẩm trên mỗi trang, từ đó truy vấn dữ liệu sản phẩm phù hợp từ API.
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
//chứa query parameters hiện tại từ URL
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const categoryData = await categoryApi.getCategories()
        setCategories(normalizeList(categoryData))
      } catch (error) {
        console.error(error.message)
      }
    }

    fetchFilterData()
  }, [])//Chạy effect chỉ một lần duy nhất sau lần render đầu tiên.

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const params = {}
        if (filters.categoryId) {
          params.categoryId = filters.categoryId
        }
        const brandData = await brandApi.getBrands(params)
        setBrands(normalizeList(brandData))
      } catch (error) {
        console.error(error.message)
      }
    }

    fetchBrands()
  }, [filters.categoryId])

  useEffect(() => {
    setFilters({
      keyword: searchParams.get('keyword') || '',
      categoryId: searchParams.get('categoryId') || '',
      brandId: searchParams.get('brandId') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
    })
  }, [searchParams])//đồng bộ state filters với query parameters trên URL, đảm bảo rằng khi người dùng thay đổi URL trực tiếp hoặc sử dụng nút back/forward của trình duyệt, các bộ lọc sẽ được cập nhật chính xác.

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)

      try {
        const params = buildProductParams(queryObject)//làm sạch params
        const data = await productApi.getProducts(params)//gửi param lên API

        setPageData(data)//lưu dữ liệu phân trang sản phẩm
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

  const products = pageData?.content || []//lấy dữ liệu content từ pageData để gán vào biến products, nếu không có thì dùng mảng rỗng [].

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

function buildProductParams(query) {//object tham số (params) cho việc gọi API lấy danh sách sản phẩm dựa trên dữ liệu tìm kiếm (query).
  const params = {//chuyển object này thành object params sạch hơn để gửi lên API.
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