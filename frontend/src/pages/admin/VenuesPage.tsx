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
import { venuesApi } from '../../api'
import { Venue } from '../../types'
import VenueFormDialog from './VenueFormDialog'
import ConfirmDialog from '../../components/ConfirmDialog'
import { VenueFormData } from './venueSchema'
import Loading from '../../components/Loading'

export default function VenuesPage() {
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()
  
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState<Venue | undefined>(undefined)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [venueToDelete, setVenueToDelete] = useState<Venue | null>(null)

  // Fetch venues
  const { data: venues, isLoading } = useQuery({
    queryKey: ['venues'],
    queryFn: () => venuesApi.list(),
  })

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: VenueFormData) => venuesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues'] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
      enqueueSnackbar('Mekan başarıyla oluşturuldu', { variant: 'success' })
    },
    onError: () => {
      enqueueSnackbar('Mekan oluşturulurken bir hata oluştu', { variant: 'error' })
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: VenueFormData }) =>
      venuesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues'] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
      enqueueSnackbar('Mekan başarıyla güncellendi', { variant: 'success' })
    },
    onError: () => {
      enqueueSnackbar('Mekan güncellenirken bir hata oluştu', { variant: 'error' })
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => venuesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues'] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
      enqueueSnackbar('Mekan başarıyla silindi', { variant: 'success' })
    },
    onError: () => {
      enqueueSnackbar('Mekan silinirken bir hata oluştu', { variant: 'error' })
    },
  })

  // Handlers
  const handleOpenCreateDialog = () => {
    setSelectedVenue(undefined)
    setFormDialogOpen(true)
  }

  const handleOpenEditDialog = (venue: Venue) => {
    setSelectedVenue(venue)
    setFormDialogOpen(true)
  }

  const handleCloseFormDialog = () => {
    setFormDialogOpen(false)
    setSelectedVenue(undefined)
  }

  const handleFormSubmit = async (data: VenueFormData) => {
    if (selectedVenue) {
      await updateMutation.mutateAsync({ id: selectedVenue.id, data })
    } else {
      await createMutation.mutateAsync(data)
    }
  }

  const handleOpenDeleteDialog = (venue: Venue) => {
    setVenueToDelete(venue)
    setDeleteDialogOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setVenueToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (venueToDelete) {
      await deleteMutation.mutateAsync(venueToDelete.id)
      handleCloseDeleteDialog()
    }
  }

  if (isLoading) return <Loading />

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Mekanlar</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
        >
          Yeni Mekan Ekle
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Mekan Adı</TableCell>
              <TableCell>Adres</TableCell>
              <TableCell align="right">Kapasite</TableCell>
              <TableCell align="center">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {venues?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Henüz mekan bulunmuyor
                </TableCell>
              </TableRow>
            ) : (
              venues?.map((venue) => (
                <TableRow key={venue.id} hover>
                  <TableCell>{venue.id}</TableCell>
                  <TableCell>{venue.name}</TableCell>
                  <TableCell>{venue.address}</TableCell>
                  <TableCell align="right">{venue.capacity}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Düzenle">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleOpenEditDialog(venue)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Sil">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleOpenDeleteDialog(venue)}
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

      <VenueFormDialog
        open={formDialogOpen}
        venue={selectedVenue}
        onClose={handleCloseFormDialog}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Mekanı Sil"
        message={`"${venueToDelete?.name}" mekanını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
        onConfirm={handleConfirmDelete}
        onClose={handleCloseDeleteDialog}
        loading={deleteMutation.isPending}
      />
    </Box>
  )
}
