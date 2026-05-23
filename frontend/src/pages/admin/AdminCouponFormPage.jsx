import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ArrowLeft, Save } from 'lucide-react'

import { adminCouponApi } from '../../api/adminCouponApi'

function AdminCouponFormPage() {
  const { couponId } = useParams()
  const navigate = useNavigate()

  const isEditMode = Boolean(couponId)

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    maxDiscountAmount: '',
    minOrderAmount: '',
    usageLimit: '',
    startAt: '',
    endAt: '',
    status: 'ACTIVE',
  })

  const [loading, setLoading] = useState(isEditMode)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({})

  const title = useMemo(
    () => (isEditMode ? 'Cập nhật coupon' : 'Thêm coupon'),
    [isEditMode]
  )

  useEffect(() => {
    const fetchCoupon = async () => {
      if (!isEditMode) {
        return
      }

      setLoading(true)
      setMessage('')

      try {
        const coupon = await adminCouponApi.getCouponById(couponId)

        setFormData({
          code: coupon.code || '',
          name: coupon.name || '',
          description: coupon.description || '',
          discountType: coupon.discountType || coupon.type || 'PERCENTAGE',
          discountValue:
            coupon.discountValue ?? coupon.value ?? '',
          maxDiscountAmount: coupon.maxDiscountAmount ?? '',
          minOrderAmount:
            coupon.minOrderAmount ??
            coupon.minimumOrderAmount ??
            '',
          usageLimit: coupon.usageLimit ?? coupon.maxUsage ?? '',
          startAt: toDateTimeLocal(coupon.startAt),
          endAt: toDateTimeLocal(coupon.endAt),
          status: coupon.status || 'ACTIVE',
        })
      } catch (error) {
        setMessage(error.message || 'Không thể tải coupon')
      } finally {
        setLoading(false)
      }
    }

    fetchCoupon()
  }, [isEditMode, couponId])

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }))

    setMessage('')
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!formData.code.trim()) {
      nextErrors.code = 'Mã coupon không được để trống'
    }
    if (!formData.name.trim()) {
      nextErrors.name = 'Tên coupon không được để trống'
    }
    if (!formData.discountValue) {
      nextErrors.discountValue = 'Giá trị giảm không được để trống'
    }

    if (Number(formData.discountValue) <= 0) {
      nextErrors.discountValue = 'Giá trị giảm phải lớn hơn 0'
    }

    if (
      formData.discountType === 'PERCENTAGE' &&
      Number(formData.discountValue) > 100
    ) {
      nextErrors.discountValue = 'Giảm theo phần trăm không được vượt quá 100'
    }

    if (!formData.startAt) {
      nextErrors.startAt = 'Vui lòng chọn thời gian bắt đầu'
    }
    if (formData.startAt && new Date(formData.startAt) < new Date()) {
      nextErrors.startAt = 'Thời gian bắt đầu không được ở quá khứ'
    }
    if (!formData.endAt) {
      nextErrors.endAt = 'Vui lòng chọn thời gian kết thúc'
    }

    if (
      formData.startAt &&
      formData.endAt &&
      new Date(formData.startAt) >= new Date(formData.endAt)
    ) {
      nextErrors.endAt = 'Thời gian kết thúc phải sau thời gian bắt đầu'
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  const buildPayload = () => {
    return {
      code: formData.code.trim().toUpperCase(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue || 0),
      maxDiscountAmount: formData.maxDiscountAmount
        ? Number(formData.maxDiscountAmount)
        : null,
      minOrderAmount: formData.minOrderAmount
        ? Number(formData.minOrderAmount)
        : 0,
      usageLimit: formData.usageLimit
        ? Number(formData.usageLimit)
        : null,
      startAt: formData.startAt,
      endAt: formData.endAt,
      status: formData.status,
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    setMessage('')

    try {
      const payload = buildPayload()

      if (isEditMode) {
        await adminCouponApi.updateCoupon(couponId, payload)
      } else {
        await adminCouponApi.createCoupon(payload)
      }

      navigate('/admin/coupons', {
        replace: true,
      })
    } catch (error) {
      setMessage(error.message || 'Không thể lưu coupon')
      setErrors(error.errors || {})
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div>
        <div className="mb-5 h-20 animate-pulse rounded bg-gray-200" />
        <div className="h-[560px] animate-pulse rounded bg-gray-200" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-5 rounded-lg bg-white p-5 shadow-sm">
        <Link
          to="/admin/coupons"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
        >
          <ArrowLeft size={18} />
          Quay lại danh sách coupon
        </Link>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900">{title}</h2>
            <p className="mt-1 text-sm text-gray-500">
              Thiết lập mã giảm giá, điều kiện áp dụng và thời gian hiệu lực.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded bg-red-600 px-5 py-3 font-black text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={20} />
            {submitting ? 'Đang lưu...' : 'Lưu coupon'}
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {message}
        </div>
      )}

      <div className="rounded-lg bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-xl font-black text-gray-900">
          Thông tin coupon
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            label="Mã coupon"
            value={formData.code}
            onChange={(value) => handleChange('code', value)}
            error={errors.code}
            placeholder="VD: SALE10"
          />
<FormField
  label="Tên coupon"
  value={formData.name}
  onChange={(value) => handleChange('name', value)}
  error={errors.name}
  placeholder="VD: Giảm 10% toàn cửa hàng"
/>
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Trạng thái
            </label>

            <select
              value={formData.status}
              onChange={(event) => handleChange('status', event.target.value)}
              className="h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500"
            >
              <option value="ACTIVE">Hoạt động</option>
              <option value="INACTIVE">Ngừng hoạt động</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Loại giảm giá
            </label>

            <select
              value={formData.discountType}
              onChange={(event) =>
                handleChange('discountType', event.target.value)
              }
              className="h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500"
            >
              <option value="PERCENTAGE">Giảm theo phần trăm</option>
              <option value="FIXED">Giảm số tiền cố định</option>
            </select>
          </div>

          <FormField
            label={
              formData.discountType === 'PERCENTAGE'
                ? 'Giá trị giảm (%)'
                : 'Giá trị giảm (VNĐ)'
            }
            type="number"
            value={formData.discountValue}
            onChange={(value) => handleChange('discountValue', value)}
            error={errors.discountValue}
            placeholder={
              formData.discountType === 'PERCENTAGE' ? 'VD: 10' : 'VD: 100000'
            }
          />

          <FormField
            label="Giảm tối đa"
            type="number"
            value={formData.maxDiscountAmount}
            onChange={(value) => handleChange('maxDiscountAmount', value)}
            placeholder="VD: 500000"
          />

          <FormField
            label="Đơn hàng tối thiểu"
            type="number"
            value={formData.minOrderAmount}
            onChange={(value) => handleChange('minOrderAmount', value)}
            placeholder="VD: 1000000"
          />

          <FormField
            label="Giới hạn lượt dùng"
            type="number"
            value={formData.usageLimit}
            onChange={(value) => handleChange('usageLimit', value)}
            placeholder="Để trống nếu không giới hạn"
          />

          <FormField
            label="Thời gian bắt đầu"
            type="datetime-local"
            value={formData.startAt}
            onChange={(value) => handleChange('startAt', value)}
            error={errors.startAt}
            min={getCurrentDateTimeLocal()}
          />

          <FormField
            label="Thời gian kết thúc"
            type="datetime-local"
            value={formData.endAt}
            onChange={(value) => handleChange('endAt', value)}
            error={errors.endAt}
          />

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Mô tả
            </label>

            <textarea
              value={formData.description}
              onChange={(event) =>
                handleChange('description', event.target.value)
              }
              rows="4"
              placeholder="Mô tả ngắn về coupon..."
              className="w-full rounded border px-4 py-3 text-sm outline-none focus:border-red-500"
            />
          </div>
        </div>
      </div>
    </form>
  )
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  error,
  type = 'text',
  min,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        min={min}
        className={
          error
            ? 'h-11 w-full rounded border border-red-500 px-4 text-sm outline-none'
            : 'h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500'
        }
      />

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

function toDateTimeLocal(value) {
  if (!value) return ''

  const date = new Date(value)
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60 * 1000)

  return localDate.toISOString().slice(0, 16)
}
function getCurrentDateTimeLocal() {
  const now = new Date()
  now.setSeconds(0, 0)

  const offset = now.getTimezoneOffset()
  const localDate = new Date(now.getTime() - offset * 60 * 1000)

  return localDate.toISOString().slice(0, 16)
}
export default AdminCouponFormPage