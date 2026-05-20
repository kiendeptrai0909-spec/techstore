import axiosClient from './axiosClient'

export const adminBannerApi = {
  getBanners: (params) => {
    return axiosClient.get('/admin/banners', { params })
  },

  getBannerById: (bannerId) => {
    return axiosClient.get(`/admin/banners/${bannerId}`)
  },

  createBanner: (data) => {
    return axiosClient.post('/admin/banners', data)
  },

  updateBanner: (bannerId, data) => {
    return axiosClient.put(`/admin/banners/${bannerId}`, data)
  },

  deleteBanner: (bannerId) => {
    return axiosClient.delete(`/admin/banners/${bannerId}`)
  },
}