import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../../hooks/useAuth'

function ProtectedRoute({ children }) {
  const location = useLocation()
  const { loading, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-[#e9e9e9]">
        <div className="rounded bg-white px-6 py-4 font-semibold shadow-sm">
          Đang kiểm tra đăng nhập...
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

  return children
}

export default ProtectedRoute