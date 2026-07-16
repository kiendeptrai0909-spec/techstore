import axiosClient from './axiosClient'

export const categoryApi = {
  getCategories: () => {
    return axiosClient.get('/categories')
  },
  getSpecificationKeys: (categoryId) => {
    return axiosClient.get(`/categories/${categoryId}/specification-keys`)
  },
}