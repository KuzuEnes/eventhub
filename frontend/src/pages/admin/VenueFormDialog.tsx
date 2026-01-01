import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material'
import { Venue } from '../../types'
import { venueSchema, VenueFormData } from './venueSchema'

interface VenueFormDialogProps {
  open: boolean
  venue?: Venue
  onClose: () => void
  onSubmit: (data: VenueFormData) => Promise<void>
  isLoading?: boolean
}

export default function VenueFormDialog({
  open,
  venue,
  onClose,
  onSubmit,
  isLoading = false,
}: VenueFormDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VenueFormData>({
    resolver: zodResolver(venueSchema),
    defaultValues: venue
      ? {
          name: venue.name,
          address: venue.address,
          capacity: venue.capacity,
        }
      : undefined,
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleFormSubmit = async (data: VenueFormData) => {
    await onSubmit(data)
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{venue ? 'Mekanı Düzenle' : 'Yeni Mekan Ekle'}</DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Mekan Adı"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            disabled={isLoading}
          />

          <TextField
            fullWidth
            label="Adres"
            multiline
            rows={3}
            {...register('address')}
            error={!!errors.address}
            helperText={errors.address?.message}
            disabled={isLoading}
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
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            İptal
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{ minWidth: '100px' }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Kaydet'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
