import http from './client'
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../types'

export const categoriesApi = {
  list: async (params?: Record<string, string | number | boolean | undefined>): Promise<Category[]> => {
    const { data } = await http.get('/categories', { params })
    return data
  },

  get: async (id: number): Promise<Category> => {
    const { data } = await http.get(`/categories/${id}`)
    return data
  },

  create: async (dto: CreateCategoryDto): Promise<Category> => {
    const { data } = await http.post('/categories', dto)
    return data
  },

  update: async (id: number, dto: UpdateCategoryDto): Promise<Category> => {
    const { data } = await http.patch(`/categories/${id}`, dto)
    return data
  },

  delete: async (id: number): Promise<void> => {
    await http.delete(`/categories/${id}`)
  },
}
