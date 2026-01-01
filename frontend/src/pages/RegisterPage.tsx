import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { useAuth } from '../auth/useAuth'
import { registerSchema, RegisterFormData } from '../auth/schemas'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const { register: registerAuth } = useAuth()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true)
    try {
      await registerAuth(data.email, data.password)
      enqueueSnackbar('Başarıyla kayıt oldunuz', { variant: 'success' })
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { message?: string } } }
      
      let errorMessage = 'Kayıt başarısız'
      
      if (err?.response?.status === 409) {
        errorMessage = 'Bu e-posta zaten kayıtlı. Giriş yapmayı deneyin.'
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message
      }
      
      enqueueSnackbar(errorMessage, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
            Kaydol
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Şifre"
              type="password"
              margin="normal"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Şifreyi Tekrarla"
              type="password"
              margin="normal"
              {...register('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              disabled={loading}
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              type="submit"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Kaydol'}
            </Button>
          </form>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Hesabınız var mı?{' '}
              <Link to="/login" style={{ color: '#1976d2' }}>
                Giriş Yap
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}
