import { Link } from 'react-router'
import { Edit, Eye, Trash2 } from 'lucide-react'

function AdminNewsTable({ news = [], loading, onDelete }) {
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

  if (news.length === 0) {
    return (
      <div className="rounded-lg bg-white p-10 text-center shadow-sm">
        <h3 className="text-xl font-black text-gray-900">
          Không có bài viết
        </h3>
        <p className="mt-2 text-gray-500">
          Chưa tìm thấy bài viết phù hợp với bộ lọc.
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
              <th className="px-4 py-3 font-bold">Bài viết</th>
              <th className="px-4 py-3 font-bold">Slug</th>
              <th className="px-4 py-3 font-bold">Trạng thái</th>
              <th className="px-4 py-3 font-bold">Ngày tạo</th>
              <th className="px-4 py-3 text-center font-bold">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {news.map((item) => {
              const newsId = item.id || item.newsId

              return (
                <tr key={newsId} className="border-b text-sm hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-20 w-32 shrink-0 items-center justify-center overflow-hidden rounded border bg-gray-50">
                        <img
                          src={
                            item.thumbnailUrl ||
                            item.imageUrl ||
                            'https://placehold.co/300x160?text=TechStore'
                          }
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="line-clamp-2 font-black text-gray-900">
                          {item.title}
                        </div>

                        {item.summary && (
                          <div className="mt-1 line-clamp-2 text-xs text-gray-500">
                            {item.summary}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="text-sm font-semibold text-gray-700">
                      {item.slug}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <NewsStatusBadge status={item.status} />
                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString('vi-VN')
                      : 'Đang cập nhật'}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-2">
                      {item.slug && item.status === 'PUBLISHED' && (
                        <Link
                          to={`/news/${item.slug}`}
                          target="_blank"
                          className="inline-flex h-9 w-9 items-center justify-center rounded border text-gray-600 hover:border-blue-500 hover:text-blue-600"
                          title="Xem ngoài website"
                        >
                          <Eye size={16} />
                        </Link>
                      )}

                      <Link
                        to={`/admin/news/${newsId}/edit`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded border text-gray-600 hover:border-red-500 hover:text-red-600"
                        title="Sửa bài viết"
                      >
                        <Edit size={16} />
                      </Link>

                      <button
                        type="button"
                        onClick={() => onDelete(newsId)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded border text-gray-600 hover:border-red-500 hover:text-red-600"
                        title="Xóa bài viết"
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

function NewsStatusBadge({ status }) {
  const statusMap = {
    DRAFT: {
      label: 'Bản nháp',
      className: 'border-yellow-200 bg-yellow-50 text-yellow-700',
    },
    PUBLISHED: {
      label: 'Đã xuất bản',
      className: 'border-green-200 bg-green-50 text-green-700',
    },
    HIDDEN: {
      label: 'Đã ẩn',
      className: 'border-gray-200 bg-gray-50 text-gray-700',
    },
  }

  const current = statusMap[status] || {
    label: status || 'Không rõ',
    className: 'border-gray-200 bg-gray-50 text-gray-700',
  }

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-bold ${current.className}`}
    >
      {current.label}
    </span>
  )
}

export default AdminNewsTable