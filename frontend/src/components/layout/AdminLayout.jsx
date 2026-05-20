import { NavLink, Outlet, useNavigate } from 'react-router'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Ticket,
  Image,
  Newspaper,
  HelpCircle,
  MessageSquare,
  LogOut,
  Home,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

function AdminLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
      end: true,
    },
    {
      label: 'Sản phẩm',
      path: '/admin/products',
      icon: Package,
    },
    {
      label: 'Đơn hàng',
      path: '/admin/orders',
      icon: ShoppingBag,
    },
    {
      label: 'Coupon',
      path: '/admin/coupons',
      icon: Ticket,
    },
    {
      label: 'Banner',
      path: '/admin/banners',
      icon: Image,
    },
    {
      label: 'Tin tức',
      path: '/admin/news',
      icon: Newspaper,
    },
    {
      label: 'FAQ',
      path: '/admin/faqs',
      icon: HelpCircle,
    },
    {
      label: 'Liên hệ',
      path: '/admin/contact-messages',
      icon: MessageSquare,
    },
  ]

  const navClassName = ({ isActive }) =>
    isActive
      ? 'flex items-center gap-3 rounded bg-red-600 px-4 py-3 font-bold text-white'
      : 'flex items-center gap-3 rounded px-4 py-3 font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600'

  return (
    <div className="min-h-screen bg-gray-100">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-260px border-r bg-white lg:block lg:w-[260px]">
        <div className="flex h-16 items-center border-b px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-red-600 text-xl font-black text-white">
            T
          </div>

          <div className="ml-3">
            <div className="text-xl font-black text-gray-900">TechStore</div>
            <div className="text-xs font-semibold text-gray-500">
              Admin Panel
            </div>
          </div>
        </div>

        <nav className="space-y-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={navClassName}
              >
                <Icon size={20} />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
      </aside>

      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm lg:px-6">
          <div>
            <h1 className="text-xl font-black text-gray-900">
              Quản trị hệ thống
            </h1>
            <p className="text-sm text-gray-500">
              Xin chào, {user?.fullName || user?.email || 'Admin'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="hidden items-center gap-2 rounded border px-4 py-2 text-sm font-bold text-gray-700 hover:border-red-500 hover:text-red-600 sm:flex"
            >
              <Home size={18} />
              Về website
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
            >
              <LogOut size={18} />
              Đăng xuất
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout