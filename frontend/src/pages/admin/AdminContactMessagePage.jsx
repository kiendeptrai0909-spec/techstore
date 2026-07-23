import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { MessageSquare } from 'lucide-react'

import { adminContactMessageApi } from '../../api/adminContactMessageApi'
import AdminContactMessageFilter from '../../components/admin/contact/AdminContactMessageFilter'
import AdminContactMessageTable from '../../components/admin/contact/AdminContactMessageTable'
import AdminPagination from '../../components/admin/AdminPagination'

function AdminContactMessagePage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [pageData, setPageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    status: searchParams.get('status') || '',
    size: searchParams.get('size') || '10',
  })

  const currentPage = Number(searchParams.get('page') || 0)
  const pageSize = Number(searchParams.get('size') || filters.size || 10)

  const fetchMessages = async () => {
    setLoading(true)
    setMessage('')

    try {
      const params = {
        page: currentPage,
        size: pageSize,
      }

      const keyword = searchParams.get('keyword')
      const status = searchParams.get('status')

      if (keyword) params.keyword = keyword
      if (status) params.status = status

      const data = await adminContactMessageApi.getMessages(params)
      setPageData(data)
    } catch (error) {
      setMessage(error.message || 'Không thể tải danh sách tin nhắn')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setFilters({
      keyword: searchParams.get('keyword') || '',
      status: searchParams.get('status') || '',
      size: searchParams.get('size') || '10',
    })

    fetchMessages()
  }, [searchParams])

  const messages = Array.isArray(pageData)
    ? pageData
    : pageData?.content || []

  const handleSubmitFilter = (event) => {
    event.preventDefault()

    const nextParams = {
      page: '0',
      size: String(filters.size || 10),
    }

    if (filters.keyword.trim()) {
      nextParams.keyword = filters.keyword.trim()
    }

    if (filters.status) {
      nextParams.status = filters.status
    }

    setSearchParams(nextParams)
  }

  const handleResetFilter = () => {
    setFilters({
      keyword: '',
      status: '',
      size: '10',
    })

    setSearchParams({
      page: '0',
      size: '10',
    })
  }

  const handlePageChange = (page) => {
    const nextParams = {
      page: String(page),
      size: String(pageSize),
    }

    const keyword = searchParams.get('keyword')
    const status = searchParams.get('status')

    if (keyword) nextParams.keyword = keyword
    if (status) nextParams.status = status

    setSearchParams(nextParams)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <MessageSquare size={26} />
        </div>

        <div>
          <h2 className="text-2xl font-black text-gray-900">
            Quản lý liên hệ
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Xem và xử lý tin nhắn liên hệ từ khách hàng.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <AdminContactMessageFilter
          filters={filters}
          setFilters={setFilters}
          onSubmit={handleSubmitFilter}
          onReset={handleResetFilter}
        />

        {message && (
          <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {message}
          </div>
        )}

        <AdminContactMessageTable
          messages={messages}
          loading={loading}
        />

        <AdminPagination
          pageData={pageData}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}


export default AdminContactMessagePage