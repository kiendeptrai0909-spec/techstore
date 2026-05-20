import { Link } from 'react-router'
import { Eye } from 'lucide-react'
import { formatCurrency } from '../../../utils/formatCurrency'
import OrderStatusBadge from '../../order/OrderStatusBadge'
import PaymentStatusBadge from '../../order/PaymentStatusBadge'

function AdminOrderTable({ orders = [], loading }) {
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

  if (orders.length === 0) {
    return (
      <div className="rounded-lg bg-white p-10 text-center shadow-sm">
        <h3 className="text-xl font-black text-gray-900">
          Không có đơn hàng
        </h3>
        <p className="mt-2 text-gray-500">
          Chưa tìm thấy đơn hàng phù hợp với bộ lọc.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse text-left">
          <thead>
            <tr className="border-b bg-gray-50 text-sm text-gray-600">
              <th className="px-4 py-3 font-bold">Mã đơn</th>
              <th className="px-4 py-3 font-bold">Khách hàng</th>
              <th className="px-4 py-3 font-bold">Ngày đặt</th>
              <th className="px-4 py-3 font-bold">Trạng thái</th>
              <th className="px-4 py-3 font-bold">Thanh toán</th>
              <th className="px-4 py-3 text-right font-bold">Tổng tiền</th>
              <th className="px-4 py-3 text-center font-bold">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => {
              const orderId = order.id || order.orderId
              const payment = order.payment || order.paymentResponse
              const orderStatus = order.orderStatus || order.status
              const paymentStatus = payment?.status || order.paymentStatus

              const totalAmount =
                order.finalAmount ||
                order.totalAmount ||
                order.subtotalAmount ||
                0

              return (
                <tr key={orderId} className="border-b text-sm hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="font-black text-gray-900">
                      {order.orderCode || `#${orderId}`}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      ID: {orderId}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="font-bold text-gray-900">
                      {order.receiverName ||
                        order.customerName ||
                        order.user?.fullName ||
                        'Khách hàng'}
                    </div>

                    <div className="mt-1 text-xs text-gray-500">
                      {order.receiverPhone ||
                        order.customerPhone ||
                        order.user?.phone ||
                        'Chưa có SĐT'}
                    </div>
                  </td>

                  <td className="px-4 py-4 text-gray-700">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString('vi-VN')
                      : 'Đang cập nhật'}
                  </td>

                  <td className="px-4 py-4">
                    <OrderStatusBadge status={orderStatus} />
                  </td>

                  <td className="px-4 py-4">
                    <PaymentStatusBadge status={paymentStatus} />
                  </td>

                  <td className="px-4 py-4 text-right font-black text-red-600">
                    {formatCurrency(totalAmount)}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-center">
                      <Link
                        to={`/admin/orders/${orderId}`}
                        className="inline-flex items-center gap-2 rounded bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700"
                      >
                        <Eye size={16} />
                        Xem
                      </Link>
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

export default AdminOrderTable