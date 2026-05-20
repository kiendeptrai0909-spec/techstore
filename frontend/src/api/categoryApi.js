import axiosClient from './axiosClient'

export const categoryApi = {
  getCategories: () => {
    return axiosClient.get('/categories')
  },
}