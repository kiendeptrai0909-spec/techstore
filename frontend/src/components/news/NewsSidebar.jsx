import { Link } from 'react-router'
import { Newspaper } from 'lucide-react'

function NewsSidebar({ news = [], currentSlug }) {
  const latestNews = news
    .filter((item) => item.slug !== currentSlug)
    .slice(0, 5)

  return (
    <aside className="rounded-md bg-white p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-xl font-black text-gray-900">
        <Newspaper size={22} className="text-red-600" />
        Tin mới nhất
      </h2>

      {latestNews.length === 0 ? (
        <div className="mt-4 rounded border border-dashed p-5 text-center text-sm text-gray-500">
          Chưa có bài viết mới.
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {latestNews.map((item) => {
            const imageUrl =
              item.thumbnailUrl ||
              item.imageUrl ||
              'https://placehold.co/200x120?text=TechStore'

            return (
              <Link
                key={item.id || item.slug}
                to={`/news/${item.slug}`}
                className="group flex gap-3 border-b pb-4 last:border-b-0 last:pb-0"
              >
                <div className="h-20 w-28 shrink-0 overflow-hidden rounded border bg-gray-100">
                  <img
                    src={imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="line-clamp-2 text-sm font-bold text-gray-900 group-hover:text-red-600">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString('vi-VN')
                      : 'Đang cập nhật'}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </aside>
  )
}

export default NewsSidebar