function AdminOrderFilter({ filters, setFilters, onSubmit, onReset }) {
  const orderStatuses = [
    {
      value: '',
      label: 'Tất cả trạng thái',
    },
    {
      value: 'PENDING',
      label: 'Chờ xác nhận',
    },
    {
      value: 'CONFIRMED',
      label: 'Đã xác nhận',
    },
    {
      value: 'SHIPPING',
      label: 'Đang giao hàng',
    },
    {
      value: 'COMPLETED',
      label: 'Hoàn thành',
    },
    {
      value: 'CANCELLED',
      label: 'Đã hủy',
    },
  ]

  const handleChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <form
        onSubmit={onSubmit}
        className="grid gap-4 md:grid-cols-[1fr_220px_160px_120px]"
      >
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Tìm kiếm
          </label>

          <input
            value={filters.keyword}
            onChange={(event) => handleChange('keyword', event.target.value)}
            placeholder="Mã đơn, tên người nhận, số điện thoại..."
            className="h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Trạng thái
          </label>

          <select
            value={filters.status}
            onChange={(event) => handleChange('status', event.target.value)}
            className="h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500"
          >
            {orderStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Kích thước trang
          </label>

          <select
            value={filters.size}
            onChange={(event) => handleChange('size', event.target.value)}
            className="h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500"
          >
            <option value="10">10 dòng</option>
            <option value="20">20 dòng</option>
            <option value="50">50 dòng</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="h-11 flex-1 rounded bg-red-600 px-4 text-sm font-black text-white hover:bg-red-700"
          >
            Lọc
          </button>

          <button
            type="button"
            onClick={onReset}
            className="h-11 rounded border px-4 text-sm font-bold text-gray-700 hover:border-red-500 hover:text-red-600"
          >
            Xóa
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminOrderFilter