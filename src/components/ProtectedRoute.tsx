/**
 * ProtectedRoute Component - Route Protection with Subscription Check
 * Admin users (via user_roles table) bypass subscription requirement.
 * @updated force-rebuild
 */

import { ReactNode, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { checkIsAdmin } from '@/lib/auth'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
  requireSubscription?: boolean
}

export function ProtectedRoute({ children, requireSubscription = true }: ProtectedRouteProps) {
  const { user, loading, hasActiveSubscription } = useAuth()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [checkingAdmin, setCheckingAdmin] = useState(false)

  useEffect(() => {
    if (!user?.id || !requireSubscription || hasActiveSubscription) {
      setIsAdmin(null)
      setCheckingAdmin(false)
      return
    }

    setCheckingAdmin(true)
    checkIsAdmin(user.id).then((result) => {
      setIsAdmin(result)
      setCheckingAdmin(false)
    })
  }, [user?.id, requireSubscription, hasActiveSubscription])

  if (loading || checkingAdmin) {
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

  if (requireSubscription && !hasActiveSubscription && !isAdmin) {
    return <Navigate to="/login?error=subscription_required" replace />
  }

  return <>{children}</>
}
