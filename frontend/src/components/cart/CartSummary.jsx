import { Link } from 'react-router'
import { formatCurrency } from '../../utils/formatCurrency'

function CartSummary({ cart, items = [], onClearCart, clearing }) {
  const subtotal =
    cart?.subtotalAmount ||
    cart?.totalAmount ||
    items.reduce((sum, item) => {
      const price = item.price || item.unitPrice || item.salePrice || 0
      const quantity = item.quantity || 1
      return sum + price * quantity
    }, 0)

  const totalQuantity = items.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  )

  return (
    <div className="rounded-md bg-white p-5 shadow-sm">
      <h2 className="text-xl font-black text-gray-900">
        Thông tin đơn hàng
      </h2>

      <div className="mt-4 space-y-3 border-b pb-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Số lượng sản phẩm</span>
          <span className="font-bold">{totalQuantity}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Tạm tính</span>
          <span className="font-bold">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Phí vận chuyển</span>
          <span className="font-bold text-green-600">Tính khi checkout</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="font-bold text-gray-900">Tổng cộng</span>
        <span className="text-2xl font-black text-red-600">
          {formatCurrency(subtotal)}
        </span>
      </div>

      <Link
        to="/checkout"
        className={
          items.length === 0
            ? 'mt-5 block cursor-not-allowed rounded bg-gray-300 px-5 py-3 text-center font-black text-white'
            : 'mt-5 block rounded bg-red-600 px-5 py-3 text-center font-black text-white hover:bg-red-700'
        }
        onClick={(event) => {
          if (items.length === 0) {
            event.preventDefault()
          }
        }}
      >
        Tiến hành đặt hàng
      </Link>

      <button
        type="button"
        onClick={onClearCart}
        disabled={items.length === 0 || clearing}
        className="mt-3 w-full rounded border px-5 py-3 font-bold text-gray-700 hover:border-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {clearing ? 'Đang xóa...' : 'Xóa toàn bộ giỏ hàng'}
      </button>

      <Link
        to="/products"
        className="mt-3 block text-center text-sm font-bold text-blue-600 hover:underline"
      >
        Tiếp tục mua hàng
      </Link>
    </div>
  )
}

export default CartSummary