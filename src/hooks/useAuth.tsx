/**
 * useAuth Hook - Authentication State Management
 * @updated force-rebuild
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { signOut as authSignOut, getSubscriptionStatus } from '@/lib/auth'

const MOCK_USER_KEY = 'skinbella.mock_user'

export interface MockUser {
  id: string
  email: string
  isAdmin?: boolean
}

export function getMockUser(): MockUser | null {
  try {
    const raw = localStorage.getItem(MOCK_USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function setMockUser(mock: MockUser) {
  localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mock))
}

export function clearMockUser() {
  localStorage.removeItem(MOCK_USER_KEY)
}

function mockToUser(mock: MockUser): User {
  return {
    id: mock.id,
    email: mock.email,
    app_metadata: {},
    user_metadata: { full_name: mock.email },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  } as unknown as User
}

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
    // Check for mock user first (local dev testing)
    const mock = getMockUser()
    if (mock) {
      console.log('🔧 useAuth: Using mock user from localStorage:', mock.email)
      setUser(mockToUser(mock))
      setHasActiveSubscription(true) // mock users bypass subscription
      setLoading(false)
      return
    }

    let mounted = true

    // Set up auth state listener
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
    })

    // Get initial session with timeout fallback
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('⏱️ Auth session check timed out, setting loading=false')
        setLoading(false)
      }
    }, 5000)

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return
      clearTimeout(timeout)
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        checkSubscription(session.user.id)
      }

      setLoading(false)
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
    clearMockUser()
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
