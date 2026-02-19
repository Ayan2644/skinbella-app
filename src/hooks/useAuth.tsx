/**
 * useAuth Hook - Authentication State Management
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { signOut as authSignOut, getSubscriptionStatus } from '@/lib/auth'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  hasActiveSubscription: boolean
  subscriptionStatus: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null)

  const checkSubscription = async (userId: string) => {
    const subscription = await getSubscriptionStatus(userId)

    if (subscription) {
      setSubscriptionStatus(subscription.status)
      const isActive = subscription.status === 'active'
      const notExpired = !subscription.expires_at || new Date(subscription.expires_at) > new Date()
      setHasActiveSubscription(isActive && notExpired)
    } else {
      setSubscriptionStatus(null)
      setHasActiveSubscription(false)
    }
  }

  useEffect(() => {
    // Set up auth state listener FIRST
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

    // Then get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        checkSubscription(session.user.id)
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

  return (
    <AuthContext.Provider value={{
      user, session, loading,
      signOut: handleSignOut,
      hasActiveSubscription, subscriptionStatus
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
