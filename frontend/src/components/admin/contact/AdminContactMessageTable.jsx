import { Link } from 'react-router'
import { Eye } from 'lucide-react'

export function ContactMessageStatusBadge({ status }) {
  const statusMap = {
    NEW: {
      label: 'Mới',
      className: 'border-yellow-200 bg-yellow-50 text-yellow-700',
    },
    PROCESSING: {
      label: 'Đang xử lý',
      className: 'border-blue-200 bg-blue-50 text-blue-700',
    },
    RESOLVED: {
      label: 'Đã xử lý',
      className: 'border-green-200 bg-green-50 text-green-700',
    },
    CLOSED: {
      label: 'Đã đóng',
      className: 'border-gray-200 bg-gray-50 text-gray-700',
    },
  }

  const current = statusMap[status] || {
    label: status || 'Không rõ',
    className: 'border-gray-200 bg-gray-50 text-gray-700',
  }

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${current.className}`}
    >
      {current.label}
    </span>
  )
}

function AdminContactMessageTable({ messages = [], loading }) {
  if (loading) {
    return (
      <div className="rounded-lg bg-white p-5 shadow-sm">
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded bg-gray-100"
            />
          ))}
        </div>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-lg bg-white p-10 text-center shadow-sm">
        <h3 className="text-xl font-black text-gray-900">
          Không có tin nhắn liên hệ
        </h3>
        <p className="mt-2 text-gray-500">
          Chưa tìm thấy tin nhắn phù hợp với bộ lọc.
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
              <th className="px-4 py-3 font-bold">Khách hàng</th>
              <th className="px-4 py-3 font-bold">Liên hệ</th>
              <th className="px-4 py-3 font-bold">Chủ đề</th>
              <th className="px-4 py-3 font-bold">Nội dung</th>
              <th className="px-4 py-3 font-bold">Trạng thái</th>
              <th className="px-4 py-3 font-bold">Ngày gửi</th>
              <th className="px-4 py-3 text-center font-bold">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {messages.map((message) => {
              const messageId = message.id || message.messageId
              const fullName =
                message.fullName || message.name || message.customerName || 'Khách hàng'

              return (
                <tr
                  key={messageId}
                  className="border-b text-sm hover:bg-gray-50"
                >
                  <td className="px-4 py-4">
                    <div className="font-black text-gray-900">
                      {fullName}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="font-semibold text-gray-800">
                      {message.email || 'Chưa có email'}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {message.phone || message.phoneNumber || 'Chưa có SĐT'}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="line-clamp-2 font-bold text-gray-900">
                      {message.subject || 'Không có chủ đề'}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="line-clamp-2 max-w-xs text-gray-600">
                      {message.message || message.content || 'Không có nội dung'}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <ContactMessageStatusBadge status={message.status} />
                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    {message.createdAt
                      ? new Date(message.createdAt).toLocaleString('vi-VN')
                      : 'Đang cập nhật'}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-center">
                      <Link
                        to={`/admin/contact-messages/${messageId}`}
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

export default AdminContactMessageTable