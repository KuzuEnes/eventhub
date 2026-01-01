import http from './client'
import { LoginDto, RegisterDto, AuthResponse, BackendAuthResponse, User } from '../types'

// Normalize backend response (access_token → accessToken)
const normalizeAuthResponse = (backendResponse: BackendAuthResponse): AuthResponse => ({
  accessToken: backendResponse.access_token,
  user: backendResponse.user,
})

export const authApi = {
  register: async (dto: RegisterDto): Promise<AuthResponse> => {
    const { data } = await http.post<BackendAuthResponse>('/auth/register', dto)
    return normalizeAuthResponse(data)
  },

  login: async (dto: LoginDto): Promise<AuthResponse> => {
    const { data } = await http.post<BackendAuthResponse>('/auth/login', dto)
    return normalizeAuthResponse(data)
  },

  me: async (): Promise<User> => {
    const { data } = await http.get('/auth/me')
    return data
  },
}
