import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { SnackbarProvider } from 'notistack'
import AppRouter from './app/router'
import { theme } from './app/theme'
import { AuthProvider } from './auth/AuthProvider'

const queryClient = new QueryClient()

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <BrowserRouter>
              <CssBaseline />
              <AuthProvider>
                <AppRouter />
              </AuthProvider>
            </BrowserRouter>
          </SnackbarProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
