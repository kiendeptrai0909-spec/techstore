import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ArrowLeft, Save, Award } from 'lucide-react'
import { brandApi } from '../../api/brandApi'

function AdminBrandFormPage() {
  const navigate = useNavigate()
  const { brandId } = useParams()
  const isEdit = Boolean(brandId)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    status: 'ACTIVE',
  })

  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isEdit) return

    const fetchBrand = async () => {
      setLoading(true)
      setMessage('')

      try {
        const brand = await brandApi.getBrandById(brandId)

        setFormData({
          name: brand.name || '',
          slug: brand.slug || '',
          description: brand.description || '',
          status: brand.status || 'ACTIVE',
        })
      } catch (error) {
        setMessage(error.message || 'Không thể tải thông tin thương hiệu')
      } finally {
        setLoading(false)
      }
    }

    fetchBrand()
  }, [brandId, isEdit])

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

  const handleNameChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: !isEdit || !prev.slug ? generateSlug(value) : prev.slug,
    }))

    setErrors((prev) => ({
      ...prev,
      name: '',
      slug: '',
    }))

    setMessage('')
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!formData.name.trim()) {
      nextErrors.name = 'Tên thương hiệu không được để trống'
    }

    if (!formData.slug.trim()) {
      nextErrors.slug = 'Slug thương hiệu không được để trống'
    }

    if (!formData.status) {
      nextErrors.status = 'Vui lòng chọn trạng thái'
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  const buildPayload = () => {
    return {
      name: formData.name.trim(),
      slug: formData.slug.trim().toLowerCase(),
      description: formData.description.trim(),
      logoUrl: '',
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

      if (isEdit) {
        await brandApi.updateBrand(brandId, payload)
      } else {
        await brandApi.createBrand(payload)
      }

      navigate('/admin/brands', {
        state: {
          successMessage: isEdit
            ? 'Cập nhật thương hiệu thành công'
            : 'Thêm thương hiệu thành công',
        },
      })
    } catch (error) {
      setMessage(error.message || 'Không thể lưu thương hiệu')
      setErrors(error.errors || {})
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded bg-white p-6 text-center text-gray-500 shadow-sm">
        Đang tải thông tin thương hiệu...
      </div>
    )
  }

  const title = isEdit ? 'Cập nhật thương hiệu' : 'Thêm thương hiệu'

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-5 rounded-lg bg-white p-5 shadow-sm">
        <Link
          to="/admin/brands"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
        >
          <ArrowLeft size={18} />
          Quay lại danh sách thương hiệu
        </Link>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Award size={26} />
            </div>

            <div>
              <h2 className="text-2xl font-black text-gray-900">{title}</h2>
              <p className="mt-1 text-sm text-gray-500">
                Thiết lập tên, slug và trạng thái hiển thị.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded bg-red-600 px-5 py-3 font-black text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={20} />
            {submitting ? 'Đang lưu...' : 'Lưu thương hiệu'}
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {message}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h3 className="text-xl font-black text-gray-900">
            Thông tin thương hiệu
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <FormField
              label="Tên thương hiệu"
              value={formData.name}
              onChange={handleNameChange}
              error={errors.name}
              placeholder="VD: ASUS"
            />

            <FormField
              label="Slug"
              value={formData.slug}
              onChange={(value) => handleChange('slug', generateSlug(value))}
              error={errors.slug}
              placeholder="VD: asus"
            />

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Trạng thái
              </label>

              <select
                value={formData.status}
                onChange={(event) => handleChange('status', event.target.value)}
                className={
                  errors.status
                    ? 'h-11 w-full rounded border border-red-500 px-4 text-sm outline-none bg-white'
                    : 'h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500 bg-white'
                }
              >
                <option value="ACTIVE">Đang hiển thị</option>
                <option value="INACTIVE">Đang ẩn</option>
              </select>

              {errors.status && (
                <p className="mt-1 text-sm font-semibold text-red-600">
                  {errors.status}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Mô tả
              </label>

              <textarea
                value={formData.description}
                onChange={(event) =>
                  handleChange('description', event.target.value)
                }
                rows={5}
                placeholder="Mô tả thương hiệu..."
                className="w-full rounded border px-4 py-3 text-sm outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h3 className="text-xl font-black text-gray-900">
            Xem trước
          </h3>

          <div className="mt-5 rounded border p-4">
            <div className="flex h-40 items-center justify-center overflow-hidden rounded border bg-gray-50 text-red-600">
              <Award size={64} />
            </div>

            <div className="mt-4">
              <div className="font-black text-gray-900">
                {formData.name || 'Tên thương hiệu'}
              </div>

              <div className="mt-1 text-sm text-gray-500">
                Slug: {formData.slug || 'slug-thuong-hieu'}
              </div>

              <div className="mt-3">
                <span
                  className={
                    formData.status === 'ACTIVE'
                      ? 'inline-flex rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-600'
                      : 'inline-flex rounded-full border bg-gray-50 px-3 py-1 text-xs font-bold text-gray-600'
                  }
                >
                  {formData.status === 'ACTIVE' ? 'Hiển thị' : 'Đang ẩn'}
                </span>
              </div>
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
        className={
          error
            ? 'h-11 w-full rounded border border-red-500 px-4 text-sm outline-none'
            : 'h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500'
        }
      />

      {error && (
        <p className="mt-1 text-sm font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

function generateSlug(value) {
  return value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default AdminBrandFormPage
