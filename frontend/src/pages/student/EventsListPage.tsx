import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Chip,
  LinearProgress,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { eventsApi, categoriesApi, venuesApi } from '../../api'
import Loading from '../../components/Loading'
import { useDebounce } from '../../hooks/useDebounce'

export default function EventsListPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    q: '',
    categoryId: '',
    venueId: '',
    from: '',
    to: '',
  })

  // Debounce search query to avoid refetching on every keystroke
  const debouncedQ = useDebounce(filters.q, 400)

  // Build query params (only include non-empty values)
  const nonEmptyFilters = Object.fromEntries(
    Object.entries({ ...filters, q: debouncedQ }).filter(([_, value]) => value !== '')
  )
  const queryString = new URLSearchParams(nonEmptyFilters).toString()

  // Convert string IDs to numbers for API call
  const queryParams = {
    ...nonEmptyFilters,
    ...(nonEmptyFilters.categoryId && { categoryId: Number(nonEmptyFilters.categoryId) }),
    ...(nonEmptyFilters.venueId && { venueId: Number(nonEmptyFilters.venueId) }),
  }

  // Fetch events with filters
  const { data: events, isLoading: eventsLoading, isFetching } = useQuery({
    queryKey: ['events', queryString],
    queryFn: () => eventsApi.list(queryParams),
  })

  // Fetch categories for dropdown
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.list(),
  })

  // Fetch venues for dropdown
  const { data: venues = [] } = useQuery({
    queryKey: ['venues'],
    queryFn: () => venuesApi.list(),
  })

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleClearFilters = () => {
    setFilters({ q: '', categoryId: '', venueId: '', from: '', to: '' })
  }

  // Show full page loading only on first load
  if (eventsLoading) return <Loading />

  return (
    <Box>
      {/* Small loading indicator for refetching while typing */}
      {isFetching && !eventsLoading && (
        <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }} />
      )}

      <Typography variant="h4" sx={{ mb: 3 }}>
        Etkinlikler
      </Typography>

      {/* Filters */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Filtreler</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Ara"
              size="small"
              value={filters.q}
              onChange={(e) => handleFilterChange('q', e.target.value)}
              placeholder="Etkinlik adı ara..."
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Kategori</InputLabel>
              <Select
                value={filters.categoryId}
                onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                label="Kategori"
              >
                <MenuItem value="">
                  <em>Tümü</em>
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Mekan</InputLabel>
              <Select
                value={filters.venueId}
                onChange={(e) => handleFilterChange('venueId', e.target.value)}
                label="Mekan"
              >
                <MenuItem value="">
                  <em>Tümü</em>
                </MenuItem>
                {venues.map((venue) => (
                  <MenuItem key={venue.id} value={venue.id}>
                    {venue.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              label="Başlangıç Tarihi"
              type="datetime-local"
              size="small"
              value={filters.from}
              onChange={(e) => handleFilterChange('from', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              label="Bitiş Tarihi"
              type="datetime-local"
              size="small"
              value={filters.to}
              onChange={(e) => handleFilterChange('to', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleClearFilters}
              sx={{ height: '40px' }}
            >
              Temizle
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Events List */}
      <Grid container spacing={3}>
        {events?.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
              Etkinlik bulunamadı
            </Typography>
          </Grid>
        ) : (
          events?.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {event.description || 'Açıklama yok'}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="caption" display="flex" alignItems="center">
                      📅 {new Date(event.startAt).toLocaleString('tr-TR')}
                    </Typography>
                    <Typography variant="caption" display="flex" alignItems="center">
                      📍 {event.venue?.name || 'Mekan belirtilmemiş'}
                    </Typography>
                    <Typography variant="caption" display="flex" alignItems="center">
                      🏷️ {event.category?.name || 'Kategori yok'}
                    </Typography>
                    <Typography variant="caption" display="flex" alignItems="center">
                      👥 Kapasite: {event.capacity}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Chip 
                      label={event.category?.name || 'Kategori yok'} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => navigate(`/events/${event.id}`)}
                    fullWidth
                  >
                    Detay Gör
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  )
}
