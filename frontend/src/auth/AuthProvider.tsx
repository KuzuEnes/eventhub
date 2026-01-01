import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, AuthResponse } from '../types'
import { authApi } from '../api'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Load user from token on app start
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      loadUser()
    } else {
      setLoading(false)
    }
  }, [])

  const loadUser = async () => {
    try {
      const userData = await authApi.me()
      setUser(userData)
    } catch (error) {
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response: AuthResponse = await authApi.login({ email, password })
      localStorage.setItem('token', response.accessToken)
      setUser(response.user)
      // Navigate based on role
      const route = response.user.role === 'ADMIN' ? '/admin/events' : '/events'
      navigate(route)
    } catch (error) {
      throw error
    }
  }

  const register = async (email: string, password: string) => {
    try {
      const response: AuthResponse = await authApi.register({ email, password })
      localStorage.setItem('token', response.accessToken)
      setUser(response.user)
      navigate('/events')
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
