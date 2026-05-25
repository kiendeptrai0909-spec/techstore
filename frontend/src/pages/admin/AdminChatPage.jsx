import { useEffect, useRef, useState } from 'react'
import { MessageSquare, Send, Trash2, XCircle } from 'lucide-react'
import { adminChatApi } from '../../api/adminChatApi'
import { useAuth } from '../../contexts/AuthContext'

function AdminChatPage() {
  const { user } = useAuth()
  const messagesEndRef = useRef(null)

  const [sessions, setSessions] = useState([])
  const [selectedSession, setSelectedSession] = useState(null)
  const [messages, setMessages] = useState([])
  const [status, setStatus] = useState('')
  const [input, setInput] = useState('')
  const [message, setMessage] = useState('')
  const [loadingSessions, setLoadingSessions] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [deletingSessionId, setDeletingSessionId] = useState(null)

  useEffect(() => {
    fetchSessions()
  }, [status])

  useEffect(() => {
    if (!selectedSession) return undefined

    fetchMessages(selectedSession.id)

    const intervalId = setInterval(() => {
      fetchMessages(selectedSession.id, false)
    }, 3000)

    return () => clearInterval(intervalId)
  }, [selectedSession])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const normalizePageContent = (data) => {
    if (Array.isArray(data)) return data
    if (Array.isArray(data?.content)) return data.content
    return []
  }

  const fetchSessions = async () => {
    setLoadingSessions(true)
    setMessage('')

    try {
      const params = {
        page: 0,
        size: 50,
      }

      if (status) params.status = status

      const data = await adminChatApi.getSessions(params)
      const list = normalizePageContent(data)

      setSessions(list)

      if (!selectedSession && list.length > 0) {
        setSelectedSession(list[0])
      }

      if (
        selectedSession &&
        !list.some((session) => session.id === selectedSession.id)
      ) {
        setSelectedSession(null)
        setMessages([])
      }
    } catch (error) {
      setMessage(error.message || 'Không thể tải danh sách chat')
    } finally {
      setLoadingSessions(false)
    }
  }

  const fetchMessages = async (sessionId, showLoading = true) => {
    if (showLoading) setLoadingMessages(true)

    try {
      const data = await adminChatApi.getMessages(sessionId, {
        page: 0,
        size: 100,
      })

      setMessages(normalizePageContent(data))
    } catch (error) {
      setMessage(error.message || 'Không thể tải tin nhắn')
    } finally {
      if (showLoading) setLoadingMessages(false)
    }
  }

  const handleSelectSession = async (session) => {
    setSelectedSession(session)
    setInput('')
  }

  const handleSend = async () => {
    const content = input.trim()

    if (!content || !selectedSession || sending) return

    setSending(true)
    setMessage('')

    try {
      await adminChatApi.sendMessage(selectedSession.id, {
        message: content,
      })

      setInput('')
      await fetchMessages(selectedSession.id, false)
      await fetchSessions()
    } catch (error) {
      setMessage(error.message || 'Không thể gửi tin nhắn')
    } finally {
      setSending(false)
    }
  }

  const handleAssign = async () => {
    if (!selectedSession) return

    try {
      const data = await adminChatApi.assignSession(selectedSession.id)
      setSelectedSession(data)
      await fetchSessions()
    } catch (error) {
      setMessage(error.message || 'Không thể nhận phiên chat')
    }
  }

  const handleClose = async () => {
    if (!selectedSession) return

    const confirmed = window.confirm('Bạn có chắc muốn đóng phiên chat này?')

    if (!confirmed) return

    try {
      const data = await adminChatApi.closeSession(selectedSession.id)
      setSelectedSession(data)
      await fetchSessions()
    } catch (error) {
      setMessage(error.message || 'Không thể đóng phiên chat')
    }
  }

  const handleDeleteSession = async (sessionId) => {
    const confirmed = window.confirm(
      'Bạn có chắc muốn xóa phiên chat này? Tất cả tin nhắn trong phiên cũng sẽ bị xóa.'
    )

    if (!confirmed) return

    setDeletingSessionId(sessionId)
    setMessage('')

    try {
      await adminChatApi.deleteSession(sessionId)

      setSessions((prev) =>
        prev.filter((session) => session.id !== sessionId)
      )

      if (selectedSession?.id === sessionId) {
        setSelectedSession(null)
        setMessages([])
        setInput('')
      }
    } catch (error) {
      setMessage(error.message || 'Không thể xóa phiên chat')
    } finally {
      setDeletingSessionId(null)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <MessageSquare size={26} />
          </div>

          <div>
            <h2 className="text-2xl font-black text-gray-900">
              Quản lý chat trực tuyến
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Nhận và trả lời tin nhắn hỗ trợ từ khách hàng.
            </p>
          </div>
        </div>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="h-11 rounded border bg-white px-4 text-sm font-bold outline-none focus:border-red-500"
        >
          <option value="">Tất cả phiên</option>
          <option value="OPEN">Đang mở</option>
          <option value="CLOSED">Đã đóng</option>
        </select>
      </div>

      {message && (
        <div className="mb-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {message}
        </div>
      )}

      <div className="grid min-h-[650px] overflow-hidden rounded-lg bg-white shadow-sm lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="border-r">
          <div className="border-b px-4 py-3">
            <h3 className="font-black text-gray-900">Phiên chat</h3>
          </div>

          <div className="max-h-[600px] overflow-y-auto">
            {loadingSessions ? (
              <div className="p-5 text-center text-sm text-gray-500">
                Đang tải phiên chat...
              </div>
            ) : sessions.length === 0 ? (
              <div className="p-5 text-center text-sm text-gray-500">
                Chưa có phiên chat nào.
              </div>
            ) : (
              sessions.map((session) => {
                const active = selectedSession?.id === session.id
                const deleting = deletingSessionId === session.id

                return (
                  <div
                    key={session.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelectSession(session)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        handleSelectSession(session)
                      }
                    }}
                    className={
                      active
                        ? 'block w-full cursor-pointer border-b bg-red-50 px-4 py-4 text-left'
                        : 'block w-full cursor-pointer border-b px-4 py-4 text-left hover:bg-gray-50'
                    }
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-black text-gray-900">
                          {session.customerName ||
                            `Khách hàng #${session.customerId}`}
                        </div>

                        <div className="mt-1 line-clamp-1 text-sm text-gray-500">
                          {session.lastMessage || 'Chưa có tin nhắn'}
                        </div>

                        <div className="mt-2 text-xs text-gray-400">
                          #{session.id}
                          {session.staffName ? ` · NV: ${session.staffName}` : ''}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <span
                          className={
                            session.status === 'CLOSED'
                              ? 'rounded-full border bg-gray-50 px-2 py-1 text-xs font-bold text-gray-600'
                              : 'rounded-full border border-green-200 bg-green-50 px-2 py-1 text-xs font-bold text-green-600'
                          }
                        >
                          {session.status === 'CLOSED' ? 'Đã đóng' : 'Đang mở'}
                        </span>

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            handleDeleteSession(session.id)
                          }}
                          disabled={deleting}
                          className="rounded border p-2 text-gray-500 hover:border-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Xóa phiên chat"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <div className="flex min-h-[650px] flex-col">
          {!selectedSession ? (
            <div className="flex flex-1 items-center justify-center text-gray-500">
              Chọn một phiên chat để xem nội dung.
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
                <div>
                  <h3 className="font-black text-gray-900">
                    {selectedSession.customerName ||
                      `Khách hàng #${selectedSession.customerId}`}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Phiên #{selectedSession.id}
                    {selectedSession.staffName
                      ? ` · Nhân viên: ${selectedSession.staffName}`
                      : ' · Chưa có nhân viên nhận'}
                  </p>
                </div>

                <div className="flex gap-2">
                  {!selectedSession.staffId &&
                    selectedSession.status !== 'CLOSED' && (
                      <button
                        type="button"
                        onClick={handleAssign}
                        className="rounded bg-blue-600 px-4 py-2 text-sm font-black text-white hover:bg-blue-700"
                      >
                        Nhận chat
                      </button>
                    )}

                  {selectedSession.status !== 'CLOSED' && (
                    <button
                      type="button"
                      onClick={handleClose}
                      className="inline-flex items-center gap-2 rounded border px-4 py-2 text-sm font-black text-gray-700 hover:border-red-500 hover:text-red-600"
                    >
                      <XCircle size={17} />
                      Đóng phiên
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDeleteSession(selectedSession.id)}
                    disabled={deletingSessionId === selectedSession.id}
                    className="inline-flex items-center gap-2 rounded border px-4 py-2 text-sm font-black text-gray-700 hover:border-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={17} />
                    Xóa phiên
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto bg-gray-50 p-5">
                {loadingMessages ? (
                  <div className="py-10 text-center text-sm text-gray-500">
                    Đang tải tin nhắn...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="py-10 text-center text-sm text-gray-500">
                    Chưa có tin nhắn trong phiên này.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((chatMessage) => {
                      const isMine = chatMessage.senderId === user?.id

                      return (
                        <div
                          key={chatMessage.id}
                          className={
                            isMine ? 'flex justify-end' : 'flex justify-start'
                          }
                        >
                          <div
                            className={
                              isMine
                                ? 'max-w-[70%] rounded-2xl rounded-tr-sm bg-red-600 px-4 py-2 text-sm font-semibold text-white'
                                : 'max-w-[70%] rounded-2xl rounded-tl-sm bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm'
                            }
                          >
                            {!isMine && (
                              <div className="mb-1 text-xs font-black text-gray-500">
                                {chatMessage.senderName || 'Khách hàng'}
                              </div>
                            )}

                            {chatMessage.message}

                            <div
                              className={
                                isMine
                                  ? 'mt-1 text-[10px] text-red-100'
                                  : 'mt-1 text-[10px] text-gray-400'
                              }
                            >
                              {chatMessage.createdAt
                                ? new Date(
                                    chatMessage.createdAt
                                  ).toLocaleString('vi-VN')
                                : ''}
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              <div className="border-t p-4">
                {selectedSession.status === 'CLOSED' ? (
                  <div className="rounded bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-500">
                    Phiên chat này đã đóng, không thể gửi thêm tin nhắn.
                  </div>
                ) : (
                  <div className="flex items-end gap-2">
                    <textarea
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={1}
                      placeholder="Nhập phản hồi cho khách hàng..."
                      className="max-h-28 min-h-11 flex-1 resize-none rounded-xl border px-4 py-3 text-sm outline-none focus:border-red-500"
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
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminChatPage