import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { PackageSearch, UserCircle } from 'lucide-react'

import { userApi } from '../../api/userApi'
import ProfileForm from '../../components/user/ProfileForm'
import AvatarUpload from '../../components/user/AvatarUpload'
import ChangePasswordForm from '../../components/user/ChangePasswordForm'

function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const fetchProfile = async () => {
    setLoading(true)
    setMessage('')

    try {
      const data = await userApi.getProfile()
      setProfile(data)
    } catch (error) {
      setMessage(error.message || 'Không thể tải thông tin tài khoản')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleUpdated = (updatedUser) => {
    setProfile(updatedUser)
  }

  const handleAvatarUploaded = (avatarUrl) => {
    setProfile((prev) => ({
      ...prev,
      avatar: avatarUrl,
    }))
  }

  if (loading) {
    return (
      <div className="bg-[#e9e9e9]">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="mb-5 h-24 animate-pulse rounded bg-gray-200" />

          <div className="grid gap-5 lg:grid-cols-[330px_minmax(0,1fr)]">
            <div className="h-96 animate-pulse rounded bg-gray-200" />
            <div className="h-[720px] animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#e9e9e9]">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-5 rounded-md bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                <UserCircle size={32} />
              </div>

              <div>
                <h1 className="text-3xl font-black text-gray-900">
                  Tài khoản của tôi
                </h1>

                <p className="mt-1 text-gray-500">
                  Xem và cập nhật thông tin cá nhân của bạn.
                </p>
              </div>
            </div>

            <Link
              to="/account/orders"
              className="inline-flex items-center gap-2 rounded border px-5 py-3 font-bold text-gray-700 hover:border-red-500 hover:text-red-600"
            >
              <PackageSearch size={20} />
              Đơn hàng của tôi
            </Link>
          </div>
        </div>

        {message && (
          <div className="mb-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {message}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[330px_minmax(0,1fr)]">
          <div className="space-y-5">
            <AvatarUpload
              user={profile}
              onUploaded={handleAvatarUploaded}
            />

            <ChangePasswordForm />
          </div>

          <ProfileForm
            user={profile}
            onUpdated={handleUpdated}
          />
        </div>
      </div>
    </div>
  )
}

export default ProfilePage