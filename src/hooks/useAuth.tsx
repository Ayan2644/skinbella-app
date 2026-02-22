/**
 * useAuth Hook - Authentication State Management
 * Real Supabase Auth only — no mock/localStorage bypasses.
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
  const loadingRef = { current: true }
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null)

  const checkSubscription = async (userId: string) => {
    try {
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
    } catch (err) {
      console.warn('Subscription check failed:', err)
      setSubscriptionStatus(null)
      setHasActiveSubscription(false)
    }
  }

  useEffect(() => {
    let mounted = true

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        await checkSubscription(session.user.id)
      } else {
        setHasActiveSubscription(false)
        setSubscriptionStatus(null)
      }

      setLoading(false)
      loadingRef.current = false
    })

    const timeout = setTimeout(() => {
      if (mounted && loadingRef.current) {
        console.warn('⏱️ Auth session check timed out, setting loading=false')
        setLoading(false)
        loadingRef.current = false
      }
    }, 3000)

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return
      clearTimeout(timeout)
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        checkSubscription(session.user.id)
      }

      setLoading(false)
      loadingRef.current = false
    }).catch(() => {
      if (mounted) {
        clearTimeout(timeout)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
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
