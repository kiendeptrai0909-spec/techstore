import { Link } from 'react-router'
import { Star } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'

function OrderItemList({ items = [], orderStatus, onOpenReview }) {
  if (items.length === 0) {
    return (
      <div className="rounded border border-dashed p-6 text-center text-gray-500">
        Đơn hàng chưa có sản phẩm.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const orderItemId = item.orderItemId || item.id
        const productId = item.productId || item.product?.id
        const productSlug = item.productSlug || item.slug || item.product?.slug

        const productName =
          item.productName || item.name || item.product?.name || 'Sản phẩm'

        const variantName =
          item.variantName ||
          item.productVariantName ||
          item.sku ||
          item.productVariant?.sku

        const productSku =
          item.productSku || item.sku || item.productVariant?.sku

        const imageUrl =
          item.thumbnailUrl ||
          item.imageUrl ||
          item.productImage ||
          item.productVariant?.thumbnailUrl ||
          item.product?.thumbnailUrl ||
          'https://placehold.co/300x300?text=TechStore'

        const quantity = item.quantity || 1
        const unitPrice = item.unitPrice || item.price || item.salePrice || 0
        const totalPrice = item.totalPrice || unitPrice * quantity

        const productUrl = productSlug ? `/products/${productSlug}` : '/products'

        const canReview =
          orderStatus === 'COMPLETED' && Boolean(productId) && Boolean(orderItemId)

        const handleOpenReview = () => {
          if (!canReview) {
            return
          }

          onOpenReview?.({
            ...item,
            id: orderItemId,
            orderItemId,
            productId,
            productName,
            productSlug,
            thumbnailUrl: imageUrl,
            imageUrl,
            variantName,
            productSku,
          })
        }

        return (
          <div
            key={orderItemId || `${productId}-${index}`}
            className="grid gap-4 rounded border bg-white p-4 md:grid-cols-[100px_minmax(0,1fr)_170px]"
          >
            <Link
              to={productUrl}
              className="flex h-[100px] w-[100px] items-center justify-center overflow-hidden rounded border bg-white"
            >
              <img
                src={imageUrl}
                alt={productName}
                className="max-h-full max-w-full object-contain"
              />
            </Link>

            <div>
              <Link
                to={productUrl}
                target="_blank"
                className="line-clamp-2 font-bold text-gray-900 hover:text-red-600"
              >
                {productName}
              </Link>

              {variantName && (
                <p className="mt-1 text-sm text-gray-500">
                  Phiên bản:{' '}
                  <span className="font-semibold">{variantName}</span>
                </p>
              )}

              {productSku && (
                <p className="mt-1 text-sm text-gray-500">
                  SKU: <span className="font-semibold">{productSku}</span>
                </p>
              )}

              <p className="mt-1 text-sm text-gray-500">
                Số lượng: <span className="font-semibold">{quantity}</span>
              </p>

              {orderStatus === 'COMPLETED' && (
                <button
                  type="button"
                  disabled={!canReview}
                  onClick={handleOpenReview}
                  className="mt-3 inline-flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  <Star size={16} />
                  Đánh giá sản phẩm
                </button>
              )}
            </div>

            <div className="text-left md:text-right">
              <div className="text-sm text-gray-500">
                Đơn giá: {formatCurrency(unitPrice)}
              </div>

              <div className="mt-2 text-lg font-black text-red-600">
                {formatCurrency(totalPrice)}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default OrderItemList