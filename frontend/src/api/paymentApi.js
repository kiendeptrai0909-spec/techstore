import axiosClient from './axiosClient'

export const paymentApi = {
  confirmBankTransfer: (orderId) => {
  return axiosClient.post(`/payments/${orderId}/confirm-bank-transfer`)
},
}