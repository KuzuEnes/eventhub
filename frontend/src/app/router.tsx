import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import AppLayout from '../components/AppLayout'
import AdminLayout from '../pages/admin/AdminLayout'

// Pages
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import EventsListPage from '../pages/student/EventsListPage'
import EventDetailPage from '../pages/student/EventDetailPage'
import MyRegistrationsPage from '../pages/student/MyRegistrationsPage'
import VenuesPage from '../pages/admin/VenuesPage'
import CategoriesPage from '../pages/admin/CategoriesPage'
import EventsPage from '../pages/admin/EventsPage'
import UsersPage from '../pages/admin/UsersPage'
import NotFoundPage from '../pages/NotFoundPage'

// Guards
import RequireAuth from '../auth/RequireAuth'
import RequireRole from '../auth/RequireRole'

export default function AppRouter() {
  return (
    <Routes>
      {/* Public routes (no layout) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes with AppLayout */}
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        {/* Student routes */}
        <Route path="/events" element={<EventsListPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route
          path="/me/registrations"
          element={
            <RequireRole roles={['STUDENT']}>
              <MyRegistrationsPage />
            </RequireRole>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <RequireRole roles={['ADMIN']}>
              <AdminLayout />
            </RequireRole>
          }
        >
          <Route path="venues" element={<VenuesPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
      </Route>

      {/* Fallbacks */}
      <Route path="/" element={<Navigate to="/events" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
