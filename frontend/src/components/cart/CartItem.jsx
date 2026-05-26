import { Link } from 'react-router'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'

function CartItem({ item, onUpdateQuantity, onRemove, updating }) {
  const cartItemId = item.cartItemId || item.id

  const productName = item.productName || item.name || 'Sản phẩm'

  const productSlug =
    item.productSlug ||
    item.slug ||
    item.product?.slug ||
    item.product?.productSlug ||
    ''

  const productDetailUrl = productSlug ? `/products/${productSlug}` : '/products'

  const available = item.available !== false
  const unavailableReason =
    item.unavailableReason || 'Sản phẩm hiện không thể mua'

  const variantName = item.variantName || item.productVariantName
  const productSku = item.productSku || item.sku

  const imageUrl =
    item.thumbnailUrl ||
    item.imageUrl ||
    item.productImage ||
    item.productThumbnailUrl ||
    'https://placehold.co/300x300?text=TechStore'

  const originalPrice = Number(
    item.price || item.originalPrice || item.unitPrice || 0
  )

  const salePrice = Number(item.salePrice || 0)

  const finalPrice =
    salePrice > 0 && salePrice < originalPrice ? salePrice : originalPrice

  const quantity = Number(item.quantity || 1)
  const totalPrice = Number(item.totalPrice || finalPrice * quantity)

  const decreaseQuantity = () => {
    if (quantity <= 1 || updating || !available) {
      return
    }

    onUpdateQuantity(cartItemId, quantity - 1)
  }

  const increaseQuantity = () => {
    if (updating || !available) {
      return
    }

    onUpdateQuantity(cartItemId, quantity + 1)
  }

  const handleQuantityChange = (event) => {
    const value = Number(event.target.value)

    if (!value || value < 1 || updating || !available) {
      return
    }

    onUpdateQuantity(cartItemId, value)
  }

  return (
    <div
      className={
        available
          ? 'rounded-md bg-white p-4 shadow-sm'
          : 'rounded-md bg-white p-4 opacity-75 shadow-sm'
      }
    >
      <div className="grid gap-4 md:grid-cols-[120px_minmax(0,1fr)_180px_140px_40px] md:items-center">
        <Link
          to={productDetailUrl}
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
            to={productDetailUrl}
            className={
              available
                ? 'line-clamp-2 font-bold text-red-600 hover:underline'
                : 'line-clamp-2 font-bold text-gray-500 hover:underline'
            }
          >
            {productName}
          </Link>

          {variantName && (
            <p className="mt-1 text-sm text-gray-500">
              Phiên bản:{' '}
              <span className="font-semibold">{variantName}</span>
            </p>
          )}

          {productSku && (
            <p className="mt-1 text-sm text-gray-500">
              SKU: <span className="font-semibold">{productSku}</span>
            </p>
          )}

          {!available && (
            <div className="mt-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-600">
              {unavailableReason}
            </div>
          )}

          <div className="mt-3 md:hidden">
            {salePrice > 0 && salePrice < originalPrice && (
              <div className="text-sm text-gray-400 line-through">
                {formatCurrency(originalPrice)}
              </div>
            )}

            <div
              className={
                available
                  ? 'text-lg font-black text-red-600'
                  : 'text-lg font-black text-gray-400'
              }
            >
              {formatCurrency(finalPrice)}
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          {salePrice > 0 && salePrice < originalPrice && (
            <div className="text-sm text-gray-400 line-through">
              {formatCurrency(originalPrice)}
            </div>
          )}

          <div
            className={
              available
                ? 'text-lg font-black text-red-600'
                : 'text-lg font-black text-gray-400'
            }
          >
            {formatCurrency(finalPrice)}
          </div>
        </div>

        <div>
          <div className="flex w-max items-center overflow-hidden rounded border">
            <button
              type="button"
              onClick={decreaseQuantity}
              disabled={updating || quantity <= 1 || !available}
              className="flex h-9 w-9 items-center justify-center hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Minus size={16} />
            </button>

            <input
              value={quantity}
              onChange={handleQuantityChange}
              type="number"
              min="1"
              disabled={updating || !available}
              className="h-9 w-14 border-x text-center text-sm outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-70"
            />

            <button
              type="button"
              onClick={increaseQuantity}
              disabled={updating || !available}
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