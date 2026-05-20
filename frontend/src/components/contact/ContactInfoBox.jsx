import {
  Clock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  Wrench,
} from 'lucide-react'

function ContactInfoBox() {
  const infoItems = [
    {
      icon: Phone,
      title: 'Hotline',
      value: '0909.123.456',
      description: 'Hỗ trợ tư vấn mua hàng và kỹ thuật.',
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'support@techstore.vn',
      description: 'Gửi yêu cầu hỗ trợ qua email.',
    },
    {
      icon: MapPin,
      title: 'Địa chỉ',
      value: '123 Nguyễn Trãi, Quận 1, TP.HCM',
      description: 'Showroom và trung tâm bảo hành.',
    },
    {
      icon: Clock,
      title: 'Giờ làm việc',
      value: '08:00 - 21:00',
      description: 'Tất cả các ngày trong tuần.',
    },
  ]

  const services = [
    {
      icon: Wrench,
      title: 'Tư vấn build PC',
      description: 'Hỗ trợ chọn cấu hình theo nhu cầu và ngân sách.',
    },
    {
      icon: Truck,
      title: 'Giao hàng toàn quốc',
      description: 'Giao hàng nhanh, đóng gói cẩn thận.',
    },
    {
      icon: ShieldCheck,
      title: 'Bảo hành chính hãng',
      description: 'Sản phẩm rõ nguồn gốc, chính sách minh bạch.',
    },
  ]

  return (
    <div className="space-y-5">
      <div className="rounded-md bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-gray-900">
          Thông tin liên hệ
        </h2>

        <div className="mt-4 space-y-4">
          {infoItems.map((item) => {
            const Icon = item.icon

            return (
              <div key={item.title} className="flex gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <Icon size={21} />
                </div>

                <div>
                  <div className="font-bold text-gray-900">{item.title}</div>
                  <div className="mt-1 font-black text-red-600">
                    {item.value}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {item.description}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-md bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-gray-900">
          Dịch vụ hỗ trợ
        </h2>

        <div className="mt-4 space-y-3">
          {services.map((service) => {
            const Icon = service.icon

            return (
              <div
                key={service.title}
                className="rounded border bg-gray-50 p-4"
              >
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <Icon size={19} className="text-red-600" />
                  {service.title}
                </div>

                <div className="mt-2 text-sm leading-6 text-gray-600">
                  {service.description}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ContactInfoBox