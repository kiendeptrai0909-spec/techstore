import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

function FaqAccordion({ faqs = [] }) {
  const [activeId, setActiveId] = useState(null)

  if (faqs.length === 0) {
    return (
      <div className="rounded-md bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-600">
          <HelpCircle size={40} />
        </div>

        <h2 className="mt-5 text-2xl font-black text-gray-900">
          Chưa có câu hỏi thường gặp
        </h2>

        <p className="mt-2 text-gray-500">
          Nội dung FAQ đang được TechStore cập nhật.
        </p>
      </div>
    )
  }

  const handleToggle = (faqId) => {
    setActiveId((prev) => (prev === faqId ? null : faqId))
  }

  return (
    <div className="space-y-3">
      {faqs.map((faq) => {
        const faqId = faq.id || faq.faqId
        const active = activeId === faqId

        return (
          <div
            key={faqId}
            className="overflow-hidden rounded-md bg-white shadow-sm"
          >
            <button
              type="button"
              onClick={() => handleToggle(faqId)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-red-50"
            >
              <span className="font-black text-gray-900">
                {faq.question}
              </span>

              <ChevronDown
                size={22}
                className={
                  active
                    ? 'shrink-0 rotate-180 text-red-600 transition'
                    : 'shrink-0 text-gray-500 transition'
                }
              />
            </button>

            {active && (
              <div className="border-t px-5 py-4">
                <div className="whitespace-pre-line leading-7 text-gray-700">
                  {faq.answer}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default FaqAccordion