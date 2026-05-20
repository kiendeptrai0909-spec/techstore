import axiosClient from './axiosClient'

export const cartApi = {
  getCart: () => {
    return axiosClient.get('/cart')
  },

  addToCart: (data) => {
    return axiosClient.post('/cart/items', data)
  },

  updateCartItem: (cartItemId, data) => {
    return axiosClient.put(`/cart/items/${cartItemId}`, data)
  },

  removeCartItem: (cartItemId) => {
    return axiosClient.delete(`/cart/items/${cartItemId}`)
  },

  clearCart: () => {
    return axiosClient.delete('/cart')
  },
}