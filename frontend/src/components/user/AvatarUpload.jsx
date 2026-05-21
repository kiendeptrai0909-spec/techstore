import { useRef, useState } from 'react'
import { Camera, Loader2, User } from 'lucide-react'
import { userApi } from '../../api/userApi'

function AvatarUpload({ user, onUploaded }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSelectFile = () => {
    inputRef.current?.click()
  }

  const handleChange = async (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    setMessage('')

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setMessage('Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage('Ảnh không được vượt quá 5MB')
      return
    }

    setUploading(true)

    try {
      const data = await userApi.uploadAvatar(file)
      onUploaded?.(data.avatar)
    } catch (error) {
      setMessage(error.message || 'Không thể upload avatar')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="rounded-md bg-white p-5 shadow-sm">
      <h2 className="text-xl font-black text-gray-900">Ảnh đại diện</h2>

      <div className="mt-5 flex flex-col items-center">
        <div className="relative h-36 w-36 overflow-hidden rounded-full border bg-gray-100">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.fullName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-400">
              <User size={54} />
            </div>
          )}

          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
              <Loader2 size={30} className="animate-spin" />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleSelectFile}
          disabled={uploading}
          className="mt-4 inline-flex items-center gap-2 rounded bg-red-600 px-5 py-3 font-black text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Camera size={18} />
          {uploading ? 'Đang tải...' : 'Đổi ảnh đại diện'}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          className="hidden"
        />

        <p className="mt-3 text-center text-sm text-gray-500">
          Hỗ trợ JPG, PNG, WEBP. Tối đa 5MB.
        </p>

        {message && (
          <div className="mt-3 rounded border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
            {message}
          </div>
        )}
      </div>
    </div>
  )
}

export default AvatarUpload