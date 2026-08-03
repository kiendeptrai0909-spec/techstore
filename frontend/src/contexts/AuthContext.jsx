import { useEffect, useMemo, useState } from 'react'
import { authApi } from '../api/authApi'
import { AuthContext } from './AuthContextInstance'

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
  const isStaff = user?.role === 'ROLE_STAFF'
  const isAdminOrStaff = isAdmin || isStaff

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

  const saveAuthData = (response) => {
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

  const login = async (data) => {
    const response = await authApi.login(data)
    return saveAuthData(response)
  }

  const loginWithGoogle = async (credential) => {
    const response = await authApi.googleLogin(credential)
    return saveAuthData(response)
  }

  const register = async (data) => {
    const response = await authApi.register(data)
    return saveAuthData(response)
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
      isStaff,
      isAdminOrStaff,
      login,
      loginWithGoogle,
      register,
      logout,
    }),
    [user, loading, isAuthenticated, isAdmin, isStaff, isAdminOrStaff, login, loginWithGoogle, register]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

