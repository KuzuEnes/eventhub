import React, { useEffect } from 'react'
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
import { Category } from '../../types'
import { categorySchema, CategoryFormData } from './categorySchema'

interface CategoryFormDialogProps {
  open: boolean
  category?: Category
  onClose: () => void
  onSubmit: (data: CategoryFormData) => Promise<void>
  isLoading?: boolean
}

export default function CategoryFormDialog({
  open,
  category,
  onClose,
  onSubmit,
  isLoading = false,
}: CategoryFormDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? {
          name: category.name,
        }
      : undefined,
  })

  useEffect(() => {
    if (category) {
      reset({ name: category.name })
    } else {
      reset({ name: '' })
    }
  }, [category, reset])

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleFormSubmit = async (data: CategoryFormData) => {
    await onSubmit(data)
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{category ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle'}</DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Kategori Adı"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            disabled={isLoading}
            autoFocus
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
