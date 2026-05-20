import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { PackageSearch } from 'lucide-react'

import { orderApi } from '../../api/orderApi'
import { formatCurrency } from '../../utils/formatCurrency'
import OrderStatusBadge from '../../components/order/OrderStatusBadge'
import PaymentStatusBadge from '../../components/order/PaymentStatusBadge'

function MyOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [pageData, setPageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const currentPage = Number(searchParams.get('page') || 0)
  const pageSize = Number(searchParams.get('size') || 10)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setMessage('')

      try {
        const data = await orderApi.getMyOrders({
          page: currentPage,
          size: pageSize,
        })

        setPageData(data)
      } catch (error) {
        setMessage(error.message || 'Không thể tải danh sách đơn hàng')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [currentPage, pageSize])

  const orders = Array.isArray(pageData)
    ? pageData
    : pageData?.content || []

  const handlePageChange = (page) => {
    setSearchParams({
      page: String(page),
      size: String(pageSize),
    })

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  if (loading) {
    return (
      <div className="bg-[#e9e9e9]">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="mb-4 h-20 animate-pulse rounded bg-gray-200" />

          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-40 animate-pulse rounded bg-gray-200"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#e9e9e9]">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-4 rounded-md bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <PackageSearch size={28} className="text-red-600" />

            <div>
              <h1 className="text-2xl font-black text-gray-900">
                Đơn hàng của tôi
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Theo dõi trạng thái các đơn hàng bạn đã đặt tại TechStore.
              </p>
            </div>
          </div>
        </div>

        {message && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {message}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="rounded-md bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-600">
              <PackageSearch size={40} />
            </div>

            <h2 className="mt-5 text-2xl font-black text-gray-900">
              Bạn chưa có đơn hàng nào
            </h2>

            <p className="mt-2 text-gray-500">
              Hãy mua sắm sản phẩm yêu thích và quay lại đây để theo dõi đơn hàng.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-block rounded bg-red-600 px-6 py-3 font-black text-white hover:bg-red-700"
            >
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {orders.map((order) => {
                const payment = order.payment || order.paymentResponse
                const paymentStatus = payment?.status || order.paymentStatus

                const totalAmount =
                  order.finalAmount ||
                  order.totalAmount ||
                  order.subtotalAmount ||
                  0

                return (
                  <div
                    key={order.id || order.orderId}
                    className="rounded-md bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-4">
                      <div>
                        <div className="text-sm text-gray-500">
                          Mã đơn hàng
                        </div>

                        <div className="mt-1 text-lg font-black text-gray-900">
                          {order.orderCode || `#${order.id || order.orderId}`}
                        </div>

                        <div className="mt-1 text-sm text-gray-500">
                          Ngày đặt:{' '}
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleString('vi-VN')
                            : 'Đang cập nhật'}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <OrderStatusBadge status={order.orderStatus || order.status} />
                        <PaymentStatusBadge status={paymentStatus} />
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                      <InfoItem
                        label="Người nhận"
                        value={order.receiverName || 'Đang cập nhật'}
                      />

                      <InfoItem
                        label="Số điện thoại"
                        value={order.receiverPhone || 'Đang cập nhật'}
                      />

                      <InfoItem
                        label="Thanh toán"
                        value={order.paymentMethod || payment?.method || 'COD'}
                      />
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="text-sm text-gray-500">
                          Tổng thanh toán
                        </div>

                        <div className="text-2xl font-black text-red-600">
                          {formatCurrency(totalAmount)}
                        </div>
                      </div>

                      <Link
                        to={`/account/orders/${order.id || order.orderId}`}
                        className="rounded bg-red-600 px-5 py-3 font-black text-white hover:bg-red-700"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>

            <OrderPagination
              pageData={pageData}
              onPageChange={handlePageChange}
            />
          </>
        )}
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

function OrderPagination({ pageData, onPageChange }) {
  if (!pageData || pageData.totalPages <= 1) {
    return null
  }

  const currentPage = pageData.number || 0
  const totalPages = pageData.totalPages || 0

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded border bg-white px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50 hover:border-red-500 hover:text-red-600"
      >
        Trước
      </button>

      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index)}
          className={
            index === currentPage
              ? 'rounded border border-red-600 bg-red-600 px-4 py-2 text-sm font-black text-white'
              : 'rounded border bg-white px-4 py-2 text-sm font-bold hover:border-red-500 hover:text-red-600'
          }
        >
          {index + 1}
        </button>
      ))}

      <button
        disabled={currentPage >= totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded border bg-white px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50 hover:border-red-500 hover:text-red-600"
      >
        Sau
      </button>
    </div>
  )
}

export default MyOrdersPage