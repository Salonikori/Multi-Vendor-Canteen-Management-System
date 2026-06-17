import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from './ui/Spinner'

const ROLE_HOME = { student: '/student', vendor: '/vendor', admin: '/admin' }

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-paper flex items-center justify-center"><Spinner /></div>
  if (!user) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to={ROLE_HOME[user.role] || '/login'} replace />
  return children
}
