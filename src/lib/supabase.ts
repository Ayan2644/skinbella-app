/**
 * Supabase Client Configuration
 *
 * @author @dev (Dex) - Backend Squad
 * @version 1.0.0
 * @story 1.1 - Setup Supabase Project
 */

import { createClient } from '@supabase/supabase-js'

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validation
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '❌ Missing Supabase environment variables. ' +
    'Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env'
  )
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

/**
 * Test Supabase connection
 * @returns Promise<boolean> - true if connected, false otherwise
 */
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (error) {
      console.error('❌ Supabase connection error:', error.message)
      return false
    }

    console.log('✅ Supabase connected successfully!')
    console.log('📊 Database responsive and ready')
    return true
  } catch (error) {
    console.error('❌ Supabase connection failed:', error)
    return false
  }
}

/**
 * Database Types (to be extended as we build)
 */
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          kiwify_customer_id: string | null
          full_name: string | null
          profile_photo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          kiwify_customer_id?: string | null
          full_name?: string | null
          profile_photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          kiwify_customer_id?: string | null
          full_name?: string | null
          profile_photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          kiwify_subscription_id: string
          status: 'active' | 'cancelled' | 'expired' | 'paused' | 'refunded'
          plan_name: string | null
          amount_cents: number
          started_at: string | null
          expires_at: string | null
          cancelled_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          kiwify_subscription_id: string
          status: 'active' | 'cancelled' | 'expired' | 'paused' | 'refunded'
          plan_name?: string | null
          amount_cents?: number
          started_at?: string | null
          expires_at?: string | null
          cancelled_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          kiwify_subscription_id?: string
          status?: 'active' | 'cancelled' | 'expired' | 'paused' | 'refunded'
          plan_name?: string | null
          amount_cents?: number
          started_at?: string | null
          expires_at?: string | null
          cancelled_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      quiz_results: {
        Row: {
          id: string
          user_id: string
          skin_age: number | null
          scores: Record<string, any>
          answers: Record<string, any>
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skin_age?: number | null
          scores?: Record<string, any>
          answers?: Record<string, any>
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          skin_age?: number | null
          scores?: Record<string, any>
          answers?: Record<string, any>
          created_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          email: string
          quiz_completed: boolean
          quiz_result_id: string | null
          converted_to_user: boolean
          user_id: string | null
          source: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          quiz_completed?: boolean
          quiz_result_id?: string | null
          converted_to_user?: boolean
          user_id?: string | null
          source?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          quiz_completed?: boolean
          quiz_result_id?: string | null
          converted_to_user?: boolean
          user_id?: string | null
          source?: string | null
          created_at?: string
        }
      }
      user_activity: {
        Row: {
          id: string
          user_id: string
          activity_type: string
          activity_data: Record<string, any>
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_type: string
          activity_data?: Record<string, any>
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity_type?: string
          activity_data?: Record<string, any>
          created_at?: string
        }
      }
      admin_metrics: {
        Row: {
          id: string
          metric_date: string
          total_users: number
          active_subscriptions: number
          cancelled_subscriptions: number
          mrr_cents: number
          new_users_today: number
          quiz_completions_today: number
          calculated_at: string
        }
        Insert: {
          id?: string
          metric_date: string
          total_users?: number
          active_subscriptions?: number
          cancelled_subscriptions?: number
          mrr_cents?: number
          new_users_today?: number
          quiz_completions_today?: number
          calculated_at?: string
        }
        Update: {
          id?: string
          metric_date?: string
          total_users?: number
          active_subscriptions?: number
          cancelled_subscriptions?: number
          mrr_cents?: number
          new_users_today?: number
          quiz_completions_today?: number
          calculated_at?: string
        }
      }
    }
  }
}

// Typed Supabase client
export type TypedSupabaseClient = ReturnType<typeof createClient<Database>>
