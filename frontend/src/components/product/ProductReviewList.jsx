import { Star } from 'lucide-react'

function ProductReviewList({ reviews = [], loading }) {
  return (
    <div className="rounded-md bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-black text-gray-900">
          Đánh giá sản phẩm
        </h2>

        <button className="rounded bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700">
          Viết đánh giá
        </button>
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