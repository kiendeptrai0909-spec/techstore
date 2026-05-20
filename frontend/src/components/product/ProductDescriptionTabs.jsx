import { useState } from 'react'

function ProductDescriptionTabs({ product, selectedVariant }) {
  const [activeTab, setActiveTab] = useState('description')

  const specifications =
    selectedVariant?.specifications ||
    product.specifications ||
    product.productSpecifications ||
    []

  return (
    <div className="rounded-md bg-white shadow-sm">
      <div className="flex border-b">
        <button
          type="button"
          onClick={() => setActiveTab('description')}
          className={
            activeTab === 'description'
              ? 'border-b-2 border-red-600 px-5 py-3 font-bold text-red-600'
              : 'px-5 py-3 font-bold text-gray-700 hover:text-red-600'
          }
        >
          Mô tả sản phẩm
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('specifications')}
          className={
            activeTab === 'specifications'
              ? 'border-b-2 border-red-600 px-5 py-3 font-bold text-red-600'
              : 'px-5 py-3 font-bold text-gray-700 hover:text-red-600'
          }
        >
          Thông số kỹ thuật
        </button>
      </div>

      <div className="p-5">
        {activeTab === 'description' && (
          <div className="prose max-w-none">
            {product.description ? (
              <div className="whitespace-pre-line leading-7 text-gray-700">
                {product.description}
              </div>
            ) : (
              <p className="text-gray-500">
                Mô tả sản phẩm đang được cập nhật.
              </p>
            )}
          </div>
        )}

        {activeTab === 'specifications' && (
          <div>
            {specifications.length > 0 ? (
              <div className="overflow-hidden rounded border">
                {specifications.map((item, index) => (
                  <div
                    key={item.id || index}
                    className={
                      index % 2 === 0
                        ? 'grid grid-cols-[180px_1fr] bg-gray-50'
                        : 'grid grid-cols-[180px_1fr] bg-white'
                    }
                  >
                    <div className="border-r px-4 py-3 font-semibold text-gray-700">
                      {item.name || item.keyName || item.specificationKey?.name}
                    </div>

                    <div className="px-4 py-3 text-gray-700">
                      {item.value || item.specificationValue || 'Đang cập nhật'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                Thông số kỹ thuật đang được cập nhật.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDescriptionTabs