/**
 * ProtectedRoute Component - Route Protection with Subscription Check
 *
 * @author @dev (Dex) - Backend Squad
 * @version 1.2.0
 * @story 1.4 - Implement Magic Link Authentication
 *
 * Admin users bypass subscription requirement.
 */

import { ReactNode, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
  requireSubscription?: boolean
}

const DEV_MODE = true; // TODO: Desativar após corrigir auth flow

export function ProtectedRoute({ children, requireSubscription = true }: ProtectedRouteProps) {
  const { user, loading, hasActiveSubscription } = useAuth()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [checkingAdmin, setCheckingAdmin] = useState(false)

  // Check if user is admin (admins bypass subscription requirement)
  useEffect(() => {
    if (!user?.email || !requireSubscription || hasActiveSubscription) {
      setIsAdmin(null)
      setCheckingAdmin(false)
      return
    }

    setCheckingAdmin(true)
    supabase
      .from('users')
      .select('is_admin')
      .eq('email', user.email)
      .single()
      .then(({ data }) => {
        setIsAdmin(data ? (data.is_admin ?? false) : false)
        setCheckingAdmin(false)
      }, () => {
        setIsAdmin(false)
        setCheckingAdmin(false)
      })
  }, [user?.email, requireSubscription, hasActiveSubscription])

  if (DEV_MODE) {
    return <>{children}</>
  }

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

  // Admin users bypass subscription check
  if (requireSubscription && !hasActiveSubscription && !isAdmin) {
    return <Navigate to="/login?error=subscription_required" replace />
  }

  return <>{children}</>
}
