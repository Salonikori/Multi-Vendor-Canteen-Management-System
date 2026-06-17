import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import * as api from '../services/api'

const AuthContext = createContext(null)
const STORAGE_KEY = 'campuseats_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async ({ role, vendorId, name }) => {
    const loggedInUser = await api.login({ role, vendorId, name })
    setUser(loggedInUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser))
    return loggedInUser
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
