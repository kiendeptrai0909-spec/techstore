import { ShieldCheck } from 'lucide-react'

function WarrantyPolicyPage() {
  return (
    <div className="bg-[#e9e9e9]">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="rounded-md bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <ShieldCheck size={30} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">
                Chính sách bảo hành
              </h1>
              <p className="mt-1 text-gray-500">
                Cam kết bảo hành chính hãng, uy tín và nhanh chóng tại TechStore.
              </p>
            </div>
          </div>

          <div className="prose prose-blue mt-6 max-w-none text-gray-700 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">1. Điều kiện bảo hành miễn phí</h2>
            <p>Sản phẩm sẽ được bảo hành miễn phí nếu đáp ứng đầy đủ các điều kiện sau:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Sản phẩm còn trong thời hạn bảo hành quy định của TechStore (tính từ ngày mua hàng hiển thị trên hệ thống).</li>
              <li>Sản phẩm bị lỗi kỹ thuật do nhà sản xuất.</li>
              <li>Số Serial Number (S/N) hoặc tem bảo hành dán trên sản phẩm phải còn nguyên vẹn, không bị rách, mờ hay tẩy xóa.</li>
              <li>Sản phẩm không thuộc nhóm từ chối bảo hành do lỗi người dùng.</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-6">2. Trường hợp không được bảo hành (Sửa chữa dịch vụ)</h2>
            <p>Sản phẩm thuộc các trường hợp sau sẽ không được bảo hành miễn phí, TechStore hỗ trợ sửa chữa tính phí:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Sản phẩm đã hết thời hạn bảo hành.</li>
              <li>Sản phẩm có dấu hiệu bị cạy mở, thay đổi linh kiện hoặc đã qua sửa chữa ở những nơi không thuộc hệ thống bảo hành của TechStore.</li>
              <li>Sản phẩm bị hư hỏng do tác động vật lý (rơi vỡ, cấn móp, trầy xước mạnh), biến dạng do nhiệt độ cao, ẩm ướt hoặc bị vào nước, chất lỏng.</li>
              <li>Sản phẩm bị hư hại do thiên tai, hỏa hoạn, côn trùng xâm nhập hoặc sử dụng sai điện áp quy định.</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-6">3. Thời gian giải quyết bảo hành</h2>
            <p>
              Thời gian kiểm tra và xử lý bảo hành trung bình từ <strong>3 đến 7 ngày làm việc</strong> (không tính Chủ Nhật và ngày lễ). Trong trường hợp linh kiện thay thế cần nhập khẩu trực tiếp từ nhà sản xuất, thời gian bảo hành có thể kéo dài hơn và TechStore sẽ thông báo trước cho quý khách hàng.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-6">4. Địa điểm tiếp nhận bảo hành</h2>
            <p>
              Quý khách có thể mang trực tiếp sản phẩm đến các chi nhánh cửa hàng TechStore trên toàn quốc hoặc gửi qua bưu điện kèm theo mô tả lỗi chi tiết. Mọi thông tin thắc mắc vui lòng liên hệ hotline bảo hành: <strong className="text-blue-600">0909.456.789</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WarrantyPolicyPage
