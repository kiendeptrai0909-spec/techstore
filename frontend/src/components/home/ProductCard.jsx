import { Gift, Star } from 'lucide-react'
import { Link } from 'react-router'
import { formatCurrency } from '../../utils/formatCurrency'

function ProductCard({ product }) {
  const variant = product?.variants?.[0]

  const price = variant?.price || product?.price || 0
  const salePrice = variant?.salePrice || product?.salePrice || price
  const hasDiscount = salePrice && price && salePrice < price

  const discountPercent = hasDiscount
    ? Math.round(((price - salePrice) / price) * 100)
    : 0

  const imageUrl =
    variant?.thumbnailUrl ||
    product?.thumbnailUrl ||
    product?.imageUrl ||
    'https://placehold.co/500x500?text=TechStore'

  const specs = [
    variant?.sku,
    product?.brand?.name,
    product?.category?.name,
    variant?.stock !== undefined ? `Còn ${variant.stock}` : null,
  ].filter(Boolean)//loại bỏ các giá trị null hoặc undefined khỏi mảng specs

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group relative flex min-h-[370px] flex-col rounded border border-gray-200 bg-white p-3 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="absolute right-3 top-3 z-10 text-red-600">
        <Gift size={22} fill="currentColor" />
      </div>

      <div className="absolute left-3 top-3 z-10 rounded-full bg-red-600 px-2 py-1 text-[11px] font-bold text-white">
        Quà tặng HOT
      </div>

      <div className="mt-5 flex h-[170px] items-center justify-center overflow-hidden rounded bg-white">
        <img
          src={imageUrl}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
        />
      </div>

      <h3 className="mt-3 line-clamp-2 min-h-[44px] text-sm font-semibold text-gray-900">
        {product.name}
      </h3>

      <div className="mt-2 rounded bg-gray-100 p-2 text-[12px] text-gray-600">
        {specs.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            {specs.slice(0, 4).map((item) => (
              <span key={item} className="truncate">
                • {item}
              </span>
            ))}
          </div>
        ) : (
          <span>Thông tin sản phẩm đang cập nhật</span>
        )}
      </div>

      <div className="mt-auto pt-3">
        {hasDiscount && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 line-through">
              {formatCurrency(price)}
            </span>
            <span className="rounded border border-red-500 px-1 text-xs font-semibold text-red-600">
              -{discountPercent}%
            </span>
          </div>
        )}

        <div className="mt-1 text-lg font-black text-red-600">
          {salePrice ? formatCurrency(salePrice) : 'Liên hệ'}
        </div>

        <div className="mt-1 flex items-center gap-1 text-sm">
          <span className="font-bold text-orange-500">
            {product.averageRating != null ? Number(product.averageRating).toFixed(1) : '0.0'}
          </span>
          <Star size={14} fill="orange" className="text-orange-500" />
          <span className="text-gray-500">
            ({product.reviewCount ?? product.totalReviews ?? 0} đánh giá)
          </span>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard