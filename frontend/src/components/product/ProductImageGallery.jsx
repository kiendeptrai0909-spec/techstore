import { useMemo, useState } from 'react'

function ProductImageGallery({ product, selectedVariant }) {
  const images = useMemo(() => {
    const result = []

    if (selectedVariant?.thumbnailUrl) {
      result.push({
        id: `variant-${selectedVariant.id}`,
        url: selectedVariant.thumbnailUrl,
        alt: selectedVariant.name || product?.name,
      })
    }

    if (product?.thumbnailUrl) {
      result.push({
        id: 'product-thumbnail',
        url: product.thumbnailUrl,
        alt: product.name,
      })
    }

    if (product?.imageUrl) {
      result.push({
        id: 'product-image',
        url: product.imageUrl,
        alt: product.name,
      })
    }

    if (Array.isArray(product?.images)) {
      product.images.forEach((image) => {
        result.push({
          id: image.id,
          url: image.imageUrl || image.url,
          alt: image.altText || product.name,
        })
      })
    }

    if (Array.isArray(product?.productImages)) {
      product.productImages.forEach((image) => {
        result.push({
          id: image.id,
          url: image.imageUrl || image.url,
          alt: image.altText || product.name,
        })
      })
    }

    if (Array.isArray(product?.variants)) {
      product.variants.forEach((variant) => {
        if (variant.thumbnailUrl) {
          result.push({
            id: `variant-list-${variant.id}`,
            url: variant.thumbnailUrl,
            alt: variant.name || product.name,
          })
        }
      })
    }

    const uniqueImages = []
    const existedUrls = new Set()

    result.forEach((image) => {
      if (image.url && !existedUrls.has(image.url)) {
        existedUrls.add(image.url)
        uniqueImages.push(image)
      }
    })

    if (uniqueImages.length === 0) {
      uniqueImages.push({
        id: 'placeholder',
        url: 'https://placehold.co/700x700?text=TechStore',
        alt: product?.name || 'TechStore product',
      })
    }

    return uniqueImages
  }, [product, selectedVariant])

  const [activeIndex, setActiveIndex] = useState(0)

  const activeImage = images[activeIndex] || images[0]

  return (
    <div className="rounded-md bg-white p-4 shadow-sm">
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-md border bg-white">
        <img
          src={activeImage.url}
          alt={activeImage.alt}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <div className="mt-4 grid grid-cols-5 gap-3">
        {images.slice(0, 10).map((image, index) => (
          <button
            key={`${image.id}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={
              index === activeIndex
                ? 'aspect-square overflow-hidden rounded border-2 border-red-600 bg-white p-1'
                : 'aspect-square overflow-hidden rounded border bg-white p-1 hover:border-red-500'
            }
          >
            <img
              src={image.url}
              alt={image.alt}
              className="h-full w-full object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default ProductImageGallery