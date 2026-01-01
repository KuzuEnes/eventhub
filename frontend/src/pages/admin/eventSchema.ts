import { z } from 'zod'

export const eventSchema = z.object({
  title: z.string().min(2, 'Etkinlik başlığı en az 2 karakter olmalı'),
  description: z.string().optional(),
  startAt: z.string().min(1, 'Başlangıç tarihi gerekli'),
  endAt: z.string().min(1, 'Bitiş tarihi gerekli'),
  capacity: z.number().min(1, 'Kapasite en az 1 olmalı'),
  venueId: z.number().min(1, 'Mekan seçimi gerekli'),
  categoryId: z.number().min(1, 'Kategori seçimi gerekli'),
})

export type EventFormData = z.infer<typeof eventSchema>
