import { useState } from 'react'
import { Send } from 'lucide-react'
import { contactMessageApi } from '../../api/contactMessageApi'

function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }))

    setSuccessMessage('')
    setErrorMessage('')
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'Vui lòng nhập họ tên'
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Vui lòng nhập email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = 'Email không hợp lệ'
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = 'Vui lòng nhập số điện thoại'
    }

    if (!formData.subject.trim()) {
      nextErrors.subject = 'Vui lòng nhập chủ đề'
    }

    if (!formData.message.trim()) {
      nextErrors.message = 'Vui lòng nhập nội dung liên hệ'
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      await contactMessageApi.createMessage({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      })

      setSuccessMessage(
        'Gửi liên hệ thành công. TechStore sẽ phản hồi bạn sớm nhất có thể.'
      )

      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })
    } catch (error) {
      setErrorMessage(error.message || 'Không thể gửi liên hệ')
      setErrors(error.errors || {})
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="rounded-md bg-white p-5 shadow-sm">
      <h2 className="text-xl font-black text-gray-900">
        Gửi tin nhắn cho TechStore
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Điền thông tin bên dưới, bộ phận hỗ trợ sẽ liên hệ lại với bạn.
      </p>

      {successMessage && (
        <div className="mt-4 rounded border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            label="Họ tên"
            value={formData.fullName}
            onChange={(value) => handleChange('fullName', value)}
            error={errors.fullName}
            placeholder="Nhập họ tên của bạn"
          />

          <FormField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(value) => handleChange('email', value)}
            error={errors.email}
            placeholder="Nhập email"
          />

          <FormField
            label="Số điện thoại"
            value={formData.phone}
            onChange={(value) => handleChange('phone', value)}
            error={errors.phone}
            placeholder="Nhập số điện thoại"
          />

          <FormField
            label="Chủ đề"
            value={formData.subject}
            onChange={(value) => handleChange('subject', value)}
            error={errors.subject}
            placeholder="VD: Tư vấn mua PC"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-800">
            Nội dung liên hệ
          </label>

          <textarea
            value={formData.message}
            onChange={(event) => handleChange('message', event.target.value)}
            rows="7"
            placeholder="Nhập nội dung cần hỗ trợ..."
            className={
              errors.message
                ? 'w-full rounded border border-red-500 px-4 py-3 text-sm leading-7 outline-none'
                : 'w-full rounded border px-4 py-3 text-sm leading-7 outline-none focus:border-red-500'
            }
          />

          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded bg-red-600 px-6 py-3 font-black text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={20} />
          {submitting ? 'Đang gửi...' : 'Gửi liên hệ'}
        </button>
      </form>
    </div>
  )
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  error,
  type = 'text',
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-800">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={
          error
            ? 'h-11 w-full rounded border border-red-500 px-4 text-sm outline-none'
            : 'h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500'
        }
      />

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default ContactForm