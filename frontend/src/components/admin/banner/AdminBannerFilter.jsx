function AdminBannerFilter({ filters, setFilters, onSubmit, onReset }) {
  const positions = [
    { value: '', label: 'Tất cả vị trí' },
    { value: 'HOME_TOP', label: 'Trang chủ - đầu trang' },
    { value: 'HOME_MIDDLE', label: 'Trang chủ - giữa trang' },
    { value: 'HOME_BOTTOM', label: 'Trang chủ - cuối trang' },
    { value: 'SIDEBAR_LEFT', label: 'Banner trái' },
    { value: 'SIDEBAR_RIGHT', label: 'Banner phải' },
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
        className="grid gap-4 lg:grid-cols-[1fr_220px_180px_140px]"
      >
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Tìm kiếm
          </label>

          <input
            value={filters.keyword}
            onChange={(event) => handleChange('keyword', event.target.value)}
            placeholder="Tiêu đề banner..."
            className="h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Vị trí
          </label>

          <select
            value={filters.position}
            onChange={(event) => handleChange('position', event.target.value)}
            className="h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500"
          >
            {positions.map((position) => (
              <option key={position.value} value={position.value}>
                {position.label}
              </option>
            ))}
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
            <option value="ACTIVE">Đang hiển thị</option>
            <option value="INACTIVE">Đang ẩn</option>
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

export default AdminBannerFilter