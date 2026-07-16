import axiosClient from './axiosClient'

export const brandApi = {
  getBrands: (params) => {
    return axiosClient.get('/brands', { params })
  },
  getBrandsByCategory: (categoryId) => {
    return axiosClient.get('/brands', { params: { categoryId } })
  },

  getAdminBrands: (params) => {
    return axiosClient.get('/admin/brands', { params })
  },

  getBrandById: (id) => {
    return axiosClient.get(`/admin/brands/${id}`)
  },

  createBrand: (data) => {
    return axiosClient.post('/admin/brands', data)
  },

  updateBrand: (id, data) => {
    return axiosClient.put(`/admin/brands/${id}`, data)
  },

  deleteBrand: (id) => {
    return axiosClient.delete(`/admin/brands/${id}`)
  },
}