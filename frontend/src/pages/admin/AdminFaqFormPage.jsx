import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ArrowLeft, Save } from 'lucide-react'

import { adminFaqApi } from '../../api/adminFaqApi'

function AdminFaqFormPage() {
  const { faqId } = useParams()
  const navigate = useNavigate()

  const isEditMode = Boolean(faqId)

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    sortOrder: 1,
    status: 'ACTIVE',
  })

  const [loading, setLoading] = useState(isEditMode)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({})

  const title = useMemo(
    () => (isEditMode ? 'Cập nhật FAQ' : 'Thêm FAQ'),
    [isEditMode]
  )

  useEffect(() => {
    const fetchFaq = async () => {
      if (!isEditMode) return

      setLoading(true)
      setMessage('')

      try {
        const faq = await adminFaqApi.getFaqById(faqId)

        setFormData({
          question: faq.question || '',
          answer: faq.answer || '',
          sortOrder: faq.sortOrder ?? 1,
          status: faq.status || 'ACTIVE',
        })
      } catch (error) {
        setMessage(error.message || 'Không thể tải FAQ')
      } finally {
        setLoading(false)
      }
    }

    fetchFaq()
  }, [isEditMode, faqId])

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

    if (!formData.question.trim()) {
      nextErrors.question = 'Câu hỏi không được để trống'
    }

    if (!formData.answer.trim()) {
      nextErrors.answer = 'Câu trả lời không được để trống'
    }

    if (formData.sortOrder === '' || Number(formData.sortOrder) < 0) {
      nextErrors.sortOrder = 'Thứ tự hiển thị không hợp lệ'
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  const buildPayload = () => {
    return {
      question: formData.question.trim(),
      answer: formData.answer.trim(),
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

      if (isEditMode) {
        await adminFaqApi.updateFaq(faqId, payload)
      } else {
        await adminFaqApi.createFaq(payload)
      }

      navigate('/admin/faqs', {
        state: {
          successMessage: isEditMode
            ? 'Cập nhật FAQ thành công'
            : 'Thêm FAQ thành công',
        },
      })
    } catch (error) {
      setMessage(error.message || 'Không thể lưu FAQ')
      setErrors(error.errors || {})
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div>
        <div className="mb-5 h-20 animate-pulse rounded bg-gray-200" />
        <div className="h-[520px] animate-pulse rounded bg-gray-200" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-5 rounded-lg bg-white p-5 shadow-sm">
        <Link
          to="/admin/faqs"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
        >
          <ArrowLeft size={18} />
          Quay lại danh sách FAQ
        </Link>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900">{title}</h2>
            <p className="mt-1 text-sm text-gray-500">
              Thiết lập câu hỏi, câu trả lời, thứ tự hiển thị và trạng thái.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded bg-red-600 px-5 py-3 font-black text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={20} />
            {submitting ? 'Đang lưu...' : 'Lưu FAQ'}
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
            Thông tin FAQ
          </h3>

          <div className="grid gap-4">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Câu hỏi
              </label>

              <input
                value={formData.question}
                onChange={(event) =>
                  handleChange('question', event.target.value)
                }
                placeholder="VD: TechStore có hỗ trợ trả góp không?"
                className={
                  errors.question
                    ? 'h-11 w-full rounded border border-red-500 px-4 text-sm outline-none'
                    : 'h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500'
                }
              />

              {errors.question && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.question}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Câu trả lời
              </label>

              <textarea
                value={formData.answer}
                onChange={(event) =>
                  handleChange('answer', event.target.value)
                }
                rows="8"
                placeholder="Nhập câu trả lời chi tiết..."
                className={
                  errors.answer
                    ? 'w-full rounded border border-red-500 px-4 py-3 text-sm leading-7 outline-none'
                    : 'w-full rounded border px-4 py-3 text-sm leading-7 outline-none focus:border-red-500'
                }
              />

              {errors.answer && (
                <p className="mt-1 text-sm text-red-600">{errors.answer}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
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
                  onChange={(event) =>
                    handleChange('status', event.target.value)
                  }
                  className="h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500"
                >
                  <option value="ACTIVE">Hiển thị</option>
                  <option value="INACTIVE">Ẩn</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm xl:sticky xl:top-[88px] xl:self-start">
          <h3 className="mb-4 text-xl font-black text-gray-900">
            Xem trước
          </h3>

          <div className="rounded border bg-gray-50 p-4">
            <div className="font-black text-gray-900">
              {formData.question || 'Câu hỏi sẽ hiển thị ở đây'}
            </div>

            <div className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
              {formData.answer || 'Câu trả lời sẽ hiển thị ở đây.'}
            </div>
          </div>

          <div className="mt-4 rounded bg-gray-50 p-4 text-sm">
            <div>
              <span className="font-bold">Thứ tự:</span>{' '}
              {formData.sortOrder}
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

export default AdminFaqFormPage