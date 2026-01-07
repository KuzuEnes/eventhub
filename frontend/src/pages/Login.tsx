import React from 'react'
import { useForm } from 'react-hook-form'
import api from '../api/client'

type Form = { email: string; password: string }

export default function Login() {
  const { register, handleSubmit } = useForm<Form>()
const onSubmit = async (data: Form) => {
  try {
    const res = await api.post('/auth/login', data)

    const token =
      res.data?.accessToken ??
      res.data?.access_token ??
      res.data?.token

    if (!token) {
      console.log("LOGIN RESPONSE:", res.data)
      alert("Giriş başarılı ama token alanı bulunamadı. Console'a bak.")
      return
    }

    localStorage.setItem('token', token)
    alert('Logged in')
    window.location.href = '/'
  } catch (err) {
    console.log("LOGIN ERROR:", err)
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
