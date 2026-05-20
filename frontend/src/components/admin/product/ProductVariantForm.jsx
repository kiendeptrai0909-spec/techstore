import { Plus, Trash2 } from 'lucide-react'

function ProductVariantForm({ variants, setVariants }) {
  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        name: '',
        sku: '',
        price: '',
        salePrice: '',
        stock: '',
        thumbnailUrl: '',
      },
    ])
  }

  const handleRemoveVariant = (index) => {
    setVariants((prev) => prev.filter((_, itemIndex) => itemIndex !== index))
  }

  const handleChangeVariant = (index, field, value) => {
    setVariants((prev) =>
      prev.map((variant, itemIndex) =>
        itemIndex === index
          ? {
              ...variant,
              [field]: value,
            }
          : variant
      )
    )
  }

  return (
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900">
            Biến thể sản phẩm
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Thêm SKU, giá, tồn kho và ảnh đại diện cho từng biến thể.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddVariant}
          className="inline-flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
        >
          <Plus size={18} />
          Thêm biến thể
        </button>
      </div>

      {variants.length === 0 ? (
        <div className="rounded border border-dashed p-8 text-center text-gray-500">
          Chưa có biến thể. Hãy thêm ít nhất một biến thể để bán sản phẩm.
        </div>
      ) : (
        <div className="space-y-4">
          {variants.map((variant, index) => (
            <div key={index} className="rounded border bg-gray-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-black text-gray-900">
                  Biến thể #{index + 1}
                </h3>

                <button
                  type="button"
                  onClick={() => handleRemoveVariant(index)}
                  className="inline-flex items-center gap-2 rounded border bg-white px-3 py-2 text-sm font-bold text-gray-700 hover:border-red-500 hover:text-red-600"
                >
                  <Trash2 size={16} />
                  Xóa
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <FormField
                  label="Tên biến thể"
                  value={variant.name}
                  onChange={(value) =>
                    handleChangeVariant(index, 'name', value)
                  }
                  placeholder="VD: 16GB / 512GB / Black"
                />

                <FormField
                  label="SKU"
                  value={variant.sku}
                  onChange={(value) =>
                    handleChangeVariant(index, 'sku', value)
                  }
                  placeholder="VD: IP16-128-BLK"
                />

                <FormField
                  label="Giá gốc"
                  type="number"
                  value={variant.price}
                  onChange={(value) =>
                    handleChangeVariant(index, 'price', value)
                  }
                  placeholder="VD: 20000000"
                />

                <FormField
                  label="Giá khuyến mãi"
                  type="number"
                  value={variant.salePrice}
                  onChange={(value) =>
                    handleChangeVariant(index, 'salePrice', value)
                  }
                  placeholder="VD: 18990000"
                />

                <FormField
                  label="Tồn kho"
                  type="number"
                  value={variant.stock}
                  onChange={(value) =>
                    handleChangeVariant(index, 'stock', value)
                  }
                  placeholder="VD: 20"
                />

                <FormField
                  label="Ảnh biến thể"
                  value={variant.thumbnailUrl}
                  onChange={(value) =>
                    handleChangeVariant(index, 'thumbnailUrl', value)
                  }
                  placeholder="https://..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function FormField({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded border bg-white px-4 text-sm outline-none focus:border-red-500"
      />
    </div>
  )
}

export default ProductVariantForm