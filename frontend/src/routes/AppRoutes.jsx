import { Route, Routes } from 'react-router'

import MainLayout from '../layouts/MainLayout'
import AdminLayout from '../layouts/AdminLayout'

import HomePage from '../pages/public/HomePage'
import ProductListPage from '../pages/public/ProductListPage'
import ProductDetailPage from '../pages/public/ProductDetailPage'
import FaqPage from '../pages/public/FaqPage'
import ContactPage from '../pages/public/ContactPage'
import NewsListPage from '../pages/public/NewsListPage'
import NewsDetailPage from '../pages/public/NewsDetailPage'

import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'

import CartPage from '../pages/user/CartPage'
import CheckoutPage from '../pages/user/CheckoutPage'
import OrderSuccessPage from '../pages/user/OrderSuccessPage'
import MyOrdersPage from '../pages/user/MyOrdersPage'
import OrderDetailPage from '../pages/user/OrderDetailPage'
import ProfilePage from '../pages/user/ProfilePage'
import AdminCustomerPage from '../pages/admin/AdminCustomerPage'
import AdminCustomerDetailPage from '../pages/admin/AdminCustomerDetailPage'
import AdminEmployeePage from '../pages/admin/AdminEmployeePage'
import AdminEmployeeFormPage from '../pages/admin/AdminEmployeeFormPage'
import ProtectedRoute from '../components/common/ProtectedRoute'
import AdminProtectedRoute from '../components/common/AdminProtectedRoute'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage'
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
import AdminCategoryPage from '../pages/admin/AdminCategoryPage'
import AdminCategoryFormPage from '../pages/admin/AdminCategoryFormPage'
function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC / USER ROUTES - dùng MainLayout có Header/Footer */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />

        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />

        <Route path="/news" element={<NewsListPage />} />
        <Route path="/news/:slug" element={<NewsDetailPage />} />

        <Route path="/faqs" element={<FaqPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/account/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

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

      {/* ADMIN ROUTES - tách khỏi MainLayout, không hiện Header/Footer public */}
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
        <Route path="categories" element={<AdminCategoryPage />} />
        <Route path="categories/create" element={<AdminCategoryFormPage />} />
        <Route path="categories/:categoryId/edit" element={<AdminCategoryFormPage />} />
        <Route path="coupons" element={<AdminCouponPage />} />
        <Route path="coupons/create" element={<AdminCouponFormPage />} />
        <Route path="coupons/:couponId/edit" element={<AdminCouponFormPage />} />
        <Route path="customers" element={<AdminCustomerPage />} />
        <Route path="customers/:customerId" element={<AdminCustomerDetailPage />} />

        <Route path="employees" element={<AdminEmployeePage />} />
        <Route path="employees/create" element={<AdminEmployeeFormPage />} />
        <Route path="employees/:employeeId/edit" element={<AdminEmployeeFormPage />} />
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
    </Routes>
  )
}

export default AppRoutes