import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ChevronRight } from 'lucide-react'

import { productApi } from '../../api/productApi'
import { cartApi } from '../../api/cartApi'
import { reviewApi } from '../../api/reviewApi'

import ProductImageGallery from '../../components/product/ProductImageGallery'
import ProductInfoBox from '../../components/product/ProductInfoBox'
import ProductDescriptionTabs from '../../components/product/ProductDescriptionTabs'
import ProductReviewList from '../../components/product/ProductReviewList'

function ProductDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState([])
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [loadingReviews, setLoadingReviews] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      setLoadingProduct(true)
      setError('')

      try {
        const data = await productApi.getProductBySlug(slug)
        setProduct(data)

        if (data?.variants?.length > 0) {
          setSelectedVariant(data.variants[0])
        }
      } catch (err) {
        setError(err.message || 'Không tìm thấy sản phẩm')
      } finally {
        setLoadingProduct(false)
      }
    }

    fetchProduct()
  }, [slug])

  useEffect(() => {
    const fetchReviews = async () => {
      if (!product?.id) {
        return
      }

      setLoadingReviews(true)

      try {
        const data = await reviewApi.getProductReviews(product.id, {
          page: 0,
          size: 10,
        })

        setReviews(Array.isArray(data) ? data : data?.content || [])
      } catch (err) {
        console.error(err.message)
      } finally {
        setLoadingReviews(false)
      }
    }

    fetchReviews()
  }, [product?.id])

  const variants = useMemo(() => product?.variants || [], [product])

  const handleSelectVariant = (variant) => {
    setSelectedVariant(variant)
    setQuantity(1)
  }

  const handleAddToCart = async () => {
    const token = localStorage.getItem('accessToken')

    if (!token) {
      navigate('/login')
      return
    }

    if (variants.length > 0 && !selectedVariant) {
      alert('Vui lòng chọn phiên bản sản phẩm')
      return
    }

    const productVariantId = selectedVariant?.id

    if (!productVariantId) {
      alert('Sản phẩm chưa có phiên bản để thêm vào giỏ hàng')
      return
    }

    setAddingToCart(true)

    try {
      await cartApi.addToCart({
        productVariantId,
        quantity,
      })

      alert('Đã thêm sản phẩm vào giỏ hàng')
    } catch (err) {
      alert(err.message || 'Không thể thêm vào giỏ hàng')
    } finally {
      setAddingToCart(false)
    }
  }

  if (loadingProduct) {
    return (
      <div className="bg-[#e9e9e9]">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="grid gap-5 lg:grid-cols-[520px_minmax(0,1fr)]">
            <div className="h-[560px] animate-pulse rounded bg-gray-200" />
            <div className="h-[560px] animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="bg-[#e9e9e9]">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="rounded bg-white p-10 text-center shadow-sm">
            <h1 className="text-2xl font-black text-gray-900">
              Không tìm thấy sản phẩm
            </h1>

            <p className="mt-2 text-gray-500">
              {error || 'Sản phẩm không tồn tại hoặc đã ngừng kinh doanh.'}
            </p>

            <Link
              to="/products"
              className="mt-5 inline-block rounded bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700"
            >
              Quay lại danh sách sản phẩm
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#e9e9e9]">
      <div className="mx-auto max-w-7xl px-4 py-5">
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
          <Link to="/" className="hover:text-red-600">
            Trang chủ
          </Link>

          <ChevronRight size={16} />

          <Link to="/products" className="hover:text-red-600">
            Sản phẩm
          </Link>

          <ChevronRight size={16} />

          <span className="line-clamp-1 font-semibold text-gray-900">
            {product.name}
          </span>
        </div>

        <div className="grid gap-5 lg:grid-cols-[520px_minmax(0,1fr)]">
          <ProductImageGallery
            product={product}
            selectedVariant={selectedVariant}
          />

          <ProductInfoBox
            product={product}
            selectedVariant={selectedVariant}
            onSelectVariant={handleSelectVariant}
            quantity={quantity}
            setQuantity={setQuantity}
            onAddToCart={handleAddToCart}
            addingToCart={addingToCart}
          />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
          <ProductDescriptionTabs
            product={product}
            selectedVariant={selectedVariant}
          />

          <div className="rounded-md bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-gray-900">
              Cam kết bán hàng
            </h2>

            <ul className="mt-4 space-y-3 text-sm text-gray-700">
              <li>✓ Sản phẩm chính hãng, nguồn gốc rõ ràng</li>
              <li>✓ Bảo hành theo chính sách nhà sản xuất</li>
              <li>✓ Hỗ trợ đổi trả theo quy định</li>
              <li>✓ Giao hàng toàn quốc</li>
              <li>✓ Tư vấn cấu hình miễn phí</li>
            </ul>
          </div>
        </div>

        <div className="mt-5">
          <ProductReviewList reviews={reviews} loading={loadingReviews} />
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage