import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { bannerApi } from '../../api/bannerApi'
import { categoryApi } from '../../api/categoryApi'
import { productApi } from '../../api/productApi'
import { newsApi } from '../../api/newsApi'

import CategorySidebar from '../../components/home/CategorySidebar'
import SideBanner from '../../components/home/SideBanner'
import ProductSection from '../../components/home/ProductSection'
import CategoryIconGrid from '../../components/home/CategoryIconGrid'
import NewsSection from '../../components/home/NewsSection'

function HomePage() {
  const [banners, setBanners] = useState([])
  const [categories, setCategories] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [keyboardProducts, setKeyboardProducts] = useState([])
  const [officeProducts, setOfficeProducts] = useState([])
  const [pcProducts, setPcProducts] = useState([])
  const [mouseProducts, setMouseProducts] = useState([])
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [
          bannerData,
          categoryData,
          featuredProductData,
          productData,
          newsData,
        ] = await Promise.all([
          bannerApi.getBanners(),
          categoryApi.getCategories(),
          productApi.getFeaturedProducts({ page: 0, size: 10 }),
          productApi.getProducts({ page: 0, size: 20 }),
          newsApi.getNews({ page: 0, size: 4 }),
        ])

        const normalizedBanners = normalizeList(bannerData)
        const normalizedCategories = normalizeList(categoryData)
        const normalizedFeaturedProducts = normalizeList(featuredProductData)
        const normalizedProducts = normalizeList(productData)
        const normalizedNews = normalizeList(newsData)

        setBanners(normalizedBanners)
        setCategories(normalizedCategories)
        setFeaturedProducts(normalizedFeaturedProducts)
        setAllProducts(normalizedProducts)
        setNews(normalizedNews)
        const laptopCategory = findCategoryByKeywords(normalizedCategories, [
          'laptop',
          'may tinh xach tay',
        ])

        const pcCategory = findCategoryByKeywords(normalizedCategories, [
          'pc',
          'may tinh bo',
          'build pc',
        ])
        const keyboardCategory = findCategoryByKeywords(normalizedCategories, [
          'ban phim',
          'ban phim co',
          'phim co',
          'keyboard',
        ])
        const [
          keyboardData,
          officeProductData,
          pcProductData,
        ] = await Promise.all([
          productApi.getProducts({
            page: 0,
            size: 5,
            status: 'ACTIVE',
            ...(keyboardCategory?.id
              ? { categoryId: keyboardCategory.id }
              : { keyword: 'ban phim' }),
          }),

          productApi.getProducts({
            page: 0,
            size: 5,
            status: 'ACTIVE',
            keyword: 'laptop',
          }),

          productApi.getProducts({
            page: 0,
            size: 5,
            status: 'ACTIVE',
            ...(pcCategory?.id ? { categoryId: pcCategory.id } : { keyword: 'pc' }),
          }),
        ])

        setKeyboardProducts(normalizeList(keyboardData))
        setOfficeProducts(normalizeList(officeProductData))
        setPcProducts(normalizeList(pcProductData))
        const mouseCategory = normalizedCategories.find((category) => {
          const slug = category.slug || ''
          const name = category.name || ''

          return (
            slug === 'chuot' ||
            slug === 'chuot-may-tinh' ||
            name.toLowerCase() === 'chuột' ||
            name.toLowerCase() === 'chuột máy tính'
          )
        })

        if (mouseCategory?.id) {
          const mouseProductData = await productApi.getProducts({
            page: 0,
            size: 5,
            categoryId: mouseCategory.id,
            status: 'ACTIVE',
          })

          setMouseProducts(normalizeList(mouseProductData))
        } else {
          const mouseProductData = await productApi.getProducts({
            page: 0,
            size: 5,
            keyword: 'chuot',
            status: 'ACTIVE',
          })

          setMouseProducts(normalizeList(mouseProductData))
        }
      } catch (error) {
        console.error(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchHomeData()
  }, [])

  const sortedBanners = sortBanners(banners)

  const leftBanner = findFirstBannerByPosition(sortedBanners, [
    'Banner trái',
    'HOME_LEFT',
    'SIDEBAR_LEFT',
    'LEFT',
  ])

  const rightBanner = findFirstBannerByPosition(sortedBanners, [
    'Banner phải',
    'HOME_RIGHT',
    'SIDEBAR_RIGHT',
    'RIGHT',
  ])

  const topBanners = findBannersByPosition(sortedBanners, [
    'Trang chủ - đầu trang',
    'HOME_TOP',
    'TOP',
  ])

  const middleBanners = findBannersByPosition(sortedBanners, [
    'Trang chủ - giữa trang',
    'HOME_MIDDLE',
    'MIDDLE',
  ])

  const bottomBanners = findBannersByPosition(sortedBanners, [
    'Trang chủ - cuối trang',
    'HOME_BOTTOM',
    'BOTTOM',
  ])

  /*
   * Quy ước:
   * Trang chủ - đầu trang:
   * - thứ tự 1      -> banner lớn trung tâm
   * - thứ tự 2-4    -> 3 banner nhỏ bên phải
   * - thứ tự 5-6    -> 2 banner dưới banner lớn
   *
   * Trang chủ - giữa trang:
   * - thứ tự 1      -> ô Deal hời tuần
   * - thứ tự 2      -> ô Monitor
   * - thứ tự 3      -> ô Gaming Mouse
   * - thứ tự 4      -> ô PC RX 6500XT
   */
  const heroMainBanner = topBanners[0]
  const heroRightBanners = topBanners.slice(1, 4)
  const heroBottomBanners = topBanners.slice(4, 6)

  const middleFallbackTitles = [
    'Deal hời tuần',
    'Monitor',
    'Gaming Mouse',
    'PC RX 6500XT',
  ]

  const middleSlotBanners = middleBanners.slice(0, 4)



  return (
    <div className="bg-[#e9e9e9]">
      <div className="mx-auto grid max-w-[1580px] grid-cols-1 gap-4 px-4 py-4 xl:grid-cols-[150px_minmax(0,1fr)_150px]">
        <SideBanner banner={leftBanner} side="left" />

        <main className="space-y-4">
          <section>
            <div className="grid gap-3 lg:grid-cols-[230px_minmax(0,1fr)_300px]">
              <div className="hidden lg:block">
                <CategorySidebar categories={categories} />
              </div>

              <div className="space-y-3">
                {heroMainBanner ? (
                  <BannerLink
                    banner={heroMainBanner}
                    imageClassName="h-[310px] w-full object-cover"
                    className="block overflow-hidden rounded-md bg-white shadow-sm"
                  />
                ) : (
                  <div className="overflow-hidden rounded-md bg-white shadow-sm">
                    <HeroFallback />
                  </div>
                )}

                <div className="grid gap-3 md:grid-cols-2">
                  {heroBottomBanners.length > 0 ? (
                    <>
                      {[0, 1].map((index) => {
                        const banner = heroBottomBanners[index]
                        const fallbackTitle =
                          index === 0 ? 'Laptop Gaming' : 'Laptop Office'

                        if (banner) {
                          return (
                            <BannerLink
                              key={banner.id}
                              banner={banner}
                              imageClassName="h-[160px] w-full object-cover"
                              className="overflow-hidden rounded-md bg-white shadow-sm"
                            />
                          )
                        }

                        return (
                          <BigPromo key={fallbackTitle} title={fallbackTitle} />
                        )
                      })}
                    </>
                  ) : (
                    <>
                      <BigPromo title="Laptop Gaming" />
                      <BigPromo title="Laptop Office" />
                    </>
                  )}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {heroRightBanners.length > 0 ? (
                  <>
                    {[0, 1, 2].map((index) => {
                      const banner = heroRightBanners[index]
                      const fallbackTitles = ['Build PC', 'Phím cơ', 'PC i5/5060']

                      if (banner) {
                        return (
                          <BannerLink
                            key={banner.id}
                            banner={banner}
                            imageClassName="h-[150px] w-full object-cover lg:h-[153px]"
                            className="overflow-hidden rounded-md bg-white shadow-sm"
                          />
                        )
                      }

                      return (
                        <SmallPromo
                          key={fallbackTitles[index]}
                          title={fallbackTitles[index]}
                        />
                      )
                    })}
                  </>
                ) : (
                  <>
                    <SmallPromo title="Build PC" />
                    <SmallPromo title="Phím cơ" />
                    <SmallPromo title="PC i5/5060" />
                  </>
                )}
              </div>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-4">
              {middleFallbackTitles.map((title, index) => {
                const banner = middleSlotBanners[index]

                if (banner) {
                  return (
                    <BannerLink
                      key={banner.id}
                      banner={banner}
                      imageClassName="h-[150px] w-full object-cover"
                      className="overflow-hidden rounded-md bg-white shadow-sm"
                    />
                  )
                }

                return <SmallPromo key={title} title={title} />
              })}
            </div>
          </section>

          {loading ? (
            <div className="rounded bg-white p-8 text-center text-gray-500">
              Đang tải dữ liệu...
            </div>
          ) : (
            <>
              <ProductSection
                title="Bàn phím bán chạy"
                products={keyboardProducts}
                tabs={[
                  { label: 'AULA', url: '/products?keyword=aula' },
                  { label: 'AKKO', url: '/products?keyword=akko' },
                  { label: 'Logitech', url: '/products?keyword=logitech' },
                  { label: 'Razer', url: '/products?keyword=razer' },
                  { label: 'Corsair', url: '/products?keyword=corsair' },
                ]}
                viewAllUrl="/products?keyword=ban+phim"
              />

              <ProductSection
                title="Laptop bán chạy"
                products={officeProducts}
                tabs={[
                  { label: 'ASUS', url: '/products?keyword=asus' },
                  { label: 'MSI', url: '/products?keyword=msi' },
                  { label: 'LENOVO', url: '/products?keyword=lenovo' },
                  { label: 'DELL', url: '/products?keyword=dell' },
                  { label: 'ACER', url: '/products?keyword=acer' },
                ]}
                viewAllUrl="/products?keyword=laptop"
              />

              <ProductSection
                title="Chuột bán chạy"
                products={mouseProducts}
                tabs={[
                  { label: 'Logitech', url: '/products?keyword=logitech' },
                  { label: 'Razer', url: '/products?keyword=razer' },
                  { label: 'Asus', url: '/products?keyword=asus' },
                  { label: 'Rapoo', url: '/products?keyword=rapoo' },
                ]}
                viewAllUrl="/products?category=chuot"
              />

              <CategoryIconGrid categories={categories} />

              {bottomBanners.length > 0 && (
                <section className="grid gap-3 md:grid-cols-2">
                  {bottomBanners.map((banner) => (
                    <BannerLink
                      key={banner.id}
                      banner={banner}
                      imageClassName="h-[180px] w-full object-cover"
                      className="overflow-hidden rounded-md bg-white shadow-sm"
                    />
                  ))}
                </section>
              )}

              <NewsSection news={news} />
            </>
          )}
        </main>

        <SideBanner banner={rightBanner} side="right" />
      </div>
    </div>
  )
}

