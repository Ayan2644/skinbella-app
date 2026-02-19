/**
 * useAuth Hook - Authentication State Management
 *
 * @author @dev (Dex) - Backend Squad
 * @version 1.0.0
 * @story 1.4 - Implement Magic Link Authentication
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { getCurrentUser, signOut as authSignOut, getSubscriptionStatus } from '@/lib/auth'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  hasActiveSubscription: boolean
  subscriptionStatus: 'active' | 'cancelled' | 'expired' | 'paused' | 'refunded' | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'cancelled' | 'expired' | 'paused' | 'refunded' | null>(null)

  // Check subscription status
  const checkSubscription = async (userId: string) => {
    const subscription = await getSubscriptionStatus(userId)

    if (subscription) {
      setSubscriptionStatus(subscription.status)

      // Check if subscription is active and not expired
      const isActive = subscription.status === 'active'
      const notExpired = !subscription.expires_at || new Date(subscription.expires_at) > new Date()

      setHasActiveSubscription(isActive && notExpired)
    } else {
      setSubscriptionStatus(null)
      setHasActiveSubscription(false)
    }
  }

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        checkSubscription(session.user.id)
      }

      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        await checkSubscription(session.user.id)
      } else {
        setHasActiveSubscription(false)
        setSubscriptionStatus(null)
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await authSignOut()
    setUser(null)
    setSession(null)
    setHasActiveSubscription(false)
    setSubscriptionStatus(null)
  }

  const value = {
    user,
    session,
    loading,
    signOut: handleSignOut,
    hasActiveSubscription,
    subscriptionStatus
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
