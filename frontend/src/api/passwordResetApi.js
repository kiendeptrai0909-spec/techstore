import axiosClient from './axiosClient'

export const passwordResetApi = {
  forgotPassword: (email) => {
    return axiosClient.post('/password-reset/forgot', {
      email,
    })
  },

  resetPassword: ({ token, newPassword, confirmPassword }) => {
    return axiosClient.post('/password-reset/reset', {
      token,
      newPassword,
      confirmPassword,
    })
  },
}