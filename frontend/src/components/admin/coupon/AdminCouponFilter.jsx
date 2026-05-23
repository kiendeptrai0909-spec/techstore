function AdminCouponFilter({ filters, setFilters, onSubmit, onReset }) {
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
        className="grid gap-4 lg:grid-cols-[1fr_180px_180px_140px]"
      >
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Tìm kiếm
          </label>

          <input
            value={filters.keyword}
            onChange={(event) => handleChange('keyword', event.target.value)}
            placeholder="Mã coupon..."
            className="h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Loại giảm giá
          </label>

          <select
            value={filters.discountType}
            onChange={(event) =>
              handleChange('discountType', event.target.value)
            }
            className="h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500"
          >
            <option value="">Tất cả</option>
            <option value="PERCENTAGE">Phần trăm</option>
            <option value="FIXED">Số tiền cố định</option>
          </select>
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
            <option value="">Tất cả</option>
            <option value="ACTIVE">Đang hoạt động</option>
            <option value="INACTIVE">Ngừng hoạt động</option>
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

export default AdminCouponFilter