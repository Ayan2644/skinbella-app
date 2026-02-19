/**
 * AdminLogin - Redirects to main login (admin access is role-based, not separate)
 */

import { Navigate } from 'react-router-dom'

const AdminLogin = () => {
  return <Navigate to="/login" replace />
}

export default AdminLogin
