import { Link } from 'react-router'
import { getCategoryIcon } from '../../utils/categoryIcons'

function CategoryIconGrid({ categories = [] }) {
  const items = categories.length > 0 ? categories.slice(0, 16) : []

  return (
    <section className="rounded-md bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">
        Danh mục sản phẩm
      </h2>

      <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 lg:grid-cols-8">
        {items.map((category, index) => {
          const Icon = getCategoryIcon(category.imageUrl)

          return (
            <Link
              key={category.id}
              to={`/products?categoryId=${category.id}`}
              className="group flex flex-col items-center gap-2 rounded p-3 text-center hover:bg-red-50"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded bg-gray-100 text-gray-700 group-hover:bg-red-100 group-hover:text-red-600">
                <Icon size={28} />
              </div>

              <span className="line-clamp-1 text-sm font-medium text-gray-800">
                {category.name}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default CategoryIconGrid