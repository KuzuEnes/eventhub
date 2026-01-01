import React from 'react'
import { Box, Container } from '@mui/material'
import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'

export default function AppLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <Outlet />
      </Container>
    </Box>
  )
}
