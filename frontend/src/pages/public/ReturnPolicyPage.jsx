import { RotateCcw } from 'lucide-react'

function ReturnPolicyPage() {
  return (
    <div className="bg-[#e9e9e9]">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="rounded-md bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <RotateCcw size={30} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">
                Chính sách đổi trả
              </h1>
              <p className="mt-1 text-gray-500">
                Chính sách linh hoạt, sẵn sàng đổi trả hỗ trợ khách hàng tốt nhất tại TechStore.
              </p>
            </div>
          </div>

          <div className="prose prose-blue mt-6 max-w-none text-gray-700 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">1. Quy định đổi trả 1 ĐỔI 1 trong 7 ngày</h2>
            <p>Tất cả sản phẩm công nghệ (Laptop, PC, Bàn phím, Chuột...) mua tại TechStore nếu gặp lỗi kỹ thuật từ nhà sản xuất sẽ được áp dụng chính sách <strong>1 đổi 1 sản phẩm tương đương hoàn toàn miễn phí</strong> trong vòng <strong>7 ngày đầu tiên</strong> kể từ ngày mua hàng.</p>

            <h2 className="text-xl font-bold text-gray-900 mt-6">2. Điều kiện áp dụng đổi trả</h2>
            <p>Sản phẩm khi đổi trả cần đáp ứng các điều kiện bắt buộc sau đây:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Sản phẩm còn đầy đủ hộp (box), sách hướng dẫn, phụ kiện đi kèm (cáp sạc, đầu thu USB, tạ chuột...) và các quà tặng đi kèm đơn hàng (nếu có).</li>
              <li>Sản phẩm không có dấu hiệu va đập, cấn móp, nứt vỡ hoặc bị vào nước do người sử dụng.</li>
              <li>Hóa đơn mua hàng hoặc đơn hàng trên hệ thống TechStore phải được xác thực chính xác.</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-6">3. Quy trình thực hiện đổi trả</h2>
            <p>Để tiến hành đổi trả nhanh chóng, quý khách thực hiện các bước sau:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Bước 1:</strong> Liên hệ tổng đài hỗ trợ đổi trả hoặc fanpage TechStore để thông báo về lỗi sản phẩm.</li>
              <li><strong>Bước 2:</strong> Mang sản phẩm đến trực tiếp cửa hàng TechStore gần nhất để nhân viên kỹ thuật kiểm tra thực tế. Đối với khách hàng ở xa, quý khách có thể gửi chuyển phát nhanh sản phẩm về trung tâm bảo hành của TechStore.</li>
              <li><strong>Bước 3:</strong> Sau khi xác nhận lỗi đáp ứng điều kiện đổi mới, TechStore sẽ tiến hành gửi sản phẩm mới đến địa chỉ của quý khách sớm nhất.</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-6">4. Phương thức hoàn tiền</h2>
            <p>
              Trong trường hợp sản phẩm lỗi không còn hàng để đổi mới, quý khách có quyền lựa chọn đổi sang sản phẩm khác (bù trừ chênh lệch giá trị) hoặc yêu cầu hoàn lại tiền mua hàng. TechStore sẽ tiến hành chuyển khoản hoàn tiền cho quý khách trong vòng <strong>24h - 48h làm việc</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReturnPolicyPage
