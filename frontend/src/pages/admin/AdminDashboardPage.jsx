import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  Boxes,
  CreditCard,
  DollarSign,
  Package,
  ShoppingBag,
  Star,
  Tags,
  TrendingUp,
  Users,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { adminDashboardApi } from '../../api/adminDashboardApi'
import { formatCurrency } from '../../utils/formatCurrency'

const CHART_COLORS = [
  '#ef4444',
  '#3b82f6',
  '#22c55e',
  '#f97316',
  '#8b5cf6',
  '#06b6d4',
  '#eab308',
  '#ec4899',
]

function AdminDashboardPage() {
  const [summary, setSummary] = useState(null)
  const [revenueStatistics, setRevenueStatistics] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [categoryStatistics, setCategoryStatistics] = useState([])
  const [brandStatistics, setBrandStatistics] = useState([])
  const [paymentStatistics, setPaymentStatistics] = useState([])
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [recentOrders, setRecentOrders] = useState([])

  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [dateFilter, setDateFilter] = useState({
    fromDate: '',
    toDate: '',
  })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
  fetchDashboard()
}, [dateFilter])

  const fetchDashboard = async () => {
    setLoading(true)
    setMessage('')
    const dateParams = {}

    if (dateFilter.fromDate) {
      dateParams.fromDate = dateFilter.fromDate
    }

    if (dateFilter.toDate) {
      dateParams.toDate = dateFilter.toDate
    }
    try {
      const [
        summaryData,
        revenueData,
        topProductData,
        categoryData,
        brandData,
        paymentData,
        lowStockData,
        recentOrderData,
      ] = await Promise.all([
        adminDashboardApi.getSummary(),
        adminDashboardApi.getRevenueStatistics({
  type: dateFilter.fromDate || dateFilter.toDate ? 'day' : 'month',
  ...dateParams,
}),
        adminDashboardApi.getTopProducts({
          limit: 5,
        }),
        adminDashboardApi.getCategoryStatistics({
          limit: 8,
          ...dateParams,
        }),
        adminDashboardApi.getBrandStatistics({
          limit: 8,
          ...dateParams,
        }),
        adminDashboardApi.getPaymentStatistics(dateParams),
        adminDashboardApi.getLowStockProducts({
          limit: 5,
          threshold: 5,
        }),
        adminDashboardApi.getRecentOrders({
          limit: 5,
        }),
      ])

      setSummary(unwrapData(summaryData))
      setRevenueStatistics(normalizeList(revenueData))
      setTopProducts(normalizeList(topProductData))
      setCategoryStatistics(normalizeList(categoryData))
      setBrandStatistics(normalizeList(brandData))
      setPaymentStatistics(normalizeList(paymentData))
      setLowStockProducts(normalizeList(lowStockData))
      setRecentOrders(normalizeList(recentOrderData))
    } catch (error) {
      setMessage(
        error?.response?.data?.message ||
        error?.message ||
        'Không thể tải dữ liệu dashboard'
      )
    } finally {
      setLoading(false)
    }
  }

  const cards = useMemo(() => {
    return [
      {
        title: 'Doanh thu',
        value: formatCurrency(toNumber(summary?.totalRevenue)),
        icon: DollarSign,
        color: 'bg-green-50 text-green-600',
      },
      {
        title: 'Tổng đơn hàng',
        value: toNumber(summary?.totalOrders),
        icon: ShoppingBag,
        color: 'bg-blue-50 text-blue-600',
      },
      {
        title: 'Tổng sản phẩm',
        value: toNumber(summary?.totalProducts),
        icon: Package,
        color: 'bg-purple-50 text-purple-600',
      },
      {
        title: 'Tổng khách hàng',
        value: toNumber(summary?.totalCustomers),
        icon: Users,
        color: 'bg-orange-50 text-orange-600',
      },
    ]
  }, [summary])
