import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

export default function Header() {
  const { user } = useAuth()

  return (
    <header>
      <nav>
        <Link to="/">Home</Link> | <Link to="/events">Events</Link>
        {user ? <span> | {user.email}</span> : <Link to="/login">Login</Link>}
      </nav>
    </header>
  )
}
