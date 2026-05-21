import { useState } from 'react'
import { X } from 'lucide-react'
import { reviewApi } from '../../api/reviewApi'
import StarRatingInput from './StarRatingInput'

function ReviewModal({ open, item, onClose, onSubmitted }) {
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  if (!open || !item) {
    return null
  }

  const productId = item.productId
  const orderItemId = item.orderItemId || item.id

  const productName = item.productName || 'Sản phẩm'
  const variantName = item.variantName || item.productVariantName
  const imageUrl =
    item.thumbnailUrl ||
    item.imageUrl ||
    item.productImage ||
    'https://placehold.co/300x300?text=TechStore'

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!productId) {
      setMessage('Không tìm thấy mã sản phẩm')
      return
    }

    if (!orderItemId) {
      setMessage('Không tìm thấy mã chi tiết đơn hàng')
      return
    }

    if (!rating) {
      setMessage('Vui lòng chọn số sao đánh giá')
      return
    }

    if (!content.trim()) {
      setMessage('Vui lòng nhập nội dung đánh giá')
      return
    }

    setSubmitting(true)
    setMessage('')

    try {
      await reviewApi.createReview(productId, {
  orderItemId,
  rating,
  content: content.trim(),
  comment: content.trim(),
})

      setContent('')
      setRating(5)
      onSubmitted?.()
      onClose?.()
    } catch (error) {
      setMessage(error.message || 'Không thể gửi đánh giá')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-xl overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-xl font-black text-gray-900">
            Đánh giá sản phẩm
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-red-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="flex gap-4 rounded bg-gray-50 p-3">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded border bg-white">
              <img
                src={imageUrl}
                alt={productName}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div>
              <h3 className="line-clamp-2 font-black text-gray-900">
                {productName}
              </h3>

              {variantName && (
                <p className="mt-1 text-sm text-gray-500">
                  Phiên bản: {variantName}
                </p>
              )}
            </div>
          </div>

          {message && (
            <div className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {message}
            </div>
          )}

          <div className="mt-5">
            <label className="mb-2 block font-bold text-gray-900">
              Bạn đánh giá sản phẩm này thế nào?
            </label>

            <StarRatingInput value={rating} onChange={setRating} />
          </div>

          <div className="mt-5">
            <label className="mb-2 block font-bold text-gray-900">
              Nội dung đánh giá
            </label>

            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={5}
              placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
              className="w-full rounded border px-4 py-3 text-sm outline-none focus:border-red-500"
            />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded border px-5 py-3 font-black text-gray-700 hover:border-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded bg-red-600 px-5 py-3 font-black text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReviewModal