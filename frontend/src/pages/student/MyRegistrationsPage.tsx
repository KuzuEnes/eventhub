import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  Alert,
} from '@mui/material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { registrationsApi } from '../../api'
import { Registration } from '../../types'
import Loading from '../../components/Loading'
import ConfirmDialog from '../../components/ConfirmDialog'
import { AxiosError } from 'axios'

export default function MyRegistrationsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)

  // Fetch my registrations
  const { data: registrations, isLoading } = useQuery<Registration[]>({
    queryKey: ['my-registrations'],
    queryFn: () => registrationsApi.myRegistrations(),
  })

  // Unregister mutation
  const unregisterMutation = useMutation({
    mutationFn: (eventId: number) => registrationsApi.unregister(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
      enqueueSnackbar('Etkinlik kaydınız başarıyla iptal edildi', { variant: 'success' })
      setConfirmDialogOpen(false)
      setSelectedRegistration(null)
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      if (error.response?.status === 401) {
        enqueueSnackbar('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.', { variant: 'error' })
      } else {
        enqueueSnackbar(
          error.response?.data?.message || 'Kayıt iptali başarısız',
          { variant: 'error' }
        )
      }
      setConfirmDialogOpen(false)
    },
  })

  const handleOpenConfirmDialog = (registration: Registration) => {
    setSelectedRegistration(registration)
    setConfirmDialogOpen(true)
  }

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false)
    setSelectedRegistration(null)
  }

  const handleConfirmUnregister = () => {
    if (selectedRegistration?.event?.id) {
      unregisterMutation.mutate(selectedRegistration.event.id)
    }
  }

  if (isLoading) return <Loading />

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Kayıtlı Etkinliklerim
      </Typography>

      {registrations && registrations.length > 0 ? (
        <Grid container spacing={3}>
          {registrations.map((reg) => {
            const eventDate = new Date(reg.event?.startAt || '')
            const isPastEvent = eventDate < new Date()
            
            return (
              <Grid item xs={12} sm={6} md={4} key={reg.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {reg.event?.title}
                      </Typography>
                      {isPastEvent && (
                        <Chip label="Geçmiş" size="small" color="default" />
                      )}
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {reg.event?.description || 'Açıklama yok'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="caption" display="flex" alignItems="center">
                        📅 {eventDate.toLocaleString('tr-TR')}
                      </Typography>
                      <Typography variant="caption" display="flex" alignItems="center">
                        📍 {reg.event?.venue?.name || 'Mekan belirtilmemiş'}
                      </Typography>
                      <Typography variant="caption" display="flex" alignItems="center">
                        🏷️ {reg.event?.category?.name || 'Kategori yok'}
                      </Typography>
                      <Typography variant="caption" display="flex" alignItems="center" sx={{ mt: 1, color: 'success.main' }}>
                        ✅ Kayıt: {new Date(reg.createdAt).toLocaleDateString('tr-TR')}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/events/${reg.event?.id}`)}
                    >
                      Detay Gör
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleOpenConfirmDialog(reg)}
                      disabled={unregisterMutation.isPending}
                    >
                      Kaydı İptal Et
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      ) : (
        <Alert severity="info" sx={{ mt: 2 }}>
          Henüz herhangi bir etkinliğe kayıtlı değilsiniz. 
          <Button 
            size="small" 
            onClick={() => navigate('/events')} 
            sx={{ ml: 2 }}
          >
            Etkinliklere Göz At
          </Button>
        </Alert>
      )}

      <ConfirmDialog
        open={confirmDialogOpen}
        title="Kaydı İptal Et"
        message={`"${selectedRegistration?.event?.title || 'Bu etkinlik'}" etkinliğinden kaydınızı iptal etmek istediğinize emin misiniz?`}
        onConfirm={handleConfirmUnregister}
        onClose={handleCloseConfirmDialog}
        confirmText="İptal Et"
      />
    </Box>
  )
}
