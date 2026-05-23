import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { ArrowLeft, LockKeyhole } from 'lucide-react'
import { passwordResetApi } from '../../api/passwordResetApi'

function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const token = useMemo(() => {
    return searchParams.get('token') || ''
  }, [searchParams])

  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!token) {
      setError('Liên kết đặt lại mật khẩu không hợp lệ')
      return
    }

    if (!form.newPassword.trim()) {
      setError('Vui lòng nhập mật khẩu mới')
      return
    }

    if (form.newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự')
      return
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }

    setSubmitting(true)
    setMessage('')
    setError('')

    try {
      const response = await passwordResetApi.resetPassword({
        token,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      })

      setMessage(response?.message || 'Đặt lại mật khẩu thành công')

      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (err) {
      setError(err.message || 'Không thể đặt lại mật khẩu')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-[#e9e9e9]">
      <div className="mx-auto flex min-h-[calc(100vh-180px)] max-w-7xl items-center justify-center px-4 py-10">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-md lg:grid-cols-[1.1fr_1fr]">
          <div className="hidden bg-gradient-to-br from-red-600 to-red-800 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <h1 className="text-4xl font-black">TECHSTORE</h1>

              <p className="mt-4 max-w-md text-lg leading-8">
                Tạo mật khẩu mới cho tài khoản của bạn để tiếp tục mua sắm tại
                TechStore.
              </p>
            </div>

            <div className="rounded-lg bg-white/10 p-5">
              <h2 className="text-xl font-black">
                Mật khẩu an toàn hơn
              </h2>

              <p className="mt-2 leading-7 text-red-50">
                Nên dùng mật khẩu có ít nhất 6 ký tự, kết hợp chữ, số và ký tự
                đặc biệt để tăng độ an toàn.
              </p>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-red-600"
            >
              <ArrowLeft size={17} />
              Quay lại đăng nhập
            </Link>

            <div className="mt-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                <LockKeyhole size={28} />
              </div>

              <h1 className="mt-5 text-3xl font-black text-gray-900">
                Đặt lại mật khẩu
              </h1>

              <p className="mt-2 leading-7 text-gray-500">
                Nhập mật khẩu mới cho tài khoản của bạn.
              </p>
            </div>

            {!token && (
              <div className="mt-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                Liên kết đặt lại mật khẩu không hợp lệ hoặc thiếu token.
              </div>
            )}

            {message && (
              <div className="mt-5 rounded border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                {message}
              </div>
            )}

            {error && (
              <div className="mt-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-800">
                  Mật khẩu mới
                </label>

                <input
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  type="password"
                  placeholder="Nhập mật khẩu mới"
                  disabled={submitting || !token}
                  className="h-12 w-full rounded border px-4 text-sm outline-none focus:border-red-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-800">
                  Xác nhận mật khẩu
                </label>

                <input
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  type="password"
                  placeholder="Nhập lại mật khẩu mới"
                  disabled={submitting || !token}
                  className="h-12 w-full rounded border px-4 text-sm outline-none focus:border-red-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !token}
                className="h-12 w-full rounded bg-red-600 font-black text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-gray-500">
              Đã có tài khoản?{' '}
              <Link
                to="/login"
                className="font-bold text-red-600 hover:underline"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage