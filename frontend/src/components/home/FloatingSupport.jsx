import { MessageCircle } from 'lucide-react'

function FloatingSupport() {
  return (
    <div className="fixed bottom-8 right-6 z-50 hidden items-center gap-3 md:flex">
      <button className="flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-300 hover:bg-red-700">
        <MessageCircle size={20} />
        Bạn cần hỗ trợ gì?
      </button>

      <button className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-lg">
        🤖
      </button>

      <button className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-sm font-black text-white shadow-lg">
        Zalo
      </button>
    </div>
  )
}

export default FloatingSupport