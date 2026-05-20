import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { CheckCircle2, CreditCard, PackageCheck } from 'lucide-react'

import { orderApi } from '../../api/orderApi'
import { paymentApi } from '../../api/paymentApi'
import { formatCurrency } from '../../utils/formatCurrency'

function OrderSuccessPage() {
  const { orderId } = useParams()
  const location = useLocation()

  const [order, setOrder] = useState(location.state?.order || null)
  const [loading, setLoading] = useState(!location.state?.order)
  const [paying, setPaying] = useState(false)
  const [message, setMessage] = useState('')

  const payment = order?.payment || order?.paymentResponse
  const paymentMethod = order?.paymentMethod || payment?.method
  const paymentStatus = payment?.status || order?.paymentStatus

  const finalAmount =
    order?.finalAmount ||
    order?.totalAmount ||
    order?.subtotalAmount ||
    0

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

  const handleMockPay = async () => {
    setPaying(true)
    setMessage('')

    try {
      await paymentApi.mockPay(orderId)
      const updatedOrder = await orderApi.getOrderById(orderId)
      setOrder(updatedOrder)
      setMessage('Thanh toán giả lập thành công')
    } catch (error) {
      setMessage(error.message || 'Thanh toán thất bại')
    } finally {
      setPaying(false)
    }
  }

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

  const canMockPay =
    paymentMethod === 'MOCK_BANKING' &&
    paymentStatus !== 'PAID' &&
    paymentStatus !== 'SUCCESS'

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
            <div className="mt-5 rounded border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
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
                value={order.orderStatus || order.status || 'PENDING'}
              />

              <InfoItem
                label="Phương thức thanh toán"
                value={paymentMethod || 'COD'}
              />

              <InfoItem
                label="Trạng thái thanh toán"
                value={paymentStatus || 'PENDING'}
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

          {canMockPay && (
            <button
              type="button"
              onClick={handleMockPay}
              disabled={paying}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded bg-blue-600 px-6 py-3 font-black text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CreditCard size={20} />
              {paying ? 'Đang thanh toán...' : 'Thanh toán giả lập'}
            </button>
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

export default OrderSuccessPage