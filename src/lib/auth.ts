/**
 * Authentication Library - Magic Link + Subscription Validation
 *
 * @author @dev (Dex) - Backend Squad
 * @version 1.0.0
 * @story 1.4 - Implement Magic Link Authentication
 */

import { supabase } from './supabase'

/**
 * Check if email has an active subscription
 */
export async function hasActiveSubscription(email: string): Promise<boolean> {
  try {
    // First, find user by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (userError || !user) {
      return false
    }

    // Check if user has active subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('status, expires_at')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (subError || !subscription) {
      return false
    }

    // Check if subscription is not expired
    if (subscription.expires_at) {
      const expiresAt = new Date(subscription.expires_at)
      if (expiresAt < new Date()) {
        return false
      }
    }

    return true
  } catch (error) {
    console.error('Error checking subscription:', error)
    return false
  }
}

/**
 * Send magic link to user's email
 * Note: Subscription check happens AFTER login via RLS + ProtectedRoute
 */
export async function sendMagicLink(email: string): Promise<{
  success: boolean
  error?: string
  needsSubscription?: boolean
}> {
  try {
    // Send magic link directly
    // Subscription will be validated by RLS after user clicks the link
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/app`,
        shouldCreateUser: true, // Allow creating auth user (they must have subscription in DB)
      }
    })

    if (error) {
      console.error('Error sending magic link:', error)

      // Check if error is because user doesn't exist
      if (error.message.includes('User not found') || error.message.includes('not found')) {
        return {
          success: false,
          needsSubscription: true,
          error: 'Email não encontrado. Você precisa de uma assinatura ativa para acessar o app.'
        }
      }

      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true
    }
  } catch (error) {
    console.error('Error in sendMagicLink:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao enviar link de acesso'
    }
  }
}

/**
 * Verify magic link token and sign in
 */
export async function verifyMagicLink(token: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email'
    })

    if (error) {
      console.error('Error verifying magic link:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true
    }
  } catch (error) {
    console.error('Error in verifyMagicLink:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao verificar link de acesso'
    }
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      console.error('Error getting current user:', error)
      return null
    }

    return user
  } catch (error) {
    console.error('Error in getCurrentUser:', error)
    return null
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error signing out:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true
    }
  } catch (error) {
    console.error('Error in signOut:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao sair'
    }
  }
}

/**
 * Get user's subscription status
 */
export async function getSubscriptionStatus(userId: string) {
  try {
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error('Error getting subscription:', error)
      return null
    }

    return subscription
  } catch (error) {
    console.error('Error in getSubscriptionStatus:', error)
    return null
  }
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return false
    }

    // Check for is_admin custom claim in JWT
    const isAdminClaim = session.user.user_metadata?.is_admin

    return isAdminClaim === true
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

/**
 * Kiwify checkout URL from env
 */
export const KIWIFY_CHECKOUT_URL = import.meta.env.VITE_KIWIFY_CHECKOUT_URL || 'https://pay.kiwify.com.br/YOUR_PRODUCT_ID'
