import React from 'react'
import { useForm } from 'react-hook-form'
import api from '../api/client'

type Form = { email: string; password: string }

export default function Login() {
  const { register, handleSubmit } = useForm<Form>()

  const onSubmit = async (data: Form) => {
    try {
      const res = await api.post('/auth/login', data)
      localStorage.setItem('token', res.data.accessToken)
      alert('Logged in')
    } catch (err) {
      alert('Login failed')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Email</label>
        <input {...register('email')} />
      </div>
      <div>
        <label>Password</label>
        <input type="password" {...register('password')} />
      </div>
      <button type="submit">Login</button>
    </form>
  )
}
