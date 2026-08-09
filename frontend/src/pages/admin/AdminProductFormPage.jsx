import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ArrowLeft, Save, X, ImagePlus, Loader2 } from 'lucide-react'

import { adminProductApi } from '../../api/adminProductApi'
import { categoryApi } from '../../api/categoryApi'
import { brandApi } from '../../api/brandApi'
import { uploadApi } from '../../api/uploadApi'
import ProductVariantForm from '../../components/admin/product/ProductVariantForm'

function AdminProductFormPage() {
  const { productId } = useParams()
  const navigate = useNavigate()

  const isEditMode = Boolean(productId)

  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [specificationKeys, setSpecificationKeys] = useState([])
  const [specifications, setSpecifications] = useState({})

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    categoryId: '',
    brandId: '',
    status: 'ACTIVE',
    featured: false,
    thumbnailUrl: '',
    images: [],
  })

  const [variants, setVariants] = useState([
    {
      name: '',
      sku: '',
      price: '',
      salePrice: '',
      stock: '',
      thumbnailUrl: '',
    },
  ])

  const [loading, setLoading] = useState(isEditMode)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingMultiple, setUploadingMultiple] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 })
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({})

  const title = useMemo(
    () => (isEditMode ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'),
    [isEditMode]
  )

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true)
      setMessage('')

      try {
        const [categoryData, brandData] = await Promise.all([
          categoryApi.getCategories(),
          brandApi.getBrands(),
        ])

        setCategories(normalizeList(categoryData))
        setBrands(normalizeList(brandData))

        if (isEditMode) {
          const product = await adminProductApi.getProductById(productId)

          setFormData({
            name: product.name || '',
            slug: product.slug || '',
            description: product.description || '',
            categoryId:
              product.categoryId ||
              product.category?.id ||
              '',
            brandId:
              product.brandId ||
              product.brand?.id ||
              '',
            status: product.status || 'ACTIVE',
            featured: Boolean(product.featured),
            thumbnailUrl: product.thumbnailUrl || product.imageUrl || '',
            images: Array.isArray(product.images)
              ? product.images.map((img) => img.imageUrl || img)
              : [],
          })

          setVariants(
            product.variants?.length > 0
              ? product.variants.map((variant) => {
                  const specs = variant.specifications || []
                  const convertedSpecs = specs.map((spec) => {
                    if (spec.specificationKeyId !== undefined) {
                      return {
                        name: spec.specificationKey?.name || spec.name || '',
                        value: spec.value || '',
                      }
                    }
                    return {
                      name: spec.name || '',
                      value: spec.value || '',
                    }
                  })

                  return {
                    id: variant.id,
                    name: variant.name || '',
                    sku: variant.sku || '',
                    price: variant.price ?? '',
                    salePrice: variant.salePrice ?? '',
                    stock: variant.stock ?? '',
                    thumbnailUrl: variant.thumbnailUrl || '',
                    images: Array.isArray(variant.images)
                      ? variant.images.map((img) => img.imageUrl || img)
                      : [],
                    description: variant.description || '',
                    specifications: convertedSpecs,
                    status: variant.status || 'ACTIVE',
                  }
                })
              : [
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
                ]
          )

          const catId = product.categoryId || product.category?.id
          if (catId) {
            try {
              const [keys, filteredBrands] = await Promise.all([
                categoryApi.getSpecificationKeys(catId),
                brandApi.getBrandsByCategory(catId)
              ])
              const keyList = normalizeList(keys)
              setSpecificationKeys(keyList)
              setBrands(normalizeList(filteredBrands))

              const prefilled = {}
              keyList.forEach((key) => {
                const existing = product.specifications?.find(
                  (s) => s.specificationKeyId === key.id
                )
                prefilled[key.id] = existing ? existing.value : ''
              })
              setSpecifications(prefilled)
            } catch {
              // không load được thì bỏ qua
            }
          }
        }
      } catch (error) {
        setMessage(error.message || 'Không thể tải dữ liệu sản phẩm')
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [isEditMode, productId])

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }))

    setMessage('')
  }

  const handleCategoryChange = async (value) => {
    handleChange('categoryId', value)
    handleChange('brandId', '')
    setSpecificationKeys([])
    setSpecifications({})

    if (!value) return

    try {
      const [keys, brandsData] = await Promise.all([
        categoryApi.getSpecificationKeys(value),
        brandApi.getBrandsByCategory(value),
      ])
      setSpecificationKeys(normalizeList(keys))
      setBrands(normalizeList(brandsData))
    } catch {
      // ignore
    }
  }

  const handleNameChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: !isEditMode || !prev.slug ? generateSlug(value) : prev.slug,
    }))

    setErrors((prev) => ({
      ...prev,
      name: '',
      slug: '',
    }))

    setMessage('')
  }

  const handleThumbnailChange = async (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setMessage('Vui lòng chọn file hình ảnh')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage('Kích thước ảnh không được vượt quá 5MB')
      return
    }

    setUploadingImage(true)
    setMessage('')

    try {
      const response = await uploadApi.uploadImage(file)

      const imageUrl =
        response?.data?.url ||
        response?.url ||
        response?.data?.secureUrl ||
        response?.secureUrl ||
        ''

      if (!imageUrl) {
        setMessage('Upload ảnh thành công nhưng không nhận được đường dẫn ảnh')
        return
      }

      setFormData((prev) => ({
        ...prev,
        thumbnailUrl: imageUrl,
      }))

      setErrors((prev) => ({
        ...prev,
        thumbnailUrl: '',
      }))
    } catch (error) {
      setMessage(
        error?.response?.data?.message ||
          error?.message ||
          'Upload ảnh thất bại'
      )
    } finally {
      setUploadingImage(false)
      event.target.value = ''
    }
  }

  const handleMultipleImagesChange = async (event) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    // Kiểm tra định dạng và kích thước
    const invalidFile = files.find(
      (f) => !f.type.startsWith('image/') || f.size > 5 * 1024 * 1024
    )
    if (invalidFile) {
      setMessage('Chỉ được chọn ảnh và mỗi ảnh không quá 5MB')
      event.target.value = ''
      return
    }

    setUploadingMultiple(true)
    setUploadProgress({ done: 0, total: files.length })
    setMessage('')

    const uploaded = []

    for (const file of files) {
      try {
        const response = await uploadApi.uploadImage(file)
        const imageUrl =
          response?.data?.url ||
          response?.url ||
          response?.data?.secureUrl ||
          response?.secureUrl ||
          ''
        if (imageUrl) {
          uploaded.push(imageUrl)
        }
      } catch {
        // bỏ qua ảnh lỗi, tiếp tục upload các ảnh còn lại
      }
      setUploadProgress((prev) => ({ ...prev, done: prev.done + 1 }))
    }

    if (uploaded.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploaded],
      }))
    }

    if (uploaded.length < files.length) {
      setMessage(
        `${uploaded.length}/${files.length} ảnh đã được upload thành công. Một số ảnh bị lỗi.`
      )
    }

    setUploadingMultiple(false)
    event.target.value = ''
  }

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!formData.name.trim()) {
      nextErrors.name = 'Tên sản phẩm không được để trống'
    }

    if (!formData.slug.trim()) {
      nextErrors.slug = 'Slug không được để trống'
    }

    if (!formData.categoryId) {
      nextErrors.categoryId = 'Vui lòng chọn danh mục'
    }

    if (!formData.brandId) {
      nextErrors.brandId = 'Vui lòng chọn thương hiệu'
    }

    if (variants.length === 0) {
      nextErrors.variants = 'Sản phẩm cần có ít nhất một biến thể'
    }

    variants.forEach((variant, index) => {
      if (!variant.sku?.trim()) {
        nextErrors.variants = `Biến thể #${index + 1} chưa có SKU`
      }

      if (!variant.price) {
        nextErrors.variants = `Biến thể #${index + 1} chưa có giá`
      }
    })

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  const buildPayload = () => {
    return {
      name: formData.name.trim(),
      slug: formData.slug.trim().toLowerCase(),
      description: formData.description.trim(),
      categoryId: Number(formData.categoryId),
      brandId: Number(formData.brandId),
      status: formData.status,
      featured: Boolean(formData.featured),
      thumbnailUrl: formData.thumbnailUrl.trim(),
      images: formData.images.filter(Boolean),
      variants: variants.map((variant) => ({
        id: variant.id,
        name: variant.name?.trim(),
        sku: variant.sku?.trim(),
        price: Number(variant.price || 0),
        salePrice: variant.salePrice ? Number(variant.salePrice) : null,
        stock: Number(variant.stock || 0),
        thumbnailUrl: variant.thumbnailUrl?.trim(),
        images: Array.isArray(variant.images) ? variant.images.filter(Boolean) : [],
        description: variant.description?.trim() || '',
        status: variant.status || 'ACTIVE',
        specifications: (variant.specifications || [])
          .filter((spec) => spec.name?.trim() && spec.value?.trim())
          .map((spec) => ({
            name: spec.name.trim(),
            value: spec.value.trim(),
          })),
      })),
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    setMessage('')

    try {
      const payload = buildPayload()

      if (isEditMode) {
        await adminProductApi.updateProduct(productId, payload)
      } else {
        await adminProductApi.createProduct(payload)
      }

      navigate('/admin/products', {
        state: {
          successMessage: isEditMode
            ? 'Cập nhật sản phẩm thành công'
            : 'Thêm sản phẩm thành công',
        },
      })
    } catch (error) {
      setMessage(error.message || 'Không thể lưu sản phẩm')
      setErrors(error.errors || {})
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div>
        <div className="mb-5 h-20 animate-pulse rounded bg-gray-200" />
        <div className="space-y-5">
          <div className="h-96 animate-pulse rounded bg-gray-200" />
          <div className="h-96 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-5 rounded-lg bg-white p-5 shadow-sm">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
        >
          <ArrowLeft size={18} />
          Quay lại danh sách sản phẩm
        </Link>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900">{title}</h2>
            <p className="mt-1 text-sm text-gray-500">
              Nhập thông tin sản phẩm, danh mục, thương hiệu và biến thể.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded bg-red-600 px-5 py-3 font-black text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={20} />
            {submitting ? 'Đang lưu...' : 'Lưu sản phẩm'}
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {message}
        </div>
      )}

      {errors.variants && (
        <div className="mb-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {errors.variants}
        </div>
      )}

      <div className="space-y-5">
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-black text-gray-900">
            Thông tin sản phẩm
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              label="Tên sản phẩm"
              value={formData.name}
              onChange={handleNameChange}
              error={errors.name}
              placeholder="VD: Laptop ASUS TUF Gaming F15"
            />

            <FormField
              label="Slug"
              value={formData.slug}
              onChange={(value) => handleChange('slug', generateSlug(value))}
              error={errors.slug}
              placeholder="VD: laptop-asus-tuf-gaming-f15"
            />

            <SelectField
              label="Danh mục"
              value={formData.categoryId}
              onChange={handleCategoryChange}
              error={errors.categoryId}
              options={categories}
              placeholder="Chọn danh mục"
            />

            <SelectField
              label="Thương hiệu"
              value={formData.brandId}
              onChange={(value) => handleChange('brandId', value)}
              error={errors.brandId}
              options={brands}
              placeholder="Chọn thương hiệu"
            />

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Trạng thái
              </label>

              <select
                value={formData.status}
                onChange={(event) =>
                  handleChange('status', event.target.value)
                }
                className="h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500"
              >
                <option value="ACTIVE">Đang bán</option>
                <option value="INACTIVE">Ngừng bán</option>
              </select>
            </div>

            {/* Ảnh đại diện */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Ảnh đại diện
              </label>

              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  disabled={uploadingImage}
                  className="block h-11 w-full rounded border px-4 py-2 text-sm outline-none file:mr-4 file:rounded file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                />

                {uploadingImage && (
                  <p className="flex items-center gap-2 text-sm font-semibold text-blue-600 animate-pulse">
                    <Loader2 size={14} className="animate-spin" />
                    Đang upload ảnh lên Cloudinary...
                  </p>
                )}

                {formData.thumbnailUrl && (
                  <div className="rounded border bg-gray-50 p-3">
                    <p className="mb-2 text-sm font-bold text-gray-700">
                      Ảnh hiện tại
                    </p>

                    <img
                      src={formData.thumbnailUrl}
                      alt="Ảnh đại diện sản phẩm"
                      className="h-36 w-36 rounded border bg-white object-contain"
                    />

                    <p className="mt-2 break-all text-xs text-gray-500">
                      {formData.thumbnailUrl}
                    </p>

                    <button
                      type="button"
                      onClick={() => handleChange('thumbnailUrl', '')}
                      className="mt-3 rounded border border-red-200 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
                    >
                      Xóa ảnh
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(event) =>
                    handleChange('featured', event.target.checked)
                  }
                  className="h-4 w-4"
                />
                Sản phẩm nổi bật
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Mô tả sản phẩm
              </label>

              <textarea
                value={formData.description}
                onChange={(event) =>
                  handleChange('description', event.target.value)
                }
                rows="7"
                placeholder="Nhập mô tả sản phẩm..."
                className="w-full rounded border px-4 py-3 text-sm outline-none focus:border-red-500"
              />
            </div>

            {/* Bộ sưu tập ảnh sản phẩm (multi-image gallery) */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Thư viện ảnh sản phẩm
                <span className="ml-2 text-xs font-normal text-gray-400">
                  (Có thể chọn nhiều ảnh cùng lúc, mỗi ảnh tối đa 5MB)
                </span>
              </label>

              {/* Nút chọn nhiều ảnh */}
              <label
                className={`inline-flex cursor-pointer items-center gap-2 rounded border-2 border-dashed border-gray-300 px-5 py-3 text-sm font-bold text-gray-600 transition hover:border-red-400 hover:text-red-500 ${uploadingMultiple ? 'cursor-not-allowed opacity-60' : ''}`}
              >
                <ImagePlus size={18} />
                {uploadingMultiple
                  ? `Đang upload ${uploadProgress.done}/${uploadProgress.total} ảnh...`
                  : 'Chọn nhiều ảnh để thêm vào thư viện'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMultipleImagesChange}
                  disabled={uploadingMultiple}
                  className="hidden"
                />
              </label>

              {uploadingMultiple && (
                <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                  <Loader2 size={14} className="animate-spin" />
                  <span>
                    Đang tải lên {uploadProgress.done}/{uploadProgress.total}{' '}
                    ảnh...
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-300"
                      style={{
                        width: `${uploadProgress.total > 0 ? (uploadProgress.done / uploadProgress.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Lưới xem trước ảnh đã upload */}
              {formData.images.length > 0 && (
                <div className="mt-3">
                  <p className="mb-2 text-xs font-semibold text-gray-500">
                    {formData.images.length} ảnh trong thư viện
                  </p>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                    {formData.images.map((url, index) => (
                      <div key={`${url}-${index}`} className="group relative">
                        <div className="aspect-square overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50">
                          <img
                            src={url}
                            alt={`Ảnh sản phẩm ${index + 1}`}
                            className="h-full w-full object-cover transition-opacity group-hover:opacity-70"
                          />
                        </div>
                        {/* Nút xóa ảnh */}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-700"
                          title="Xóa ảnh này"
                        >
                          <X size={12} />
                        </button>
                        <p className="mt-1 truncate text-center text-xs text-gray-400">
                          Ảnh {index + 1}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.images.length === 0 && !uploadingMultiple && (
                <p className="mt-3 text-sm text-gray-400 italic">
                  Chưa có ảnh nào trong thư viện. Nhấn nút trên để thêm ảnh.
                </p>
              )}
            </div>
          </div>
        </div>

        <ProductVariantForm
          variants={variants}
          setVariants={setVariants}
          specificationKeys={specificationKeys}
        />
      </div>
    </form>
  )
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  error,
  type = 'text',
}) {
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
        className={
          error
            ? 'h-11 w-full rounded border border-red-500 px-4 text-sm outline-none'
            : 'h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500'
        }
      />

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={
          error
            ? 'h-11 w-full rounded border border-red-500 px-4 text-sm outline-none'
            : 'h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500'
        }
      >
        <option value="">{placeholder}</option>
        {options.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

function normalizeList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.items)) return data.items
  return []
}

function generateSlug(value) {
  return value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default AdminProductFormPage