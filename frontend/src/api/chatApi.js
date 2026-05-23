import axiosClient from './axiosClient'

export const chatApi = {
  createSession: () => {
    return axiosClient.post('/chat/sessions')
  },

  getMySessions: (params) => {
    return axiosClient.get('/chat/sessions', { params })
  },

  getMessages: (sessionId, params) => {
    return axiosClient.get(`/chat/sessions/${sessionId}/messages`, { params })
  },

  sendMessage: (sessionId, data) => {
    return axiosClient.post(`/chat/sessions/${sessionId}/messages`, data)
  },
}