import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import {
  ArrowLeft,
  MapPin,
  PackageCheck,
  Phone,
  User,
  Wallet,
} from 'lucide-react'

import { adminOrderApi } from '../../api/adminOrderApi'
import { formatCurrency } from '../../utils/formatCurrency'
import OrderStatusBadge from '../../components/order/OrderStatusBadge'
import PaymentStatusBadge from '../../components/order/PaymentStatusBadge'
import OrderItemList from '../../components/order/OrderItemList'
import UpdateOrderStatusBox from '../../components/admin/order/UpdateOrderStatusBox'

function AdminOrderDetailPage() {
  const { orderId } = useParams()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [updating, setUpdating] = useState(false)

  const fetchOrder = async () => {
    setLoading(true)
    setMessage('')

    try {
      const data = await adminOrderApi.getOrderById(orderId)
      setOrder(data)
    } catch (error) {
      setMessage(error.message || 'Không thể tải chi tiết đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const items = useMemo(() => {
    if (!order) {
      return []
    }

    if (Array.isArray(order.items)) {
      return order.items
    }

    if (Array.isArray(order.orderItems)) {
      return order.orderItems
    }

    return []
  }, [order])

  const handleUpdateStatus = async (status) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn cập nhật đơn hàng sang trạng thái ${status}?`
    )

    if (!confirmed) {
      return
    }

    setUpdating(true)
    setMessage('')
    setSuccessMessage('')

    try {
      const updatedOrder = await adminOrderApi.updateOrderStatus(orderId, status)

      setOrder(updatedOrder)
      setSuccessMessage('Cập nhật trạng thái đơn hàng thành công')
    } catch (error) {
      setMessage(error.message || 'Không thể cập nhật trạng thái đơn hàng')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div>
        <div className="mb-4 h-20 animate-pulse rounded bg-gray-200" />
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_370px]">
          <div className="h-[520px] animate-pulse rounded bg-gray-200" />
          <div className="h-[420px] animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="rounded bg-white p-10 text-center shadow-sm">
        <h1 className="text-2xl font-black text-gray-900">
          Không tìm thấy đơn hàng
        </h1>

        {message && <p className="mt-2 text-red-600">{message}</p>}

        <Link
          to="/admin/orders"
          className="mt-5 inline-block rounded bg-red-600 px-6 py-3 font-black text-white hover:bg-red-700"
        >
          Quay lại danh sách đơn hàng
        </Link>
      </div>
    )
  }

  const payment = order.payment || order.paymentResponse
  const orderStatus = order.orderStatus || order.status
  const paymentStatus = payment?.status || order.paymentStatus

  const subtotal =
    order.subtotalAmount ||
    order.totalProductAmount ||
    order.totalAmount ||
    0

  const discountAmount = order.discountAmount || 0
  const shippingFee = order.shippingFee || 0

  const finalAmount =
    order.finalAmount ||
    order.totalAmount ||
    subtotal - discountAmount + shippingFee

  return (
    <div>
      <div className="mb-4 rounded-lg bg-white p-5 shadow-sm">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
        >
          <ArrowLeft size={18} />
          Quay lại danh sách đơn hàng
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900">
              Đơn hàng {order.orderCode || `#${order.id || orderId}`}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Ngày đặt:{' '}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString('vi-VN')
                : 'Đang cập nhật'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <OrderStatusBadge status={orderStatus} />
            <PaymentStatusBadge status={paymentStatus} />
          </div>
        </div>
      </div>

      {message && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {message}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 rounded border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          {successMessage}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_370px]">
        <div className="space-y-5">
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-xl font-black text-gray-900">
              <PackageCheck size={22} className="text-red-600" />
              Sản phẩm trong đơn hàng
            </h3>

            <OrderItemList items={items} orderStatus={orderStatus} />
          </div>

          <div className="rounded-lg bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-xl font-black text-gray-900">
              Thông tin khách hàng
            </h3>

            <div className="grid gap-4 md:grid-cols-3">
              <InfoCard
                icon={User}
                label="Người nhận"
                value={
                  order.receiverName ||
                  order.customerName ||
                  order.user?.fullName ||
                  'Đang cập nhật'
                }
              />

              <InfoCard
                icon={Phone}
                label="Số điện thoại"
                value={
                  order.receiverPhone ||
                  order.customerPhone ||
                  order.user?.phone ||
                  'Đang cập nhật'
                }
              />

              <InfoCard
                icon={MapPin}
                label="Địa chỉ giao hàng"
                value={order.shippingAddress || 'Đang cập nhật'}
              />
            </div>

            {order.note && (
              <div className="mt-4 rounded border bg-gray-50 p-4">
                <div className="text-sm text-gray-500">Ghi chú</div>
                <div className="mt-1 font-semibold text-gray-900">
                  {order.note}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <UpdateOrderStatusBox
            currentStatus={orderStatus}
            onUpdateStatus={handleUpdateStatus}
            updating={updating}
          />

          <div className="rounded-lg bg-white p-5 shadow-sm">
            <h3 className="flex items-center gap-2 text-xl font-black text-gray-900">
              <Wallet size={22} className="text-red-600" />
              Thanh toán
            </h3>

            <div className="mt-4 space-y-3 text-sm">
              <SummaryRow
                label="Phương thức"
                value={order.paymentMethod || payment?.method || 'COD'}
              />

              <SummaryRow
                label="Trạng thái"
                value={<PaymentStatusBadge status={paymentStatus} />}
              />

              <SummaryRow label="Tạm tính" value={formatCurrency(subtotal)} />

              <SummaryRow
                label="Giảm giá"
                value={`-${formatCurrency(discountAmount)}`}
                valueClassName="text-green-600"
              />

              <SummaryRow
                label="Phí vận chuyển"
                value={
                  shippingFee > 0 ? formatCurrency(shippingFee) : 'Miễn phí'
                }
                valueClassName="text-green-600"
              />
            </div>

            <div className="mt-5 flex items-center justify-between border-t pt-4">
              <span className="font-bold text-gray-900">
                Tổng thanh toán
              </span>

              <span className="text-2xl font-black text-red-600">
                {formatCurrency(finalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded border bg-gray-50 p-4">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Icon size={18} />
        {label}
      </div>

      <div className="mt-2 font-bold text-gray-900">{value}</div>
    </div>
  )
}

function SummaryRow({ label, value, valueClassName = 'text-gray-900' }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-gray-600">{label}</span>
      <span className={`font-bold ${valueClassName}`}>{value}</span>
    </div>
  )
}

export default AdminOrderDetailPage