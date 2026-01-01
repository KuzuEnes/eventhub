import http from './client'
import { Registration, CreateRegistrationDto } from '../types'

export const registrationsApi = {
  list: async (eventId: number, params?: Record<string, string | number | boolean | undefined>): Promise<Registration[]> => {
    const { data } = await http.get(`/events/${eventId}/registrations`, { params })
    return data
  },

  create: async (eventId: number, dto: CreateRegistrationDto): Promise<Registration> => {
    const { data } = await http.post(`/events/${eventId}/registrations`, dto)
    return data
  },

  delete: async (eventId: number, userId: number): Promise<void> => {
    await http.delete(`/events/${eventId}/registrations/${userId}`)
  },

  // Student endpoints
  register: async (eventId: number): Promise<void> => {
    await http.post(`/events/${eventId}/register`)
  },

  unregister: async (eventId: number): Promise<void> => {
    await http.delete(`/events/${eventId}/register`)
  },

  myRegistrations: async (): Promise<Registration[]> => {
    const { data } = await http.get('/me/registrations')
    return data
  },
}
