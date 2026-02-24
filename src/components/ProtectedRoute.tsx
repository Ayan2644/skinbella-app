/**
 * ProtectedRoute Component - Route Protection with Subscription Check
 * Admin users bypass subscription requirement via centralized useAuth.
 */

import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
  requireSubscription?: boolean
}

export function ProtectedRoute({ children, requireSubscription = true }: ProtectedRouteProps) {
  const { user, loading, hasActiveSubscription, isAdmin, adminLoading } = useAuth()

  if (loading || adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Admins bypass subscription requirement
  if (requireSubscription && !hasActiveSubscription && !isAdmin) {
    return <Navigate to="/login?error=subscription_required" replace />
  }

  return <>{children}</>
}
