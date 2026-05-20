import { Route, Routes } from 'react-router'
import MainLayout from '../layouts/MainLayout'
import HomePage from '../pages/public/HomePage'
import ProductListPage from '../pages/public/ProductListPage'
import ProductDetailPage from '../pages/public/ProductDetailPage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import CartPage from '../pages/user/CartPage'
import ProtectedRoute from '../components/common/ProtectedRoute'
import CheckoutPage from '../pages/user/CheckoutPage'
import OrderSuccessPage from '../pages/user/OrderSuccessPage'
import MyOrdersPage from '../pages/user/MyOrdersPage'
import OrderDetailPage from '../pages/user/OrderDetailPage'
import AdminProtectedRoute from '../components/common/AdminProtectedRoute'
import AdminLayout from '../layouts/AdminLayout'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import AdminOrderPage from '../pages/admin/AdminOrderPage'
import AdminOrderDetailPage from '../pages/admin/AdminOrderDetailPage'
import AdminProductPage from '../pages/admin/AdminProductPage'
import AdminProductFormPage from '../pages/admin/AdminProductFormPage'
import AdminCouponPage from '../pages/admin/AdminCouponPage'
import AdminCouponFormPage from '../pages/admin/AdminCouponFormPage'
import AdminBannerPage from '../pages/admin/AdminBannerPage'
import AdminBannerFormPage from '../pages/admin/AdminBannerFormPage'
import AdminNewsPage from '../pages/admin/AdminNewsPage'
import AdminNewsFormPage from '../pages/admin/AdminNewsFormPage'
import AdminFaqPage from '../pages/admin/AdminFaqPage'
import AdminFaqFormPage from '../pages/admin/AdminFaqFormPage'
import AdminContactMessagePage from '../pages/admin/AdminContactMessagePage'
import AdminContactMessageDetailPage from '../pages/admin/AdminContactMessageDetailPage'
import FaqPage from '../pages/public/FaqPage'
import ContactPage from '../pages/public/ContactPage'
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
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/news" element={<PlaceholderPage title="Tin tức" />} />
        <Route path="/faqs" element={<FaqPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="orders" element={<AdminOrderPage />} />
          <Route path="orders/:orderId" element={<AdminOrderDetailPage />} />
          <Route path="products" element={<AdminProductPage />} />
          <Route path="products/create" element={<AdminProductFormPage />} />
          <Route path="products/:productId/edit" element={<AdminProductFormPage />} />
          <Route path="coupons" element={<AdminCouponPage />} />
          <Route path="coupons/create" element={<AdminCouponFormPage />} />
          <Route path="coupons/:couponId/edit" element={<AdminCouponFormPage />} />
          <Route path="banners" element={<AdminBannerPage />} />
          <Route path="banners/create" element={<AdminBannerFormPage />} />
          <Route path="banners/:bannerId/edit" element={<AdminBannerFormPage />} />
          <Route path="news" element={<AdminNewsPage />} />
          <Route path="news/create" element={<AdminNewsFormPage />} />
          <Route path="news/:newsId/edit" element={<AdminNewsFormPage />} />
          <Route path="faqs" element={<AdminFaqPage />} />
          <Route path="faqs/create" element={<AdminFaqFormPage />} />
          <Route path="faqs/:faqId/edit" element={<AdminFaqFormPage />} />
          <Route path="contact-messages" element={<AdminContactMessagePage />} />
          <Route
            path="contact-messages/:messageId"
            element={<AdminContactMessageDetailPage />}
          />
        </Route>
        <Route
          path="/account/orders"
          element={
            <ProtectedRoute>
              <MyOrdersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/account/orders/:orderId"
          element={
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/success/:orderId"
          element={
            <ProtectedRoute>
              <OrderSuccessPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}

export default AppRoutes