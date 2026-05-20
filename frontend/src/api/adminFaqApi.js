import axiosClient from './axiosClient'

export const adminFaqApi = {
  getFaqs: (params) => {
    return axiosClient.get('/admin/faqs', { params })
  },

  getFaqById: (faqId) => {
    return axiosClient.get(`/admin/faqs/${faqId}`)
  },

  createFaq: (data) => {
    return axiosClient.post('/admin/faqs', data)
  },

  updateFaq: (faqId, data) => {
    return axiosClient.put(`/admin/faqs/${faqId}`, data)
  },

  deleteFaq: (faqId) => {
    return axiosClient.delete(`/admin/faqs/${faqId}`)
  },
}