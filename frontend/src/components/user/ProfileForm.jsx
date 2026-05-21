import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { userApi } from '../../api/userApi'

function ProfileForm({ user, onUpdated }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    address: '',
  })

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!user) return

    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      gender: user.gender || '',
      dateOfBirth: user.dateOfBirth || '',
      address: user.address || '',
    })
  }, [user])

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

    if (formData.phone && formData.phone.length > 20) {
      nextErrors.phone = 'Số điện thoại không được vượt quá 20 ký tự'
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) return

    setSubmitting(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        gender: formData.gender || null,
        dateOfBirth: formData.dateOfBirth || null,
        address: formData.address.trim(),
      }

      const updatedUser = await userApi.updateProfile(payload)

      setSuccessMessage('Cập nhật thông tin thành công')
      onUpdated?.(updatedUser)
    } catch (error) {
      setErrorMessage(error.message || 'Không thể cập nhật thông tin')
      setErrors(error.errors || {})
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="rounded-md bg-white p-5 shadow-sm">
      <h2 className="text-xl font-black text-gray-900">
        Thông tin cá nhân
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Quản lý thông tin tài khoản của bạn.
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
            placeholder="Nhập họ tên"
          />

          <FormField
            label="Email"
            value={formData.email}
            disabled
            placeholder="Email"
          />

          <FormField
            label="Số điện thoại"
            value={formData.phone}
            onChange={(value) => handleChange('phone', value)}
            error={errors.phone}
            placeholder="Nhập số điện thoại"
          />

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-800">
              Giới tính
            </label>

            <select
              value={formData.gender}
              onChange={(event) => handleChange('gender', event.target.value)}
              className="h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500"
            >
              <option value="">Chưa chọn</option>
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="OTHER">Khác</option>
            </select>
          </div>

          <FormField
            label="Ngày sinh"
            type="date"
            value={formData.dateOfBirth}
            onChange={(value) => handleChange('dateOfBirth', value)}
          />

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-800">
              Vai trò
            </label>

            <input
              value={formatRole(user?.role)}
              disabled
              className="h-11 w-full rounded border bg-gray-100 px-4 text-sm text-gray-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-800">
            Địa chỉ
          </label>

          <textarea
            value={formData.address}
            onChange={(event) => handleChange('address', event.target.value)}
            rows="4"
            placeholder="Nhập địa chỉ"
            className="w-full rounded border px-4 py-3 text-sm leading-7 outline-none focus:border-red-500"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded bg-red-600 px-6 py-3 font-black text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={20} />
          {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
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
  disabled = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-800">
        {label}
      </label>

      <input
        type={type}
        value={value ?? ''}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className={
          disabled
            ? 'h-11 w-full rounded border bg-gray-100 px-4 text-sm text-gray-500 outline-none'
            : error
              ? 'h-11 w-full rounded border border-red-500 px-4 text-sm outline-none'
              : 'h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500'
        }
      />

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

function formatRole(role) {
  const map = {
    ROLE_ADMIN: 'Quản trị viên',
    ROLE_STAFF: 'Nhân viên',
    ROLE_CUSTOMER: 'Khách hàng',
  }

  return map[role] || role || ''
}

export default ProfileForm