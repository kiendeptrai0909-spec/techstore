import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../contexts/AuthContext'
import {
  Menu,
  Search,
  Phone,
  MapPin,
  ClipboardList,
  ShoppingCart,
  User,
  LogOut,
  ShieldCheck,
  Wrench,
  Newspaper,
  Truck,
  RefreshCcw,
} from 'lucide-react'

function Header() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()

  const [keyword, setKeyword] = useState('')

  const handleSearch = (event) => {
    event.preventDefault()

    const trimmedKeyword = keyword.trim()

    if (!trimmedKeyword) {
      navigate('/products')
      return
    }

    navigate(`/products?keyword=${encodeURIComponent(trimmedKeyword)}`)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      <div className="bg-blue-600 py-2 text-center text-sm font-black text-white md:text-xl">
        MUA PC | TECHSTORE | TẶNG MÀN OLED 240Hz
      </div>

      <div className="bg-red-600 text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-white text-xl font-black text-red-600">
              T
            </div>

            <div className="hidden leading-tight sm:block">
              <div className="text-2xl font-black tracking-tight">
                TECHSTORE
              </div>
              <div className="text-[11px] font-semibold tracking-[0.25em] text-red-100">
                COMPUTER
              </div>
            </div>
          </Link>

          <Link
            to="/products"
            className="hidden shrink-0 items-center gap-2 rounded bg-red-700 px-3 py-2 text-sm font-bold hover:bg-red-800 md:flex"
          >
            <Menu size={19} />
            Danh mục
          </Link>

          <form
            onSubmit={handleSearch}
            className="flex h-11 flex-1 items-center overflow-hidden rounded bg-white"
          >
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              type="text"
              placeholder="Bạn cần tìm gì?"
              className="h-full flex-1 px-4 text-sm text-gray-800 outline-none"
            />

            <button
              type="submit"
              className="flex h-full w-12 shrink-0 items-center justify-center text-gray-700 hover:bg-gray-100"
            >
              <Search size={21} />
            </button>
          </form>

          <div className="hidden shrink-0 items-center gap-2 text-sm font-bold lg:flex">
            <Phone size={22} />
            <span className="leading-tight">
              Hotline
              <br />
              0909.123.456
            </span>
          </div>

          <div className="hidden shrink-0 items-center gap-2 text-sm font-bold lg:flex">
            <MapPin size={22} />
            <span className="leading-tight">
              Hệ thống
              <br />
              Showroom
            </span>
          </div>

          <Link
            to="/account/orders"
            className="hidden shrink-0 items-center gap-2 text-sm font-bold lg:flex"
          >
            <ClipboardList size={22} />
            <span className="leading-tight">
              Tra cứu
              <br />
              đơn hàng
            </span>
          </Link>

          <Link
            to="/cart"
            className="relative flex shrink-0 items-center gap-2 rounded bg-red-700 px-3 py-2 text-sm font-bold hover:bg-red-800"
          >
            <ShoppingCart size={22} />
            <span className="hidden sm:inline">
              Giỏ
              <br />
              hàng
            </span>

            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-300 text-xs font-black text-red-600">
              0
            </span>
          </Link>

          {isAuthenticated ? (
            <div className="flex shrink-0 items-center gap-2">
              <Link
                to="/account/orders"
                className="hidden max-w-[130px] truncate rounded bg-red-700 px-3 py-2 text-sm font-bold hover:bg-red-800 md:block"
                title={user?.fullName || user?.email || 'Tài khoản'}
              >
                {user?.fullName || 'Tài khoản'}
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded bg-red-700 px-3 py-2 text-sm font-bold hover:bg-red-800"
              >
                <LogOut size={22} />
                <span className="hidden sm:inline">Thoát</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex shrink-0 items-center gap-2 rounded bg-red-700 px-3 py-2 text-sm font-bold hover:bg-red-800"
            >
              <User size={22} />
              <span>
                Đăng
                <br />
                nhập
              </span>
            </Link>
          )}
        </div>
      </div>

      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between overflow-x-auto px-4 py-2 text-sm font-semibold text-gray-800">
          <Link
            to="/products"
            className="flex min-w-max items-center gap-2 px-3 hover:text-red-600"
          >
            <Wrench size={17} />
            BUILD PC tặng màn hình 240Hz
          </Link>

          <Link
            to="/products?keyword=thanh-ly"
            className="flex min-w-max items-center gap-2 px-3 hover:text-red-600"
          >
            <RefreshCcw size={17} />
            Xả Kho Thanh Lý
          </Link>

          <Link
            to="/news"
            className="flex min-w-max items-center gap-2 px-3 hover:text-red-600"
          >
            <Newspaper size={17} />
            Tin tức
          </Link>

          <Link
            to="/contact"
            className="flex min-w-max items-center gap-2 px-3 hover:text-red-600"
          >
            <Truck size={17} />
            Dịch vụ kỹ thuật tại nhà
          </Link>

          <Link
            to="/faqs"
            className="flex min-w-max items-center gap-2 px-3 hover:text-red-600"
          >
            <ShieldCheck size={17} />
            Tra cứu bảo hành
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header