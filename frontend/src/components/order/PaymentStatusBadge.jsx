function PaymentStatusBadge({ status }) {
  const statusMap = {
    PENDING: {
      label: 'Chưa thanh toán',
      className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    },
    PAID: {
      label: 'Đã thanh toán',
      className: 'bg-green-50 text-green-700 border-green-200',
    },
    FAILED: {
      label: 'Thanh toán thất bại',
      className: 'bg-red-50 text-red-700 border-red-200',
    },
    REFUNDED: {
      label: 'Đã hoàn tiền',
      className: 'bg-gray-50 text-gray-700 border-gray-200',
    },
    SUCCESS: {
      label: 'Đã thanh toán',
      className: 'bg-green-50 text-green-700 border-green-200',
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

export default PaymentStatusBadge