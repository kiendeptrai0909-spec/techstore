import { Minus, Plus, ShieldCheck, ShoppingCart, Truck } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'
import ProductVariantSelector from './ProductVariantSelector'

function ProductInfoBox({
  product,
  selectedVariant,
  onSelectVariant,
  quantity,
  setQuantity,
  onAddToCart,
  addingToCart,
}) {
  const price = selectedVariant?.price || product?.price || 0
  const salePrice = selectedVariant?.salePrice || product?.salePrice || price
  const hasDiscount = price && salePrice && salePrice < price

  const discountPercent = hasDiscount
    ? Math.round(((price - salePrice) / price) * 100)
    : 0

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  const stock = selectedVariant?.stock ?? product?.stock ?? 0

  return (
    <div className="rounded-md bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-black text-gray-900 md:text-3xl">
        {product.name}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
        <span>
          Thương hiệu:{' '}
          <strong className="text-gray-900">
            {product.brand?.name || 'Đang cập nhật'}
          </strong>
        </span>

        <span className="h-4 w-px bg-gray-300" />

        <span>
          Danh mục:{' '}
          <strong className="text-gray-900">
            {product.category?.name || 'Đang cập nhật'}
          </strong>
        </span>

        <span className="h-4 w-px bg-gray-300" />

        <span>
          Mã SP:{' '}
          <strong className="text-gray-900">
            {selectedVariant?.sku || product.sku || product.id}
          </strong>
        </span>
      </div>

      <div className="mt-5 rounded-md bg-gray-50 p-4">
        {hasDiscount && (
          <div className="mb-1 flex items-center gap-2">
            <span className="text-gray-400 line-through">
              {formatCurrency(price)}
            </span>

            <span className="rounded border border-red-500 px-2 py-0.5 text-xs font-bold text-red-600">
              -{discountPercent}%
            </span>
          </div>
        )}

        <div className="text-3xl font-black text-red-600">
          {salePrice ? formatCurrency(salePrice) : 'Liên hệ'}
        </div>

        <div className="mt-2 text-sm text-gray-500">
          Tình trạng:{' '}
          {stock > 0 ? (
            <span className="font-bold text-green-600">Còn hàng</span>
          ) : (
            <span className="font-bold text-red-600">Hết hàng</span>
          )}
        </div>
      </div>

      <div className="mt-5">
        <ProductVariantSelector
          variants={product.variants || []}
          selectedVariant={selectedVariant}
          onSelectVariant={onSelectVariant}
        />
      </div>

      <div className="mt-5">
        <h3 className="mb-3 font-bold text-gray-900">Số lượng</h3>

        <div className="flex w-max items-center overflow-hidden rounded border">
          <button
            type="button"
            onClick={decreaseQuantity}
            className="flex h-10 w-10 items-center justify-center hover:bg-gray-100"
          >
            <Minus size={18} />
          </button>

          <input
            value={quantity}
            onChange={(event) => {
              const value = Number(event.target.value)
              setQuantity(value > 0 ? value : 1)
            }}
            type="number"
            min="1"
            className="h-10 w-16 border-x text-center outline-none"
          />

          <button
            type="button"
            onClick={increaseQuantity}
            className="flex h-10 w-10 items-center justify-center hover:bg-gray-100"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onAddToCart}
          disabled={addingToCart || stock <= 0}
          className="flex items-center justify-center gap-2 rounded-md bg-red-600 px-5 py-3 font-black text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ShoppingCart size={20} />
          {addingToCart ? 'Đang thêm...' : 'Thêm vào giỏ'}
        </button>

        <button
          type="button"
          disabled={stock <= 0}
          className="rounded-md bg-blue-600 px-5 py-3 font-black text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Mua ngay
        </button>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
        <div className="flex items-center gap-2 rounded border p-3">
          <Truck size={20} className="text-red-600" />
          Giao hàng toàn quốc
        </div>

        <div className="flex items-center gap-2 rounded border p-3">
          <ShieldCheck size={20} className="text-red-600" />
          Bảo hành chính hãng
        </div>
      </div>
    </div>
  )
}

export default ProductInfoBox