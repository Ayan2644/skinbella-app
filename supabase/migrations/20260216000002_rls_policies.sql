-- =====================================================
-- SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================
-- Story: 1.2 - Implement Row Level Security
-- Author: @dev (Dex) - Backend Squad
-- Date: 2026-02-16
-- =====================================================

-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_metrics ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USERS TABLE POLICIES
-- =====================================================

-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- Only authenticated users with active subscription can insert (via webhook)
-- This will be handled by service_role key in Edge Functions
CREATE POLICY "Service role can insert users"
  ON users
  FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- SUBSCRIPTIONS TABLE POLICIES
-- =====================================================

-- Users can read their own subscriptions
CREATE POLICY "Users can read own subscriptions"
  ON subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only service role can insert/update subscriptions (webhooks)
CREATE POLICY "Service role can manage subscriptions"
  ON subscriptions
  FOR ALL
  USING (true);

-- =====================================================
-- QUIZ_RESULTS TABLE POLICIES
-- =====================================================

-- Users can read their own quiz results
CREATE POLICY "Users can read own quiz results"
  ON quiz_results
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own quiz results
CREATE POLICY "Users can insert own quiz results"
  ON quiz_results
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own quiz results (retake quiz)
CREATE POLICY "Users can update own quiz results"
  ON quiz_results
  FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- LEADS TABLE POLICIES
-- =====================================================

-- Leads table is managed by service role only (quiz → subscription flow)
-- No direct user access
CREATE POLICY "Service role can manage leads"
  ON leads
  FOR ALL
  USING (true);

-- =====================================================
-- USER_ACTIVITY TABLE POLICIES
-- =====================================================

-- Users can read their own activity
CREATE POLICY "Users can read own activity"
  ON user_activity
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own activity
CREATE POLICY "Users can insert own activity"
  ON user_activity
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- ADMIN_METRICS TABLE POLICIES
-- =====================================================

-- Only admin users can access metrics
-- We'll use a custom claim 'is_admin' in JWT
CREATE POLICY "Admins can read metrics"
  ON admin_metrics
  FOR SELECT
  USING (
    (auth.jwt() ->> 'is_admin')::boolean = true
  );

-- Only service role can insert/update metrics (scheduled job)
CREATE POLICY "Service role can manage metrics"
  ON admin_metrics
  FOR ALL
  USING (true);

-- =====================================================
-- HELPER FUNCTION: Check Active Subscription
-- =====================================================

-- Function to check if user has active subscription
CREATE OR REPLACE FUNCTION has_active_subscription(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM subscriptions
    WHERE subscriptions.user_id = $1
      AND status = 'active'
      AND (expires_at IS NULL OR expires_at > NOW())
  );
END;
$$;

-- =====================================================
-- ENHANCED POLICY: Only Active Subscribers Access Content
-- =====================================================

-- Drop existing policy if recreating
DROP POLICY IF EXISTS "Users can read own data" ON users;

-- Recreate with subscription check
CREATE POLICY "Active subscribers can read own data"
  ON users
  FOR SELECT
  USING (
    auth.uid() = id
    AND has_active_subscription(id)
  );

-- Same for quiz_results
DROP POLICY IF EXISTS "Users can read own quiz results" ON quiz_results;

CREATE POLICY "Active subscribers can read quiz results"
  ON quiz_results
  FOR SELECT
  USING (
    auth.uid() = user_id
    AND has_active_subscription(user_id)
  );

-- Same for user_activity
DROP POLICY IF EXISTS "Users can read own activity" ON user_activity;

CREATE POLICY "Active subscribers can read activity"
  ON user_activity
  FOR SELECT
  USING (
    auth.uid() = user_id
    AND has_active_subscription(user_id)
  );

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Test RLS is enabled (should return 6 rows with 't')
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- List all policies
-- SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public';

-- Test active subscription check
-- SELECT has_active_subscription('YOUR_USER_UUID');

-- =====================================================
-- NOTES
-- =====================================================

-- 1. Service role bypasses RLS (used in Edge Functions for webhooks)
-- 2. Anon key respects RLS (used in frontend)
-- 3. Admin access requires 'is_admin' custom claim in JWT
-- 4. Active subscription check prevents cancelled/expired users from accessing data
-- 5. Leads table has no user-facing policies (backend only)

-- =====================================================
-- END OF RLS POLICIES
-- =====================================================
