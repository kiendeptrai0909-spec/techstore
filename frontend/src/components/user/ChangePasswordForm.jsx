import { useState } from 'react'
import { KeyRound, Save } from 'lucide-react'
import { userApi } from '../../api/userApi'

function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
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

    if (!formData.currentPassword) {
      nextErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại'
    }

    if (!formData.newPassword) {
      nextErrors.newPassword = 'Vui lòng nhập mật khẩu mới'
    } else if (formData.newPassword.length < 6) {
      nextErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự'
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới'
    } else if (formData.confirmPassword !== formData.newPassword) {
      nextErrors.confirmPassword = 'Xác nhận mật khẩu không khớp'
    }

    if (
      formData.currentPassword &&
      formData.newPassword &&
      formData.currentPassword === formData.newPassword
    ) {
      nextErrors.newPassword = 'Mật khẩu mới không được trùng mật khẩu hiện tại'
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
      await userApi.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      })

      setSuccessMessage('Đổi mật khẩu thành công')

      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error) {
      setErrorMessage(error.message || 'Không thể đổi mật khẩu')
      setErrors(error.errors || {})
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="rounded-md bg-white p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-xl font-black text-gray-900">
        <KeyRound size={22} className="text-red-600" />
        Đổi mật khẩu
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Cập nhật mật khẩu đăng nhập để bảo vệ tài khoản của bạn.
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
        <PasswordField
          label="Mật khẩu hiện tại"
          value={formData.currentPassword}
          onChange={(value) => handleChange('currentPassword', value)}
          error={errors.currentPassword}
          placeholder="Nhập mật khẩu hiện tại"
        />

        <PasswordField
          label="Mật khẩu mới"
          value={formData.newPassword}
          onChange={(value) => handleChange('newPassword', value)}
          error={errors.newPassword}
          placeholder="Nhập mật khẩu mới"
        />

        <PasswordField
          label="Xác nhận mật khẩu mới"
          value={formData.confirmPassword}
          onChange={(value) => handleChange('confirmPassword', value)}
          error={errors.confirmPassword}
          placeholder="Nhập lại mật khẩu mới"
        />

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded bg-red-600 px-6 py-3 font-black text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={20} />
          {submitting ? 'Đang lưu...' : 'Đổi mật khẩu'}
        </button>
      </form>
    </div>
  )
}

function PasswordField({ label, value, onChange, placeholder, error }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-800">
        {label}
      </label>

      <input
        type="password"
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

export default ChangePasswordForm