import { EyeOff } from 'lucide-react'

function PrivacyPolicyPage() {
  return (
    <div className="bg-[#e9e9e9]">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="rounded-md bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <EyeOff size={30} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">
                Chính sách bảo mật
              </h1>
              <p className="mt-1 text-gray-500">
                Bảo vệ thông tin cá nhân và quyền riêng tư của quý khách hàng tuyệt đối.
              </p>
            </div>
          </div>

          <div className="prose prose-blue mt-6 max-w-none text-gray-700 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">1. Mục đích thu thập thông tin cá nhân</h2>
            <p>TechStore thu thập thông tin cá nhân của quý khách (bao gồm: Họ tên, Số điện thoại, Email, Địa chỉ giao hàng) để phục vụ cho các mục đích:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Xử lý và thực hiện giao nhận đơn hàng.</li>
              <li>Hỗ trợ kỹ thuật, giải quyết khiếu nại và các dịch vụ sau bán hàng như bảo hành, bảo dưỡng sản phẩm.</li>
              <li>Gửi các chương trình khuyến mãi, ưu đãi đặc biệt nếu khách hàng đăng ký nhận tin.</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-6">2. Phạm vi sử dụng thông tin</h2>
            <p>Chúng tôi cam kết chỉ sử dụng thông tin cá nhân của quý khách hàng trong phạm vi nội bộ của hệ thống TechStore và cung cấp cho đối tác giao nhận để hoàn thành đơn hàng. Tuyệt đối không chia sẻ, mua bán thông tin cá nhân của khách hàng cho bất kỳ bên thứ ba nào khác khi chưa được sự đồng ý của quý khách.</p>

            <h2 className="text-xl font-bold text-gray-900 mt-6">3. Thời gian lưu trữ thông tin</h2>
            <p>Thông tin cá nhân của khách hàng sẽ được lưu trữ và bảo mật trên hệ thống máy chủ của TechStore cho đến khi đơn hàng hoàn tất hoặc khi nhận được yêu cầu hủy bỏ thông tin trực tiếp từ phía khách hàng.</p>

            <h2 className="text-xl font-bold text-gray-900 mt-6">4. Cam kết bảo mật thông tin</h2>
            <p>
              Hệ thống thanh toán trực tuyến trên trang web TechStore đều được bảo vệ bằng các tiêu chuẩn bảo mật dữ liệu tiên tiến, đảm bảo thông tin tài khoản của quý khách không bị rò rỉ hoặc đánh cắp. Chúng tôi luôn áp dụng các biện pháp an ninh mạng cao nhất để ngăn ngừa việc truy cập trái phép.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-6">5. Quyền lợi của khách hàng</h2>
            <p>
              Quý khách có quyền kiểm tra, cập nhật hoặc điều chỉnh thông tin cá nhân của mình bằng cách đăng nhập vào tài khoản trên website TechStore hoặc liên hệ trực tiếp với bộ phận chăm sóc khách hàng của chúng tôi để được hỗ trợ.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
