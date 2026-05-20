import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../../contexts/AuthContext'

function AdminProtectedRoute({ children }) {
  const location = useLocation()
  const { loading, isAuthenticated, user } = useAuth()

  const role = user?.role || user?.authorities?.[0]?.authority
  const isAdmin = role === 'ROLE_ADMIN' || role === 'ADMIN'

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="rounded bg-white px-6 py-4 font-semibold shadow-sm">
          Đang kiểm tra quyền admin...
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

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminProtectedRoute