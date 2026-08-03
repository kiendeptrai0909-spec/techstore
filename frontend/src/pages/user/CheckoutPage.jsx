import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ShoppingBag } from 'lucide-react'

import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../contexts/CartContext'
import { cartApi } from '../../api/cartApi'
import { couponApi } from '../../api/couponApi'
import { orderApi } from '../../api/orderApi'

import CheckoutForm from '../../components/checkout/CheckoutForm'
import CheckoutSummary from '../../components/checkout/CheckoutSummary'
import PaymentMethodBox from '../../components/checkout/PaymentMethodBox'
import CouponBox from '../../components/checkout/CouponBox'

function CheckoutPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { clearCartState } = useCart()

  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    receiverName: user?.fullName || '',
    receiverPhone: user?.phone || '',
    shippingAddress: user?.address || '',
    note: '',
    paymentMethod: 'COD',
  })

  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [placingOrder, setPlacingOrder] = useState(false)

  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [couponMessage, setCouponMessage] = useState('')
  const [validatingCoupon, setValidatingCoupon] = useState(false)

  const items = useMemo(() => {
    if (!cart) return []

    if (Array.isArray(cart.items)) return cart.items
    if (Array.isArray(cart.cartItems)) return cart.cartItems

    return []
  }, [cart])

  const subtotal = useMemo(() => {
    return (
      cart?.subtotalAmount ||
      cart?.totalAmount ||
      items.reduce((sum, item) => {
        const price = item.price || item.unitPrice || item.salePrice || 0
        const quantity = item.quantity || 1
        return sum + price * quantity
      }, 0)
    )
  }, [cart, items])

  const finalAmount = Math.max(0, subtotal - discountAmount)

  useEffect(() => {
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

    fetchCart()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }))

    setMessage('')
  }

  const handlePaymentMethodChange = (paymentMethod) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod,
    }))
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!formData.receiverName.trim()) {
      nextErrors.receiverName = 'Vui lòng nhập họ tên người nhận'
    }

    if (!formData.receiverPhone.trim()) {
      nextErrors.receiverPhone = 'Vui lòng nhập số điện thoại'
    }

    if (!formData.shippingAddress.trim()) {
      nextErrors.shippingAddress = 'Vui lòng nhập địa chỉ giao hàng'
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  const handleApplyCoupon = async () => {
    const code = couponCode.trim()

    if (!code) {
      setCouponMessage('Vui lòng nhập mã giảm giá')
      return
    }

    if (subtotal <= 0) {
      setCouponMessage('Giỏ hàng chưa có sản phẩm')
      return
    }

    setValidatingCoupon(true)
    setCouponMessage('')

    try {
      const data = await couponApi.validateCoupon({
        code,
        subtotalAmount: subtotal,
      })

      const valid =
        data.valid === true ||
        data.isValid === true ||
        data.status === 'VALID' ||
        data.code

      if (!valid) {
        setAppliedCoupon(null)
        setDiscountAmount(0)
        setCouponMessage(data.message || 'Mã giảm giá không hợp lệ')
        return
      }

      const discount =
        data.discountAmount ||
        data.discount ||
        data.discountValue ||
        0

      setAppliedCoupon(data)
      setDiscountAmount(discount)
      setCouponCode(data.code || code)
      setCouponMessage('')
    } catch (error) {
      setAppliedCoupon(null)
      setDiscountAmount(0)
      setCouponMessage(error.message || 'Mã giảm giá không hợp lệ')
    } finally {
      setValidatingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setDiscountAmount(0)
    setCouponCode('')
    setCouponMessage('')
  }

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      setMessage('Giỏ hàng đang trống')
      return
    }

    if (!validateForm()) {
      return
    }

    setPlacingOrder(true)
    setMessage('')

    try {
      const payload = {
        receiverName: formData.receiverName.trim(),
        receiverPhone: formData.receiverPhone.trim(),
        shippingAddress: formData.shippingAddress.trim(),
        note: formData.note.trim(),
        paymentMethod: formData.paymentMethod,
        couponCode: appliedCoupon ? couponCode.trim() : null,
      }

      const order = await orderApi.createOrder(payload)
      const orderId = order.id || order.orderId

      clearCartState()

      navigate(`/orders/success/${orderId}`, {
        replace: true,
        state: {
          order,
        },
      })
    } catch (error) {
      setMessage(error.message || 'Không thể đặt hàng')
      setErrors(error.errors || {})
    } finally {
      setPlacingOrder(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-[#e9e9e9]">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="h-20 animate-pulse rounded bg-gray-200" />
          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_390px]">
            <div className="space-y-5">
              <div className="h-80 animate-pulse rounded bg-gray-200" />
              <div className="h-52 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="h-96 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="bg-[#e9e9e9]">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="rounded bg-white p-10 text-center shadow-sm">
            <h1 className="text-2xl font-black text-gray-900">
              Giỏ hàng đang trống
            </h1>

            <p className="mt-2 text-gray-500">
              Bạn cần thêm sản phẩm vào giỏ hàng trước khi checkout.
            </p>

            <Link
              to="/products"
              className="mt-5 inline-block rounded bg-red-600 px-6 py-3 font-black text-white hover:bg-red-700"
            >
              Mua sắm ngay
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#e9e9e9]">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-5 rounded-md bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <ShoppingBag size={28} className="text-red-600" />

            <div>
              <h1 className="text-2xl font-black text-gray-900">
                Thanh toán
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Kiểm tra thông tin nhận hàng và hoàn tất đơn hàng.
              </p>
            </div>
          </div>
        </div>

        {message && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {message}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_390px]">
          <div className="space-y-5">
            <CheckoutForm
              formData={formData}
              errors={errors}
              onChange={handleChange}
            />

            <PaymentMethodBox
              value={formData.paymentMethod}
              onChange={handlePaymentMethodChange}
            />

            <CouponBox
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              appliedCoupon={appliedCoupon}
              discountAmount={discountAmount}
              validating={validatingCoupon}
              message={couponMessage}
              onApply={handleApplyCoupon}
              onRemove={handleRemoveCoupon}
            />
          </div>

          <div className="lg:sticky lg:top-[150px] lg:self-start">
            <CheckoutSummary
              items={items}
              subtotal={subtotal}
              discountAmount={discountAmount}
              finalAmount={finalAmount}
              onPlaceOrder={handlePlaceOrder}
              placingOrder={placingOrder}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage