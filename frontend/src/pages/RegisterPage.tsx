import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSnackbar } from 'notistack'
import { useAuth } from '../auth/useAuth'
import { registerSchema, RegisterFormData } from '../auth/schemas'
import styles from './Login.module.css'

export default function RegisterPage() {
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
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        {/* Left Panel - Illustration */}
        <div className={styles.leftPanel}>
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/sign-up-page-1886582-1598253.png"
            alt="Register Illustration"
            className={styles.illustration}
          />
        </div>

        {/* Right Panel - Form */}
        <div className={styles.rightPanel}>
          <div className={styles.formHeader}>
            <h1 className={styles.formTitle}>Create Account</h1>
            <p className={styles.formSubtitle}>Sign up to get started</p>
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

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.formLabel}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className={`${styles.formInput} ${errors.confirmPassword ? styles.error : ''}`}
                placeholder="Confirm your password"
                disabled={loading}
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <span className={styles.errorText}>{errors.confirmPassword.message}</span>
              )}
            </div>

            <button
              type="submit"
              className={styles.loginButton}
              disabled={loading}
            >
              {loading ? <span className={styles.loader}></span> : 'SIGN UP'}
            </button>
          </form>

          <div className={styles.registerLink}>
            Hesabınız var mı?
            <Link to="/login">Giriş Yap</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
