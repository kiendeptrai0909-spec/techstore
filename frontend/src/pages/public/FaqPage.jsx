import { useEffect, useMemo, useState } from 'react'
import { HelpCircle, Search } from 'lucide-react'

import { faqApi } from '../../api/faqApi'
import FaqAccordion from '../../components/faq/FaqAccordion'

function FaqPage() {
  const [faqs, setFaqs] = useState([])
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true)
      setMessage('')

      try {
        const data = await faqApi.getFaqs({
          page: 0,
          size: 100,
        })

        setFaqs(normalizeList(data))
      } catch (error) {
        setMessage(error.message || 'Không thể tải danh sách FAQ')
      } finally {
        setLoading(false)
      }
    }

    fetchFaqs()
  }, [])

  const filteredFaqs = useMemo(() => {
    const trimmedKeyword = keyword.trim().toLowerCase()

    if (!trimmedKeyword) {
      return faqs
    }

    return faqs.filter((faq) => {
      const question = faq.question?.toLowerCase() || ''
      const answer = faq.answer?.toLowerCase() || ''

      return (
        question.includes(trimmedKeyword) ||
        answer.includes(trimmedKeyword)
      )
    })
  }, [faqs, keyword])

  return (
    <div className="bg-[#e9e9e9]">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-5 rounded-md bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <HelpCircle size={30} />
            </div>

            <div>
              <h1 className="text-3xl font-black text-gray-900">
                Câu hỏi thường gặp
              </h1>

              <p className="mt-1 text-gray-500">
                Giải đáp nhanh các thắc mắc khi mua hàng tại TechStore.
              </p>
            </div>
          </div>

          <div className="mt-6 flex h-12 items-center overflow-hidden rounded border bg-white focus-within:border-red-500">
            <div className="flex h-full w-12 items-center justify-center text-gray-500">
              <Search size={20} />
            </div>

            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm kiếm câu hỏi..."
              className="h-full flex-1 px-2 text-sm outline-none"
            />
          </div>
        </div>

        {message && (
          <div className="mb-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {message}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-16 animate-pulse rounded bg-gray-200"
              />
            ))}
          </div>
        ) : (
          <FaqAccordion faqs={filteredFaqs} />
        )}
      </div>
    </div>
  )
}

function normalizeList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.items)) return data.items
  if (Array.isArray(data?.data)) return data.data
  return []
}

export default FaqPage