const orderStatusCards = useMemo(() => {
  return [
    {
      title: 'Chờ xử lý',
      value: toNumber(summary?.pendingOrders),
      color: 'bg-yellow-50 text-yellow-700',
    },
    {
      title: 'Đã xác nhận',
      value: toNumber(summary?.confirmedOrders),
      color: 'bg-blue-50 text-blue-700',
    },
    {
      title: 'Đang giao',
      value: toNumber(summary?.shippingOrders),
      color: 'bg-indigo-50 text-indigo-700',
    },
    {
      title: 'Hoàn thành',
      value: toNumber(summary?.completedOrders),
      color: 'bg-green-50 text-green-700',
    },
    {
      title: 'Đã hủy',
      value: toNumber(summary?.cancelledOrders),
      color: 'bg-red-50 text-red-700',
    },
  ]
}, [summary])
   const handleApplyDateFilter = () => {
    if (fromDate && toDate && fromDate > toDate) {
      setMessage('Ngày bắt đầu không được lớn hơn ngày kết thúc')
      return
    }

    setMessage('')
    setDateFilter({
      fromDate,
      toDate,
    })
  }

  const handleClearDateFilter = () => {
    setFromDate('')
    setToDate('')
    setDateFilter({
      fromDate: '',
      toDate: '',
    })
    setMessage('')
  }

  const activeDateFilterText = getDateFilterText(dateFilter)

 
  if (loading) {
    return (
      <div>
        <div className="mb-6 h-10 w-72 animate-pulse rounded bg-gray-200" />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-lg bg-gray-200"
            />
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <div className="h-96 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-96 animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 space-y-4">
  <div>
    <h2 className="text-2xl font-black text-gray-900">
      Dashboard
    </h2>
    <p className="mt-1 text-sm text-gray-500">
      Tổng quan hoạt động kinh doanh của TechStore.
    </p>
  </div>

  <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
    <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <h3 className="text-sm font-black uppercase text-gray-900">
          Bộ lọc thống kê
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          Chọn khoảng thời gian cần xem doanh thu.
        </p>

        {activeDateFilterText && (
          <p className="mt-2 text-xs font-semibold text-blue-600">
            Đang lọc: {activeDateFilterText}
          </p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[180px_180px_auto_auto] lg:items-end">


        <label className="block">
          <span className="mb-1 block text-xs font-bold text-gray-600">
            Từ ngày
          </span>

          <input
            type="date"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
            className="h-10 w-full rounded border border-gray-300 bg-white px-3 text-sm font-semibold outline-none focus:border-red-500"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-bold text-gray-600">
            Đến ngày
          </span>

          <input
            type="date"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
            className="h-10 w-full rounded border border-gray-300 bg-white px-3 text-sm font-semibold outline-none focus:border-red-500"
          />
        </label>

        <button
          type="button"
          onClick={handleApplyDateFilter}
          className="h-10 rounded bg-red-600 px-5 text-sm font-black text-white hover:bg-red-700"
        >
          Lọc
        </button>

        <button
          type="button"
          onClick={handleClearDateFilter}
          className="h-10 rounded border border-gray-300 bg-white px-5 text-sm font-black text-gray-700 hover:bg-gray-50"
        >
          Bỏ lọc
        </button>
      </div>
    </div>
  </div>
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

      <div className="mt-6 grid gap-4 md:grid-cols-5">
        {orderStatusCards.map((item) => (
          <div
            key={item.title}
            className={`rounded-lg p-4 text-center shadow-sm ${item.color}`}
          >
            <p className="text-sm font-bold">{item.title}</p>
            <p className="mt-2 text-2xl font-black">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <SmallSummaryCard
          title="Tổng biến thể"
          value={toNumber(summary?.totalProductVariants)}
          icon={Boxes}
          color="bg-cyan-50 text-cyan-700"
        />

        <SmallSummaryCard
          title="Tổng đánh giá"
          value={toNumber(summary?.totalReviews)}
          icon={Star}
          color="bg-amber-50 text-amber-700"
        />

        <SmallSummaryCard
          title="Sản phẩm tồn kho thấp"
          value={lowStockProducts.length}
          icon={AlertTriangle}
          color="bg-red-50 text-red-700"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <DashboardPanel
          title="Doanh thu"
          description="Thống kê doanh thu theo ngày hoặc theo tháng."
          icon={TrendingUp}
          iconClassName="text-green-600"
        >
          <RevenueLineChart data={revenueStatistics} />
        </DashboardPanel>

        <DashboardPanel
          title="Sản phẩm bán chạy"
          description="Top sản phẩm có số lượng bán tốt."
          icon={Star}
          iconClassName="text-orange-500"
        >
          {topProducts.length === 0 ? (
            <EmptyBox text="Chưa có dữ liệu sản phẩm bán chạy." />
          ) : (
            <div className="space-y-4">
              {topProducts.map((product, index) => {
                const productName =
                  product?.productName ||
                  product?.name ||
                  product?.product?.name ||
                  'Sản phẩm'

                const variantName =
                  product?.variantName ||
                  product?.productVariantName ||
                  ''

                const soldQuantity = toNumber(
                  product?.totalQuantitySold ||
                  product?.soldQuantity ||
                  product?.quantitySold ||
                  product?.totalSold ||
                  product?.quantity
                )

                const revenue = toNumber(
                  product?.totalRevenue ||
                  product?.revenue ||
                  product?.totalAmount
                )

                const imageUrl =
                  product?.thumbnailUrl ||
                  product?.imageUrl ||
                  product?.productImage ||
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

                      {variantName && (
                        <div className="mt-1 line-clamp-1 text-xs text-gray-500">
                          {variantName}
                        </div>
                      )}

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
        </DashboardPanel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <DashboardPanel
          title="Doanh thu theo danh mục"
          description="Thống kê số lượng bán và doanh thu theo danh mục."
          icon={Tags}
          iconClassName="text-purple-600"
        >
          <StatisticBarChart
            data={categoryStatistics}
            emptyText="Chưa có dữ liệu thống kê danh mục."
            nameKey="categoryName"
          />
        </DashboardPanel>

        <DashboardPanel
          title="Doanh thu theo thương hiệu"
          description="Thống kê số lượng bán và doanh thu theo thương hiệu."
          icon={Package}
          iconClassName="text-blue-600"
        >
          <StatisticBarChart
            data={brandStatistics}
            emptyText="Chưa có dữ liệu thống kê thương hiệu."
            nameKey="brandName"
          />
        </DashboardPanel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <DashboardPanel
          title="Thống kê thanh toán"
          description="Thống kê theo phương thức và trạng thái thanh toán."
          icon={CreditCard}
          iconClassName="text-indigo-600"
        >
          {paymentStatistics.length === 0 ? (
            <EmptyBox text="Chưa có dữ liệu thanh toán." />
          ) : (
            <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
              <PaymentPieChart data={paymentStatistics} />

              <div className="overflow-hidden rounded border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-3">Phương thức</th>
                      <th className="px-4 py-3">Trạng thái</th>
                      <th className="px-4 py-3 text-center">Số đơn</th>
                      <th className="px-4 py-3 text-right">Số tiền</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {paymentStatistics.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 font-semibold text-gray-900">
                          {formatPaymentMethod(item?.method)}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge value={item?.status} />
                        </td>
                        <td className="px-4 py-3 text-center font-bold">
                          {toNumber(item?.totalOrders)}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-red-600">
                          {formatCurrency(toNumber(item?.totalAmount))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </DashboardPanel>

        <DashboardPanel
          title="Sản phẩm tồn kho thấp"
          description="Các biến thể sản phẩm có số lượng tồn kho thấp."
          icon={AlertTriangle}
          iconClassName="text-red-600"
        >
          {lowStockProducts.length === 0 ? (
            <EmptyBox text="Không có sản phẩm tồn kho thấp." />
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((item, index) => {
                const productName = item?.productName || 'Sản phẩm'
                const variantName = item?.variantName || ''
                const sku = item?.productSku || item?.sku || ''
                const stock = toNumber(item?.stock)

                return (
                  <div
                    key={`${sku}-${index}`}
                    className="flex items-center justify-between gap-4 rounded border p-3"
                  >
                    <div className="min-w-0">
                      <p className="line-clamp-1 font-bold text-gray-900">
                        {productName}
                      </p>

                      <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                        {variantName}
                        {sku ? ` | SKU: ${sku}` : ''}
                      </p>
                    </div>

                    <div className="rounded bg-red-50 px-3 py-1 text-sm font-black text-red-600">
                      Còn {stock}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </DashboardPanel>
      </div>

      <div className="mt-6">
        <DashboardPanel
          title="Đơn hàng gần đây"
          description="Danh sách các đơn hàng mới phát sinh trong hệ thống."
          icon={ShoppingBag}
          iconClassName="text-blue-600"
        >
          {recentOrders.length === 0 ? (
            <EmptyBox text="Chưa có đơn hàng gần đây." />
          ) : (
            <div className="overflow-hidden rounded border">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-3">Mã đơn</th>
                    <th className="px-4 py-3">Khách hàng</th>
                    <th className="px-4 py-3">Trạng thái đơn</th>
                    <th className="px-4 py-3">Thanh toán</th>
                    <th className="px-4 py-3 text-right">Tổng tiền</th>
                    <th className="px-4 py-3 text-right">Ngày đặt</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {recentOrders.map((order, index) => (
                    <tr key={`${order?.orderCode}-${index}`}>
                      <td className="px-4 py-3 font-bold text-gray-900">
                        {order?.orderCode || '---'}
                      </td>

                      <td className="px-4 py-3">
                        {order?.customerName || 'Khách hàng'}
                      </td>

                      <td className="px-4 py-3">
                        <OrderStatusBadge value={order?.orderStatus} />
                      </td>

                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className="font-semibold text-gray-700">
                            {formatPaymentMethod(order?.paymentMethod)}
                          </div>
                          <StatusBadge value={order?.paymentStatus} />
                        </div>
                      </td>

                      <td className="px-4 py-3 text-right font-bold text-red-600">
                        {formatCurrency(toNumber(order?.finalAmount))}
                      </td>

                      <td className="px-4 py-3 text-right text-gray-500">
                        {formatDateTime(order?.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DashboardPanel>
      </div>
    </div>
  )
}

function RevenueLineChart({ data }) {
  const chartData = normalizeList(data).map((item, index) => ({
    name:
      item?.label ||
      item?.date ||
      item?.month ||
      item?.period ||
      `Mốc ${index + 1}`,
    revenue: toNumber(
      item?.revenue ||
      item?.totalRevenue ||
      item?.amount ||
      item?.totalAmount
    ),
    orderCount: toNumber(item?.orderCount || item?.totalOrders),
  }))

  if (chartData.length === 0) {
    return <EmptyBox text="Chưa có dữ liệu doanh thu." />
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={formatShortCurrency} />
          <Tooltip content={<RevenueTooltip />} />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function StatisticBarChart({ data, emptyText, nameKey }) {
  const chartData = normalizeList(data).map((item, index) => ({
    name: item?.[nameKey] || item?.name || `Mục ${index + 1}`,
    revenue: toNumber(item?.totalRevenue),
    quantity: toNumber(item?.totalQuantitySold),
    orders: toNumber(item?.totalOrders),
  }))

  if (chartData.length === 0) {
    return <EmptyBox text={emptyText} />
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={formatShortCurrency} />
          <Tooltip content={<StatisticTooltip />} />
          <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function PaymentPieChart({ data }) {
  const chartData = normalizeList(data).map((item, index) => {
    const amount = toNumber(item?.totalAmount)
    const orders = toNumber(item?.totalOrders)

    return {
      name: `${formatPaymentMethod(item?.method)} - ${formatPaymentStatus(
        item?.status
      )}`,
      value: amount > 0 ? amount : orders,
      amount,
      orders,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }
  })

  if (chartData.length === 0) {
    return <EmptyBox text="Chưa có dữ liệu thanh toán." />
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<PaymentTooltip />} />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={85}
            innerRadius={45}
            paddingAngle={4}
          >
            {chartData.map((item, index) => (
              <Cell key={`payment-${index}`} fill={item.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

function RevenueTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const item = payload[0].payload

  return (
    <div className="rounded border bg-white px-3 py-2 shadow">
      <p className="font-bold text-gray-900">{label}</p>
      <p className="text-sm text-red-600">
        Doanh thu: {formatCurrency(item.revenue)}
      </p>
      <p className="text-sm text-gray-600">Số đơn: {item.orderCount}</p>
    </div>
  )
}

function StatisticTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const item = payload[0].payload

  return (
    <div className="rounded border bg-white px-3 py-2 shadow">
      <p className="font-bold text-gray-900">{label}</p>
      <p className="text-sm text-red-600">
        Doanh thu: {formatCurrency(item.revenue)}
      </p>
      <p className="text-sm text-gray-600">Đã bán: {item.quantity}</p>
      <p className="text-sm text-gray-600">Số đơn: {item.orders}</p>
    </div>
  )
}

function PaymentTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const item = payload[0].payload

  return (
    <div className="rounded border bg-white px-3 py-2 shadow">
      <p className="font-bold text-gray-900">{item.name}</p>
      <p className="text-sm text-red-600">
        Số tiền: {formatCurrency(item.amount)}
      </p>
      <p className="text-sm text-gray-600">Số đơn: {item.orders}</p>
    </div>
  )
}

function SmallSummaryCard({ title, value, icon: Icon, color }) {
  return (
    <div className={`rounded-lg p-4 shadow-sm ${color}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold">{title}</p>
          <p className="mt-2 text-2xl font-black">{value}</p>
        </div>

        <Icon size={26} />
      </div>
    </div>
  )
}

function DashboardPanel({
  title,
  description,
  icon: Icon,
  iconClassName = '',
  children,
}) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>

        {Icon && <Icon size={24} className={iconClassName} />}
      </div>

      {children}
    </div>
  )
}

function EmptyBox({ text }) {
  return (
    <div className="rounded border border-dashed p-10 text-center text-gray-500">
      {text}
    </div>
  )
}

function StatusBadge({ value }) {
  const status = value || 'PENDING'

  const className =
    status === 'PAID'
      ? 'bg-green-50 text-green-700'
      : status === 'FAILED'
        ? 'bg-red-50 text-red-700'
        : 'bg-yellow-50 text-yellow-700'

  return (
    <span className={`rounded px-2 py-1 text-xs font-bold ${className}`}>
      {formatPaymentStatus(status)}
    </span>
  )
}

function OrderStatusBadge({ value }) {
  const status = value || 'PENDING'

  const className =
    status === 'COMPLETED'
      ? 'bg-green-50 text-green-700'
      : status === 'CANCELLED'
        ? 'bg-red-50 text-red-700'
        : status === 'SHIPPING'
          ? 'bg-indigo-50 text-indigo-700'
          : status === 'CONFIRMED'
            ? 'bg-blue-50 text-blue-700'
            : 'bg-yellow-50 text-yellow-700'

  return (
    <span className={`rounded px-2 py-1 text-xs font-bold ${className}`}>
      {formatOrderStatus(status)}
    </span>
  )
}

function unwrapData(response) {
  if (response?.data !== undefined) {
    return response.data
  }

  return response
}

function normalizeList(response) {
  const data = unwrapData(response)

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

function toNumber(value) {
  if (value === null || value === undefined || value === '') {
    return 0
  }

  const numberValue = Number(value)

  if (Number.isNaN(numberValue)) {
    return 0
  }

  return numberValue
}

function formatShortCurrency(value) {
  const numberValue = toNumber(value)

  if (numberValue >= 1000000000) {
    return `${numberValue / 1000000000} tỷ`
  }

  if (numberValue >= 1000000) {
    return `${numberValue / 1000000} tr`
  }

  if (numberValue >= 1000) {
    return `${numberValue / 1000}k`
  }

  return numberValue
}

function formatPaymentMethod(value) {
  if (value === 'BANK_TRANSFER') {
    return 'Chuyển khoản'
  }

  if (value === 'COD') {
    return 'COD'
  }

  return value || '---'
}

function formatPaymentStatus(value) {
  if (value === 'PAID') {
    return 'Đã thanh toán'
  }

  if (value === 'FAILED') {
    return 'Thất bại'
  }

  if (value === 'PENDING') {
    return 'Chờ thanh toán'
  }

  return value || '---'
}

function formatOrderStatus(value) {
  if (value === 'PENDING') {
    return 'Chờ xử lý'
  }

  if (value === 'CONFIRMED') {
    return 'Đã xác nhận'
  }

  if (value === 'SHIPPING') {
    return 'Đang giao'
  }

  if (value === 'COMPLETED') {
    return 'Hoàn thành'
  }

  if (value === 'CANCELLED') {
    return 'Đã hủy'
  }

  return value || '---'
}

function formatDateTime(value) {
  if (!value) {
    return '---'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString('vi-VN')
}
function getDateFilterText(dateFilter) {
  if (!dateFilter?.fromDate && !dateFilter?.toDate) {
    return ''
  }

  if (dateFilter.fromDate && dateFilter.toDate) {
    return `từ ${formatDateOnly(dateFilter.fromDate)} đến ${formatDateOnly(
      dateFilter.toDate
    )}`
  }

  if (dateFilter.fromDate) {
    return `từ ${formatDateOnly(dateFilter.fromDate)}`
  }

  return `đến ${formatDateOnly(dateFilter.toDate)}`
}

function formatDateOnly(value) {
  if (!value) {
    return ''
  }

  const [year, month, day] = String(value).split('-')

  if (!year || !month || !day) {
    return value
  }

  return `${day}/${month}/${year}`
}
export default AdminDashboardPage