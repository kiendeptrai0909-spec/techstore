import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')

    if (!savedUser) {
      return null
    }

    try {
      return JSON.parse(savedUser)
    } catch {
      localStorage.removeItem('user')
      return null
    }
  })

  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem('accessToken')
  const isAuthenticated = Boolean(token && user)
  const isAdmin = user?.role === 'ROLE_ADMIN'

  useEffect(() => {
    const loadCurrentUser = async () => {
      const accessToken = localStorage.getItem('accessToken')

      if (!accessToken) {
        setLoading(false)
        return
      }

      try {
        const currentUser = await authApi.getMe()

        setUser(currentUser)
        localStorage.setItem('user', JSON.stringify(currentUser))
      } catch {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadCurrentUser()
  }, [])

  const login = async (data) => {
    const response = await authApi.login(data)

    localStorage.setItem('accessToken', response.accessToken)

    const userData = {
      id: response.userId,
      fullName: response.fullName,
      email: response.email,
      role: response.role,
      status: response.status,
    }

    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))

    return response
  }

  const register = async (data) => {
    const response = await authApi.register(data)

    localStorage.setItem('accessToken', response.accessToken)

    const userData = {
      id: response.userId,
      fullName: response.fullName,
      email: response.email,
      role: response.role,
      status: response.status,
    }

    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))

    return response
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,
      isAdmin,
      login,
      register,
      logout,
    }),
    [user, loading, isAuthenticated, isAdmin]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth phải được dùng bên trong AuthProvider')
  }

  return context
}