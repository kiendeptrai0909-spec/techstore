function OrderStatusBadge({ status }) {
  const statusMap = {
    PENDING: {
      label: 'Chờ xác nhận',
      className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    },
    CONFIRMED: {
      label: 'Đã xác nhận',
      className: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    SHIPPING: {
      label: 'Đang giao hàng',
      className: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    COMPLETED: {
      label: 'Hoàn thành',
      className: 'bg-green-50 text-green-700 border-green-200',
    },
    CANCELLED: {
      label: 'Đã hủy',
      className: 'bg-red-50 text-red-700 border-red-200',
    },
  }

  const current = statusMap[status] || {
    label: status || 'Không rõ',
    className: 'bg-gray-50 text-gray-700 border-gray-200',
  }

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${current.className}`}
    >
      {current.label}
    </span>
  )
}

export default OrderStatusBadge