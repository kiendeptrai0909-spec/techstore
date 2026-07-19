import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, Mail, Phone, User, Users, ShoppingBag } from 'lucide-react'
import { adminCustomerApi } from '../../api/adminCustomerApi'

function AdminCustomerDetailPage() {
  const { customerId } = useParams()

  const [customer, setCustomer] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true)
      setMessage('')

      try {
        const data = await adminCustomerApi.getCustomerById(customerId)
        setCustomer(data)
      } catch (error) {
        setMessage(error.message || 'Không thể tải thông tin khách hàng')
      } finally {
        setLoading(false)
      }
    }

    fetchCustomer()
  }, [customerId])

  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true)
      try {
        const data = await adminCustomerApi.getCustomerOrders(customerId)
        setOrders(Array.isArray(data) ? data : data?.content || [])
      } catch (error) {
        console.error('Không thể tải lịch sử đơn hàng:', error)
      } finally {
        setLoadingOrders(false)
      }
    }

    if (customerId) {
      fetchOrders()
    }
  }, [customerId])

  if (loading) {
    return (
      <div className="rounded bg-white p-6 text-center text-gray-500 shadow-sm">
        Đang tải thông tin khách hàng...
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="rounded bg-white p-6 text-center shadow-sm">
        <div className="text-red-600">
          {message || 'Không tìm thấy khách hàng'}
        </div>

        <Link
          to="/admin/customers"
          className="mt-4 inline-block rounded bg-red-600 px-5 py-3 font-black text-white hover:bg-red-700"
        >
          Quay lại danh sách khách hàng
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-5 rounded-lg bg-white p-5 shadow-sm">
        <Link
          to="/admin/customers"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
        >
          <ArrowLeft size={18} />
          Quay lại danh sách khách hàng
        </Link>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <Users size={26} />
          </div>

          <div>
            <h2 className="text-2xl font-black text-gray-900">
              Chi tiết khách hàng
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Xem thông tin tài khoản và liên hệ của khách hàng.
            </p>
          </div>
        </div>
      </div>

      {message && (
        <div className="mb-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {message}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h3 className="text-xl font-black text-gray-900">
            Thông tin khách hàng
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <InfoCard
              icon={User}
              label="Họ tên"
              value={customer.fullName || customer.name || 'Chưa cập nhật'}
            />

            <InfoCard
              icon={Mail}
              label="Email"
              value={customer.email || 'Chưa cập nhật'}
            />

            <InfoCard
              icon={Phone}
              label="Số điện thoại"
              value={customer.phone || 'Chưa cập nhật'}
            />

            <InfoCard
              icon={Users}
              label="Vai trò"
              value={customer.role || customer.roleName || 'CUSTOMER'}
            />
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h3 className="text-xl font-black text-gray-900">
            Trạng thái tài khoản
          </h3>

          <div className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Mã khách hàng</span>
              <span className="font-black text-gray-900">{customer.id}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Trạng thái</span>
              <span
                className={
                  customer.status === 'BLOCKED'
                    ? 'rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-600'
                    : 'rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-600'
                }
              >
                {customer.status === 'BLOCKED' ? 'Đã khóa' : 'Hoạt động'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Ngày tạo</span>
              <span className="font-bold text-gray-900">
                {customer.createdAt
                  ? new Date(customer.createdAt).toLocaleString('vi-VN')
                  : 'Không có'}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h3 className="text-xl font-black text-gray-900">
            Lịch sử mua hàng
          </h3>

          <div className="mt-5">
            {loadingOrders ? (
              <div className="text-center text-gray-500">
                Đang tải lịch sử đơn hàng...
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center text-gray-500">
                Khách hàng chưa có đơn hàng nào.
              </div>
            ) : (
              <div className="overflow-hidden rounded border">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="px-4 py-3 font-bold">Mã đơn hàng</th>
                      <th className="px-4 py-3 font-bold">Ngày đặt</th>
                      <th className="px-4 py-3 font-bold">Tổng tiền</th>
                      <th className="px-4 py-3 font-bold">Trạng thái</th>
                      <th className="px-4 py-3 text-right font-bold">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-t">
                        <td className="px-4 py-4 font-black text-gray-900">
                          #{order.id}
                        </td>
                        <td className="px-4 py-4 text-gray-600">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleString('vi-VN')
                            : ''}
                        </td>
                        <td className="px-4 py-4 font-semibold text-gray-900">
                          {order.totalAmount
                            ? new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                              }).format(order.totalAmount)
                            : ''}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                              order.status === 'COMPLETED'
                                ? 'border border-green-200 bg-green-50 text-green-600'
                                : order.status === 'CANCELLED'
                                  ? 'border border-red-200 bg-red-50 text-red-600'
                                  : order.status === 'PENDING'
                                    ? 'border border-yellow-200 bg-yellow-50 text-yellow-600'
                                    : 'border border-gray-200 bg-gray-50 text-gray-600'
                            }`}
                          >
                            {order.status === 'COMPLETED'
                              ? 'Hoàn thành'
                              : order.status === 'CANCELLED'
                                ? 'Đã hủy'
                                : order.status === 'PENDING'
                                  ? 'Chờ xử lý'
                                  : order.status || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="inline-flex items-center gap-2 rounded border px-3 py-2 text-sm font-bold text-gray-700 hover:border-red-500 hover:text-red-600"
                          >
                            <ShoppingBag size={16} />
                            Xem chi tiết
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded border p-4">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Icon size={18} />
        {label}
      </div>

      <div className="mt-2 font-black text-gray-900">
        {value}
      </div>
    </div>
  )
}

export default AdminCustomerDetailPage