import { useState } from 'react'
import { Link } from 'react-router'
import { Mail, ArrowLeft } from 'lucide-react'
import { passwordResetApi } from '../../api/passwordResetApi'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!email.trim()) {
      setError('Vui lòng nhập email')
      return
    }

    setSubmitting(true)
    setMessage('')
    setError('')

    try {
      const response = await passwordResetApi.forgotPassword(email.trim())

      setMessage(
        response?.message ||
          'Nếu email tồn tại trong hệ thống, chúng tôi đã gửi liên kết đặt lại mật khẩu.'
      )
    } catch (err) {
      setError(err.message || 'Không thể gửi yêu cầu đặt lại mật khẩu')
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
                Nhập email tài khoản của bạn để nhận liên kết đặt lại mật khẩu.
              </p>
            </div>

            <div className="rounded-lg bg-white/10 p-5">
              <h2 className="text-xl font-black">
                Bảo mật tài khoản TechStore
              </h2>

              <p className="mt-2 leading-7 text-red-50">
                Liên kết đặt lại mật khẩu chỉ có hiệu lực trong thời gian ngắn.
                Không chia sẻ liên kết này cho người khác.
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
                <Mail size={28} />
              </div>

              <h1 className="mt-5 text-3xl font-black text-gray-900">
                Quên mật khẩu
              </h1>

              <p className="mt-2 leading-7 text-gray-500">
                Nhập email bạn đã đăng ký. Nếu tài khoản tồn tại, hệ thống sẽ
                gửi email chứa liên kết đặt lại mật khẩu.
              </p>
            </div>

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

            <form onSubmit={handleSubmit} className="mt-6">
              <label className="mb-2 block text-sm font-bold text-gray-800">
                Email
              </label>

              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="Nhập email của bạn"
                disabled={submitting}
                className="h-12 w-full rounded border px-4 text-sm outline-none focus:border-red-500 disabled:cursor-not-allowed disabled:bg-gray-100"
              />

              <button
                type="submit"
                disabled={submitting}
                className="mt-5 h-12 w-full rounded bg-red-600 font-black text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Đang gửi...' : 'Gửi liên kết đặt lại mật khẩu'}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-gray-500">
              Đã nhớ mật khẩu?{' '}
              <Link
                to="/login"
                className="font-bold text-red-600 hover:underline"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage