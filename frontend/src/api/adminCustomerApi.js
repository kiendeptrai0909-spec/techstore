import axiosClient from './axiosClient'

export const adminCustomerApi = {
  getCustomers: (params) => {
    return axiosClient.get('/admin/customers', { params })
  },

  getCustomerById: (customerId) => {
    return axiosClient.get(`/admin/customers/${customerId}`)
  },

  updateCustomerStatus: (customerId, data) => {
    return axiosClient.put(`/admin/customers/${customerId}/status`, data)
  },
}