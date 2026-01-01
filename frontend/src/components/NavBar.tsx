import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Menu,
  MenuItem,
  Button,
  IconButton,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { useAuth } from '../auth/useAuth'

export default function NavBar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    setAnchorEl(null)
  }

  const isAdmin = user?.role === 'ADMIN'

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          EventHub
        </Typography>

        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
          <Button color="inherit" onClick={() => navigate('/events')}>
            Etkinlikler
          </Button>

          {user && (
            <Button color="inherit" onClick={() => navigate('/me/registrations')}>
              Kayıtlarım
            </Button>
          )}

          {isAdmin && (
            <>
              <Button color="inherit" onClick={() => navigate('/admin/venues')}>
                Mekanlar
              </Button>
              <Button color="inherit" onClick={() => navigate('/admin/categories')}>
                Kategoriler
              </Button>
              <Button color="inherit" onClick={() => navigate('/admin/events')}>
                Etkinlikler (Admin)
              </Button>
              <Button color="inherit" onClick={() => navigate('/admin/users')}>
                Kullanıcılar
              </Button>
            </>
          )}

          {user && (
            <IconButton
              size="large"
              aria-controls="user-menu"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <AccountCircleIcon />
            </IconButton>
          )}

          {!user && (
            <Button color="inherit" onClick={() => navigate('/login')}>
              Giriş Yap
            </Button>
          )}
        </Box>

        {/* Mobile menu */}
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ display: { xs: 'flex', sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* User menu */}
      {user && (
        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem disabled>
            <Typography variant="body2">{user.email}</Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>Çıkış Yap</MenuItem>
        </Menu>
      )}
    </AppBar>
  )
}
