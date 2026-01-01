import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './useAuth'

export default function RequireRole({
  roles,
  children,
}: {
  roles: ('ADMIN' | 'STUDENT')[]
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()

  if (loading) {
    return null
  }

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
