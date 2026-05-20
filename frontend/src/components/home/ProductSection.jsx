import { Truck } from 'lucide-react'
import { Link } from 'react-router'
import ProductCard from './ProductCard'

function ProductSection({
  title,
  products = [],
  tabs = [],
  viewAllUrl = '/products',
}) {
  return (
    <section className="rounded-md bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center gap-4 border-b pb-3">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>

        <div className="hidden h-6 w-px bg-gray-300 md:block" />

        <div className="flex items-center gap-2 font-semibold text-gray-800">
          <Truck size={19} className="text-red-600" />
          <span>Miễn phí giao hàng</span>
        </div>

        <div className="ml-auto hidden flex-wrap items-center gap-6 text-sm font-medium text-gray-700 lg:flex">
          {tabs.map((tab) => (
            <Link
              key={tab.label}
              to={tab.url}
              className="hover:text-red-600"
            >
              {tab.label}
            </Link>
          ))}

          <Link to={viewAllUrl} className="text-blue-600 hover:underline">
            Xem tất cả
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="rounded border border-dashed p-8 text-center text-gray-500">
          Chưa có sản phẩm.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {products.slice(0, 5).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}

export default ProductSection