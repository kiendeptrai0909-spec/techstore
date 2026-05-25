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

  const leftBanner = banners[0]
  const rightBanner = banners[1]

  const heroMainBanner = banners[2]
  const heroRightBanners = banners.slice(3, 6)
  const heroBottomBanners = banners.slice(6, 10)

  const promotionBanners = banners.slice(10, 14)

  const pcProducts =
    featuredProducts.length > 0 ? featuredProducts : allProducts.slice(0, 5)

  const laptopGamingProducts =
    allProducts.length > 5 ? allProducts.slice(5, 10) : allProducts.slice(0, 5)

  const officeProducts =
    allProducts.length > 10
      ? allProducts.slice(10, 15)
      : allProducts.slice(0, 5)



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
                <Link
                  to={heroMainBanner?.linkUrl || '/products'}
                  className="block overflow-hidden rounded-md bg-white shadow-sm"
                >
                  {heroMainBanner?.imageUrl ? (
                    <img
                      src={heroMainBanner.imageUrl}
                      alt={heroMainBanner.title}
                      className="h-[310px] w-full object-cover"
                    />
                  ) : (
                    <HeroFallback />
                  )}
                </Link>

                <div className="grid gap-3 md:grid-cols-2">
                  {heroBottomBanners.slice(0, 2).length > 0 ? (
                    heroBottomBanners.slice(0, 2).map((banner) => (
                      <Link
                        key={banner.id}
                        to={banner.linkUrl || '/products'}
                        className="overflow-hidden rounded-md bg-white shadow-sm"
                      >
                        <img
                          src={banner.imageUrl}
                          alt={banner.title}
                          className="h-[160px] w-full object-cover"
                        />
                      </Link>
                    ))
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
                  heroRightBanners.map((banner) => (
                    <Link
                      key={banner.id}
                      to={banner.linkUrl || '/products'}
                      className="overflow-hidden rounded-md bg-white shadow-sm"
                    >
                      <img
                        src={banner.imageUrl}
                        alt={banner.title}
                        className="h-[150px] w-full object-cover lg:h-[153px]"
                      />
                    </Link>
                  ))
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
              {heroBottomBanners.slice(2, 6).length > 0 ? (
                heroBottomBanners.slice(2, 6).map((banner) => (
                  <Link
                    key={banner.id}
                    to={banner.linkUrl || '/products'}
                    className="overflow-hidden rounded-md bg-white shadow-sm"
                  >
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="h-[140px] w-full object-cover"
                    />
                  </Link>
                ))
              ) : (
                <>
                  <SmallPromo title="Deal hời tuần" />
                  <SmallPromo title="Monitor" />
                  <SmallPromo title="Gaming Mouse" />
                  <SmallPromo title="PC RX 6500XT" />
                </>
              )}
            </div>
          </section>

          {loading ? (
            <div className="rounded bg-white p-8 text-center text-gray-500">
              Đang tải dữ liệu...
            </div>
          ) : (
            <>
              

              <ProductSection
                title="Laptop gaming bán chạy"
                products={laptopGamingProducts}
                tabs={[
                  { label: 'ASUS', url: '/products?keyword=asus' },
                  { label: 'ACER', url: '/products?keyword=acer' },
                  { label: 'MSI', url: '/products?keyword=msi' },
                  { label: 'LENOVO', url: '/products?keyword=lenovo' },
                  { label: 'DELL', url: '/products?keyword=dell' },
                ]}
                viewAllUrl="/products?keyword=laptop+gaming"
              />

              <ProductSection
                title="Laptop văn phòng bán chạy"
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

              

              <NewsSection news={news} />
            </>
          )}
        </main>

        <SideBanner banner={rightBanner} side="right" />
      </div>
    </div>
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
export default HomePage