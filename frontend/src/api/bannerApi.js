import axiosClient from './axiosClient'

export const bannerApi = {
  getBanners: (position) => {
    const params = {}

    if (position) {
      params.position = position
    }

    return axiosClient.get('/banners', { params })
  },
}