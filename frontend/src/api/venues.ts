import http from './client'
import { Venue, CreateVenueDto, UpdateVenueDto } from '../types'

export const venuesApi = {
  list: async (params?: Record<string, string | number | boolean | undefined>): Promise<Venue[]> => {
    const { data } = await http.get('/venues', { params })
    return data
  },

  get: async (id: number): Promise<Venue> => {
    const { data } = await http.get(`/venues/${id}`)
    return data
  },

  create: async (dto: CreateVenueDto): Promise<Venue> => {
    const { data } = await http.post('/venues', dto)
    return data
  },

  update: async (id: number, dto: UpdateVenueDto): Promise<Venue> => {
    const { data } = await http.patch(`/venues/${id}`, dto)
    return data
  },

  delete: async (id: number): Promise<void> => {
    await http.delete(`/venues/${id}`)
  },
}
