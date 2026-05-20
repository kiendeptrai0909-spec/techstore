import axiosClient from './axiosClient'

export const adminDashboardApi = {
  getSummary: () => {
    return axiosClient.get('/admin/dashboard/summary')
  },

  getRevenueStatistics: (params) => {
    return axiosClient.get('/admin/dashboard/revenue', { params })
  },

  getTopProducts: (params) => {
    return axiosClient.get('/admin/dashboard/top-products', { params })
  },
}