function ProductPagination({ pageData, onPageChange }) {
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
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
      <button
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded border bg-white px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 hover:border-red-500 hover:text-red-600"
      >
        Trước
      </button>

      {currentPage > 2 && (
        <>
          <button
            onClick={() => onPageChange(0)}
            className="rounded border bg-white px-4 py-2 text-sm font-semibold hover:border-red-500 hover:text-red-600"
          >
            1
          </button>
          <span className="px-2 text-gray-500">...</span>
        </>
      )}

      {getPages().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={
            page === currentPage
              ? 'rounded border border-red-600 bg-red-600 px-4 py-2 text-sm font-bold text-white'
              : 'rounded border bg-white px-4 py-2 text-sm font-semibold hover:border-red-500 hover:text-red-600'
          }
        >
          {page + 1}
        </button>
      ))}

      {currentPage < totalPages - 3 && (
        <>
          <span className="px-2 text-gray-500">...</span>
          <button
            onClick={() => onPageChange(totalPages - 1)}
            className="rounded border bg-white px-4 py-2 text-sm font-semibold hover:border-red-500 hover:text-red-600"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        disabled={currentPage >= totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded border bg-white px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 hover:border-red-500 hover:text-red-600"
      >
        Sau
      </button>
    </div>
  )
}

export default ProductPagination