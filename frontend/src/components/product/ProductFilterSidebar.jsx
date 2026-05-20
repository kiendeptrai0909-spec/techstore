function ProductFilterSidebar({
  categories = [],
  brands = [],
  filters,
  setFilters,
  onSubmit,
  onReset,
}) {
  const handleChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const pricePresets = [
    {
      label: 'Dưới 10 triệu',
      minPrice: '',
      maxPrice: '10000000',
    },
    {
      label: '10 - 20 triệu',
      minPrice: '10000000',
      maxPrice: '20000000',
    },
    {
      label: '20 - 30 triệu',
      minPrice: '20000000',
      maxPrice: '30000000',
    },
    {
      label: 'Trên 30 triệu',
      minPrice: '30000000',
      maxPrice: '',
    },
  ]

  return (
    <aside className="rounded-md bg-white p-4 shadow-sm">
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <h3 className="mb-3 text-lg font-bold">Bộ lọc sản phẩm</h3>

          <input
            value={filters.keyword}
            onChange={(event) => handleChange('keyword', event.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full rounded border px-3 py-2 text-sm outline-none focus:border-red-500"
          />
        </div>

        <div>
          <h4 className="mb-2 font-semibold">Danh mục</h4>

          <select
            value={filters.categoryId}
            onChange={(event) => handleChange('categoryId', event.target.value)}
            className="w-full rounded border px-3 py-2 text-sm outline-none focus:border-red-500"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h4 className="mb-2 font-semibold">Thương hiệu</h4>

          <select
            value={filters.brandId}
            onChange={(event) => handleChange('brandId', event.target.value)}
            className="w-full rounded border px-3 py-2 text-sm outline-none focus:border-red-500"
          >
            <option value="">Tất cả thương hiệu</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h4 className="mb-2 font-semibold">Khoảng giá</h4>

          <div className="grid grid-cols-2 gap-2">
            <input
              value={filters.minPrice}
              onChange={(event) => handleChange('minPrice', event.target.value)}
              type="number"
              placeholder="Từ"
              className="rounded border px-3 py-2 text-sm outline-none focus:border-red-500"
            />

            <input
              value={filters.maxPrice}
              onChange={(event) => handleChange('maxPrice', event.target.value)}
              type="number"
              placeholder="Đến"
              className="rounded border px-3 py-2 text-sm outline-none focus:border-red-500"
            />
          </div>

          <div className="mt-3 grid gap-2">
            {pricePresets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setFilters((prev) => ({
                    ...prev,
                    minPrice: preset.minPrice,
                    maxPrice: preset.maxPrice,
                  }))
                }}
                className="rounded border px-3 py-2 text-left text-sm hover:border-red-500 hover:text-red-600"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="submit"
            className="rounded bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
          >
            Lọc
          </button>

          <button
            type="button"
            onClick={onReset}
            className="rounded border px-4 py-2 text-sm font-bold hover:border-red-500 hover:text-red-600"
          >
            Xóa lọc
          </button>
        </div>
      </form>
    </aside>
  )
}

export default ProductFilterSidebar