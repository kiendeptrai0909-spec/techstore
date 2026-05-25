import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../../contexts/AuthContext'
import AuthCard from '../../components/auth/AuthCard'
import FormInput from '../../components/auth/FormInput'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loginWithGoogle } = useAuth()

  const googleButtonRef = useRef(null)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const redirectTo = location.state?.from || '/'

  const handleGoogleLogin = useCallback(
    async (response) => {
      if (!response?.credential) {
        setMessage('Không nhận được thông tin đăng nhập từ Google')
        return
      }

      setSubmitting(true)
      setMessage('')
      setErrors({})

      try {
        await loginWithGoogle(response.credential)

        navigate(redirectTo, { replace: true })
      } catch (error) {
        setMessage(error.message || 'Đăng nhập Google thất bại')
        setErrors(error.errors || {})
      } finally {
        setSubmitting(false)
      }
    },
    [loginWithGoogle, navigate, redirectTo]
  )

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

    if (!clientId) {
      console.warn('Thiếu VITE_GOOGLE_CLIENT_ID trong file .env')
      return undefined
    }

    let timeoutId

    const renderGoogleButton = () => {
      if (!window.google || !googleButtonRef.current) {
        timeoutId = window.setTimeout(renderGoogleButton, 200)
        return
      }

      googleButtonRef.current.innerHTML = ''

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleLogin,
      })

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        width: 432,
        text: 'signin_with',
        shape: 'rectangular',
      })
    }

    renderGoogleButton()

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [handleGoogleLogin])

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
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!formData.email.trim()) {
      nextErrors.email = 'Email không được để trống'
    }

    if (!formData.password.trim()) {
      nextErrors.password = 'Mật khẩu không được để trống'
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

    try {
      await login({
        email: formData.email.trim(),
        password: formData.password,
      })

      navigate(redirectTo, { replace: true })
    } catch (error) {
      setMessage(error.message || 'Đăng nhập thất bại')
      setErrors(error.errors || {})
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthCard
      title="Đăng nhập"
      subtitle="Đăng nhập để mua hàng, theo dõi đơn hàng và quản lý giỏ hàng."
      footerText="Chưa có tài khoản?"
      footerLinkText="Đăng ký ngay"
      footerLinkTo="/register"
    >
      {message && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Nhập email của bạn"
          error={errors.email}
          autoComplete="email"
        />

        <div>
          <FormInput
            label="Mật khẩu"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Nhập mật khẩu"
            error={errors.password}
            autoComplete="current-password"
          />

          <div className="mt-2 text-right">
            <Link
              to="/forgot-password"
              className="text-sm font-bold text-red-600 hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-red-600 px-5 py-3 font-black text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-sm font-semibold text-gray-500">hoặc</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="flex justify-center">
        <div ref={googleButtonRef} />
      </div>
    </AuthCard>
  )
}

export default LoginPage