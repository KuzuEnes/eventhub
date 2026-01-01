import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Event, Venue, Category } from '../../types'
import { venuesApi, categoriesApi } from '../../api'
import { eventSchema, EventFormData } from './eventSchema'
import { toDatetimeLocal, fromDatetimeLocal } from '../../utils/date'

interface EventFormDialogProps {
  open: boolean
  event?: Event
  onClose: () => void
  onSubmit: (data: EventFormData) => Promise<void>
  isLoading?: boolean
}

export default function EventFormDialog({
  open,
  event,
  onClose,
  onSubmit,
  isLoading = false,
}: EventFormDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: event
      ? {
          title: event.title,
          description: event.description || '',
          startAt: toDatetimeLocal(event.startAt),
          endAt: toDatetimeLocal(event.endAt),
          capacity: event.capacity,
          venueId: event.venueId,
          categoryId: event.categoryId,
        }
      : {
          title: '',
          description: '',
          startAt: '',
          endAt: '',
          capacity: 0,
          venueId: 0,
          categoryId: 0,
        },
  })

  // Load venues
  const { data: venues, isLoading: venuesLoading } = useQuery({
    queryKey: ['venues'],
    queryFn: () => venuesApi.list(),
    enabled: open,
  })

  // Load categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.list(),
    enabled: open,
  })

  useEffect(() => {
    if (event) {
      reset({
        title: event.title,
        description: event.description || '',
        startAt: toDatetimeLocal(event.startAt),
        endAt: toDatetimeLocal(event.endAt),
        capacity: event.capacity,
        venueId: event.venueId,
        categoryId: event.categoryId,
      })
    } else {
      reset({
        title: '',
        description: '',
        startAt: '',
        endAt: '',
        capacity: 0,
        venueId: 0,
        categoryId: 0,
      })
    }
  }, [event, reset])

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleFormSubmit = async (data: EventFormData) => {
    // datetime-local formatını ISO string'e çevir
    const submitData = {
      ...data,
      startAt: fromDatetimeLocal(data.startAt),
      endAt: fromDatetimeLocal(data.endAt),
    }
    await onSubmit(submitData)
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{event ? 'Etkinliği Düzenle' : 'Yeni Etkinlik Ekle'}</DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Etkinlik Başlığı"
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
            disabled={isLoading}
            autoFocus
          />

          <TextField
            fullWidth
            label="Açıklama"
            multiline
            rows={3}
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
            disabled={isLoading}
          />

          <TextField
            fullWidth
            label="Başlangıç Tarihi ve Saati"
            type="datetime-local"
            {...register('startAt')}
            error={!!errors.startAt}
            helperText={errors.startAt?.message}
            disabled={isLoading}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            fullWidth
            label="Bitiş Tarihi ve Saati"
            type="datetime-local"
            {...register('endAt')}
            error={!!errors.endAt}
            helperText={errors.endAt?.message}
            disabled={isLoading}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            fullWidth
            label="Kapasite"
            type="number"
            {...register('capacity', { valueAsNumber: true })}
            error={!!errors.capacity}
            helperText={errors.capacity?.message}
            disabled={isLoading}
          />

          <FormControl fullWidth error={!!errors.venueId} disabled={isLoading || venuesLoading}>
            <InputLabel>Mekan</InputLabel>
            <Controller
              name="venueId"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Mekan">
                  <MenuItem value={0}>
                    <em>Mekan Seçin</em>
                  </MenuItem>
                  {venues?.map((venue) => (
                    <MenuItem key={venue.id} value={venue.id}>
                      {venue.name} (Kapasite: {venue.capacity})
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.venueId && <FormHelperText>{errors.venueId.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth error={!!errors.categoryId} disabled={isLoading || categoriesLoading}>
            <InputLabel>Kategori</InputLabel>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Kategori">
                  <MenuItem value={0}>
                    <em>Kategori Seçin</em>
                  </MenuItem>
                  {categories?.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.categoryId && <FormHelperText>{errors.categoryId.message}</FormHelperText>}
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            İptal
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || venuesLoading || categoriesLoading}
            sx={{ minWidth: '100px' }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Kaydet'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
