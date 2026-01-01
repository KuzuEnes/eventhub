import http from './client'
import { User } from '../types'

export const usersApi = {
  list: async (params?: Record<string, unknown>): Promise<User[]> => {
    const { data } = await http.get('/users', { params })
    return data
  },

  get: async (id: number): Promise<User> => {
    const { data } = await http.get(`/users/${id}`)
    return data
  },

  update: async (id: number, dto: Partial<User>): Promise<User> => {
    const { data } = await http.patch(`/users/${id}`, dto)
    return data
  },

  updateRole: async (id: number, role: 'ADMIN' | 'STUDENT'): Promise<User> => {
    const { data } = await http.patch(`/users/${id}/role`, { role })
    return data
  },
}
