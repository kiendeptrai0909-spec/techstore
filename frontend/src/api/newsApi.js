import axiosClient from './axiosClient'

export const newsApi = {
  getNews: (params) => {
    return axiosClient.get('/news', { params })
  },

  getNewsBySlug: (slug) => {
    return axiosClient.get(`/news/${slug}`)
  },
}