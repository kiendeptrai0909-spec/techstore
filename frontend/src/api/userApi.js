import axiosClient from './axiosClient'

export const userApi = {
  getProfile: () => {
    return axiosClient.get('/users/me')
  },

  updateProfile: (data) => {
    return axiosClient.put('/users/me', data)
  },

  uploadAvatar: (file) => {
    const formData = new FormData()
    formData.append('file', file)

    return axiosClient.patch('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  changePassword: (data) => {
    return axiosClient.patch('/users/me/password', data)
  },
}