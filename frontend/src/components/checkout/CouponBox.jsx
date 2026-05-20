import { Ticket, X } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'

function CouponBox({
  couponCode,
  setCouponCode,
  appliedCoupon,
  discountAmount,
  validating,
  message,
  onApply,
  onRemove,
}) {
  return (
    <div className="rounded-md bg-white p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-xl font-black text-gray-900">
        <Ticket size={22} className="text-red-600" />
        Mã giảm giá
      </h2>

      {appliedCoupon ? (
        <div className="mt-4 rounded border border-green-200 bg-green-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-bold text-green-700">
                Đã áp dụng mã: {appliedCoupon.code || couponCode}
              </div>

              <div className="mt-1 text-sm text-green-700">
                Giảm {formatCurrency(discountAmount)}
              </div>
            </div>

            <button
              type="button"
              onClick={onRemove}
              className="rounded p-1 text-green-700 hover:bg-green-100"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex gap-2">
          <input
            value={couponCode}
            onChange={(event) => setCouponCode(event.target.value)}
            placeholder="Nhập mã giảm giá"
            className="h-11 flex-1 rounded border px-4 text-sm outline-none focus:border-red-500"
          />

          <button
            type="button"
            onClick={onApply}
            disabled={validating || !couponCode.trim()}
            className="rounded bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {validating ? 'Đang kiểm tra...' : 'Áp dụng'}
          </button>
        </div>
      )}

      {message && (
        <div className="mt-3 text-sm font-semibold text-red-600">
          {message}
        </div>
      )}
    </div>
  )
}

export default CouponBox