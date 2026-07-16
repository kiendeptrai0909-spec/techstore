import { Link } from 'react-router'
import { Edit, Trash2 } from 'lucide-react'

function AdminFaqTable({ faqs = [], loading, onDelete, isStaff = false }) {
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

  if (faqs.length === 0) {
    return (
      <div className="rounded-lg bg-white p-10 text-center shadow-sm">
        <h3 className="text-xl font-black text-gray-900">
          Không có FAQ
        </h3>
        <p className="mt-2 text-gray-500">
          Chưa tìm thấy câu hỏi thường gặp phù hợp với bộ lọc.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse text-left">
          <thead>
            <tr className="border-b bg-gray-50 text-sm text-gray-600">
              <th className="px-4 py-3 font-bold">Câu hỏi</th>
              <th className="px-4 py-3 font-bold">Câu trả lời</th>
              <th className="px-4 py-3 font-bold">Thứ tự</th>
              <th className="w-32 px-4 py-3 font-bold">Trạng thái</th>
              <th className="px-4 py-3 font-bold">Ngày tạo</th>
              <th className="px-4 py-3 text-center font-bold">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {faqs.map((faq) => {
              const faqId = faq.id || faq.faqId

              return (
                <tr key={faqId} className="border-b text-sm hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="line-clamp-2 font-black text-gray-900">
                      {faq.question}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="line-clamp-3 max-w-xl text-gray-600">
                      {faq.answer}
                    </div>
                  </td>

                  <td className="px-4 py-4 font-bold">
                    {faq.sortOrder ?? 0}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={
                        faq.status === 'ACTIVE'
                          ? 'rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700'
                          : 'rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-bold text-gray-700'
                      }
                    >
                      {faq.status === 'ACTIVE' ? 'Hiển thị' : 'Đang ẩn'}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    {faq.createdAt
                      ? new Date(faq.createdAt).toLocaleString('vi-VN')
                      : 'Đang cập nhật'}
                  </td>

                  <td className="px-4 py-4">
                    {!isStaff ? (
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/admin/faqs/${faqId}/edit`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded border text-gray-600 hover:border-red-500 hover:text-red-600"
                          title="Sửa FAQ"
                        >
                          <Edit size={16} />
                        </Link>

                        <button
                          type="button"
                          onClick={() => onDelete(faqId)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded border text-gray-600 hover:border-red-500 hover:text-red-600"
                          title="Xóa FAQ"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400">---</div>
                    )}
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

export default AdminFaqTable