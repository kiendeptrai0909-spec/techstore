import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, Mail, Phone, User, Users } from 'lucide-react'
import { adminCustomerApi } from '../../api/adminCustomerApi'

function AdminCustomerDetailPage() {
  const { customerId } = useParams()

  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
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
                  customer.status === 'INACTIVE'
                    ? 'rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-600'
                    : 'rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-600'
                }
              >
                {customer.status === 'INACTIVE' ? 'Đã khóa' : 'Hoạt động'}
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