import {
  Laptop,
  Monitor,
  Cpu,
  HardDrive,
  Keyboard,
  Mouse,
  Headphones,
  Speaker,
  Gamepad2,
  Armchair,
  MemoryStick,
  Fan,
  Server,
  Cable,
  BatteryCharging,
  Package,
} from 'lucide-react'
import { Link } from 'react-router'

const icons = [
  Laptop,
  Server,
  Monitor,
  Cpu,
  MemoryStick,
  HardDrive,
  Package,
  Fan,
  BatteryCharging,
  Keyboard,
  Mouse,
  Armchair,
  Headphones,
  Speaker,
  Gamepad2,
  Cable,
]

const fallbackCategories = [
  'Laptop',
  'PC',
  'Màn hình',
  'Mainboard',
  'CPU',
  'VGA',
  'RAM',
  'Ổ cứng',
  'Case',
  'Tản nhiệt',
  'Nguồn',
  'Bàn phím',
  'Chuột',
  'Ghế',
  'Tai nghe',
  'Phụ kiện',
]

function CategoryIconGrid({ categories = [] }) {
  const items =
    categories.length > 0
      ? categories.slice(0, 16)
      : fallbackCategories.map((name, index) => ({
          id: index + 1,
          name,
        }))

  return (
    <section className="rounded-md bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">
        Danh mục sản phẩm
      </h2>

      <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 lg:grid-cols-8">
        {items.map((category, index) => {
          const Icon = icons[index % icons.length]

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