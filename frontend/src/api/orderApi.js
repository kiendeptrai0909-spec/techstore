import axiosClient from './axiosClient'

export const orderApi = {
  createOrder: (data) => {
    return axiosClient.post('/orders', data)
  },

  getMyOrders: (params) => {
    return axiosClient.get('/orders/my-orders', { params })
  },

  getOrderById: (orderId) => {
    return axiosClient.get(`/orders/${orderId}`)
  },

  cancelOrder: (orderId) => {
    return axiosClient.post(`/orders/${orderId}/cancel`)
  },
}