import { Link } from 'react-router'

function PromotionSection({ banners = [] }) {
  const fallbackPromotions = [
    {
      id: 1,
      title: 'Nâng cấp PC',
      imageUrl:
        'https://placehold.co/600x260/00AEEF/FFFFFF?text=Nang+cap+PC',
      linkUrl: '/products',
    },
    {
      id: 2,
      title: 'Microsoft 365',
      imageUrl:
        'https://placehold.co/600x260/222222/FFFFFF?text=Microsoft+365',
      linkUrl: '/products',
    },
    {
      id: 3,
      title: 'Gaming Gear',
      imageUrl:
        'https://placehold.co/600x260/111827/FFFFFF?text=Gaming+Gear',
      linkUrl: '/products',
    },
    {
      id: 4,
      title: 'Laptop Sale',
      imageUrl:
        'https://placehold.co/600x260/0EA5E9/FFFFFF?text=Laptop+Sale',
      linkUrl: '/products',
    },
  ]

  const promotions = banners.length > 0 ? banners.slice(0, 4) : fallbackPromotions

  return (
    <section className="rounded-md bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Chuyên trang khuyến mãi
        </h2>

        <Link to="/products" className="text-sm font-medium text-blue-600">
          Xem tất cả
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {promotions.map((banner) => (
          <Link
            key={banner.id}
            to={banner.linkUrl || '/products'}
            className="overflow-hidden rounded bg-gray-100"
          >
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="h-[130px] w-full object-cover transition hover:scale-105"
            />
          </Link>
        ))}
      </div>
    </section>
  )
}

export default PromotionSection