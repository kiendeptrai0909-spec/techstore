import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ArrowLeft, Save } from 'lucide-react'

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
          })

          setVariants(
            product.variants?.length > 0
              ? product.variants.map((variant) => {
                  // Handle both old format (specificationKeyId, value) and new format (name, value)
                  const specs = variant.specifications || []
                  const convertedSpecs = specs.map((spec) => {
                    // If it's the old format with specificationKeyId, convert to new format
                    if (spec.specificationKeyId !== undefined) {
                      return {
                        name: spec.specificationKey?.name || spec.name || '',
                        value: spec.value || '',
                      }
                    }
                    // If it's already in new format, keep as is
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

          // Load spec keys cho category, rồi pre-fill giá trị từ sản phẩm
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

    if (!file) {
      return
    }

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
      variants: variants.map((variant) => ({
        id: variant.id,
        name: variant.name?.trim(),
        sku: variant.sku?.trim(),
        price: Number(variant.price || 0),
        salePrice: variant.salePrice ? Number(variant.salePrice) : null,
        stock: Number(variant.stock || 0),
        thumbnailUrl: variant.thumbnailUrl?.trim(),
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
                  <p className="text-sm font-semibold text-blue-600 animate-pulse">
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