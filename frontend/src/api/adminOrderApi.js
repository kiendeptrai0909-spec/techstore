import axiosClient from './axiosClient'

export const adminOrderApi = {
  getOrders: (params) => {
    return axiosClient.get('/admin/orders', { params })
  },

  getOrderById: (orderId) => {
    return axiosClient.get(`/admin/orders/${orderId}`)
  },

  updateOrderStatus: (orderId, data) => {
    return axiosClient.put(`/admin/orders/${orderId}/status`, data)
  },
}