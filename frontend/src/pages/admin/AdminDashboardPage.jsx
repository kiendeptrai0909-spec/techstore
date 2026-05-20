import { useEffect, useMemo, useState } from 'react'
import {
  DollarSign,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  Star,
} from 'lucide-react'
import { adminDashboardApi } from '../../api/adminDashboardApi'
import { formatCurrency } from '../../utils/formatCurrency'

function AdminDashboardPage() {
  const [summary, setSummary] = useState(null)
  const [revenueStatistics, setRevenueStatistics] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true)
      setMessage('')

      try {
        const [summaryData, revenueData, topProductData] = await Promise.all([
          adminDashboardApi.getSummary(),
          adminDashboardApi.getRevenueStatistics({
            type: 'MONTH',
          }),
          adminDashboardApi.getTopProducts({
            limit: 5,
          }),
        ])

        setSummary(summaryData)
        setRevenueStatistics(normalizeList(revenueData))
        setTopProducts(normalizeList(topProductData))
      } catch (error) {
        setMessage(error.message || 'Không thể tải dữ liệu dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  const cards = useMemo(() => {
    return [
      {
        title: 'Tổng doanh thu',
        value: formatCurrency(
          summary?.totalRevenue ||
            summary?.revenue ||
            summary?.totalAmount ||
            0
        ),
        icon: DollarSign,
        color: 'bg-green-50 text-green-600',
      },
      {
        title: 'Tổng đơn hàng',
        value:
          summary?.totalOrders ||
          summary?.orderCount ||
          summary?.orders ||
          0,
        icon: ShoppingBag,
        color: 'bg-blue-50 text-blue-600',
      },
      {
        title: 'Tổng sản phẩm',
        value:
          summary?.totalProducts ||
          summary?.productCount ||
          summary?.products ||
          0,
        icon: Package,
        color: 'bg-purple-50 text-purple-600',
      },
      {
        title: 'Tổng khách hàng',
        value:
          summary?.totalCustomers ||
          summary?.customerCount ||
          summary?.users ||
          0,
        icon: Users,
        color: 'bg-orange-50 text-orange-600',
      },
    ]
  }, [summary])

  if (loading) {
    return (
      <div>
        <div className="mb-6 h-10 w-72 animate-pulse rounded bg-gray-200" />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded bg-gray-200"
            />
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="h-96 animate-pulse rounded bg-gray-200" />
          <div className="h-96 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-900">
          Dashboard
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Tổng quan hoạt động kinh doanh của TechStore.
        </p>
      </div>

      {message && (
        <div className="mb-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {message}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon

          return (
            <div
              key={card.title}
              className="rounded-lg bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    {card.title}
                  </p>
                  <p className="mt-2 text-2xl font-black text-gray-900">
                    {card.value}
                  </p>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${card.color}`}
                >
                  <Icon size={24} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-gray-900">
                Doanh thu
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Thống kê doanh thu theo thời gian.
              </p>
            </div>

            <TrendingUp size={24} className="text-green-600" />
          </div>

          {revenueStatistics.length === 0 ? (
            <div className="rounded border border-dashed p-10 text-center text-gray-500">
              Chưa có dữ liệu doanh thu.
            </div>
          ) : (
            <div className="space-y-4">
              {revenueStatistics.slice(0, 12).map((item, index) => {
                const label =
                  item.date ||
                  item.month ||
                  item.period ||
                  item.label ||
                  `Mốc ${index + 1}`

                const revenue =
                  item.revenue ||
                  item.totalRevenue ||
                  item.amount ||
                  item.totalAmount ||
                  0

                const maxRevenue = Math.max(
                  ...revenueStatistics.map(
                    (row) =>
                      row.revenue ||
                      row.totalRevenue ||
                      row.amount ||
                      row.totalAmount ||
                      0
                  ),
                  1
                )

                const percent = Math.round((revenue / maxRevenue) * 100)

                return (
                  <div key={`${label}-${index}`}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-semibold text-gray-700">
                        {label}
                      </span>
                      <span className="font-bold text-red-600">
                        {formatCurrency(revenue)}
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-red-600"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-gray-900">
                Sản phẩm bán chạy
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Top sản phẩm có doanh số tốt.
              </p>
            </div>

            <Star size={24} className="text-orange-500" />
          </div>

          {topProducts.length === 0 ? (
            <div className="rounded border border-dashed p-10 text-center text-gray-500">
              Chưa có dữ liệu sản phẩm bán chạy.
            </div>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product, index) => {
                const productName =
                  product.productName ||
                  product.name ||
                  product.product?.name ||
                  'Sản phẩm'

                const soldQuantity =
                  product.soldQuantity ||
                  product.quantitySold ||
                  product.totalSold ||
                  product.quantity ||
                  0

                const revenue =
                  product.revenue ||
                  product.totalRevenue ||
                  product.totalAmount ||
                  0

                const imageUrl =
                  product.thumbnailUrl ||
                  product.imageUrl ||
                  product.productImage ||
                  'https://placehold.co/120x120?text=TechStore'

                return (
                  <div
                    key={`${productName}-${index}`}
                    className="flex items-center gap-3 rounded border p-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600 font-black text-white">
                      {index + 1}
                    </div>

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded border bg-white">
                      <img
                        src={imageUrl}
                        alt={productName}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="line-clamp-2 font-bold text-gray-900">
                        {productName}
                      </div>

                      <div className="mt-1 text-sm text-gray-500">
                        Đã bán: {soldQuantity}
                      </div>
                    </div>

                    <div className="text-right text-sm font-bold text-red-600">
                      {formatCurrency(revenue)}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function normalizeList(data) {
  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data?.content)) {
    return data.content
  }

  if (Array.isArray(data?.items)) {
    return data.items
  }

  if (Array.isArray(data?.data)) {
    return data.data
  }

  return []
}

export default AdminDashboardPage