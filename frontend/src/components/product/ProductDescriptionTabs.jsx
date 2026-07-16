import { useState } from 'react'

function ProductDescriptionTabs({ product, selectedVariant }) {
  const [activeTab, setActiveTab] = useState('description')
  const [showAllSpecs, setShowAllSpecs] = useState(false)

  const specifications =
    selectedVariant?.specifications ||
    product?.specifications ||
    product?.productSpecifications ||
    []

  const visibleSpecifications = showAllSpecs
    ? specifications
    : specifications.slice(0, 6)

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
            {(selectedVariant?.description || product?.description) ? (
              <div className="whitespace-pre-line leading-7 text-gray-700">
                {selectedVariant?.description || product.description}
              </div>
            ) : (
              <p className="text-gray-500">
                Mô tả sản phẩm đang được cập nhật.
              </p>
            )}
          </div>
        )}

        {activeTab === 'specifications' && (
          <SpecificationTable
            specifications={specifications}
            visibleSpecifications={visibleSpecifications}
            showAllSpecs={showAllSpecs}
            onToggleShowAll={() => setShowAllSpecs((prev) => !prev)}
          />
        )}
      </div>
    </div>
  )
}

function SpecificationTable({
  specifications,
  visibleSpecifications,
  showAllSpecs,
  onToggleShowAll,
}) {
  if (!specifications || specifications.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Thông số kỹ thuật đang được cập nhật.
      </p>
    )
  }

  return (
    <div className="max-w-xl overflow-hidden rounded border bg-white">
      <div className="bg-red-600 px-4 py-3">
        <h3 className="text-base font-black uppercase text-white">
          Thông số kỹ thuật
        </h3>
      </div>

      <div>
        {visibleSpecifications.map((item, index) => (
          <div
            key={item.id || `${item.name}-${index}`}
            className="grid grid-cols-[150px_1fr] border-b last:border-b-0"
          >
            <div className="bg-gray-50 px-4 py-3 text-sm font-bold text-gray-800">
              {getSpecName(item)}
            </div>

            <div className="px-4 py-3 text-sm text-gray-800">
              {formatSpecValue(item)}
            </div>
          </div>
        ))}
      </div>

      {specifications.length > 6 && (
        <div className="flex justify-center px-4 py-3">
          <button
            type="button"
            onClick={onToggleShowAll}
            className="rounded border border-blue-600 px-5 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
          >
            {showAllSpecs ? 'Thu gọn ▲' : 'Xem cấu hình chi tiết ▸'}
          </button>
        </div>
      )}
    </div>
  )
}

function getSpecName(item) {
  return (
    item?.name ||
    item?.keyName ||
    item?.specName ||
    item?.specificationKey?.name ||
    'Thông số'
  )
}

function formatSpecValue(item) {
  const value =
    item?.value ||
    item?.specificationValue ||
    item?.specValue ||
    'Đang cập nhật'

  const unit = item?.unit || item?.specificationKey?.unit || ''

  if (!unit) {
    return value
  }

  if (String(value).toLowerCase().includes(String(unit).toLowerCase())) {
    return value
  }

  return `${value} ${unit}`
}

export default ProductDescriptionTabs