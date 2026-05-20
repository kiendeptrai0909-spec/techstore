import { formatCurrency } from '../../utils/formatCurrency'

function ProductVariantSelector({
  variants = [],
  selectedVariant,
  onSelectVariant,
}) {
  if (!variants || variants.length === 0) {
    return null
  }

  const getVariantPrice = (variant) => {
    return variant.salePrice || variant.price || 0
  }

  return (
    <div>
      <h3 className="mb-3 font-bold text-gray-900">Phiên bản</h3>

      <div className="grid gap-3 sm:grid-cols-2">
        {variants.map((variant) => {
          const active = selectedVariant?.id === variant.id
          const price = getVariantPrice(variant)

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => onSelectVariant(variant)}
              className={
                active
                  ? 'rounded-md border-2 border-red-600 bg-red-50 p-3 text-left'
                  : 'rounded-md border bg-white p-3 text-left hover:border-red-500'
              }
            >
              <div className="line-clamp-2 text-sm font-bold text-gray-900">
                {variant.name || variant.sku || `Phiên bản #${variant.id}`}
              </div>

              <div className="mt-1 text-sm font-black text-red-600">
                {price ? formatCurrency(price) : 'Liên hệ'}
              </div>

              <div className="mt-1 text-xs text-gray-500">
                SKU: {variant.sku || 'Đang cập nhật'}
              </div>

              <div className="mt-1 text-xs text-gray-500">
                Tồn kho: {variant.stock ?? 0}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ProductVariantSelector