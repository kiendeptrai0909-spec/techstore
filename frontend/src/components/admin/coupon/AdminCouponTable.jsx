import { Link } from 'react-router'
import { Edit, Trash2 } from 'lucide-react'
import { formatCurrency } from '../../../utils/formatCurrency'

function AdminCouponTable({ coupons = [], loading, onDelete }) {
  if (loading) {
    return (
      <div className="rounded-lg bg-white p-5 shadow-sm">
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-14 animate-pulse rounded bg-gray-100"
            />
          ))}
        </div>
      </div>
    )
  }

  if (coupons.length === 0) {
    return (
      <div className="rounded-lg bg-white p-10 text-center shadow-sm">
        <h3 className="text-xl font-black text-gray-900">
          Không có mã giảm giá
        </h3>
        <p className="mt-2 text-gray-500">
          Chưa tìm thấy coupon phù hợp với bộ lọc.
        </p>
      </div>
    )
  }

  const formatDiscount = (coupon) => {
    const type = coupon.discountType || coupon.type
    const value = coupon.discountValue || coupon.value || 0

    if (type === 'PERCENT') {
      return `${value}%`
    }

    return formatCurrency(value)
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse text-left">
          <thead>
            <tr className="border-b bg-gray-50 text-sm text-gray-600">
              <th className="px-4 py-3 font-bold">Mã coupon</th>
              <th className="px-4 py-3 font-bold">Loại</th>
              <th className="px-4 py-3 font-bold">Giá trị</th>
              <th className="px-4 py-3 font-bold">Đơn tối thiểu</th>
              <th className="px-4 py-3 font-bold">Sử dụng</th>
              <th className="px-4 py-3 font-bold">Thời gian</th>
              <th className="px-4 py-3 font-bold">Trạng thái</th>
              <th className="px-4 py-3 text-center font-bold">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {coupons.map((coupon) => {
              const couponId = coupon.id || coupon.couponId
              const discountType = coupon.discountType || coupon.type
              const minOrderAmount =
                coupon.minOrderAmount || coupon.minimumOrderAmount || 0
              const usageLimit = coupon.usageLimit || coupon.maxUsage || 0
              const usedCount = coupon.usedCount || coupon.usageCount || 0

              return (
                <tr
                  key={couponId}
                  className="border-b text-sm hover:bg-gray-50"
                >
                  <td className="px-4 py-4">
                    <div className="font-black uppercase text-gray-900">
                      {coupon.code}
                    </div>

                    {coupon.description && (
                      <div className="mt-1 line-clamp-1 text-xs text-gray-500">
                        {coupon.description}
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                      {discountType === 'PERCENT'
                        ? 'Phần trăm'
                        : 'Cố định'}
                    </span>
                  </td>

                  <td className="px-4 py-4 font-black text-red-600">
                    {formatDiscount(coupon)}
                  </td>

                  <td className="px-4 py-4">
                    {formatCurrency(minOrderAmount)}
                  </td>

                  <td className="px-4 py-4">
                    <span className="font-bold">{usedCount}</span>
                    {' / '}
                    <span>{usageLimit || 'Không giới hạn'}</span>
                  </td>

                  <td className="px-4 py-4 text-xs text-gray-600">
                    <div>
                      Bắt đầu:{' '}
                      <span className="font-semibold">
                        {formatDateTime(coupon.startAt)}
                      </span>
                    </div>

                    <div className="mt-1">
                      Kết thúc:{' '}
                      <span className="font-semibold">
                        {formatDateTime(coupon.endAt)}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={
                        coupon.status === 'ACTIVE'
                          ? 'rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700'
                          : 'rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-bold text-gray-700'
                      }
                    >
                      {coupon.status === 'ACTIVE'
                        ? 'Hoạt động'
                        : 'Ngừng hoạt động'}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/admin/coupons/${couponId}/edit`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded border text-gray-600 hover:border-red-500 hover:text-red-600"
                        title="Sửa coupon"
                      >
                        <Edit size={16} />
                      </Link>

                      <button
                        type="button"
                        onClick={() => onDelete(couponId)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded border text-gray-600 hover:border-red-500 hover:text-red-600"
                        title="Xóa coupon"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function formatDateTime(value) {
  if (!value) {
    return 'Không giới hạn'
  }

  return new Date(value).toLocaleString('vi-VN')
}

export default AdminCouponTable