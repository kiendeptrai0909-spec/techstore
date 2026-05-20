import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { ShoppingCart } from 'lucide-react'

import { cartApi } from '../../api/cartApi'
import CartItem from '../../components/cart/CartItem'
import CartSummary from '../../components/cart/CartSummary'

function CartPage() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [clearing, setClearing] = useState(false)
  const [message, setMessage] = useState('')

  const items = useMemo(() => {
    if (!cart) {
      return []
    }

    if (Array.isArray(cart.items)) {
      return cart.items
    }

    if (Array.isArray(cart.cartItems)) {
      return cart.cartItems
    }

    return []
  }, [cart])

  const fetchCart = async () => {
    setLoading(true)
    setMessage('')

    try {
      const data = await cartApi.getCart()
      setCart(data)
    } catch (error) {
      setMessage(error.message || 'Không thể tải giỏ hàng')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const handleUpdateQuantity = async (cartItemId, quantity) => {
    if (!cartItemId || quantity < 1) {
      return
    }

    setUpdatingId(cartItemId)
    setMessage('')

    try {
      await cartApi.updateCartItem(cartItemId, {
        quantity,
      })

      await fetchCart()
    } catch (error) {
      setMessage(error.message || 'Không thể cập nhật số lượng')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleRemoveItem = async (cartItemId) => {
    const confirmed = window.confirm('Bạn có chắc muốn xóa sản phẩm này?')

    if (!confirmed) {
      return
    }

    setUpdatingId(cartItemId)
    setMessage('')

    try {
      await cartApi.removeCartItem(cartItemId)
      await fetchCart()
    } catch (error) {
      setMessage(error.message || 'Không thể xóa sản phẩm')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleClearCart = async () => {
    const confirmed = window.confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')

    if (!confirmed) {
      return
    }

    setClearing(true)
    setMessage('')

    try {
      await cartApi.clearCart()
      await fetchCart()
    } catch (error) {
      setMessage(error.message || 'Không thể xóa giỏ hàng')
    } finally {
      setClearing(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-[#e9e9e9]">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="mb-4 h-20 animate-pulse rounded bg-gray-200" />

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-40 animate-pulse rounded bg-gray-200"
                />
              ))}
            </div>

            <div className="h-80 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#e9e9e9]">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-4 rounded-md bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <ShoppingCart size={28} className="text-red-600" />

            <div>
              <h1 className="text-2xl font-black text-gray-900">
                Giỏ hàng của bạn
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Kiểm tra sản phẩm, cập nhật số lượng và tiến hành đặt hàng.
              </p>
            </div>
          </div>
        </div>

        {message && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {message}
          </div>
        )}

        {items.length === 0 ? (
          <div className="rounded-md bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-600">
              <ShoppingCart size={38} />
            </div>

            <h2 className="mt-5 text-2xl font-black text-gray-900">
              Giỏ hàng đang trống
            </h2>

            <p className="mt-2 text-gray-500">
              Hãy thêm sản phẩm yêu thích vào giỏ hàng để tiếp tục mua sắm.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-block rounded bg-red-600 px-6 py-3 font-black text-white hover:bg-red-700"
            >
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-4">
              {items.map((item) => {
                const cartItemId = item.cartItemId || item.id

                return (
                  <CartItem
                    key={cartItemId}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                    updating={updatingId === cartItemId}
                  />
                )
              })}
            </div>

            <div className="lg:sticky lg:top-[150px] lg:self-start">
              <CartSummary
                cart={cart}
                items={items}
                onClearCart={handleClearCart}
                clearing={clearing}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage