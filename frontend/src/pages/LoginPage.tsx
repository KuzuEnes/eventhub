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

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
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

            <button
              type="submit"
              className={styles.loginButton}
              disabled={loading}
            >
              {loading ? <span className={styles.loader}></span> : 'LOGIN'}
            </button>
          </form>

          <div className={styles.registerLink}>
            Hesabınız yok mu?
            <Link to="/register">Kaydol</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
