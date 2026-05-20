import axiosClient from './axiosClient'

export const adminCouponApi = {
  getCoupons: (params) => {
    return axiosClient.get('/admin/coupons', { params })
  },

  getCouponById: (couponId) => {
    return axiosClient.get(`/admin/coupons/${couponId}`)
  },

  createCoupon: (data) => {
    return axiosClient.post('/admin/coupons', data)
  },

  updateCoupon: (couponId, data) => {
    return axiosClient.put(`/admin/coupons/${couponId}`, data)
  },

  deleteCoupon: (couponId) => {
    return axiosClient.delete(`/admin/coupons/${couponId}`)
  },
}