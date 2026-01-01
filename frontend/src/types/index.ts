// Users
export type User = {
  id: number
  email: string
  role: 'ADMIN' | 'STUDENT'
  createdAt: string
}

// Venues
export type Venue = {
  id: number
  name: string
  address: string
  capacity: number
  createdAt: string
}

export type CreateVenueDto = { name: string; address: string; capacity: number }
export type UpdateVenueDto = Partial<CreateVenueDto>

// Categories
export type Category = {
  id: number
  name: string
  createdAt: string
}

export type CreateCategoryDto = { name: string }
export type UpdateCategoryDto = { name?: string }

// Events
export type Event = {
  id: number
  title: string
  description?: string
  startAt: string
  endAt: string
  venueId: number
  categoryId: number
  capacity: number
  createdAt: string
  venue?: Venue
  category?: Category
}

export type CreateEventDto = {
  title: string
  description?: string
  startAt: string
  endAt: string
  capacity: number
  venueId: number
  categoryId: number
}

export type UpdateEventDto = Partial<CreateEventDto>

export type EventListQueryParams = {
  q?: string
  categoryId?: number
  venueId?: number
  from?: string
  to?: string
}

// Registrations
export type Registration = {
  id: number
  userId: number
  eventId: number
  createdAt: string
  user?: User
  event?: Event
}

export type CreateRegistrationDto = { eventId: number }

// Auth
export type RegisterDto = { email: string; password: string }
export type LoginDto = { email: string; password: string }

// Backend returns access_token, but we normalize to accessToken
export type BackendAuthResponse = { access_token: string; user: User }
export type AuthResponse = { accessToken: string; user: User }

// API Response wrapper
export type ApiResponse<T> = {
  data?: T
  message?: string
  statusCode?: number
}

// Paginated response
export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  limit: number
}
