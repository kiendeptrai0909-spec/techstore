import { MessageSquare } from 'lucide-react'
import ContactForm from '../../components/contact/ContactForm'
import ContactInfoBox from '../../components/contact/ContactInfoBox'

function ContactPage() {
  return (
    <div className="bg-[#e9e9e9]">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-5 rounded-md bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <MessageSquare size={30} />
            </div>

            <div>
              <h1 className="text-3xl font-black text-gray-900">
                Liên hệ TechStore
              </h1>

              <p className="mt-1 text-gray-500">
                Cần tư vấn sản phẩm, bảo hành hoặc hỗ trợ đơn hàng? Hãy gửi
                thông tin cho chúng tôi.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
          <ContactForm />
          <ContactInfoBox />
        </div>

        <div className="mt-5 overflow-hidden rounded-md bg-white shadow-sm">
          <div className="flex h-[320px] items-center justify-center bg-gray-100 text-center text-gray-500">
            <div>
              <div className="text-lg font-black text-gray-800">
                Bản đồ showroom
              </div>
              <div className="mt-2 text-sm">
                Bạn có thể thay phần này bằng Google Map iframe sau.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage