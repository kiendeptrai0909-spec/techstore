import { useEffect, useState } from 'react'

function UpdateContactMessageStatusBox({
  currentStatus,
  onUpdateStatus,
  updating,
}) {
  const [status, setStatus] = useState(currentStatus || 'NEW')

  useEffect(() => {
    setStatus(currentStatus || 'NEW')
  }, [currentStatus])

  const statuses = [
    {
      value: 'NEW',
      label: 'Mới',
    },
    {
      value: 'PROCESSING',
      label: 'Đang xử lý',
    },
    {
      value: 'RESOLVED',
      label: 'Đã xử lý',
    },
    {
      value: 'CLOSED',
      label: 'Đã đóng',
    },
  ]

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!status) return

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
            Trạng thái xử lý
          </label>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
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
        Dùng trạng thái này để theo dõi quá trình xử lý yêu cầu liên hệ của
        khách hàng.
      </p>
    </div>
  )
}

export default UpdateContactMessageStatusBox