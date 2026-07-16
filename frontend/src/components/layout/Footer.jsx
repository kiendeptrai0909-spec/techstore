import { Banknote, Landmark } from 'lucide-react'
import { FaFacebookF, FaTiktok, FaYoutube } from 'react-icons/fa6'
import { SiZalo } from 'react-icons/si'
import { Link } from 'react-router'

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
            <li>
              <Link to="/warranty-policy" className="hover:text-red-600 transition-colors">
                Chính sách bảo hành
              </Link>
            </li>
            <li>
              <Link to="/shipping-policy" className="hover:text-red-600 transition-colors">
                Chính sách giao hàng
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-red-600 transition-colors">
                Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link to="/return-policy" className="hover:text-red-600 transition-colors">
                Chính sách đổi trả
              </Link>
            </li>
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

          <div className="grid grid-cols-2 gap-2">
            <div className="flex h-10 items-center justify-center gap-2 rounded border bg-gray-50 px-2 py-2 text-center text-xs font-bold text-gray-700">
              <Landmark size={17} />
              Chuyển khoản
            </div>

            <div className="flex h-10 items-center justify-center gap-2 rounded border bg-gray-50 px-2 py-2 text-center text-xs font-bold text-gray-700">
              <Banknote size={17} />
              COD
            </div>
          </div>

          <h4 className="mb-3 mt-5 font-bold uppercase">Kết nối</h4>

          <div className="flex gap-2">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700"
            >
              <FaFacebookF size={17} />
            </a>

            <a
              href="https://www.tiktok.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white hover:bg-gray-800"
            >
              <FaTiktok size={17} />
            </a>

            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700"
            >
              <FaYoutube size={18} />
            </a>

            <a
              href="https://zalo.me/"
              target="_blank"
              rel="noreferrer"
              aria-label="Zalo"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600"
            >
              <SiZalo size={20} />
            </a>
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