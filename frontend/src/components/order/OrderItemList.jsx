import { Link } from 'react-router'
import { formatCurrency } from '../../utils/formatCurrency'

function OrderItemList({ items = [], orderStatus }) {
  if (items.length === 0) {
    return (
      <div className="rounded border border-dashed p-6 text-center text-gray-500">
        Đơn hàng chưa có sản phẩm.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const id = item.id || item.orderItemId
        const productId = item.productId
        const productSlug = item.productSlug || item.slug

        const productName = item.productName || item.name || 'Sản phẩm'
        const variantName =
          item.variantName || item.productVariantName || item.sku
        const productSku = item.productSku || item.sku

        const imageUrl =
          item.thumbnailUrl ||
          item.imageUrl ||
          item.productImage ||
          'https://placehold.co/300x300?text=TechStore'

        const quantity = item.quantity || 1
        const unitPrice = item.unitPrice || item.price || item.salePrice || 0
        const totalPrice = item.totalPrice || unitPrice * quantity

        const productUrl = productSlug
          ? `/products/${productSlug}`
          : productId
            ? `/products`
            : '/products'

        return (
          <div
            key={id}
            className="grid gap-4 rounded border bg-white p-4 md:grid-cols-[100px_minmax(0,1fr)_160px]"
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
                  className="mt-3 rounded bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
                >
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