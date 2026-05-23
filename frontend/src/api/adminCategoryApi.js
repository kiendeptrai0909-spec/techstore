import axiosClient from './axiosClient'

export const adminCategoryApi = {
  getCategories: (params) => {
    return axiosClient.get('/admin/categories', { params })
  },

  getCategoryById: (categoryId) => {
    return axiosClient.get(`/admin/categories/${categoryId}`)
  },

  createCategory: (data) => {
    return axiosClient.post('/admin/categories', data)
  },

  updateCategory: (categoryId, data) => {
    return axiosClient.put(`/admin/categories/${categoryId}`, data)
  },

  deleteCategory: (categoryId) => {
    return axiosClient.delete(`/admin/categories/${categoryId}`)
  },
}