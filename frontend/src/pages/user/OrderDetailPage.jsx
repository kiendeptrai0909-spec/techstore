import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, MapPin, PackageCheck, Phone, User } from 'lucide-react'

import { orderApi } from '../../api/orderApi'
import { reviewApi } from '../../api/reviewApi'
import { formatCurrency } from '../../utils/formatCurrency'
import OrderStatusBadge from '../../components/order/OrderStatusBadge'
import PaymentStatusBadge from '../../components/order/PaymentStatusBadge'
import OrderItemList from '../../components/order/OrderItemList'
import ReviewModal from '../../components/review/ReviewModal'

function OrderDetailPage() {
  const { orderId } = useParams()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const [reviewProduct, setReviewProduct] = useState(null)
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewMessage, setReviewMessage] = useState('')

  const fetchOrder = async () => {
    setLoading(true)
    setMessage('')

    try {
      const data = await orderApi.getOrderById(orderId)
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

  const handleOpenReview = (item) => {
    setReviewProduct(item)
    setReviewMessage('')
  }

  const handleCloseReview = () => {
    if (reviewSubmitting) {
      return
    }

    setReviewProduct(null)
  }
  const handleReviewSubmitted = async () => {
  setReviewProduct(null)
  setReviewMessage('Đánh giá sản phẩm thành công')
  await fetchOrder()
}

  const handleSubmitReview = async ({ rating, comment, content }) => {
  const productId = reviewProduct?.productId
  const orderItemId = reviewProduct?.orderItemId || reviewProduct?.id
  const reviewContent = content || comment || ''

  if (!productId) {
    setReviewMessage('Không xác định được sản phẩm cần đánh giá')
    return
  }

  if (!orderItemId) {
    setReviewMessage('Không xác định được chi tiết đơn hàng cần đánh giá')
    return
  }

  if (!rating) {
    setReviewMessage('Vui lòng chọn số sao đánh giá')
    return
  }

  if (!reviewContent.trim()) {
    setReviewMessage('Vui lòng nhập nội dung đánh giá')
    return
  }

  setReviewSubmitting(true)
  setReviewMessage('')

  try {
    await reviewApi.createReview(productId, {
      orderItemId,
      rating,
      content: reviewContent.trim(),
    })

    setReviewProduct(null)
    setReviewMessage('Đánh giá sản phẩm thành công')
    await fetchOrder()
  } catch (error) {
    setReviewMessage(error.message || 'Không thể gửi đánh giá')
  } finally {
    setReviewSubmitting(false)
  }
}

  if (loading) {
    return (
      <div className="bg-[#e9e9e9]">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="mb-4 h-20 animate-pulse rounded bg-gray-200" />
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="h-[500px] animate-pulse rounded bg-gray-200" />
            <div className="h-[400px] animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="bg-[#e9e9e9]">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="rounded bg-white p-10 text-center shadow-sm">
            <h1 className="text-2xl font-black text-gray-900">
              Không tìm thấy đơn hàng
            </h1>

            {message && <p className="mt-2 text-red-600">{message}</p>}

            <Link
              to="/account/orders"
              className="mt-5 inline-block rounded bg-red-600 px-6 py-3 font-black text-white hover:bg-red-700"
            >
              Quay lại đơn hàng của tôi
            </Link>
          </div>
        </div>
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
    <div className="bg-[#e9e9e9]">
      <ReviewModal
  open={Boolean(reviewProduct)}
  item={reviewProduct}
  onClose={handleCloseReview}
  onSubmitted={handleReviewSubmitted}
/>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-4 rounded-md bg-white p-4 shadow-sm">
          <Link
            to="/account/orders"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
          >
            <ArrowLeft size={18} />
            Quay lại đơn hàng của tôi
          </Link>

          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                Chi tiết đơn hàng {order.orderCode || `#${order.id || orderId}`}
              </h1>

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

        {reviewMessage && (
          <div className="mb-4 rounded border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
            {reviewMessage}
          </div>
        )}

        {message && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {message}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_370px]">
          <div className="space-y-5">
            <div className="rounded-md bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-gray-900">
                <PackageCheck size={22} className="text-red-600" />
                Sản phẩm trong đơn hàng
              </h2>

              <OrderItemList
                items={items}
                orderStatus={orderStatus}
                onOpenReview={handleOpenReview}
              />
            </div>

            <div className="rounded-md bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-xl font-black text-gray-900">
                Thông tin giao hàng
              </h2>

              <div className="grid gap-4 md:grid-cols-3">
                <InfoCard
                  icon={User}
                  label="Người nhận"
                  value={order.receiverName || 'Đang cập nhật'}
                />

                <InfoCard
                  icon={Phone}
                  label="Số điện thoại"
                  value={order.receiverPhone || 'Đang cập nhật'}
                />

                <InfoCard
                  icon={MapPin}
                  label="Địa chỉ"
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
            <div className="rounded-md bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-gray-900">
                Thanh toán
              </h2>

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

            <div className="rounded-md bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-gray-900">
                Trạng thái đơn hàng
              </h2>

              <div className="mt-4 space-y-3">
                <TimelineItem
                  active
                  title="Đặt hàng thành công"
                  description="Đơn hàng đã được tạo trên hệ thống."
                />

                <TimelineItem
                  active={['CONFIRMED', 'SHIPPING', 'COMPLETED'].includes(
                    orderStatus
                  )}
                  title="Đã xác nhận"
                  description="Shop đã xác nhận thông tin đơn hàng."
                />

                <TimelineItem
                  active={['SHIPPING', 'COMPLETED'].includes(orderStatus)}
                  title="Đang giao hàng"
                  description="Đơn hàng đang được vận chuyển."
                />

                <TimelineItem
                  active={orderStatus === 'COMPLETED'}
                  title="Hoàn thành"
                  description="Đơn hàng đã được giao thành công."
                />

                {orderStatus === 'CANCELLED' && (
                  <TimelineItem
                    active
                    danger
                    title="Đã hủy"
                    description="Đơn hàng đã bị hủy."
                  />
                )}
              </div>
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

function TimelineItem({ active, danger, title, description }) {
  return (
    <div className="flex gap-3">
      <div
        className={
          active
            ? danger
              ? 'mt-1 h-4 w-4 rounded-full bg-red-600'
              : 'mt-1 h-4 w-4 rounded-full bg-green-600'
            : 'mt-1 h-4 w-4 rounded-full bg-gray-300'
        }
      />

      <div>
        <div
          className={
            active
              ? danger
                ? 'font-bold text-red-600'
                : 'font-bold text-gray-900'
              : 'font-bold text-gray-400'
          }
        >
          {title}
        </div>

        <div className="text-sm text-gray-500">{description}</div>
      </div>
    </div>
  )
}

export default OrderDetailPage