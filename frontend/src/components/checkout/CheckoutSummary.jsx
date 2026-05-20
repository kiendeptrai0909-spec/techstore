import { Link } from 'react-router'
import { formatCurrency } from '../../utils/formatCurrency'

function CheckoutSummary({
  items = [],
  subtotal,
  discountAmount,
  finalAmount,
  onPlaceOrder,
  placingOrder,
}) {
  return (
    <div className="rounded-md bg-white p-5 shadow-sm">
      <h2 className="text-xl font-black text-gray-900">
        Đơn hàng của bạn
      </h2>

      <div className="mt-4 max-h-[360px] space-y-3 overflow-y-auto pr-1">
        {items.map((item) => {
          const id = item.cartItemId || item.id
          const name = item.productName || item.name || 'Sản phẩm'
          const variant = item.variantName || item.productVariantName || item.sku
          const quantity = item.quantity || 1
          const price = item.price || item.unitPrice || item.salePrice || 0
          const imageUrl =
            item.thumbnailUrl ||
            item.imageUrl ||
            item.productImage ||
            'https://placehold.co/120x120?text=TechStore'

          return (
            <div key={id} className="flex gap-3 border-b pb-3">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded border bg-white">
                <img
                  src={imageUrl}
                  alt={name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="line-clamp-2 text-sm font-bold text-gray-900">
                  {name}
                </div>

                {variant && (
                  <div className="mt-1 text-xs text-gray-500">
                    {variant}
                  </div>
                )}

                <div className="mt-1 text-xs text-gray-500">
                  SL: {quantity}
                </div>
              </div>

              <div className="text-right text-sm font-bold text-red-600">
                {formatCurrency(price * quantity)}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 space-y-3 border-b pb-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Tạm tính</span>
          <span className="font-bold">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Giảm giá</span>
          <span className="font-bold text-green-600">
            -{formatCurrency(discountAmount)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Phí vận chuyển</span>
          <span className="font-bold text-green-600">Miễn phí</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="font-bold text-gray-900">Tổng thanh toán</span>
        <span className="text-2xl font-black text-red-600">
          {formatCurrency(finalAmount)}
        </span>
      </div>

      <button
        type="button"
        onClick={onPlaceOrder}
        disabled={placingOrder || items.length === 0}
        className="mt-5 w-full rounded bg-red-600 px-5 py-3 font-black text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {placingOrder ? 'Đang đặt hàng...' : 'Đặt hàng'}
      </button>

      <Link
        to="/cart"
        className="mt-3 block text-center text-sm font-bold text-blue-600 hover:underline"
      >
        Quay lại giỏ hàng
      </Link>
    </div>
  )
}

export default CheckoutSummary