import { Link } from 'react-router'

function NewsSection({ news = [] }) {
  const fallbackNews = [
    {
      id: 1,
      slug: 'cach-chon-laptop-cho-sinh-vien',
      title: 'Cách chọn laptop cho sinh viên CNTT',
      thumbnailUrl:
        'https://placehold.co/600x340/EF4444/FFFFFF?text=Tech+News',
    },
    {
      id: 2,
      slug: 'nen-mua-pc-hay-laptop',
      title: 'Nên mua PC hay laptop để học lập trình?',
      thumbnailUrl:
        'https://placehold.co/600x340/DC2626/FFFFFF?text=Tech+Guide',
    },
    {
      id: 3,
      slug: 'cach-chon-man-hinh',
      title: 'Cách chọn màn hình phù hợp cho làm việc',
      thumbnailUrl:
        'https://placehold.co/600x340/B91C1C/FFFFFF?text=Monitor+Guide',
    },
    {
      id: 4,
      slug: 'phu-kien-can-co',
      title: 'Những phụ kiện công nghệ nên có',
      thumbnailUrl:
        'https://placehold.co/600x340/991B1B/FFFFFF?text=Accessories',
    },
  ]

  const items = news.length > 0 ? news.slice(0, 4) : fallbackNews

  return (
    <section className="rounded-md bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Tin tức công nghệ
        </h2>

        <Link to="/news" className="text-sm font-medium text-blue-600">
          Xem tất cả
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/news/${item.slug}`}
            className="group"
          >
            <div className="overflow-hidden rounded border border-red-200 bg-gray-100">
              <img
                src={
                  item.thumbnailUrl ||
                  'https://placehold.co/600x340?text=TechStore+News'
                }
                alt={item.title}
                className="h-[150px] w-full object-cover transition group-hover:scale-105"
              />
            </div>

            <h3 className="mt-2 line-clamp-2 font-semibold text-gray-900 group-hover:text-red-600">
              {item.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default NewsSection