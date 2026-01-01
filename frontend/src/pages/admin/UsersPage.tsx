import React, { useState } from 'react'
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  Chip,
} from '@mui/material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { usersApi } from '../../api'
import { User } from '../../types'
import ConfirmDialog from '../../components/ConfirmDialog'
import Loading from '../../components/Loading'

export default function UsersPage() {
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newRole, setNewRole] = useState<'ADMIN' | 'STUDENT' | null>(null)

  // Fetch users
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.list(),
  })

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: number; role: 'ADMIN' | 'STUDENT' }) =>
      usersApi.updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      enqueueSnackbar('Kullanıcı rolü başarıyla güncellendi', { variant: 'success' })
    },
    onError: () => {
      enqueueSnackbar('Kullanıcı rolü güncellenirken bir hata oluştu', { variant: 'error' })
    },
  })

  const handleRoleChange = (user: User, role: 'ADMIN' | 'STUDENT') => {
    if (role === user.role) return // No change

    setSelectedUser(user)
    setNewRole(role)
    setConfirmDialogOpen(true)
  }

  const handleConfirmRoleChange = async () => {
    if (selectedUser && newRole) {
      await updateRoleMutation.mutateAsync({ id: selectedUser.id, role: newRole })
      setConfirmDialogOpen(false)
      setSelectedUser(null)
      setNewRole(null)
    }
  }

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false)
    setSelectedUser(null)
    setNewRole(null)
  }

  const getRoleColor = (role: 'ADMIN' | 'STUDENT') => {
    return role === 'ADMIN' ? 'error' : 'primary'
  }

  const getRoleLabel = (role: 'ADMIN' | 'STUDENT') => {
    return role === 'ADMIN' ? 'Admin' : 'Öğrenci'
  }

  if (isLoading) return <Loading />

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Kullanıcılar
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>E-posta</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Kayıt Tarihi</TableCell>
              <TableCell>Rol Değiştir</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Henüz kullanıcı bulunmuyor
                </TableCell>
              </TableRow>
            ) : (
              users?.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={getRoleLabel(user.role)}
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user, e.target.value as 'ADMIN' | 'STUDENT')}
                        disabled={updateRoleMutation.isPending}
                      >
                        <MenuItem value="STUDENT">Öğrenci</MenuItem>
                        <MenuItem value="ADMIN">Admin</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDialog
        open={confirmDialogOpen}
        title="Rol Değiştir"
        message={`${selectedUser?.email} kullanıcısının rolünü ${getRoleLabel(newRole || 'STUDENT')} yapmak istiyor musunuz?`}
        onConfirm={handleConfirmRoleChange}
        onClose={handleCloseConfirmDialog}
        confirmText="Değiştir"
        loading={updateRoleMutation.isPending}
      />
    </Box>
  )
}