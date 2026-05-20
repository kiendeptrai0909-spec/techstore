import { Link } from 'react-router'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'

function CartItem({ item, onUpdateQuantity, onRemove, updating }) {
  const cartItemId = item.cartItemId || item.id

  const productName = item.productName || item.name || 'Sản phẩm'
  const productSlug = item.productSlug || item.slug
  const variantName = item.variantName || item.productVariantName || item.sku
  const productSku = item.productSku || item.sku

  const imageUrl =
    item.thumbnailUrl ||
    item.imageUrl ||
    item.productImage ||
    'https://placehold.co/300x300?text=TechStore'

  const price = item.price || item.unitPrice || item.salePrice || 0
  const quantity = item.quantity || 1
  const totalPrice = item.totalPrice || price * quantity

  const decreaseQuantity = () => {
    if (quantity <= 1) {
      return
    }

    onUpdateQuantity(cartItemId, quantity - 1)
  }

  const increaseQuantity = () => {
    onUpdateQuantity(cartItemId, quantity + 1)
  }

  return (
    <div className="rounded-md bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-[120px_minmax(0,1fr)_180px_140px_40px] md:items-center">
        <Link
          to={productSlug ? `/products/${productSlug}` : '/products'}
          className="flex h-[120px] w-[120px] items-center justify-center overflow-hidden rounded border bg-white"
        >
          <img
            src={imageUrl}
            alt={productName}
            className="max-h-full max-w-full object-contain"
          />
        </Link>

        <div>
          <Link
            to={productSlug ? `/products/${productSlug}` : '/products'}
            className="line-clamp-2 font-bold text-gray-900 hover:text-red-600"
          >
            {productName}
          </Link>

          {variantName && (
            <p className="mt-1 text-sm text-gray-500">
              Phiên bản: <span className="font-semibold">{variantName}</span>
            </p>
          )}

          {productSku && (
            <p className="mt-1 text-sm text-gray-500">
              SKU: <span className="font-semibold">{productSku}</span>
            </p>
          )}

          <p className="mt-3 text-lg font-black text-red-600 md:hidden">
            {formatCurrency(price)}
          </p>
        </div>

        <div className="hidden text-lg font-black text-red-600 md:block">
          {formatCurrency(price)}
        </div>

        <div>
          <div className="flex w-max items-center overflow-hidden rounded border">
            <button
              type="button"
              onClick={decreaseQuantity}
              disabled={updating || quantity <= 1}
              className="flex h-9 w-9 items-center justify-center hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Minus size={16} />
            </button>

            <input
              value={quantity}
              onChange={(event) => {
                const value = Number(event.target.value)

                if (value > 0) {
                  onUpdateQuantity(cartItemId, value)
                }
              }}
              type="number"
              min="1"
              disabled={updating}
              className="h-9 w-14 border-x text-center text-sm outline-none"
            />

            <button
              type="button"
              onClick={increaseQuantity}
              disabled={updating}
              className="flex h-9 w-9 items-center justify-center hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={16} />
            </button>
          </div>

          <p className="mt-2 text-sm font-semibold text-gray-700">
            Tổng: {formatCurrency(totalPrice)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onRemove(cartItemId)}
          disabled={updating}
          className="flex h-10 w-10 items-center justify-center rounded border text-gray-500 hover:border-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          title="Xóa sản phẩm"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  )
}

export default CartItem