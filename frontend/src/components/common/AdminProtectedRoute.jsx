import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../../contexts/AuthContext'

function AdminProtectedRoute({ children }) {
  const location = useLocation()

  const {
    loading,
    isAuthenticated,
    isAdminOrStaff,
  } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="rounded bg-white px-6 py-4 font-semibold shadow-sm">
          Đang kiểm tra quyền truy cập...
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  if (!isAdminOrStaff) {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminProtectedRoute