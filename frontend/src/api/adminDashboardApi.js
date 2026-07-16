import axiosClient from './axiosClient'

export const adminDashboardApi = {
  // Tổng quan dashboard
  getSummary: () => {
    return axiosClient.get('/admin/dashboard/summary')
  },

  // Doanh thu theo ngày / tháng
  // params: { type: 'day' | 'month', fromDate: '2026-05-01', toDate: '2026-05-31' }
  getRevenueStatistics: (params = {}) => {
    return axiosClient.get('/admin/dashboard/revenue', { params })
  },

  // Sản phẩm bán chạy
  // params: { limit: 5 }
  getTopProducts: (params = {}) => {
    return axiosClient.get('/admin/dashboard/top-products', { params })
  },

  // Thống kê theo danh mục
  // params: { fromDate: '2026-05-01', toDate: '2026-05-31', limit: 10 }
  getCategoryStatistics: (params = {}) => {
    return axiosClient.get('/admin/dashboard/category-statistics', { params })
  },

  // Thống kê theo thương hiệu
  // params: { fromDate: '2026-05-01', toDate: '2026-05-31', limit: 10 }
  getBrandStatistics: (params = {}) => {
    return axiosClient.get('/admin/dashboard/brand-statistics', { params })
  },

  // Thống kê thanh toán COD / chuyển khoản
  // params: { fromDate: '2026-05-01', toDate: '2026-05-31' }
  getPaymentStatistics: (params = {}) => {
    return axiosClient.get('/admin/dashboard/payment-statistics', { params })
  },

  // Sản phẩm tồn kho thấp
  // params: { limit: 5, threshold: 5 }
  getLowStockProducts: (params = {}) => {
    return axiosClient.get('/admin/dashboard/low-stock-products', { params })
  },
getOldStockProducts: (params = {}) => {
  return axiosClient.get('/admin/dashboard/old-stock-products', { params })
},

getStagnantProducts: (params = {}) => {
  return axiosClient.get('/admin/dashboard/stagnant-products', { params })
},
  // Đơn hàng gần đây
  // params: { limit: 5 }
  getRecentOrders: (params = {}) => {
    return axiosClient.get('/admin/dashboard/recent-orders', { params })
  },
}