/**
 * Re-export supabase client from the official integration.
 * This file exists for backward compatibility with imports from '@/lib/supabase'.
 */
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/integrations/supabase/types'

const url = import.meta.env.VITE_SUPABASE_URL || 'https://kkfvlbqhxvexpjrdlgpx.supabase.co'
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrZnZsYnFoeHZleHBqcmRsZ3B4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MzY0ODYsImV4cCI6MjA4NzExMjQ4Nn0.3yWH6UEBs9VB0lpxu2zj39SpDSbe5Fi8wowdS6XKCL8'

export const supabase = createClient<Database>(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})
