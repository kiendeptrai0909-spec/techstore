import { ChevronLeft, ChevronRight } from 'lucide-react'

function AdminPagination({ pageData, onPageChange }) {
  if (!pageData || pageData.totalPages <= 1) {
    return null
  }

  const currentPage = pageData.number || 0
  const totalPages = pageData.totalPages || 0

  const getPages = () => {
    const pages = []
    const start = Math.max(0, currentPage - 2)
    const end = Math.min(totalPages - 1, currentPage + 2)

    for (let page = start; page <= end; page += 1) {
      pages.push(page)
    }

    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        className="inline-flex h-9 w-9 items-center justify-center rounded border bg-white text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 hover:border-red-500 hover:text-red-600 transition-colors"
        title="Trang trước"
      >
        <ChevronLeft size={16} />
      </button>

      {currentPage > 2 && (
        <>
          <button
            onClick={() => onPageChange(0)}
            className="inline-flex h-9 min-w-9 items-center justify-center rounded border bg-white px-3 text-sm font-semibold text-gray-700 hover:border-red-500 hover:text-red-600 transition-colors"
          >
            1
          </button>
          {currentPage > 3 && <span className="px-1 text-gray-400">...</span>}
        </>
      )}

      {getPages().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={
            page === currentPage
              ? 'inline-flex h-9 min-w-9 items-center justify-center rounded border border-red-600 bg-red-600 px-3 text-sm font-black text-white'
              : 'inline-flex h-9 min-w-9 items-center justify-center rounded border bg-white px-3 text-sm font-semibold text-gray-700 hover:border-red-500 hover:text-red-600 transition-colors'
          }
        >
          {page + 1}
        </button>
      ))}

      {currentPage < totalPages - 3 && (
        <>
          {currentPage < totalPages - 4 && <span className="px-1 text-gray-400">...</span>}
          <button
            onClick={() => onPageChange(totalPages - 1)}
            className="inline-flex h-9 min-w-9 items-center justify-center rounded border bg-white px-3 text-sm font-semibold text-gray-700 hover:border-red-500 hover:text-red-600 transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        disabled={currentPage >= totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
        className="inline-flex h-9 w-9 items-center justify-center rounded border bg-white text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 hover:border-red-500 hover:text-red-600 transition-colors"
        title="Trang sau"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}

export default AdminPagination
