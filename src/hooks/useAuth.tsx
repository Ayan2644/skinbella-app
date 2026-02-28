/**
 * useAuth Hook - Authentication State Management
 * Real Supabase Auth only — no mock/localStorage bypasses.
 * Centralizes isAdmin check to avoid race conditions.
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { signOut as authSignOut, getSubscriptionStatus, checkIsAdmin } from '@/lib/auth'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  hasActiveSubscription: boolean
  subscriptionStatus: string | null
  isAdmin: boolean
  adminLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const loadingRef = { current: true }
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminLoading, setAdminLoading] = useState(true)

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

  const checkAdmin = async (userId: string) => {
    setAdminLoading(true)
    try {
      const result = await checkIsAdmin(userId)
      console.log('[useAuth] checkIsAdmin result:', result, 'for user:', userId)
      setIsAdmin(result)
    } catch (err) {
      console.warn('[useAuth] Admin check failed:', err)
      setIsAdmin(false)
    } finally {
      setAdminLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        // Fire-and-forget: don't block onAuthStateChange callback
        const userId = session.user.id
        checkSubscription(userId)
        checkAdmin(userId)
      } else {
        setHasActiveSubscription(false)
        setSubscriptionStatus(null)
        setIsAdmin(false)
        setAdminLoading(false)
      }

      setLoading(false)
      loadingRef.current = false
    })

    const timeout = setTimeout(() => {
      if (mounted && loadingRef.current) {
        console.warn('⏱️ Auth session check timed out, setting loading=false')
        setLoading(false)
        setAdminLoading(false)
        loadingRef.current = false
      }
    }, 3000)

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return
      clearTimeout(timeout)
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        Promise.all([
          checkSubscription(session.user.id),
          checkAdmin(session.user.id)
        ]).then(() => {
          if (mounted) {
            setLoading(false)
            loadingRef.current = false
          }
        })
      } else {
        setAdminLoading(false)
        setLoading(false)
        loadingRef.current = false
      }
    }).catch(() => {
      if (mounted) {
        clearTimeout(timeout)
        setLoading(false)
        setAdminLoading(false)
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
    setIsAdmin(false)
    setAdminLoading(false)
  }

  return (
    <AuthContext.Provider value={{
      user, session, loading,
      signOut: handleSignOut,
      hasActiveSubscription, subscriptionStatus,
      isAdmin, adminLoading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    // Return safe defaults instead of throwing — prevents blank screen during HMR or race conditions
    return {
      user: null,
      session: null,
      loading: true,
      signOut: async () => {},
      hasActiveSubscription: false,
      subscriptionStatus: null,
      isAdmin: false,
      adminLoading: true,
    } as AuthContextType
  }
  return context
}
