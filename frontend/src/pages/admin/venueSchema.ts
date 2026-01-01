import { z } from 'zod'

export const venueSchema = z.object({
  name: z.string().min(3, 'Mekan adı en az 3 karakter olmalı'),
  address: z.string().min(5, 'Adres en az 5 karakter olmalı'),
  capacity: z.number().min(1, 'Kapasite en az 1 olmalı'),
})

export type VenueFormData = z.infer<typeof venueSchema>
