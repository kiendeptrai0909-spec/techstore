import axiosClient from './axiosClient'

export const adminReviewApi = {
  getReviews: (params) => {
    return axiosClient.get('/admin/reviews', { params })
  },

  approveReview: (reviewId) => {
    return axiosClient.put(`/admin/reviews/${reviewId}/approve`)
  },

  hideReview: (reviewId) => {
    return axiosClient.put(`/admin/reviews/${reviewId}/hide`)
  },

  deleteReview: (reviewId) => {
    return axiosClient.delete(`/admin/reviews/${reviewId}`)
  },
}
