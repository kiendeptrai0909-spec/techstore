import axiosClient from './axiosClient'

export const adminChatApi = {
  getSessions: (params) => {
    return axiosClient.get('/admin/chat/sessions', { params })
  },

  getMessages: (sessionId, params) => {
    return axiosClient.get(`/admin/chat/sessions/${sessionId}/messages`, {
      params,
    })
  },

  assignSession: (sessionId) => {
    return axiosClient.put(`/admin/chat/sessions/${sessionId}/assign`)
  },

  sendMessage: (sessionId, data) => {
    return axiosClient.post(`/admin/chat/sessions/${sessionId}/messages`, data)
  },

  closeSession: (sessionId) => {
    return axiosClient.put(`/admin/chat/sessions/${sessionId}/close`)
  },
}