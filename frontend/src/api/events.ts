import http from './client'
import { Event, CreateEventDto, UpdateEventDto, EventListQueryParams } from '../types'

export const eventsApi = {
  list: async (params?: EventListQueryParams | Record<string, string | number>): Promise<Event[]> => {
    const { data } = await http.get('/events', { params })
    return data
  },

  get: async (id: number): Promise<Event> => {
    const { data } = await http.get(`/events/${id}`)
    return data
  },

  create: async (dto: CreateEventDto): Promise<Event> => {
    const { data } = await http.post('/events', dto)
    return data
  },

  update: async (id: number, dto: UpdateEventDto): Promise<Event> => {
    const { data } = await http.patch(`/events/${id}`, dto)
    return data
  },

  delete: async (id: number): Promise<void> => {
    await http.delete(`/events/${id}`)
  },
}
