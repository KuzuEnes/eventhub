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
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { eventsApi, venuesApi, categoriesApi } from '../../api'
import { Event } from '../../types'
import EventFormDialog from './EventFormDialog'
import ConfirmDialog from '../../components/ConfirmDialog'
import { EventFormData } from './eventSchema'
import Loading from '../../components/Loading'

export default function EventsPage() {
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()
  
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null)

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>('')
  const [selectedVenueId, setSelectedVenueId] = useState<number | ''>('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  // Build filter params for stable queryKey
  const filterParams: Record<string, string | number> = {}
  if (searchQuery) filterParams.q = searchQuery
  if (selectedCategoryId) filterParams.categoryId = selectedCategoryId
  if (selectedVenueId) filterParams.venueId = selectedVenueId
  if (dateFrom) filterParams.from = dateFrom
  if (dateTo) filterParams.to = dateTo

  const queryString = new URLSearchParams(
    Object.entries(filterParams).map(([key, value]) => [key, String(value)])
  ).toString()

  // Fetch events with filters
  const { data: events, isLoading } = useQuery({
    queryKey: ['events', queryString],
    queryFn: () => eventsApi.list(filterParams),
  })

  // Fetch venues for filter
  const { data: venues } = useQuery({
    queryKey: ['venues'],
    queryFn: () => venuesApi.list(),
  })

  // Fetch categories for filter
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.list(),
  })

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: EventFormData) => eventsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      enqueueSnackbar('Etkinlik başarıyla oluşturuldu', { variant: 'success' })
    },
    onError: () => {
      enqueueSnackbar('Etkinlik oluşturulurken bir hata oluştu', { variant: 'error' })
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: EventFormData }) =>
      eventsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      enqueueSnackbar('Etkinlik başarıyla güncellendi', { variant: 'success' })
    },
    onError: () => {
      enqueueSnackbar('Etkinlik güncellenirken bir hata oluştu', { variant: 'error' })
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => eventsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      enqueueSnackbar('Etkinlik başarıyla silindi', { variant: 'success' })
    },
    onError: () => {
      enqueueSnackbar('Etkinlik silinirken bir hata oluştu', { variant: 'error' })
    },
  })

  // Handlers
  const handleOpenCreateDialog = () => {
    setSelectedEvent(undefined)
    setFormDialogOpen(true)
  }

  const handleOpenEditDialog = (event: Event) => {
    setSelectedEvent(event)
    setFormDialogOpen(true)
  }

  const handleCloseFormDialog = () => {
    setFormDialogOpen(false)
    setSelectedEvent(undefined)
  }

  const handleFormSubmit = async (data: EventFormData) => {
    if (selectedEvent) {
      await updateMutation.mutateAsync({ id: selectedEvent.id, data })
    } else {
      await createMutation.mutateAsync(data)
    }
  }

  const handleOpenDeleteDialog = (event: Event) => {
    setEventToDelete(event)
    setDeleteDialogOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setEventToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (eventToDelete) {
      await deleteMutation.mutateAsync(eventToDelete.id)
      handleCloseDeleteDialog()
    }
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedCategoryId('')
    setSelectedVenueId('')
    setDateFrom('')
    setDateTo('')
  }

  if (isLoading) return <Loading />

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Etkinlikler</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
        >
          Yeni Etkinlik Ekle
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Filtreler</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Ara (Başlık)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Kategori</InputLabel>
              <Select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value as number | '')}
                label="Kategori"
              >
                <MenuItem value="">
                  <em>Tümü</em>
                </MenuItem>
                {categories?.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Mekan</InputLabel>
              <Select
                value={selectedVenueId}
                onChange={(e) => setSelectedVenueId(e.target.value as number | '')}
                label="Mekan"
              >
                <MenuItem value="">
                  <em>Tümü</em>
                </MenuItem>
                {venues?.map((venue) => (
                  <MenuItem key={venue.id} value={venue.id}>
                    {venue.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleClearFilters}
              sx={{ height: '40px' }}
            >
              Filtreleri Temizle
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Başlangıç Tarihi"
              type="datetime-local"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Bitiş Tarihi"
              type="datetime-local"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Başlık</TableCell>
              <TableCell>Başlangıç</TableCell>
              <TableCell>Mekan</TableCell>
              <TableCell>Kategori</TableCell>
              <TableCell>Kapasite</TableCell>
              <TableCell align="center">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Henüz etkinlik bulunmuyor
                </TableCell>
              </TableRow>
            ) : (
              events?.map((event) => (
                <TableRow key={event.id} hover>
                  <TableCell>{event.id}</TableCell>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>
                    {new Date(event.startAt).toLocaleString('tr-TR')}
                  </TableCell>
                  <TableCell>{event.venue?.name || '-'}</TableCell>
                  <TableCell>{event.category?.name || '-'}</TableCell>
                  <TableCell>{event.capacity}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Düzenle">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleOpenEditDialog(event)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Sil">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleOpenDeleteDialog(event)}
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

      <EventFormDialog
        open={formDialogOpen}
        event={selectedEvent}
        onClose={handleCloseFormDialog}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Etkinliği Sil"
        message={`"${eventToDelete?.title}" etkinliğini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
        onConfirm={handleConfirmDelete}
        onClose={handleCloseDeleteDialog}
        loading={deleteMutation.isPending}
      />
    </Box>
  )
}