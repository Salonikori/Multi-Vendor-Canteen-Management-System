import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import StudentDashboard from './pages/StudentDashboard'
import VendorDashboard from './pages/VendorDashboard'
import AdminDashboard from './pages/AdminDashboard'

const ROLE_HOME = { student: '/student', vendor: '/vendor', admin: '/admin' }

export default function App() {
  const { user, loading } = useAuth()

  return (
    <div className="min-h-screen bg-canteen-bg font-sans text-canteen-cream">
      {user && !loading && <Navbar />}

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor"
          element={
            <ProtectedRoute allowedRoles={['vendor']}>
              <VendorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={<Navigate to={user ? ROLE_HOME[user.role] : '/login'} replace />}
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  )
}
