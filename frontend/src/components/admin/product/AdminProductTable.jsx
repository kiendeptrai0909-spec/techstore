import { Link } from 'react-router'
import { Edit, Eye, Trash2 } from 'lucide-react'
import { formatCurrency } from '../../../utils/formatCurrency'

function AdminProductTable({ products = [], loading, onDelete, isStaff = false }) {
  if (loading) {
    return (
      <div className="rounded-lg bg-white p-5 shadow-sm">
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded bg-gray-100"
            />
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="rounded-lg bg-white p-10 text-center shadow-sm">
        <h3 className="text-xl font-black text-gray-900">
          Không có sản phẩm
        </h3>
        <p className="mt-2 text-gray-500">
          Chưa tìm thấy sản phẩm phù hợp với bộ lọc.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse text-left">
          <thead>
            <tr className="border-b bg-gray-50 text-sm text-gray-600">
              <th className="px-4 py-3 font-bold">Sản phẩm</th>
              <th className="px-4 py-3 font-bold">Danh mục</th>
              <th className="px-4 py-3 font-bold">Thương hiệu</th>
              <th className="px-4 py-3 font-bold">Giá</th>
              <th className="px-4 py-3 font-bold">Tồn kho</th>
              <th className="w-32 px-4 py-3 font-bold">Trạng thái</th>
              <th className="px-4 py-3 text-center font-bold">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => {
              const firstVariant = product.variants?.[0]
              const price =
                firstVariant?.salePrice ||
                firstVariant?.price ||
                product.salePrice ||
                product.price ||
                0

              const totalStock =
                product.variants?.reduce(
                  (sum, variant) => sum + (variant.stock || 0),
                  0
                ) || firstVariant?.stock || 0

              const imageUrl =
                firstVariant?.thumbnailUrl ||
                product.thumbnailUrl ||
                product.imageUrl ||
                'https://placehold.co/120x120?text=TechStore'

              return (
                <tr key={product.id} className="border-b text-sm hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded border bg-white">
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="line-clamp-2 font-black text-gray-900">
                          {product.name}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          Slug: {product.slug}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {product.variants?.length || 0} biến thể
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    {product.category?.name || product.categoryName || 'N/A'}
                  </td>

                  <td className="px-4 py-4">
                    {product.brand?.name || product.brandName || 'N/A'}
                  </td>

                  <td className="px-4 py-4 font-black text-red-600">
                    {price ? formatCurrency(price) : 'Liên hệ'}
                  </td>

                  <td className="px-4 py-4 font-bold">{totalStock}</td>

                  <td className="px-4 py-4">
                    <span
                      className={
                        product.status === 'ACTIVE'
                          ? 'rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700'
                          : 'rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-bold text-gray-700'
                      }
                    >
                      {product.status === 'ACTIVE' ? 'Đang bán' : 'Ngừng bán'}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/products/${product.slug}`}
                        target="_blank"
                        className="inline-flex h-9 w-9 items-center justify-center rounded border text-gray-600 hover:border-blue-500 hover:text-blue-600"
                        title="Xem ngoài website"
                      >
                        <Eye size={16} />
                      </Link>

                      {!isStaff && (
                        <>
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded border text-gray-600 hover:border-red-500 hover:text-red-600"
                            title="Sửa sản phẩm"
                          >
                            <Edit size={16} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => onDelete(product.id)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded border text-gray-600 hover:border-red-500 hover:text-red-600"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminProductTable