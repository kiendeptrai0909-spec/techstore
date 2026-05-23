import axiosClient from './axiosClient'

export const adminEmployeeApi = {
  getEmployees: (params) => {
    return axiosClient.get('/admin/employees', { params })
  },

  getEmployeeById: (employeeId) => {
    return axiosClient.get(`/admin/employees/${employeeId}`)
  },

  createEmployee: (data) => {
    return axiosClient.post('/admin/employees', data)
  },

  updateEmployee: (employeeId, data) => {
    return axiosClient.put(`/admin/employees/${employeeId}`, data)
  },

  updateEmployeeStatus: (employeeId, data) => {
    return axiosClient.put(`/admin/employees/${employeeId}/status`, data)
  },
}