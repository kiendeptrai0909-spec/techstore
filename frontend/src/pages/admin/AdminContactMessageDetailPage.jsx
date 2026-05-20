import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import {
  ArrowLeft,
  Mail,
  MessageSquare,
  Phone,
  User,
} from 'lucide-react'

import { adminContactMessageApi } from '../../api/adminContactMessageApi'
import UpdateContactMessageStatusBox from '../../components/admin/contact/UpdateContactMessageStatusBox'
import { ContactMessageStatusBadge } from '../../components/admin/contact/AdminContactMessageTable'

function AdminContactMessageDetailPage() {
  const { messageId } = useParams()

  const [contactMessage, setContactMessage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [updating, setUpdating] = useState(false)

  const fetchMessage = async () => {
    setLoading(true)
    setMessage('')

    try {
      const data = await adminContactMessageApi.getMessageById(messageId)
      setContactMessage(data)
    } catch (error) {
      setMessage(error.message || 'Không thể tải chi tiết tin nhắn')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessage()
  }, [messageId])

  const handleUpdateStatus = async (status) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn cập nhật trạng thái sang ${status}?`
    )

    if (!confirmed) return

    setUpdating(true)
    setMessage('')
    setSuccessMessage('')

    try {
      const updatedMessage =
        await adminContactMessageApi.updateMessageStatus(messageId, {
          status,
        })

      setContactMessage(updatedMessage)
      setSuccessMessage('Cập nhật trạng thái thành công')
    } catch (error) {
      setMessage(error.message || 'Không thể cập nhật trạng thái')
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
          <div className="h-[320px] animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    )
  }

  if (!contactMessage) {
    return (
      <div className="rounded bg-white p-10 text-center shadow-sm">
        <h1 className="text-2xl font-black text-gray-900">
          Không tìm thấy tin nhắn
        </h1>

        {message && <p className="mt-2 text-red-600">{message}</p>}

        <Link
          to="/admin/contact-messages"
          className="mt-5 inline-block rounded bg-red-600 px-6 py-3 font-black text-white hover:bg-red-700"
        >
          Quay lại danh sách liên hệ
        </Link>
      </div>
    )
  }

  const fullName =
    contactMessage.fullName ||
    contactMessage.name ||
    contactMessage.customerName ||
    'Khách hàng'

  const content =
    contactMessage.message ||
    contactMessage.content ||
    'Không có nội dung'

  return (
    <div>
      <div className="mb-4 rounded-lg bg-white p-5 shadow-sm">
        <Link
          to="/admin/contact-messages"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
        >
          <ArrowLeft size={18} />
          Quay lại danh sách liên hệ
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900">
              Tin nhắn liên hệ #{contactMessage.id || messageId}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Ngày gửi:{' '}
              {contactMessage.createdAt
                ? new Date(contactMessage.createdAt).toLocaleString('vi-VN')
                : 'Đang cập nhật'}
            </p>
          </div>

          <ContactMessageStatusBadge status={contactMessage.status} />
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
              <User size={22} className="text-red-600" />
              Thông tin khách hàng
            </h3>

            <div className="grid gap-4 md:grid-cols-3">
              <InfoCard
                icon={User}
                label="Họ tên"
                value={fullName}
              />

              <InfoCard
                icon={Mail}
                label="Email"
                value={contactMessage.email || 'Chưa có email'}
              />

              <InfoCard
                icon={Phone}
                label="Số điện thoại"
                value={
                  contactMessage.phone ||
                  contactMessage.phoneNumber ||
                  'Chưa có SĐT'
                }
              />
            </div>
          </div>

          <div className="rounded-lg bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-xl font-black text-gray-900">
              <MessageSquare size={22} className="text-red-600" />
              Nội dung liên hệ
            </h3>

            <div className="rounded border bg-gray-50 p-4">
              <div className="text-sm text-gray-500">Chủ đề</div>
              <div className="mt-1 text-lg font-black text-gray-900">
                {contactMessage.subject || 'Không có chủ đề'}
              </div>
            </div>

            <div className="mt-4 rounded border bg-white p-4">
              <div className="text-sm text-gray-500">Nội dung</div>
              <div className="mt-3 whitespace-pre-line leading-7 text-gray-800">
                {content}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <UpdateContactMessageStatusBox
            currentStatus={contactMessage.status}
            onUpdateStatus={handleUpdateStatus}
            updating={updating}
          />

          <div className="rounded-lg bg-white p-5 shadow-sm">
            <h3 className="text-xl font-black text-gray-900">
              Thông tin xử lý
            </h3>

            <div className="mt-4 space-y-3 text-sm">
              <InfoRow
                label="Trạng thái hiện tại"
                value={<ContactMessageStatusBadge status={contactMessage.status} />}
              />

              <InfoRow
                label="Ngày tạo"
                value={
                  contactMessage.createdAt
                    ? new Date(contactMessage.createdAt).toLocaleString('vi-VN')
                    : 'Đang cập nhật'
                }
              />

              <InfoRow
                label="Cập nhật lần cuối"
                value={
                  contactMessage.updatedAt
                    ? new Date(contactMessage.updatedAt).toLocaleString('vi-VN')
                    : 'Chưa cập nhật'
                }
              />
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

      <div className="mt-2 break-words font-bold text-gray-900">{value}</div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0">
      <span className="text-gray-600">{label}</span>
      <span className="font-bold text-gray-900">{value}</span>
    </div>
  )
}

export default AdminContactMessageDetailPage