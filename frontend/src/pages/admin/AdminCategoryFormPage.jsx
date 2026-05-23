import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ArrowLeft, Save } from 'lucide-react'
import { adminCategoryApi } from '../../api/adminCategoryApi'

function AdminCategoryFormPage() {
  const navigate = useNavigate()
  const { categoryId } = useParams()
  const isEdit = Boolean(categoryId)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    sortOrder: 0,
    status: 'ACTIVE',
  })

  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isEdit) return

    const fetchCategory = async () => {
      setLoading(true)
      setMessage('')

      try {
        const category = await adminCategoryApi.getCategoryById(categoryId)

        setFormData({
          name: category.name || '',
          slug: category.slug || '',
          description: category.description || '',
          imageUrl: category.imageUrl || '',
          sortOrder: category.sortOrder ?? 0,
          status: category.status || 'ACTIVE',
        })
      } catch (error) {
        setMessage(error.message || 'Không thể tải thông tin danh mục')
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
  }, [categoryId, isEdit])

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
      nextErrors.name = 'Tên danh mục không được để trống'
    }

    if (!formData.slug.trim()) {
      nextErrors.slug = 'Slug danh mục không được để trống'
    }

    if (Number(formData.sortOrder) < 0) {
      nextErrors.sortOrder = 'Thứ tự hiển thị không được âm'
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
      imageUrl: formData.imageUrl.trim() || null,
      sortOrder: Number(formData.sortOrder || 0),
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
        await adminCategoryApi.updateCategory(categoryId, payload)
      } else {
        await adminCategoryApi.createCategory(payload)
      }

      navigate('/admin/categories', {
        state: {
          successMessage: isEdit
            ? 'Cập nhật danh mục thành công'
            : 'Thêm danh mục thành công',
        },
      })
    } catch (error) {
      setMessage(error.message || 'Không thể lưu danh mục')
      setErrors(error.errors || {})
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded bg-white p-6 text-center text-gray-500 shadow-sm">
        Đang tải thông tin danh mục...
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-5 rounded-lg bg-white p-5 shadow-sm">
        <Link
          to="/admin/categories"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
        >
          <ArrowLeft size={18} />
          Quay lại danh sách danh mục
        </Link>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900">
              {isEdit ? 'Cập nhật danh mục' : 'Thêm danh mục'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Thiết lập tên, slug, ảnh và thứ tự hiển thị.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded bg-red-600 px-5 py-3 font-black text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={20} />
            {submitting ? 'Đang lưu...' : 'Lưu danh mục'}
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
            Thông tin danh mục
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <FormField
              label="Tên danh mục"
              value={formData.name}
              onChange={handleNameChange}
              error={errors.name}
              placeholder="VD: Màn hình"
            />

            <FormField
              label="Slug"
              value={formData.slug}
              onChange={(value) => handleChange('slug', generateSlug(value))}
              error={errors.slug}
              placeholder="VD: man-hinh"
            />

            <FormField
              label="Thứ tự hiển thị"
              type="number"
              value={formData.sortOrder}
              onChange={(value) => handleChange('sortOrder', value)}
              error={errors.sortOrder}
              placeholder="VD: 1"
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
                    ? 'h-11 w-full rounded border border-red-500 px-4 text-sm outline-none'
                    : 'h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500'
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
              <FormField
                label="URL ảnh danh mục"
                value={formData.imageUrl}
                onChange={(value) => handleChange('imageUrl', value)}
                error={errors.imageUrl}
                placeholder="https://..."
              />
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
                placeholder="Mô tả ngắn về danh mục..."
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
            <div className="flex h-40 items-center justify-center overflow-hidden rounded border bg-gray-50">
              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt={formData.name || 'Danh mục'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm text-gray-400">
                  Chưa có ảnh danh mục
                </span>
              )}
            </div>

            <div className="mt-4">
              <div className="font-black text-gray-900">
                {formData.name || 'Tên danh mục'}
              </div>

              <div className="mt-1 text-sm text-gray-500">
                Slug: {formData.slug || 'slug-danh-muc'}
              </div>

              <div className="mt-1 text-sm text-gray-500">
                Thứ tự: {formData.sortOrder || 0}
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

export default AdminCategoryFormPage