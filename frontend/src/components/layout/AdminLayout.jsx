import { Link, NavLink, Outlet, useNavigate } from 'react-router'
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  TicketPercent,
  Image,
  Newspaper,
  CircleHelp,
  MessageSquare,
  LogOut,
  Home,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const menuItems = [
  {
    label: 'Dashboard',
    to: '/admin',
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: 'Sản phẩm',
    to: '/admin/products',
    icon: Package,
  },
  {
    label: 'Danh mục',
    to: '/admin/categories',
    icon: Tags,
  },
  {
    label: 'Đơn hàng',
    to: '/admin/orders',
    icon: ShoppingBag,
  },
  {
    label: 'Coupon',
    to: '/admin/coupons',
    icon: TicketPercent,
  },
  {
    label: 'Banner',
    to: '/admin/banners',
    icon: Image,
  },
  {
    label: 'Tin tức',
    to: '/admin/news',
    icon: Newspaper,
  },
  {
    label: 'FAQ',
    to: '/admin/faqs',
    icon: CircleHelp,
  },
  {
    label: 'Liên hệ',
    to: '/admin/contact-messages',
    icon: MessageSquare,
  },
]

function AdminLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto flex max-w-[1600px]">
        <aside className="sticky top-[150px] h-[calc(100vh-150px)] w-[270px] shrink-0 border-r bg-white">
          <div className="border-b px-6 py-5">
            <Link to="/admin" className="block">
              <h2 className="text-xl font-black text-gray-900">
                TechStore Admin
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Quản trị hệ thống
              </p>
            </Link>
          </div>

          <nav className="space-y-1 px-3 py-4">
            {menuItems.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    isActive
                      ? 'flex items-center gap-3 rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-red-600'
                      : 'flex items-center gap-3 rounded-md px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-red-600'
                  }
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="sticky top-0 z-20 border-b bg-white px-6 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-gray-900">
                  Quản trị hệ thống
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Xin chào, {user?.fullName || 'Quản trị viên TechStore'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded border px-4 py-2 text-sm font-bold text-gray-700 hover:border-red-500 hover:text-red-600"
                >
                  <Home size={18} />
                  Về website
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
                >
                  <LogOut size={18} />
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout