-- =====================================================
-- RLS VERIFICATION SCRIPT
-- =====================================================
-- Story 1.2 - Verify Row Level Security is working
-- Run this in Supabase SQL Editor after applying migration
-- =====================================================

-- =====================================================
-- 1. CHECK: RLS ENABLED ON ALL TABLES
-- =====================================================

SELECT
  tablename,
  CASE
    WHEN rowsecurity THEN '✅ ENABLED'
    ELSE '❌ DISABLED'
  END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Expected: All 6 tables with "✅ ENABLED"

-- =====================================================
-- 2. COUNT: TOTAL POLICIES CREATED
-- =====================================================

SELECT
  COUNT(*) as total_policies,
  CASE
    WHEN COUNT(*) >= 15 THEN '✅ ALL POLICIES CREATED'
    ELSE '⚠️ MISSING POLICIES'
  END as status
FROM pg_policies
WHERE schemaname = 'public';

-- Expected: total_policies >= 15

-- =====================================================
-- 3. DETAIL: POLICIES BY TABLE
-- =====================================================

SELECT
  tablename,
  COUNT(*) as policy_count,
  array_agg(policyname ORDER BY policyname) as policies
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- Expected:
-- users: 3 policies
-- subscriptions: 2 policies
-- quiz_results: 3 policies
-- leads: 1 policy
-- user_activity: 2 policies
-- admin_metrics: 2 policies

-- =====================================================
-- 4. CHECK: HELPER FUNCTION EXISTS
-- =====================================================

SELECT
  proname as function_name,
  '✅ EXISTS' as status
FROM pg_proc
WHERE proname = 'has_active_subscription';

-- Expected: 1 row with "has_active_subscription"

-- =====================================================
-- 5. FINAL SUMMARY
-- =====================================================

SELECT
  '✅ RLS VERIFICATION COMPLETE' as result,
  (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = true) as tables_with_rls,
  (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public') as total_policies,
  (SELECT COUNT(*) FROM pg_proc WHERE proname = 'has_active_subscription') as helper_functions;

-- Expected:
-- tables_with_rls: 6
-- total_policies: 15+
-- helper_functions: 1

-- =====================================================
-- ✅ IF ALL CHECKS PASS: Story 1.2 COMPLETE!
-- =====================================================
