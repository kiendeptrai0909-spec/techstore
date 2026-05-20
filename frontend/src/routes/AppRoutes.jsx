import { Route, Routes } from 'react-router'
import MainLayout from '../layouts/MainLayout'
import HomePage from '../pages/public/HomePage'

function PlaceholderPage({ title }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-3 text-gray-500">Trang này sẽ được phát triển sau.</p>
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/products"
          element={<PlaceholderPage title="Danh sách sản phẩm" />}
        />
        <Route
          path="/products/:slug"
          element={<PlaceholderPage title="Chi tiết sản phẩm" />}
        />
        <Route path="/news" element={<PlaceholderPage title="Tin tức" />} />
        <Route path="/faqs" element={<PlaceholderPage title="FAQ" />} />
        <Route path="/contact" element={<PlaceholderPage title="Liên hệ" />} />
        <Route path="/cart" element={<PlaceholderPage title="Giỏ hàng" />} />
        <Route path="/login" element={<PlaceholderPage title="Đăng nhập" />} />
        <Route
          path="/register"
          element={<PlaceholderPage title="Đăng ký" />}
        />
        <Route
          path="/account/orders"
          element={<PlaceholderPage title="Đơn hàng của tôi" />}
        />
      </Route>
    </Routes>
  )
}

export default AppRoutes