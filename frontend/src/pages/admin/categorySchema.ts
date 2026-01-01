import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(2, 'Kategori adı en az 2 karakter olmalı'),
})

export type CategoryFormData = z.infer<typeof categorySchema>
