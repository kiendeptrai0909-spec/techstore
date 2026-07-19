import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ArrowLeft, Save } from 'lucide-react'

import { adminBannerApi } from '../../api/adminBannerApi'
import { uploadApi } from '../../api/uploadApi'

function AdminBannerFormPage() {
  const { bannerId } = useParams()
  const navigate = useNavigate()

  const isEditMode = Boolean(bannerId)

  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    linkUrl: '',
    position: 'HOME_TOP',
    sortOrder: 1,
    startAt: '',
    endAt: '',
    status: 'ACTIVE',
  })

  const [loading, setLoading] = useState(isEditMode)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({})

  const title = useMemo(
    () => (isEditMode ? 'Cập nhật banner' : 'Thêm banner'),
    [isEditMode]
  )

  useEffect(() => {
    const fetchBanner = async () => {
      if (!isEditMode) return

      setLoading(true)
      setMessage('')

      try {
        const banner = await adminBannerApi.getBannerById(bannerId)

        setFormData({
          title: banner.title || '',
          imageUrl: banner.imageUrl || '',
          linkUrl: banner.linkUrl || '',
          position: banner.position || 'HOME_TOP',
          sortOrder: banner.sortOrder ?? 1,
          startAt: toDateTimeLocal(banner.startAt),
          endAt: toDateTimeLocal(banner.endAt),
          status: banner.status || 'ACTIVE',
        })
      } catch (error) {
        setMessage(error.message || 'Không thể tải banner')
      } finally {
        setLoading(false)
      }
    }

    fetchBanner()
  }, [isEditMode, bannerId])

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

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setMessage('Vui lòng chọn file hình ảnh')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage('Kích thước ảnh không được vượt quá 5MB')
      return
    }

    setUploadingImage(true)
    setMessage('')

    try {
      const response = await uploadApi.uploadImage(file)

      const imageUrl =
        response?.data?.url ||
        response?.url ||
        response?.data?.secureUrl ||
        response?.secureUrl ||
        ''

      if (!imageUrl) {
        setMessage('Upload ảnh thành công nhưng không nhận được đường dẫn ảnh')
        return
      }

      setFormData((prev) => ({ ...prev, imageUrl }))
      setErrors((prev) => ({ ...prev, imageUrl: '' }))
    } catch (error) {
      setMessage(
        error?.response?.data?.message ||
          error?.message ||
          'Upload ảnh thất bại'
      )
    } finally {
      setUploadingImage(false)
      event.target.value = ''
    }
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!formData.title.trim()) {
      nextErrors.title = 'Tiêu đề banner không được để trống'
    }

    if (!formData.imageUrl.trim()) {
      nextErrors.imageUrl = 'Vui lòng upload ảnh banner'
    }

    if (!formData.position) {
      nextErrors.position = 'Vui lòng chọn vị trí banner'
    }

    if (formData.sortOrder === '' || Number(formData.sortOrder) < 0) {
      nextErrors.sortOrder = 'Thứ tự hiển thị không hợp lệ'
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
    title: formData.title.trim(),
    imageUrl: formData.imageUrl.trim(),
    linkUrl: formData.linkUrl.trim() || null,
    position: formData.position,
    sortOrder: Number(formData.sortOrder || 0),
    startAt: toBackendDateTime(formData.startAt),
    endAt: toBackendDateTime(formData.endAt),
    status: formData.status,
  }
}

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) return

    setSubmitting(true)
    setMessage('')

    try {
      const payload = buildPayload()

      if (isEditMode) {
        await adminBannerApi.updateBanner(bannerId, payload)
      } else {
        await adminBannerApi.createBanner(payload)
      }

      navigate('/admin/banners', {
        state: {
          successMessage: isEditMode
            ? 'Cập nhật banner thành công'
            : 'Thêm banner thành công',
        },
      })
    } catch (error) {
      setMessage(error.message || 'Không thể lưu banner')
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
          to="/admin/banners"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
        >
          <ArrowLeft size={18} />
          Quay lại danh sách banner
        </Link>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900">{title}</h2>
            <p className="mt-1 text-sm text-gray-500">
              Thiết lập ảnh, vị trí, link điều hướng và thời gian hiển thị.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting || uploadingImage}
            className="inline-flex items-center gap-2 rounded bg-red-600 px-5 py-3 font-black text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={20} />
            {uploadingImage
              ? 'Đang upload ảnh...'
              : submitting
                ? 'Đang lưu...'
                : 'Lưu banner'}
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {message}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-xl font-black text-gray-900">
            Thông tin banner
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              label="Tiêu đề banner"
              value={formData.title}
              onChange={(value) => handleChange('title', value)}
              error={errors.title}
              placeholder="VD: Sale laptop gaming"
            />

            <FormField
              label="Link điều hướng"
              value={formData.linkUrl}
              onChange={(value) => handleChange('linkUrl', value)}
              placeholder="/products hoặc https://..."
            />

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Vị trí
              </label>

              <select
                value={formData.position}
                onChange={(event) =>
                  handleChange('position', event.target.value)
                }
                className={
                  errors.position
                    ? 'h-11 w-full rounded border border-red-500 px-4 text-sm outline-none'
                    : 'h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500'
                }
              >
                <option value="HOME_TOP">Trang chủ - đầu trang</option>
                <option value="HOME_MIDDLE">Trang chủ - giữa trang</option>
                <option value="HOME_BOTTOM">Trang chủ - cuối trang</option>
                <option value="SIDEBAR_LEFT">Banner trái</option>
                <option value="SIDEBAR_RIGHT">Banner phải</option>
              </select>

              {errors.position && (
                <p className="mt-1 text-sm text-red-600">{errors.position}</p>
              )}
            </div>

            <FormField
              label="Thứ tự hiển thị"
              type="number"
              value={formData.sortOrder}
              onChange={(value) => handleChange('sortOrder', value)}
              error={errors.sortOrder}
              placeholder="VD: 1"
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

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Trạng thái
              </label>

              <select
                value={formData.status}
                onChange={(event) => handleChange('status', event.target.value)}
                className="h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500"
              >
                <option value="ACTIVE">Hiển thị</option>
                <option value="INACTIVE">Ẩn</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Ảnh banner
              </label>

              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploadingImage}
                  className={
                    errors.imageUrl
                      ? 'block h-11 w-full rounded border border-red-500 px-4 py-2 text-sm outline-none file:mr-4 file:rounded file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60'
                      : 'block h-11 w-full rounded border px-4 py-2 text-sm outline-none file:mr-4 file:rounded file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60'
                  }
                />

                {errors.imageUrl && (
                  <p className="text-sm text-red-600">{errors.imageUrl}</p>
                )}

                {uploadingImage && (
                  <p className="text-sm font-semibold text-blue-600">
                    Đang upload ảnh lên Cloudinary...
                  </p>
                )}

                {formData.imageUrl && (
                  <div className="rounded border bg-gray-50 p-3">
                    <p className="mb-2 text-sm font-bold text-gray-700">
                      Ảnh đã chọn
                    </p>

                    <img
                      src={formData.imageUrl}
                      alt="Ảnh banner"
                      className="h-40 w-full rounded border bg-white object-cover"
                    />

                    <p className="mt-2 break-all text-xs text-gray-500">
                      {formData.imageUrl}
                    </p>

                    <button
                      type="button"
                      onClick={() => handleChange('imageUrl', '')}
                      className="mt-3 rounded border border-red-200 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
                    >
                      Xóa ảnh
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-xl font-black text-gray-900">
            Xem trước banner
          </h3>

          <div className="overflow-hidden rounded border bg-gray-50">
            {formData.imageUrl ? (
              <img
                src={formData.imageUrl}
                alt={formData.title || 'Banner preview'}
                className="h-[260px] w-full object-cover"
              />
            ) : (
              <div className="flex h-[260px] items-center justify-center text-gray-400">
                Chưa có ảnh banner
              </div>
            )}
          </div>

          <div className="mt-4 rounded bg-gray-50 p-4 text-sm">
            <div>
              <span className="font-bold">Tiêu đề:</span>{' '}
              {formData.title || 'Chưa nhập'}
            </div>

            <div className="mt-2">
              <span className="font-bold">Vị trí:</span>{' '}
              {formData.position}
            </div>

            <div className="mt-2">
              <span className="font-bold">Thứ tự:</span>{' '}
              {formData.sortOrder}
            </div>
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
function toBackendDateTime(value) {
  if (!value) return null

  return value.length === 16 ? `${value}:00` : value
}
export default AdminBannerFormPage