import {
  ChevronRight,
  Laptop,
  Monitor,
  Cpu,
  HardDrive,
  Keyboard,
  Mouse,
  Headphones,
  Gamepad2,
  Armchair,
  Server,
  Package,
  Cable,
  MemoryStick,
} from 'lucide-react'
import { Link } from 'react-router'

const fallbackCategories = [
  { id: 1, name: 'Laptop', icon: Laptop },
  { id: 2, name: 'Laptop Gaming', icon: Laptop },
  { id: 3, name: 'PC TechStore', icon: Server },
  { id: 4, name: 'Main, CPU, VGA', icon: Cpu },
  { id: 5, name: 'Case, Nguồn, Tản', icon: Package },
  { id: 6, name: 'Ổ cứng, RAM, Thẻ nhớ', icon: MemoryStick },
  { id: 7, name: 'Loa, Micro, Webcam', icon: Headphones },
  { id: 8, name: 'Màn hình', icon: Monitor },
  { id: 9, name: 'Bàn phím', icon: Keyboard },
  { id: 10, name: 'Chuột + Lót chuột', icon: Mouse },
  { id: 11, name: 'Tai nghe', icon: Headphones },
  { id: 12, name: 'Ghế - Bàn', icon: Armchair },
  { id: 13, name: 'Handheld, Console', icon: Gamepad2 },
  { id: 14, name: 'Phụ kiện', icon: Cable },
  { id: 15, name: 'Dịch vụ và thông tin khác', icon: HardDrive },
]

function CategorySidebar({ categories = [] }) {
  const items =
    categories.length > 0
      ? categories.map((category, index) => ({
          ...category,
          icon: fallbackCategories[index % fallbackCategories.length].icon,
        }))
      : fallbackCategories

  return (
    <div className="h-full overflow-hidden rounded-md bg-white shadow-sm">
      <ul className="divide-y divide-gray-100">
        {items.slice(0, 15).map((category) => {
          const Icon = category.icon || Laptop

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