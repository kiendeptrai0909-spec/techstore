import { Truck } from 'lucide-react'

function ShippingPolicyPage() {
  return (
    <div className="bg-[#e9e9e9]">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="rounded-md bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Truck size={30} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">
                Chính sách giao hàng
              </h1>
              <p className="mt-1 text-gray-500">
                Dịch vụ vận chuyển chuyên nghiệp, nhanh chóng và an toàn của TechStore.
              </p>
            </div>
          </div>

          <div className="prose prose-blue mt-6 max-w-none text-gray-700 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">1. Phạm vi giao hàng</h2>
            <p>TechStore hỗ trợ giao hàng tận nơi trên toàn quốc (63 tỉnh thành) thông qua các đối tác vận chuyển uy tín như Giao Hàng Nhanh (GHN), Giao Hàng Tiết Kiệm (GHTK), Viettel Post và đội ngũ giao hàng nội bộ siêu tốc của chúng tôi.</p>

            <h2 className="text-xl font-bold text-gray-900 mt-6">2. Thời gian giao hàng dự kiến</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Nội thành (Hà Nội / TP. HCM):</strong> Giao hàng siêu tốc trong vòng 2 - 4 giờ hoặc giao trong ngày đối với các đơn hàng đặt trước 16h00.</li>
              <li><strong>Các khu vực tỉnh/thành phố khác:</strong> Thời gian nhận hàng dao động từ 2 đến 4 ngày làm việc tùy thuộc vào khoảng cách địa lý.</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-6">3. Phí vận chuyển</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Miễn phí vận chuyển toàn quốc</strong> áp dụng cho tất cả các đơn hàng có giá trị từ <strong>5.000.000đ trở lên</strong>.</li>
              <li>Đối với các đơn hàng dưới 5.000.000đ, phí vận chuyển sẽ được tự động tính toán dựa trên khoảng cách và cân nặng sản phẩm khi quý khách tiến hành thanh toán tại trang checkout.</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-6">4. Kiểm tra hàng trước khi nhận (Đồng kiểm)</h2>
            <p>
              Để bảo vệ quyền lợi tối đa, quý khách vui lòng <strong>kiểm tra ngoại quan sản phẩm</strong> trước khi ký nhận hàng từ nhân viên giao hàng. Nếu phát hiện sản phẩm bị móp méo, bể vỡ hoặc không đúng sản phẩm đã đặt, quý khách có quyền từ chối nhận hàng và liên hệ ngay với hotline CSKH để được xử lý.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-6">5. Trách nhiệm với hàng hóa vận chuyển</h2>
            <p>
              Nếu dịch vụ vận chuyển do TechStore chỉ định, chúng tôi sẽ chịu trách nhiệm hoàn toàn với các rủi ro như mất mát hoặc hư hại sản phẩm trong suốt quá trình vận chuyển từ kho hàng đến tay quý khách.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShippingPolicyPage
