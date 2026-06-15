import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../contexts/AuthContext'
import AuthCard from '../../components/auth/AuthCard'
import FormInput from '../../components/auth/FormInput'

function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
  })

  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }))

    setMessage('')
    setMessageType('')
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'Họ tên không được để trống'
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Email không được để trống'
    }

    if (!formData.password.trim()) {
      nextErrors.password = 'Mật khẩu không được để trống'
    } else if (formData.password.length < 6) {
      nextErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
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
    setMessage('')
    setMessageType('')

    try {
      await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
      })

      setErrors({})
      setMessageType('success')
      setMessage('Đăng ký tài khoản thành công. Vui lòng đăng nhập.')

      setFormData({
        fullName: '',
        email: '',
        password: '',
        phone: '',
      })

      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 1500)
    } catch (error) {
      setMessageType('error')
      setMessage(error.message || 'Đăng ký thất bại')
      setErrors(error.errors || {})
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthCard
      title="Đăng ký"
      subtitle="Tạo tài khoản TechStore để mua sắm và theo dõi đơn hàng."
      footerText="Đã có tài khoản?"
      footerLinkText="Đăng nhập"
      footerLinkTo="/login"
    >
      {message && (
        <div
          className={`mb-4 rounded border px-4 py-3 text-sm font-medium ${
            messageType === 'success'
              ? 'border-green-200 bg-green-50 text-green-700'
              : 'border-red-200 bg-red-50 text-red-600'
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Họ tên"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Nhập họ tên"
          error={errors.fullName}
          autoComplete="name"
        />

        <FormInput
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Nhập email"
          error={errors.email}
          autoComplete="email"
        />

        <FormInput
          label="Số điện thoại"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Nhập số điện thoại"
          error={errors.phone}
          autoComplete="tel"
        />

        <FormInput
          label="Mật khẩu"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Tối thiểu 6 ký tự"
          error={errors.password}
          autoComplete="new-password"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-red-600 px-5 py-3 font-black text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Đang tạo tài khoản...' : 'Đăng ký'}
        </button>
      </form>
    </AuthCard>
  )
}

export default RegisterPage