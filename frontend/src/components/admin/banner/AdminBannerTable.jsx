import { Link } from 'react-router'
import { Edit, ExternalLink, Trash2 } from 'lucide-react'

function AdminBannerTable({ banners = [], loading, onDelete }) {
  if (loading) {
    return (
      <div className="rounded-lg bg-white p-5 shadow-sm">
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-20 animate-pulse rounded bg-gray-100"
            />
          ))}
        </div>
      </div>
    )
  }

  if (banners.length === 0) {
    return (
      <div className="rounded-lg bg-white p-10 text-center shadow-sm">
        <h3 className="text-xl font-black text-gray-900">
          Không có banner
        </h3>
        <p className="mt-2 text-gray-500">
          Chưa tìm thấy banner phù hợp với bộ lọc.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse text-left">
          <thead>
            <tr className="border-b bg-gray-50 text-sm text-gray-600">
              <th className="px-4 py-3 font-bold">Banner</th>
              <th className="px-4 py-3 font-bold">Vị trí</th>
              <th className="px-4 py-3 font-bold">Thứ tự</th>
              <th className="px-4 py-3 font-bold">Thời gian</th>
              <th className="px-4 py-3 font-bold">Trạng thái</th>
              <th className="px-4 py-3 text-center font-bold">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {banners.map((banner) => {
              const bannerId = banner.id || banner.bannerId

              return (
                <tr key={bannerId} className="border-b text-sm hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-20 w-32 shrink-0 items-center justify-center overflow-hidden rounded border bg-gray-50">
                        <img
                          src={
                            banner.imageUrl ||
                            'https://placehold.co/300x160?text=TechStore'
                          }
                          alt={banner.title}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="line-clamp-2 font-black text-gray-900">
                          {banner.title}
                        </div>

                        {banner.linkUrl && (
                          <a
                            href={banner.linkUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                          >
                            {banner.linkUrl}
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 font-semibold">
                    {formatPosition(banner.position)}
                  </td>

                  <td className="px-4 py-4 font-bold">
                    {banner.sortOrder ?? 0}
                  </td>

                  <td className="px-4 py-4 text-xs text-gray-600">
                    <div>
                      Bắt đầu:{' '}
                      <span className="font-semibold">
                        {formatDateTime(banner.startAt)}
                      </span>
                    </div>

                    <div className="mt-1">
                      Kết thúc:{' '}
                      <span className="font-semibold">
                        {formatDateTime(banner.endAt)}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={
                        banner.status === 'ACTIVE'
                          ? 'rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700'
                          : 'rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-bold text-gray-700'
                      }
                    >
                      {banner.status === 'ACTIVE' ? 'Hiển thị' : 'Đang ẩn'}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/admin/banners/${bannerId}/edit`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded border text-gray-600 hover:border-red-500 hover:text-red-600"
                        title="Sửa banner"
                      >
                        <Edit size={16} />
                      </Link>

                      <button
                        type="button"
                        onClick={() => onDelete(bannerId)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded border text-gray-600 hover:border-red-500 hover:text-red-600"
                        title="Xóa banner"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function formatPosition(position) {
  const map = {
    HOME_TOP: 'Trang chủ - đầu trang',
    HOME_MIDDLE: 'Trang chủ - giữa trang',
    HOME_BOTTOM: 'Trang chủ - cuối trang',
    SIDEBAR_LEFT: 'Banner trái',
    SIDEBAR_RIGHT: 'Banner phải',
  }

  return map[position] || position || 'N/A'
}

function formatDateTime(value) {
  if (!value) {
    return 'Không giới hạn'
  }

  return new Date(value).toLocaleString('vi-VN')
}

export default AdminBannerTable