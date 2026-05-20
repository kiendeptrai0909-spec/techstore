import axiosClient from './axiosClient'

export const adminNewsApi = {
  getNews: (params) => {
    return axiosClient.get('/admin/news', { params })
  },

  getNewsById: (newsId) => {
    return axiosClient.get(`/admin/news/${newsId}`)
  },

  createNews: (data) => {
    return axiosClient.post('/admin/news', data)
  },

  updateNews: (newsId, data) => {
    return axiosClient.put(`/admin/news/${newsId}`, data)
  },

  deleteNews: (newsId) => {
    return axiosClient.delete(`/admin/news/${newsId}`)
  },
}