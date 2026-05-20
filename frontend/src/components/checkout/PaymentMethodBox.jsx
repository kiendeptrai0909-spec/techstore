import { Banknote, CreditCard } from 'lucide-react'

function PaymentMethodBox({ value, onChange }) {
  const methods = [
    {
      value: 'COD',
      title: 'Thanh toán khi nhận hàng',
      description: 'Thanh toán bằng tiền mặt khi đơn hàng được giao.',
      icon: Banknote,
    },
    {
      value: 'MOCK_BANKING',
      title: 'Thanh toán giả lập',
      description: 'Dùng để test luồng thanh toán online trong hệ thống.',
      icon: CreditCard,
    },
  ]

  return (
    <div className="rounded-md bg-white p-5 shadow-sm">
      <h2 className="text-xl font-black text-gray-900">
        Phương thức thanh toán
      </h2>

      <div className="mt-4 grid gap-3">
        {methods.map((method) => {
          const Icon = method.icon
          const active = value === method.value

          return (
            <button
              key={method.value}
              type="button"
              onClick={() => onChange(method.value)}
              className={
                active
                  ? 'flex items-start gap-3 rounded-md border-2 border-red-600 bg-red-50 p-4 text-left'
                  : 'flex items-start gap-3 rounded-md border bg-white p-4 text-left hover:border-red-500'
              }
            >
              <div
                className={
                  active
                    ? 'flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white'
                    : 'flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700'
                }
              >
                <Icon size={20} />
              </div>

              <div>
                <div className="font-bold text-gray-900">{method.title}</div>
                <div className="mt-1 text-sm text-gray-500">
                  {method.description}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default PaymentMethodBox