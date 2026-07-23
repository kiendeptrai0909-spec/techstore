import { useEffect, useState } from 'react'
import { Link, useSearchParams, useLocation } from 'react-router'
import { HelpCircle, Plus } from 'lucide-react'

import { adminFaqApi } from '../../api/adminFaqApi'
import AdminFaqFilter from '../../components/admin/faq/AdminFaqFilter'
import AdminFaqTable from '../../components/admin/faq/AdminFaqTable'
import AdminPagination from '../../components/admin/AdminPagination'
import { useAuth } from '../../contexts/AuthContext'

function AdminFaqPage() {
  const { user } = useAuth()
  const role = user?.role || user?.authorities?.[0]?.authority
  const isStaff = role === 'ROLE_STAFF' || role === 'STAFF'

  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()

  const [pageData, setPageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    status: searchParams.get('status') || '',
  })

  const currentPage = Number(searchParams.get('page') || 0)
  const pageSize = Number(searchParams.get('size') || 10)

  const fetchFaqs = async () => {
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

      const data = await adminFaqApi.getFaqs(params)
      setPageData(data)
    } catch (error) {
      setMessage(error.message || 'Không thể tải danh sách FAQ')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setFilters({
      keyword: searchParams.get('keyword') || '',
      status: searchParams.get('status') || '',
    })

    fetchFaqs()
  }, [searchParams])

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage)
      window.history.replaceState({}, document.title)
      setTimeout(() => setSuccessMessage(''), 5000)
    }
  }, [location.state])

  const faqs = Array.isArray(pageData)
    ? pageData
    : pageData?.content || []
  const filteredFaqs = faqs.filter((faq) => {
    const keyword = (searchParams.get('keyword') || '').trim().toLowerCase()

    const matchKeyword =
      !keyword ||
      faq.question?.toLowerCase().includes(keyword) ||
      faq.answer?.toLowerCase().includes(keyword)

    const statusParam = searchParams.get('status') || ''
    const matchStatus =
      !statusParam || faq.status === statusParam

    return matchKeyword && matchStatus
  })
  const handleSubmitFilter = (event) => {
    event.preventDefault()

    const nextParams = {
      page: '0',
      size: String(pageSize),
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
    })

    setSearchParams({
      page: '0',
      size: String(pageSize),
    })
  }

  const handleDeleteFaq = async (faqId) => {
    const confirmed = window.confirm('Bạn có chắc muốn xóa FAQ này?')

    if (!confirmed) return

    setMessage('')
    setSuccessMessage('')

    try {
      await adminFaqApi.deleteFaq(faqId)
      setSuccessMessage('Xóa FAQ thành công')
      await fetchFaqs()
    } catch (error) {
      setMessage(error.message || 'Không thể xóa FAQ')
    }
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
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <HelpCircle size={26} />
          </div>

          <div>
            <h2 className="text-2xl font-black text-gray-900">
              Quản lý FAQ
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {isStaff ? 'Xem danh sách câu hỏi thường gặp của hệ thống.' : 'Tạo và quản lý câu hỏi thường gặp hiển thị cho khách hàng.'}
            </p>
          </div>
        </div>

        {!isStaff && (
          <Link
            to="/admin/faqs/create"
            className="inline-flex items-center gap-2 rounded bg-red-600 px-5 py-3 font-black text-white hover:bg-red-700"
          >
            <Plus size={20} />
            Thêm FAQ
          </Link>
        )}
      </div>

      <div className="space-y-5">
        <AdminFaqFilter
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

        {successMessage && (
          <div className="rounded border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
            {successMessage}
          </div>
        )}

        <AdminFaqTable
          faqs={filteredFaqs}
          loading={loading}
          onDelete={handleDeleteFaq}
          isStaff={isStaff}
        />

        <AdminPagination
          pageData={pageData}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}


export default AdminFaqPage