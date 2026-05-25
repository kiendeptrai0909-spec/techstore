import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { CheckCircle2, PackageCheck } from 'lucide-react'

import {
  bankTransferConfig,
  buildVietQrUrl,
} from '../../config/bankTransferConfig'
import { orderApi } from '../../api/orderApi'
import { formatCurrency } from '../../utils/formatCurrency'

function OrderSuccessPage() {
  const { orderId } = useParams()
  const location = useLocation()

  const [order, setOrder] = useState(location.state?.order || null)
  const [loading, setLoading] = useState(!location.state?.order)
  const [message, setMessage] = useState('')

  const payment = order?.payment || order?.paymentResponse
  const paymentMethod = order?.paymentMethod || payment?.method
  const paymentStatus = payment?.status || order?.paymentStatus
  const orderStatus = order?.orderStatus || order?.status || 'PENDING'

  const finalAmount =
    order?.finalAmount ||
    order?.totalAmount ||
    payment?.amount ||
    order?.subtotalAmount ||
    0

  const isBankTransfer = paymentMethod === 'BANK_TRANSFER'
  const isPaid = paymentStatus === 'PAID'
  const isFailed = paymentStatus === 'FAILED'
  const isCancelled = orderStatus === 'CANCELLED'

  const canShowBankTransferQr =
    isBankTransfer && !isPaid && !isFailed && !isCancelled

  useEffect(() => {
    const fetchOrder = async () => {
      if (order) {
        return
      }

      setLoading(true)

      try {
        const data = await orderApi.getOrderById(orderId)
        setOrder(data)
      } catch (error) {
        setMessage(error.message || 'Không thể tải thông tin đơn hàng')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [order, orderId])

  useEffect(() => {
    if (!orderId) return undefined
    if (!isBankTransfer) return undefined
    if (isPaid || isFailed || isCancelled) return undefined

    const intervalId = window.setInterval(async () => {
      try {
        const updatedOrder = await orderApi.getOrderById(orderId)
        setOrder(updatedOrder)
      } catch {
        // Bỏ qua lỗi tạm thời khi polling
      }
    }, 5000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [orderId, isBankTransfer, isPaid, isFailed, isCancelled])

  if (loading) {
    return (
      <div className="bg-[#e9e9e9]">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="h-96 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="bg-[#e9e9e9]">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="rounded bg-white p-10 text-center shadow-sm">
            <h1 className="text-2xl font-black text-gray-900">
              Không tìm thấy đơn hàng
            </h1>

            {message && <p className="mt-2 text-red-600">{message}</p>}

            <Link
              to="/products"
              className="mt-5 inline-block rounded bg-red-600 px-6 py-3 font-black text-white hover:bg-red-700"
            >
              Tiếp tục mua hàng
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#e9e9e9]">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-md bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">
            <CheckCircle2 size={46} />
          </div>

          <h1 className="mt-5 text-3xl font-black text-gray-900">
            Đặt hàng thành công
          </h1>

          <p className="mt-2 text-gray-500">
            Cảm ơn bạn đã mua hàng tại TechStore.
          </p>

          {message && (
            <div className="mt-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {message}
            </div>
          )}

          <div className="mt-6 rounded bg-gray-50 p-5 text-left">
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoItem
                label="Mã đơn hàng"
                value={order.orderCode || `#${order.id || orderId}`}
              />

              <InfoItem
                label="Trạng thái đơn"
                value={getOrderStatusLabel(orderStatus)}
              />

              <InfoItem
                label="Phương thức thanh toán"
                value={getPaymentMethodLabel(paymentMethod)}
              />

              <InfoItem
                label="Trạng thái thanh toán"
                value={getPaymentStatusLabel(paymentStatus)}
              />

              <InfoItem
                label="Người nhận"
                value={order.receiverName || 'Đang cập nhật'}
              />

              <InfoItem
                label="Số điện thoại"
                value={order.receiverPhone || 'Đang cập nhật'}
              />
            </div>

            <div className="mt-4">
              <div className="text-sm text-gray-500">Địa chỉ giao hàng</div>
              <div className="mt-1 font-bold text-gray-900">
                {order.shippingAddress || 'Đang cập nhật'}
              </div>
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

          {isPaid && (
            <div className="mt-6 rounded border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-700">
              Thanh toán thành công. TechStore đang xử lý đơn hàng của bạn.
            </div>
          )}

          {(isCancelled || isFailed) && (
            <div className="mt-6 rounded border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
              Đơn hàng đã quá hạn thanh toán hoặc đã bị hủy. Vui lòng đặt lại đơn mới.
            </div>
          )}

          {canShowBankTransferQr && (
            <div className="mt-6 rounded border border-blue-200 bg-blue-50 p-5 text-left text-sm text-gray-700">
              <h2 className="font-black text-gray-900">
                Quét mã QR để chuyển khoản
              </h2>

              <img
                src={buildVietQrUrl({
                  amount: finalAmount,
                  note: `TECHSTORE ${order.orderCode || order.id}`,
                })}
                alt="Mã QR chuyển khoản TechStore"
                className="mx-auto my-4 h-56 w-56 rounded bg-white p-2 object-contain shadow-sm"
              />

              <div className="mt-3 space-y-1">
                <p>
                  <span className="font-bold">Ngân hàng:</span>{' '}
                  {bankTransferConfig.bankName}
                </p>

                <p>
                  <span className="font-bold">Số tài khoản:</span>{' '}
                  {bankTransferConfig.accountNumber}
                </p>

                <p>
                  <span className="font-bold">Chủ tài khoản:</span>{' '}
                  {bankTransferConfig.accountName}
                </p>

                <p>
                  <span className="font-bold">Số tiền:</span>{' '}
                  {formatCurrency(finalAmount)}
                </p>

                <p>
                  <span className="font-bold">Nội dung:</span>{' '}
                  TECHSTORE {order.orderCode || order.id}
                </p>
              </div>

              <p className="mt-3 font-semibold text-red-600">
                Vui lòng thanh toán trong 15 phút. Sau thời gian này đơn hàng sẽ tự động hủy và sản phẩm sẽ được hoàn lại kho.
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/account/orders"
              className="inline-flex items-center gap-2 rounded border px-6 py-3 font-bold text-gray-700 hover:border-red-500 hover:text-red-600"
            >
              <PackageCheck size={20} />
              Xem đơn hàng của tôi
            </Link>

            <Link
              to="/products"
              className="rounded bg-red-600 px-6 py-3 font-black text-white hover:bg-red-700"
            >
              Tiếp tục mua hàng
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoItem({ label, value }) {
  return (
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-1 font-bold text-gray-900">{value}</div>
    </div>
  )
}

function getOrderStatusLabel(status) {
  if (status === 'PENDING') return 'Chờ xác nhận'
  if (status === 'CONFIRMED') return 'Đã xác nhận'
  if (status === 'SHIPPING') return 'Đang giao hàng'
  if (status === 'COMPLETED') return 'Hoàn thành'
  if (status === 'CANCELLED') return 'Đã hủy'

  return status || 'Chờ xác nhận'
}

function getPaymentMethodLabel(method) {
  if (method === 'BANK_TRANSFER') {
    return 'Chuyển khoản ngân hàng'
  }

  if (method === 'COD') {
    return 'Thanh toán khi nhận hàng'
  }

  return method || 'COD'
}

function getPaymentStatusLabel(status) {
  if (status === 'PAID') {
    return 'Đã thanh toán'
  }

  if (status === 'FAILED') {
    return 'Thanh toán thất bại'
  }

  return 'Chờ thanh toán'
}

export default OrderSuccessPage