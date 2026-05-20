import axiosClient from './axiosClient'

export const brandApi = {
  getBrands: () => {
    return axiosClient.get('/brands')
  },
}