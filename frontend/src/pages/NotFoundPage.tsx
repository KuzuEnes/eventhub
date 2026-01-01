import React from 'react'
import { Box, Container, Typography } from '@mui/material'

export default function NotFoundPage() {
  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Typography variant="h1" sx={{ mb: 2 }}>
          404
        </Typography>
        <Typography variant="h5">Sayfa bulunamadı</Typography>
      </Box>
    </Container>
  )
}
