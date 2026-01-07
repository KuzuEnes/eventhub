import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSnackbar } from 'notistack'
import { useAuth } from '../auth/useAuth'
import { loginSchema, LoginFormData } from '../auth/schemas'
import styles from './Login.module.css'

export default function LoginPage() {
  const { enqueueSnackbar } = useSnackbar()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [keepLoggedIn, setKeepLoggedIn] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    try {
      await login(data.email, data.password)
      enqueueSnackbar('Başarıyla giriş yaptınız', { variant: 'success' })
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      enqueueSnackbar(
        err?.response?.data?.message || 'Giriş başarısız',
        { variant: 'error' }
      )
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault()
    enqueueSnackbar('Şifre sıfırlama özelliği yakında eklenecek', { variant: 'info' })
  }

  const handleSocialLogin = (provider: string) => {
    enqueueSnackbar(`${provider} ile giriş özelliği yakında eklenecek`, { variant: 'info' })
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        {/* Left Panel - Illustration */}
        <div className={styles.leftPanel}>
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/login-page-4468581-3783954.png"
            alt="Login Illustration"
            className={styles.illustration}
          />
        </div>

        {/* Right Panel - Form */}
        <div className={styles.rightPanel}>
          <div className={styles.formHeader}>
            <h1 className={styles.formTitle}>Login</h1>
            <p className={styles.formSubtitle}>Please login to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className={`${styles.formInput} ${errors.email ? styles.error : ''}`}
                placeholder="Enter your email"
                disabled={loading}
                {...register('email')}
              />
              {errors.email && (
                <span className={styles.errorText}>{errors.email.message}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>
                Password
              </label>
              <input
                id="password"
                type="password"
                className={`${styles.formInput} ${errors.password ? styles.error : ''}`}
                placeholder="Enter your password"
                disabled={loading}
                {...register('password')}
              />
              {errors.password && (
                <span className={styles.errorText}>{errors.password.message}</span>
              )}
            </div>

            <div className={styles.rememberRow}>
              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="keepLoggedIn"
                  checked={keepLoggedIn}
                  onChange={(e) => setKeepLoggedIn(e.target.checked)}
                />
                <label htmlFor="keepLoggedIn" className={styles.checkboxLabel}>
                  Keep me logged in
                </label>
              </div>
              <a href="#" onClick={handleForgotPassword} className={styles.forgotLink}>
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className={styles.loginButton}
              disabled={loading}
            >
              {loading ? <span className={styles.loader}></span> : 'LOGIN'}
            </button>
          </form>

          <div className={styles.divider}>
            <span className={styles.dividerText}>Or Login With</span>
          </div>

          <div className={styles.socialButtons}>
            <button
              type="button"
              className={styles.socialButton}
              onClick={() => handleSocialLogin('Google')}
              aria-label="Login with Google"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>
            <button
              type="button"
              className={styles.socialButton}
              onClick={() => handleSocialLogin('Facebook')}
              aria-label="Login with Facebook"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button
              type="button"
              className={styles.socialButton}
              onClick={() => handleSocialLogin('Twitter')}
              aria-label="Login with Twitter"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#1DA1F2" d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </button>
          </div>

          <div className={styles.registerLink}>
            Hesabınız yok mu?
            <Link to="/register">Kaydol</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
