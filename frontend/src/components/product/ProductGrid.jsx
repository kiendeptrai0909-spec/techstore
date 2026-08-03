import ProductCard from '../home/ProductCard'

function ProductGrid({ products = [], loading }) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, index) => (//hiển thị trạng thái loading
          <div
            key={index}
            className="h-[370px] animate-pulse rounded bg-gray-200"
          />
        ))}
      </div>
    )
  }

  if (products.length === 0) {//kiểm tra mảng có rỗng không
    return (
      <div className="rounded-md bg-white p-10 text-center shadow-sm">
        <h3 className="text-xl font-bold text-gray-800">
          Không tìm thấy sản phẩm
        </h3>
        <p className="mt-2 text-gray-500">
          Vui lòng thử từ khóa hoặc bộ lọc khác.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid