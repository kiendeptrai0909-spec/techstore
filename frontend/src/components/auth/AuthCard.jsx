import { Link } from 'react-router'

function AuthCard({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
}) {
  return (
    <div className="min-h-[calc(100vh-220px)] bg-[#e9e9e9] px-4 py-10">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-lg bg-white shadow-lg md:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-red-600 to-red-800 p-10 text-white md:flex md:flex-col md:justify-between">
          <div>
            <h2 className="text-3xl font-black">TECHSTORE</h2>
            <p className="mt-3 text-red-100">
              Mua sắm PC, laptop, linh kiện và phụ kiện công nghệ chính hãng.
            </p>
          </div>

          <div className="rounded-lg bg-white/10 p-5">
            <p className="text-lg font-bold">
              Ưu đãi mỗi ngày cho thành viên TechStore
            </p>
            <p className="mt-2 text-sm text-red-100">
              Theo dõi đơn hàng, quản lý giỏ hàng và nhận thông tin khuyến mãi.
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mb-6">
            <h1 className="text-3xl font-black text-gray-900">{title}</h1>
            <p className="mt-2 text-gray-500">{subtitle}</p>
          </div>

          {children}

          <div className="mt-6 text-center text-sm text-gray-600">
            {footerText}{' '}
            <Link
              to={footerLinkTo}
              className="font-bold text-red-600 hover:underline"
            >
              {footerLinkText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthCard