import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './useAuth'
import { CircularProgress, Box } from '@mui/material'

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
