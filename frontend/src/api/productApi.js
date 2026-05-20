import axiosClient from './axiosClient'

export const productApi = {
  getProducts: (params) => {
    return axiosClient.get('/products', { params })
  },

  getFeaturedProducts: (params) => {
    return axiosClient.get('/products/featured', { params })
  },

  getProductById: (id) => {
    return axiosClient.get(`/products/${id}`)
  },

  getProductBySlug: (slug) => {
    return axiosClient.get(`/products/slug/${slug}`)
  },
}