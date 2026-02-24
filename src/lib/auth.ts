/**
 * Authentication Library - Magic Link + Password + Subscription Validation
 */

import { supabase } from '@/lib/supabase'

/**
 * Check if email has an active subscription (uses service role via edge function for unauthenticated check)
 */
export async function hasActiveSubscription(email: string): Promise<boolean> {
  try {
    // Use edge function to check subscription (bypasses RLS since user isn't logged in yet)
    const { data, error } = await supabase.functions.invoke('bright-responder', {
      method: 'POST',
      body: { action: 'check_subscription', email }
    })

    if (error) {
      console.error('Error checking subscription:', error)
      return false
    }

    return data?.hasActiveSubscription === true
  } catch (error) {
    console.error('Error checking subscription:', error)
    return false
  }
}

/**
 * Send magic link to user's email
 */
export async function sendMagicLink(email: string): Promise<{
  success: boolean
  error?: string
  needsSubscription?: boolean
}> {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/app`,
        shouldCreateUser: false, // Only existing users (created by webhook)
      }
    })

    if (error) {
      console.error('Error sending magic link:', error)

      if (error.message.includes('Signups not allowed') || error.message.includes('not found') || error.message.includes('User not found')) {
        return {
          success: false,
          needsSubscription: true,
          error: 'Email não encontrado. Você precisa de uma assinatura ativa para acessar o app.'
        }
      }

      return { success: false, error: error.message }
    }

    return { success: true }
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
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
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
    if (error) return null
    return user
  } catch {
    return null
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signOut({ scope: 'local' })
    if (error) {
      console.warn('signOut error:', error.message)
      // Force local cleanup even on error
      return { success: true }
    }
    return { success: true }
  } catch (error) {
    console.warn('signOut exception:', error)
    // Always succeed locally so the UI can reset
    return { success: true }
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

    if (error) return null
    return subscription
  } catch {
    return null
  }
}

/**
 * Check if user has admin role (uses has_role SECURITY DEFINER function — bypasses RLS)
 */
export async function checkIsAdmin(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('has_role', {
      _user_id: userId,
      _role: 'admin'
    })

    if (error) {
      console.warn('checkIsAdmin rpc error:', error.message)
      return false
    }
    return data === true
  } catch (err) {
    console.warn('checkIsAdmin exception:', err)
    return false
  }
}

/**
 * Kiwify checkout URL
 */
export const KIWIFY_CHECKOUT_URL = import.meta.env.VITE_KIWIFY_CHECKOUT_URL || 'https://pay.kiwify.com.br/25XXmrv'
