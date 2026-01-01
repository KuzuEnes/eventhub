import React from 'react'
import { Box, Paper } from '@mui/material'
import { Outlet } from 'react-router-dom'

export default function AdminLayout() {
  return (
    <Box>
      <Paper elevation={0}>
        <Outlet />
      </Paper>
    </Box>
  )
}
