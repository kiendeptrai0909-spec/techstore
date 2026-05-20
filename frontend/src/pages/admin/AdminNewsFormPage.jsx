import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ArrowLeft, Save } from 'lucide-react'

import { adminNewsApi } from '../../api/adminNewsApi'

function AdminNewsFormPage() {
  const { newsId } = useParams()
  const navigate = useNavigate()

  const isEditMode = Boolean(newsId)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    thumbnailUrl: '',
    status: 'DRAFT',
  })

  const [loading, setLoading] = useState(isEditMode)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({})

  const title = useMemo(
    () => (isEditMode ? 'Cập nhật bài viết' : 'Thêm bài viết'),
    [isEditMode]
  )

  useEffect(() => {
    const fetchNews = async () => {
      if (!isEditMode) return

      setLoading(true)
      setMessage('')

      try {
        const news = await adminNewsApi.getNewsById(newsId)

        setFormData({
          title: news.title || '',
          slug: news.slug || '',
          summary: news.summary || '',
          content: news.content || '',
          thumbnailUrl: news.thumbnailUrl || news.imageUrl || '',
          status: news.status || 'DRAFT',
        })
      } catch (error) {
        setMessage(error.message || 'Không thể tải bài viết')
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [isEditMode, newsId])

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'title' && !isEditMode && !prev.slug
        ? { slug: createSlug(value) }
        : {}),
    }))

    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }))

    setMessage('')
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!formData.title.trim()) {
      nextErrors.title = 'Tiêu đề không được để trống'
    }

    if (!formData.slug.trim()) {
      nextErrors.slug = 'Slug không được để trống'
    }

    if (!formData.summary.trim()) {
      nextErrors.summary = 'Tóm tắt không được để trống'
    }

    if (!formData.content.trim()) {
      nextErrors.content = 'Nội dung không được để trống'
    }

    if (!formData.thumbnailUrl.trim()) {
      nextErrors.thumbnailUrl = 'Ảnh đại diện không được để trống'
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  const buildPayload = () => {
    return {
      title: formData.title.trim(),
      slug: formData.slug.trim().toLowerCase(),
      summary: formData.summary.trim(),
      content: formData.content.trim(),
      thumbnailUrl: formData.thumbnailUrl.trim(),
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
        await adminNewsApi.updateNews(newsId, payload)
      } else {
        await adminNewsApi.createNews(payload)
      }

      navigate('/admin/news', {
        replace: true,
      })
    } catch (error) {
      setMessage(error.message || 'Không thể lưu bài viết')
      setErrors(error.errors || {})
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div>
        <div className="mb-5 h-20 animate-pulse rounded bg-gray-200" />
        <div className="h-[640px] animate-pulse rounded bg-gray-200" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-5 rounded-lg bg-white p-5 shadow-sm">
        <Link
          to="/admin/news"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
        >
          <ArrowLeft size={18} />
          Quay lại danh sách tin tức
        </Link>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900">{title}</h2>
            <p className="mt-1 text-sm text-gray-500">
              Quản lý tiêu đề, slug, ảnh đại diện, tóm tắt và nội dung bài viết.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded bg-red-600 px-5 py-3 font-black text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={20} />
            {submitting ? 'Đang lưu...' : 'Lưu bài viết'}
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {message}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-5">
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-xl font-black text-gray-900">
              Thông tin bài viết
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                label="Tiêu đề"
                value={formData.title}
                onChange={(value) => handleChange('title', value)}
                error={errors.title}
                placeholder="VD: Nên mua laptop nào cho sinh viên CNTT?"
              />

              <FormField
                label="Slug"
                value={formData.slug}
                onChange={(value) => handleChange('slug', createSlug(value))}
                error={errors.slug}
                placeholder="VD: nen-mua-laptop-nao-cho-sinh-vien-cntt"
              />

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Trạng thái
                </label>

                <select
                  value={formData.status}
                  onChange={(event) =>
                    handleChange('status', event.target.value)
                  }
                  className="h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500"
                >
                  <option value="DRAFT">Bản nháp</option>
                  <option value="PUBLISHED">Xuất bản</option>
                  <option value="HIDDEN">Ẩn</option>
                </select>
              </div>

              <FormField
                label="Ảnh đại diện"
                value={formData.thumbnailUrl}
                onChange={(value) => handleChange('thumbnailUrl', value)}
                error={errors.thumbnailUrl}
                placeholder="https://..."
              />

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Tóm tắt
                </label>

                <textarea
                  value={formData.summary}
                  onChange={(event) =>
                    handleChange('summary', event.target.value)
                  }
                  rows="3"
                  placeholder="Nhập tóm tắt ngắn cho bài viết..."
                  className={
                    errors.summary
                      ? 'w-full rounded border border-red-500 px-4 py-3 text-sm outline-none'
                      : 'w-full rounded border px-4 py-3 text-sm outline-none focus:border-red-500'
                  }
                />

                {errors.summary && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.summary}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-xl font-black text-gray-900">
              Nội dung
            </h3>

            <textarea
              value={formData.content}
              onChange={(event) => handleChange('content', event.target.value)}
              rows="18"
              placeholder="Nhập nội dung bài viết..."
              className={
                errors.content
                  ? 'w-full rounded border border-red-500 px-4 py-3 text-sm leading-7 outline-none'
                  : 'w-full rounded border px-4 py-3 text-sm leading-7 outline-none focus:border-red-500'
              }
            />

            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content}</p>
            )}
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm xl:sticky xl:top-[88px] xl:self-start">
          <h3 className="mb-4 text-xl font-black text-gray-900">
            Xem trước
          </h3>

          <div className="overflow-hidden rounded border bg-gray-50">
            {formData.thumbnailUrl ? (
              <img
                src={formData.thumbnailUrl}
                alt={formData.title || 'News preview'}
                className="h-[220px] w-full object-cover"
              />
            ) : (
              <div className="flex h-[220px] items-center justify-center text-gray-400">
                Chưa có ảnh đại diện
              </div>
            )}
          </div>

          <h4 className="mt-4 line-clamp-2 text-xl font-black text-gray-900">
            {formData.title || 'Tiêu đề bài viết'}
          </h4>

          <p className="mt-2 line-clamp-4 text-sm leading-6 text-gray-600">
            {formData.summary || 'Tóm tắt bài viết sẽ hiển thị tại đây.'}
          </p>

          <div className="mt-4 rounded bg-gray-50 p-4 text-sm">
            <div>
              <span className="font-bold">Slug:</span>{' '}
              {formData.slug || 'chua-co-slug'}
            </div>

            <div className="mt-2">
              <span className="font-bold">Trạng thái:</span>{' '}
              {formData.status}
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

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

function createSlug(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default AdminNewsFormPage