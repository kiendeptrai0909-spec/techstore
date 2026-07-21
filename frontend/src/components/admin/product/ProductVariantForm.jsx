import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { uploadApi } from '../../../api/uploadApi'

function ProductVariantForm({ variants, setVariants, specificationKeys = [] }) {
  const [uploadingVariantIndex, setUploadingVariantIndex] = useState(null)
  const [uploadError, setUploadError] = useState('')

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
        description: '',
        specifications: [],
        status: 'ACTIVE',
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

  const handleAddSpec = (variantIndex) => {
    setVariants((prev) =>
      prev.map((variant, itemIndex) =>
        itemIndex === variantIndex
          ? {
              ...variant,
              specifications: [
                ...(variant.specifications || []),
                { name: '', value: '' },
              ],
            }
          : variant
      )
    )
  }

  const handleRemoveSpec = (variantIndex, specIndex) => {
    setVariants((prev) =>
      prev.map((variant, itemIndex) =>
        itemIndex === variantIndex
          ? {
              ...variant,
              specifications: variant.specifications.filter(
                (_, idx) => idx !== specIndex
              ),
            }
          : variant
      )
    )
  }

  const handleSpecNameChange = (variantIndex, specIndex, value) => {
    setVariants((prev) =>
      prev.map((variant, itemIndex) =>
        itemIndex === variantIndex
          ? {
              ...variant,
              specifications: variant.specifications.map((spec, idx) =>
                idx === specIndex ? { ...spec, name: value } : spec
              ),
            }
          : variant
      )
    )
  }

  const handleSpecValueChange = (variantIndex, specIndex, value) => {
    setVariants((prev) =>
      prev.map((variant, itemIndex) =>
        itemIndex === variantIndex
          ? {
              ...variant,
              specifications: variant.specifications.map((spec, idx) =>
                idx === specIndex ? { ...spec, value: value } : spec
              ),
            }
          : variant
      )
    )
  }

  const handleImageChange = async (index, event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setUploadError(`Biến thể #${index + 1}: Vui lòng chọn file hình ảnh`)
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError(`Biến thể #${index + 1}: Kích thước ảnh không được vượt quá 5MB`)
      return
    }

    setUploadingVariantIndex(index)
    setUploadError('')

    try {
      const response = await uploadApi.uploadImage(file)
      const imageUrl =
        response?.data?.url ||
        response?.url ||
        response?.data?.secureUrl ||
        response?.secureUrl ||
        ''

      if (imageUrl) {
        handleChangeVariant(index, 'thumbnailUrl', imageUrl)
      } else {
        setUploadError(`Biến thể #${index + 1}: Lỗi không lấy được đường dẫn ảnh`)
      }
    } catch (error) {
      setUploadError(
        `Biến thể #${index + 1}: ` +
          (error?.response?.data?.message || error?.message || 'Upload ảnh thất bại')
      )
    } finally {
      setUploadingVariantIndex(null)
      event.target.value = ''
    }
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
          {uploadError && (
            <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {uploadError}
            </div>
          )}

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

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Trạng thái
                  </label>
                  <select
                    value={variant.status || 'ACTIVE'}
                    onChange={(e) =>
                      handleChangeVariant(index, 'status', e.target.value)
                    }
                    className="h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500"
                  >
                    <option value="ACTIVE">Đang bán</option>
                    <option value="INACTIVE">Ngừng bán</option>
                  </select>
                </div>

                <div className="md:col-span-2 xl:col-span-1">
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Ảnh biến thể
                  </label>
                  
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(index, e)}
                      disabled={uploadingVariantIndex === index}
                      className="block h-11 w-full rounded border px-4 py-2 text-sm outline-none file:mr-4 file:rounded file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    {uploadingVariantIndex === index && (
                      <p className="text-sm font-semibold text-blue-600">
                        Đang upload ảnh lên Cloudinary...
                      </p>
                    )}

                    {variant.thumbnailUrl && (
                      <div className="rounded border bg-white p-3">
                        <img
                          src={variant.thumbnailUrl}
                          alt={`Variant ${index + 1}`}
                          className="h-20 w-20 rounded border object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => handleChangeVariant(index, 'thumbnailUrl', '')}
                          className="mt-2 text-xs font-bold text-red-600 hover:underline"
                        >
                          Xóa ảnh
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Mô tả biến thể
                  </label>
                  <textarea
                    value={variant.description || ''}
                    onChange={(e) => handleChangeVariant(index, 'description', e.target.value)}
                    rows="3"
                    placeholder="Mô tả riêng cho biến thể này..."
                    className="w-full rounded border bg-white px-4 py-2 text-sm outline-none focus:border-red-500"
                  />
                </div>

                <div className="md:col-span-2 bg-white rounded border p-4 mt-2">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-bold text-gray-800">Thông số kỹ thuật biến thể</h4>
                    <button
                      type="button"
                      onClick={() => handleAddSpec(index)}
                      className="inline-flex items-center gap-1 rounded bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700"
                    >
                      <Plus size={14} />
                      Thêm thông số
                    </button>
                  </div>
                  
                  {(!variant.specifications || variant.specifications.length === 0) ? (
                    <div className="rounded border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500">
                      Chưa có thông số kỹ thuật. Nhấn "Thêm thông số" để bắt đầu.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {variant.specifications.map((spec, specIndex) => (
                        <div key={specIndex} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={spec.name || ''}
                            onChange={(e) => handleSpecNameChange(index, specIndex, e.target.value)}
                            placeholder="Tên thông số"
                            className="h-10 flex-1 rounded border bg-white px-3 text-sm outline-none focus:border-red-500"
                          />
                          <input
                            type="text"
                            value={spec.value || ''}
                            onChange={(e) => handleSpecValueChange(index, specIndex, e.target.value)}
                            placeholder="Giá trị"
                            className="h-10 flex-1 rounded border bg-white px-3 text-sm outline-none focus:border-red-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveSpec(index, specIndex)}
                            className="flex h-10 w-10 items-center justify-center rounded border bg-white text-gray-600 hover:border-red-500 hover:text-red-600"
                            title="Xóa thông số"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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