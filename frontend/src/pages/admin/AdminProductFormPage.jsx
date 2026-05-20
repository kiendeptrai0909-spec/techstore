import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ArrowLeft, Save } from 'lucide-react'

import { adminProductApi } from '../../api/adminProductApi'
import { categoryApi } from '../../api/categoryApi'
import { brandApi } from '../../api/brandApi'
import ProductVariantForm from '../../components/admin/product/ProductVariantForm'

function AdminProductFormPage() {
  const { productId } = useParams()
  const navigate = useNavigate()

  const isEditMode = Boolean(productId)

  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])

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
              ? product.variants.map((variant) => ({
                  id: variant.id,
                  name: variant.name || '',
                  sku: variant.sku || '',
                  price: variant.price ?? '',
                  salePrice: variant.salePrice ?? '',
                  stock: variant.stock ?? '',
                  thumbnailUrl: variant.thumbnailUrl || '',
                }))
              : [
                  {
                    name: '',
                    sku: '',
                    price: '',
                    salePrice: '',
                    stock: '',
                    thumbnailUrl: '',
                  },
                ]
          )
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
        replace: true,
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
              onChange={(value) => handleChange('name', value)}
              error={errors.name}
              placeholder="VD: Laptop ASUS TUF Gaming F15"
            />

            <FormField
              label="Slug"
              value={formData.slug}
              onChange={(value) => handleChange('slug', value)}
              error={errors.slug}
              placeholder="VD: laptop-asus-tuf-gaming-f15"
            />

            <SelectField
              label="Danh mục"
              value={formData.categoryId}
              onChange={(value) => handleChange('categoryId', value)}
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

            <FormField
              label="Ảnh đại diện"
              value={formData.thumbnailUrl}
              onChange={(value) => handleChange('thumbnailUrl', value)}
              placeholder="https://..."
            />

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

        <ProductVariantForm variants={variants} setVariants={setVariants} />
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

export default AdminProductFormPage