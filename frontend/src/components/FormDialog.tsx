import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

interface FormDialogProps {
  open: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
  actions?: React.ReactNode
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export default function FormDialog({
  open,
  title,
  onClose,
  children,
  actions,
  maxWidth = 'md',
}: FormDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  )
}
