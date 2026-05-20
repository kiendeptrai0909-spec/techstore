import axiosClient from './axiosClient'

export const contactMessageApi = {
  createMessage: (data) => {
    return axiosClient.post('/contact-messages', data)
  },
}