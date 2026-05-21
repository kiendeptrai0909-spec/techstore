import { Star } from 'lucide-react'

function ProductReviewList({ reviews = [], loading, onWriteReview }) {
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
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
                  className={
                    index < Math.round(averageRating)
                      ? 'fill-orange-400 text-orange-400'
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
          {reviews.map((review, reviewIndex) => {
            const reviewerName =
              review.user?.fullName ||
              review.userFullName ||
              review.fullName ||
              review.customerName ||
              review.createdBy ||
              'Khách hàng'

            const rating = Number(review.rating || 0)

            const reviewContent =
              review.content ||
              review.comment ||
              review.reviewContent ||
              review.description ||
              review.message ||
              ''

            const createdAt = review.createdAt
              ? new Date(review.createdAt).toLocaleDateString('vi-VN')
              : ''

            return (
              <div
                key={review.id || reviewIndex}
                className="rounded border p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold text-gray-900">
                      {reviewerName}
                    </div>

                    <div className="mt-1 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          size={16}
                          className={
                            index < rating
                              ? 'fill-orange-400 text-orange-400'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                    </div>
                  </div>

                  {createdAt && (
                    <div className="text-sm text-gray-500">
                      {createdAt}
                    </div>
                  )}
                </div>

                {reviewContent ? (
                  <p className="mt-3 whitespace-pre-line leading-6 text-gray-700">
                    {reviewContent}
                  </p>
                ) : (
                  <p className="mt-3 italic leading-6 text-gray-400">
                    Người dùng chưa nhập nội dung đánh giá.
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ProductReviewList