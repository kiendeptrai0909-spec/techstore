import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import {
  Bot,
  Headphones,
  MessageCircle,
  Minus,
  Send,
  User,
  X,
} from 'lucide-react'

import { useAuth } from '../../contexts/AuthContext'
import { chatApi } from '../../api/chatApi'

const SESSION_KEY = 'techstore_chat_session_id'

function ChatWidget() {
  const location = useLocation()
  const { user } = useAuth()
  const messagesEndRef = useRef(null)
const chatContainerRef = useRef(null)
const previousMessageCount = useRef(0)
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [input, setInput] = useState('')
  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem(SESSION_KEY)
  })
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')

  const hiddenPaths = [
    '/admin',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ]

  const shouldHide = hiddenPaths.some((path) =>
    location.pathname.startsWith(path)
  )

  useEffect(() => {
    if (open && !minimized && sessionId && user) {
      fetchMessages(sessionId)
    }
  }, [open, minimized, sessionId, user])

  useEffect(() => {
    if (!open || minimized || !sessionId || !user) return

    const intervalId = setInterval(() => {
      fetchMessages(sessionId, false)
    }, 3000)

    return () => clearInterval(intervalId)
  }, [open, minimized, sessionId, user])

  useEffect(() => {
  if (!open || minimized) return

  const container = chatContainerRef.current

  if (!container) return

  const hasNewMessage =
    messages.length > previousMessageCount.current

  previousMessageCount.current = messages.length

  if (!hasNewMessage) return

  const distanceFromBottom =
    container.scrollHeight -
    container.scrollTop -
    container.clientHeight

  if (distanceFromBottom < 120) {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }
}, [messages])

  if (shouldHide) {
    return null
  }

  const normalizePageContent = (data) => {
    if (Array.isArray(data)) return data
    if (Array.isArray(data?.content)) return data.content
    return []
  }

  const fetchMessages = async (currentSessionId, showLoading = true) => {
    if (!currentSessionId) return

    if (showLoading) setLoading(true)

    try {
      const data = await chatApi.getMessages(currentSessionId, {
        page: 0,
        size: 100,
      })

      setMessages(normalizePageContent(data))
      setMessage('')
    } catch (error) {
      setMessage(error.message || 'Không thể tải tin nhắn')
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  const ensureSession = async () => {
    if (sessionId) {
      return sessionId
    }

    const session = await chatApi.createSession()

    localStorage.setItem(SESSION_KEY, String(session.id))
    setSessionId(String(session.id))

    return session.id
  }

  const handleOpen = async () => {
    setOpen(true)
    setMinimized(false)

    if (!user) return

    try {
      setLoading(true)
      setMessage('')

      const currentSessionId = await ensureSession()
      await fetchMessages(currentSessionId, false)
    } catch (error) {
      setMessage(error.message || 'Không thể mở phiên chat')
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async () => {
    const content = input.trim()

    if (!content || sending) return

    if (!user) {
      setMessage('Bạn cần đăng nhập để sử dụng chat trực tuyến')
      return
    }

    setSending(true)
    setMessage('')

    try {
      const currentSessionId = await ensureSession()

      await chatApi.sendMessage(currentSessionId, {
        message: content,
      })

      setInput('')
      await fetchMessages(currentSessionId, false)
    } catch (error) {
      setMessage(error.message || 'Không thể gửi tin nhắn')
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  const handleNewSession = async () => {
    if (!user) return

    localStorage.removeItem(SESSION_KEY)
    setSessionId(null)
    setMessages([])
    setInput('')

    try {
      setLoading(true)
      const session = await chatApi.createSession()

      localStorage.setItem(SESSION_KEY, String(session.id))
      setSessionId(String(session.id))
      setMessage('')
    } catch (error) {
      setMessage(error.message || 'Không thể tạo phiên chat mới')
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-red-600 px-5 py-4 font-black text-white shadow-lg hover:bg-red-700"
      >
        <MessageCircle size={22} />
        Bạn cần hỗ trợ gì?
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[360px] overflow-hidden rounded-2xl bg-white shadow-2xl">
      <div className="flex items-center justify-between bg-red-600 px-4 py-3 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <Headphones size={22} />
          </div>

          <div>
            <div className="font-black">TechStore Support</div>
            <div className="text-xs font-semibold text-red-100">
              Chat trực tuyến
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMinimized((prev) => !prev)}
            className="flex h-8 w-8 items-center justify-center rounded hover:bg-white/20"
          >
            <Minus size={18} />
          </button>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded hover:bg-white/20"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          {!user ? (
            <div className="p-5 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                <User size={28} />
              </div>

              <h3 className="mt-3 text-lg font-black text-gray-900">
                Đăng nhập để chat
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Bạn cần đăng nhập tài khoản để sử dụng chat trực tuyến với
                TechStore.
              </p>

              <Link
                to="/login"
                className="mt-4 inline-block rounded bg-red-600 px-5 py-3 font-black text-white hover:bg-red-700"
              >
                Đăng nhập ngay
              </Link>
            </div>
          ) : (
            <>
              <div
    ref={chatContainerRef}
    className="h-[360px] overflow-y-auto bg-gray-50 p-4"
>
                {loading ? (
                  <div className="py-10 text-center text-sm text-gray-500">
                    Đang tải tin nhắn...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="py-10 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                      <Bot size={28} />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-gray-600">
                      Xin chào! Bạn cần TechStore hỗ trợ gì?
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((chatMessage) => {
                      const isUser = chatMessage.senderId === user.id

                      return (
                        <div
                          key={chatMessage.id}
                          className={
                            isUser
                              ? 'flex items-start justify-end gap-2'
                              : 'flex items-start gap-2'
                          }
                        >
                          {!isUser && (
                            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                              <Bot size={17} />
                            </div>
                          )}

                          <div
                            className={
                              isUser
                                ? 'max-w-[75%] rounded-2xl rounded-tr-sm bg-red-600 px-4 py-2 text-sm font-semibold text-white'
                                : 'max-w-[75%] rounded-2xl rounded-tl-sm bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm'
                            }
                          >
                            {chatMessage.message}

                            <div
                              className={
                                isUser
                                  ? 'mt-1 text-[10px] text-red-100'
                                  : 'mt-1 text-[10px] text-gray-400'
                              }
                            >
                              {chatMessage.createdAt
                                ? new Date(
                                    chatMessage.createdAt
                                  ).toLocaleTimeString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : ''}
                            </div>
                          </div>

                          {isUser && (
                            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-700">
                              <User size={17} />
                            </div>
                          )}
                        </div>
                      )
                    })}

                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {message && (
                <div className="border-t border-red-100 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600">
                  {message}
                </div>
              )}

              <div className="border-t bg-white p-3">
                <div className="mb-3 flex flex-wrap gap-2">
                  {[
                    'Tư vấn build PC',
                    'Kiểm tra bảo hành',
                    'Hỏi về đơn hàng',
                    'Tư vấn laptop',
                  ].map((reply) => (
                    <button
                      key={reply}
                      type="button"
                      onClick={() => setInput(reply)}
                      className="rounded-full border px-3 py-1 text-xs font-bold text-gray-700 hover:border-red-500 hover:text-red-600"
                    >
                      {reply}
                    </button>
                  ))}
                </div>

                <div className="flex items-end gap-2">
                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    placeholder="Nhập tin nhắn..."
                    className="max-h-24 min-h-11 flex-1 resize-none rounded-xl border px-4 py-3 text-sm outline-none focus:border-red-500"
                  />

                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={sending}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send size={18} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleNewSession}
                  className="mt-2 text-xs font-bold text-gray-400 hover:text-red-600"
                >
                  Tạo phiên chat mới
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default ChatWidget