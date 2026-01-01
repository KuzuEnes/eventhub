import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { categoriesApi } from '../../api'
import { Category } from '../../types'
import CategoryFormDialog from './CategoryFormDialog'
import ConfirmDialog from '../../components/ConfirmDialog'
import { CategoryFormData } from './categorySchema'
import Loading from '../../components/Loading'
import { AxiosError } from 'axios'

export default function CategoriesPage() {
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()
  
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

  // Fetch categories
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.list(),
  })

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CategoryFormData) => categoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
      enqueueSnackbar('Kategori başarıyla oluşturuldu', { variant: 'success' })
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      if (error.response?.status === 409) {
        enqueueSnackbar('Bu kategori adı zaten kullanılıyor. Lütfen farklı bir ad deneyin.', { variant: 'error' })
      } else {
        enqueueSnackbar('Kategori oluşturulurken bir hata oluştu', { variant: 'error' })
      }
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryFormData }) =>
      categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
      enqueueSnackbar('Kategori başarıyla güncellendi', { variant: 'success' })
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      if (error.response?.status === 409) {
        enqueueSnackbar('Bu kategori adı zaten kullanılıyor. Lütfen farklı bir ad deneyin.', { variant: 'error' })
      } else {
        enqueueSnackbar('Kategori güncellenirken bir hata oluştu', { variant: 'error' })
      }
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
      enqueueSnackbar('Kategori başarıyla silindi', { variant: 'success' })
    },
    onError: () => {
      enqueueSnackbar('Kategori silinirken bir hata oluştu', { variant: 'error' })
    },
  })

  // Handlers
  const handleOpenCreateDialog = () => {
    setSelectedCategory(undefined)
    setFormDialogOpen(true)
  }

  const handleOpenEditDialog = (category: Category) => {
    setSelectedCategory(category)
    setFormDialogOpen(true)
  }

  const handleCloseFormDialog = () => {
    setFormDialogOpen(false)
    setSelectedCategory(undefined)
  }

  const handleFormSubmit = async (data: CategoryFormData) => {
    if (selectedCategory) {
      await updateMutation.mutateAsync({ id: selectedCategory.id, data })
    } else {
      await createMutation.mutateAsync(data)
    }
  }

  const handleOpenDeleteDialog = (category: Category) => {
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setCategoryToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (categoryToDelete) {
      await deleteMutation.mutateAsync(categoryToDelete.id)
      handleCloseDeleteDialog()
    }
  }

  if (isLoading) return <Loading />

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Kategoriler</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
        >
          Yeni Kategori Ekle
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Kategori Adı</TableCell>
              <TableCell>Oluşturulma Tarihi</TableCell>
              <TableCell align="center">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Henüz kategori bulunmuyor
                </TableCell>
              </TableRow>
            ) : (
              categories?.map((category) => (
                <TableRow key={category.id} hover>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{new Date(category.createdAt).toLocaleDateString('tr-TR')}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Düzenle">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleOpenEditDialog(category)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Sil">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleOpenDeleteDialog(category)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <CategoryFormDialog
        open={formDialogOpen}
        category={selectedCategory}
        onClose={handleCloseFormDialog}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Kategoriyi Sil"
        message={`"${categoryToDelete?.name}" kategorisini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
        onConfirm={handleConfirmDelete}
        onClose={handleCloseDeleteDialog}
        loading={deleteMutation.isPending}
      />
    </Box>
  )
}