import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import StarRatingInput from './StarRatingInput'

function ReviewModal({ open, product, onClose, onSubmit, submitting }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setRating(5)
      setComment('')
      setError('')
    }
  }, [open])

  if (!open) {
    return null
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!rating || rating < 1 || rating > 5) {
      setError('Vui lòng chọn số sao từ 1 đến 5')
      return
    }

    if (!comment.trim()) {
      setError('Vui lòng nhập nội dung đánh giá')
      return
    }

    setError('')

    await onSubmit({
      rating,
      comment: comment.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-xl font-black text-gray-900">
            Đánh giá sản phẩm
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="flex gap-3 rounded bg-gray-50 p-3">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded border bg-white">
              <img
                src={
                  product?.thumbnailUrl ||
                  product?.imageUrl ||
                  product?.productImage ||
                  'https://placehold.co/120x120?text=TechStore'
                }
                alt={product?.productName || product?.name || 'Sản phẩm'}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="min-w-0">
              <div className="line-clamp-2 font-bold text-gray-900">
                {product?.productName || product?.name || 'Sản phẩm'}
              </div>

              {(product?.variantName || product?.productVariantName || product?.sku) && (
                <div className="mt-1 text-sm text-gray-500">
                  Phiên bản:{' '}
                  {product.variantName || product.productVariantName || product.sku}
                </div>
              )}
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-3 block font-bold text-gray-900">
              Bạn đánh giá sản phẩm này thế nào?
            </label>

            <StarRatingInput
              value={rating}
              onChange={setRating}
              disabled={submitting}
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block font-bold text-gray-900">
              Nội dung đánh giá
            </label>

            <textarea
              value={comment}
              onChange={(event) => {
                setComment(event.target.value)
                setError('')
              }}
              disabled={submitting}
              rows="5"
              placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
              className="w-full rounded border px-4 py-3 text-sm outline-none focus:border-red-500 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </div>

          {error && (
            <div className="mt-3 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded border px-5 py-3 font-bold text-gray-700 hover:border-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
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