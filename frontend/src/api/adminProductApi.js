import axiosClient from './axiosClient'

export const adminProductApi = {
  getProducts: (params) => {
    return axiosClient.get('/admin/products', { params })
  },

  getProductById: (productId) => {
    return axiosClient.get(`/admin/products/${productId}`)
  },

  createProduct: (data) => {
    return axiosClient.post('/admin/products', data)
  },

  updateProduct: (productId, data) => {
    return axiosClient.put(`/admin/products/${productId}`, data)
  },

  deleteProduct: (productId) => {
    return axiosClient.delete(`/admin/products/${productId}`)
  },
}