import { Link } from 'react-router'
import { CalendarDays } from 'lucide-react'

function NewsCard({ news }) {
  const imageUrl =
    news.thumbnailUrl ||
    news.imageUrl ||
    'https://placehold.co/600x360?text=TechStore'

  return (
    <Link
      to={`/news/${news.slug}`}
      className="group overflow-hidden rounded-md bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="aspect-[16/9] overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={news.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
          <CalendarDays size={15} />
          {news.createdAt
            ? new Date(news.createdAt).toLocaleDateString('vi-VN')
            : 'Đang cập nhật'}
        </div>

        <h3 className="line-clamp-2 text-lg font-black text-gray-900 group-hover:text-red-600">
          {news.title}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
          {news.summary || 'Nội dung tóm tắt đang được cập nhật.'}
        </p>

        <div className="mt-4 text-sm font-bold text-red-600">
          Xem chi tiết
        </div>
      </div>
    </Link>
  )
}

export default NewsCard