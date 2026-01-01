import React from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../api/client'
import { Event } from '../types'

export default function Events() {
  const { data, isLoading } = useQuery<Event[]>(['events'], async () => {
    const r = await api.get('/events')
    return r.data
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <h2>Events</h2>
      <ul>
        {(data || []).map((e) => (
          <li key={e.id}>{e.title}</li>
        ))}
      </ul>
    </div>
  )
}