function BannerLink({ banner, className, imageClassName }) {
  return (
    <Link to={banner.linkUrl || '/products'} className={className}>
      <img
        src={banner.imageUrl}
        alt={banner.title || 'Banner TechStore'}
        className={imageClassName}
      />
    </Link>
  )
}

function HeroFallback() {
  return (
    <div className="flex h-[310px] flex-col justify-center rounded-md bg-gradient-to-r from-sky-400 to-blue-600 p-8 text-white">
      <h1 className="max-w-xl text-4xl font-black">
        Sắm laptop, PC và gaming gear chất lượng
      </h1>
      <p className="mt-4 max-w-lg text-blue-50">
        Ưu đãi hấp dẫn mỗi ngày, bảo hành rõ ràng, giao hàng nhanh chóng.
      </p>
      <span className="mt-6 w-max rounded bg-yellow-400 px-5 py-3 font-black text-red-600">
        SẮM LIỀN TAY
      </span>
    </div>
  )
}

function SmallPromo({ title }) {
  return (
    <Link
      to="/products"
      className="flex h-[150px] items-center justify-center rounded-md bg-gradient-to-r from-cyan-400 to-sky-500 p-4 text-center text-2xl font-black text-white shadow-sm"
    >
      {title}
    </Link>
  )
}

