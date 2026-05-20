import axiosClient from './axiosClient'

export const couponApi = {
  validateCoupon: ({ code, subtotalAmount }) => {
    return axiosClient.get('/coupons/validate', {
      params: {
        code,
        subtotalAmount,
      },
    })
  },
}