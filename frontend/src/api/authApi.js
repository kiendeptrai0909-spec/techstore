import axiosClient from './axiosClient'

export const authApi = {
  register: (data) => {
    return axiosClient.post('/auth/register', data)
  },

  login: (data) => {
    return axiosClient.post('/auth/login', data)
  },

  getMe: () => {
    return axiosClient.get('/auth/me')
  },
  googleLogin: (credential) => {
  return axiosClient.post('/auth/google', { credential })
},
}