function BigPromo({ title }) {
  return (
    <Link
      to="/products"
      className="flex h-[160px] flex-col justify-center rounded-md bg-gradient-to-r from-blue-600 to-sky-400 p-6 text-white shadow-sm"
    >
      <h2 className="text-3xl font-black">{title}</h2>
      <p className="mt-2 text-lg font-bold">Giảm sốc hôm nay</p>
    </Link>
  )
}

function normalizeList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.items)) return data.items
  return []
}

function sortBanners(banners) {
  return [...banners].sort((a, b) => {
    const orderA = Number(a.displayOrder ?? a.sortOrder ?? a.order ?? 999)
    const orderB = Number(b.displayOrder ?? b.sortOrder ?? b.order ?? 999)

    if (orderA !== orderB) {
      return orderA - orderB
    }

    return Number(b.id || 0) - Number(a.id || 0)
  })
}

function findFirstBannerByPosition(banners, positions) {
  return findBannersByPosition(banners, positions)[0]
}

function findBannersByPosition(banners, positions) {
  const normalizedPositions = positions.map(normalizeText)

  return banners.filter((banner) => {
    const position = normalizeText(
      banner.position ||
      banner.positionCode ||
      banner.positionName ||
      banner.positionLabel ||
      banner.bannerPosition ||
      banner.location ||
      ''
    )

    return normalizedPositions.some((item) => position.includes(item))
  })
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .toUpperCase()
}
function findCategoryByKeywords(categories, keywords) {
  const normalizedKeywords = keywords.map(normalizeText)

  return categories.find((category) => {
    const name = normalizeText(category.name)
    const slug = normalizeText(category.slug)

    return normalizedKeywords.some(
      (keyword) => name.includes(keyword) || slug.includes(keyword)
    )
  })
}
export default HomePage