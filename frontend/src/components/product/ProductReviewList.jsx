import { Star } from 'lucide-react'

function ProductReviewList({ reviews = [], loading, onWriteReview }) {
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
        reviews.length
      : 0

  return (
    <div className="rounded-md bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900">
            Đánh giá sản phẩm
          </h2>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-2xl font-black text-orange-500">
              {averageRating.toFixed(1)}
            </span>

            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={18}
                  fill={index < Math.round(averageRating) ? 'orange' : 'none'}
                  className={
                    index < Math.round(averageRating)
                      ? 'text-orange-500'
                      : 'text-gray-300'
                  }
                />
              ))}
            </div>

            <span className="text-sm text-gray-500">
              ({reviews.length} đánh giá)
            </span>
          </div>
        </div>

        {onWriteReview && (
          <button
            type="button"
            onClick={onWriteReview}
            className="rounded bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
          >
            Viết đánh giá
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded bg-gray-100"
            />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded border border-dashed p-8 text-center text-gray-500">
          Chưa có đánh giá nào cho sản phẩm này.
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="rounded border p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-gray-900">
                    {review.user?.fullName ||
                      review.userFullName ||
                      review.fullName ||
                      'Khách hàng'}
                  </div>

                  <div className="mt-1 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        size={16}
                        fill={index < review.rating ? 'orange' : 'none'}
                        className={
                          index < review.rating
                            ? 'text-orange-500'
                            : 'text-gray-300'
                        }
                      />
                    ))}
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  {review.createdAt
                    ? new Date(review.createdAt).toLocaleDateString('vi-VN')
                    : ''}
                </div>
              </div>

              <p className="mt-3 leading-6 text-gray-700">
                {review.comment || review.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductReviewList