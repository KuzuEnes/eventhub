import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  Alert,
} from '@mui/material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { eventsApi, registrationsApi } from '../../api'
import { Registration } from '../../types'
import { useAuth } from '../../auth/useAuth'
import Loading from '../../components/Loading'
import { AxiosError } from 'axios'

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()
  const { user } = useAuth()

  // Fetch event details
  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsApi.get(Number(id)),
    enabled: !!id,
  })

  // Fetch my registrations to check if already registered
  const { data: myRegistrations = [] } = useQuery<Registration[]>({
    queryKey: ['my-registrations'],
    queryFn: () => registrationsApi.myRegistrations(),
    enabled: user?.role === 'STUDENT',
  })

  // Check if user is registered for this event
  const eventId = Number(id)
  const isRegistered = myRegistrations.some(
    (reg) => reg.eventId === eventId || reg.event?.id === eventId
  )

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: () => registrationsApi.register(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['event', id] })
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] })
      enqueueSnackbar('Etkinliğe başarıyla kaydoldunuz!', { variant: 'success' })
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      if (error.response?.status === 409) {
        enqueueSnackbar('Zaten bu etkinliğe kayıtlısınız', { variant: 'warning' })
      } else if (error.response?.status === 400) {
        enqueueSnackbar('Etkinlik dolu! Kayıt yapılamıyor.', { variant: 'error' })
      } else if (error.response?.status === 401) {
        enqueueSnackbar('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.', { variant: 'error' })
      } else {
        enqueueSnackbar(
          error.response?.data?.message || 'Kayıt işlemi başarısız',
          { variant: 'error' }
        )
      }
    },
  })

  // Unregister mutation
  const unregisterMutation = useMutation({
    mutationFn: () => registrationsApi.unregister(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['event', id] })
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] })
      enqueueSnackbar('Etkinlik kaydınız başarıyla iptal edildi', { variant: 'success' })
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
    },
  })

  if (eventLoading) return <Loading />
  if (!event) {
    return (
      <Box>
        <Alert severity="error">Etkinlik bulunamadı</Alert>
        <Button onClick={() => navigate('/events')} sx={{ mt: 2 }}>
          ← Etkinliklere Dön
        </Button>
      </Box>
    )
  }

  const eventDate = new Date(event.startAt)
  const isPastEvent = eventDate < new Date()

  return (
    <Box>
      <Button variant="outlined" onClick={() => navigate('/events')} sx={{ mb: 3 }}>
        ← Etkinliklere Dön
      </Button>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h4" component="h1">
              {event.title}
            </Typography>
            <Chip 
              label={event.category?.name || 'Kategori Yok'} 
              color="primary" 
              variant="outlined"
            />
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {event.description || 'Açıklama bulunmuyor'}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: 120 }}>
                📅 Tarih:
              </Typography>
              <Typography variant="body2">
                {eventDate.toLocaleDateString('tr-TR', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: 120 }}>
                ⏰ Saat:
              </Typography>
              <Typography variant="body2">
                {eventDate.toLocaleTimeString('tr-TR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: 120 }}>
                📍 Mekan:
              </Typography>
              <Typography variant="body2">
                {event.venue?.name || 'Mekan belirtilmemiş'}
              </Typography>
            </Box>

            {event.venue?.address && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: 120 }}>
                  🗺️ Adres:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.venue.address}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: 120 }}>
                🏷️ Kategori:
              </Typography>
              <Typography variant="body2">
                {event.category?.name || 'Kategori yok'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: 120 }}>
                👥 Kapasite:
              </Typography>
              <Typography variant="body2">
                {event.capacity} kişi
              </Typography>
            </Box>

            {isRegistered && (
              <Box sx={{ mt: 2 }}>
                <Alert severity="success">
                  Bu etkinliğe kayıtlısınız! ✓
                </Alert>
              </Box>
            )}

            {isPastEvent && (
              <Box sx={{ mt: 2 }}>
                <Alert severity="info">
                  Bu etkinlik geçmişte kalmış
                </Alert>
              </Box>
            )}
          </Box>
        </CardContent>

        {user?.role === 'STUDENT' && !isPastEvent && (
          <CardActions sx={{ p: 2, pt: 0 }}>
            {!isRegistered ? (
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => registerMutation.mutate()}
                disabled={registerMutation.isPending}
                fullWidth
              >
                {registerMutation.isPending ? 'Kaydediliyor...' : 'Etkinliğe Kayıt Ol'}
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="error"
                size="large"
                onClick={() => unregisterMutation.mutate()}
                disabled={unregisterMutation.isPending}
                fullWidth
              >
                {unregisterMutation.isPending ? 'İptal Ediliyor...' : 'Kaydı İptal Et'}
              </Button>
            )}
          </CardActions>
        )}
      </Card>
    </Box>
  )
}
