import axiosClient from './axiosClient'

export const paymentApi = {
  mockPay: (orderId) => {
    return axiosClient.post(`/payments/${orderId}/mock-pay`)
  },
}