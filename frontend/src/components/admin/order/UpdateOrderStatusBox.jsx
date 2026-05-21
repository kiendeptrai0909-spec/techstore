import { useEffect, useState } from 'react'

function UpdateOrderStatusBox({
  currentStatus,
  onUpdateStatus,
  updating,
}) {
  const [status, setStatus] = useState(currentStatus || 'PENDING')

  useEffect(() => {
    setStatus(currentStatus || 'PENDING')
  }, [currentStatus])

  const statuses = [
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

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!status || status === currentStatus) {
      return
    }

    onUpdateStatus(status)
  }

  return (
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <h2 className="text-xl font-black text-gray-900">
        Cập nhật trạng thái
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Trạng thái đơn hàng
          </label>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            disabled={updating}
            className="h-11 w-full rounded border px-4 text-sm outline-none focus:border-red-500"
          >
            {statuses.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={updating || status === currentStatus}
          className="w-full rounded bg-red-600 px-5 py-3 font-black text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {updating ? 'Đang cập nhật...' : 'Cập nhật trạng thái'}
        </button>
      </form>

      <p className="mt-3 text-sm text-gray-500">
        Khi cập nhật trạng thái, khách hàng sẽ thấy thay đổi trong trang
        “Đơn hàng của tôi”.
      </p>
    </div>
  )
}

export default UpdateOrderStatusBox