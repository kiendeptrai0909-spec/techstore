import axiosClient from './axiosClient'

export const adminContactMessageApi = {
  getMessages: (params) => {
    return axiosClient.get('/admin/contact-messages', { params })
  },

  getMessageById: (messageId) => {
    return axiosClient.get(`/admin/contact-messages/${messageId}`)
  },

  updateMessageStatus: (messageId, data) => {
    return axiosClient.put(`/admin/contact-messages/${messageId}/status`, data)
  },
}