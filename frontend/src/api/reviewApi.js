import axiosClient from './axiosClient'

export const reviewApi = {
  getProductReviews: (productId, params) => {
    return axiosClient.get(`/products/${productId}/reviews`, { params })
  },

  createReview: (productId, data) => {
    return axiosClient.post(`/products/${productId}/reviews`, data)
  },

  updateReview: (reviewId, data) => {
    return axiosClient.put(`/reviews/${reviewId}`, data)
  },

  deleteReview: (reviewId) => {
    return axiosClient.delete(`/reviews/${reviewId}`)
  },
}