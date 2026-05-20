function Footer() {
  return (
    <footer className="mt-8 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-5">
        <div>
          <h4 className="mb-3 font-bold uppercase">Về TechStore</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>Giới thiệu</li>
            <li>Tuyển dụng</li>
            <li>Liên hệ</li>
            <li>Hệ thống cửa hàng</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-bold uppercase">Chính sách</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>Chính sách bảo hành</li>
            <li>Chính sách giao hàng</li>
            <li>Chính sách bảo mật</li>
            <li>Chính sách đổi trả</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-bold uppercase">Thông tin</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>Hướng dẫn mua hàng</li>
            <li>Hướng dẫn thanh toán</li>
            <li>Hướng dẫn trả góp</li>
            <li>Build PC</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-bold uppercase">
            Tổng đài hỗ trợ
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              Mua hàng:{' '}
              <span className="font-bold text-blue-600">0909.123.456</span>
            </li>
            <li>
              Bảo hành:{' '}
              <span className="font-bold text-blue-600">0909.456.789</span>
            </li>
            <li>
              Khiếu nại:{' '}
              <span className="font-bold text-blue-600">0909.000.111</span>
            </li>
            <li>
              Email:{' '}
              <span className="font-bold text-blue-600">
                support@techstore.vn
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-bold uppercase">Thanh toán</h4>
          <div className="grid grid-cols-3 gap-2">
            {['VISA', 'JCB', 'ATM', 'ZaloPay', 'MoMo', 'COD'].map((item) => (
              <div
                key={item}
                className="rounded border bg-gray-50 px-2 py-2 text-center text-xs font-bold text-gray-700"
              >
                {item}
              </div>
            ))}
          </div>

          <h4 className="mb-3 mt-5 font-bold uppercase">Kết nối</h4>
          <div className="flex gap-2">
            {['f', 't', '▶', 'Z'].map((item) => (
              <div
                key={item}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-bold text-white"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t py-4 text-center text-sm text-gray-500">
        © 2026 TechStore. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer