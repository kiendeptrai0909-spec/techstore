import { Link } from 'react-router'
import { getCategoryIcon } from '../../utils/categoryIcons'
import { ChevronRight } from 'lucide-react'
function CategorySidebar({ categories = [] }) {
  const items = categories.length > 0 ? categories : []

  return (
    <div className="h-full overflow-hidden rounded-md bg-white shadow-sm">
      <ul className="divide-y divide-gray-100">
        {items.slice(0, 15).map((category) => {
          const Icon = getCategoryIcon(category.imageUrl)

          return (
            <li key={category.id}>
              <Link
                to={`/products?categoryId=${category.id}`}
                className="flex items-center justify-between px-3 py-[9px] text-sm font-medium text-gray-800 hover:bg-red-50 hover:text-red-600"
              >
                <span className="flex items-center gap-3">
                  <Icon size={18} />
                  <span className="line-clamp-1">{category.name}</span>
                </span>

                <ChevronRight size={16} />
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default CategorySidebar