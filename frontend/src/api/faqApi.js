import axiosClient from './axiosClient'

export const faqApi = {
  getFaqs: (params) => {
    return axiosClient.get('/faqs', { params })
  },
}