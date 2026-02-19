-- =====================================================
-- SkinBella App - Initial Schema Migration
-- Version: 1.0.0
-- Created: 16/02/2026
-- Author: @dev (Dex) - Backend Squad
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE 1: users
-- Stores user profile and authentication data
-- =====================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  kiwify_customer_id TEXT UNIQUE,
  full_name TEXT,
  profile_photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_kiwify_customer_id ON users(kiwify_customer_id);

-- =====================================================
-- TABLE 2: subscriptions
-- Tracks Kiwify subscriptions and payment status
-- =====================================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  kiwify_subscription_id TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'paused', 'refunded')),
  plan_name TEXT,
  amount_cents INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for subscriptions
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_kiwify_id ON subscriptions(kiwify_subscription_id);
CREATE INDEX idx_subscriptions_expires_at ON subscriptions(expires_at);

-- =====================================================
-- TABLE 3: quiz_results
-- Stores skin analysis quiz results
-- =====================================================
CREATE TABLE quiz_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skin_age INTEGER,
  scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for quiz_results
CREATE INDEX idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX idx_quiz_results_created_at ON quiz_results(created_at DESC);

-- =====================================================
-- TABLE 4: leads
-- Captures leads before conversion
-- =====================================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  quiz_completed BOOLEAN DEFAULT FALSE,
  quiz_result_id UUID REFERENCES quiz_results(id) ON DELETE SET NULL,
  converted_to_user BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  source TEXT DEFAULT 'quiz',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for leads
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_converted ON leads(converted_to_user);
CREATE INDEX idx_leads_quiz_completed ON leads(quiz_completed);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

-- =====================================================
-- TABLE 5: user_activity
-- Tracks user engagement and actions
-- =====================================================
CREATE TABLE user_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for user_activity
CREATE INDEX idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX idx_user_activity_type ON user_activity(activity_type);
CREATE INDEX idx_user_activity_created_at ON user_activity(created_at DESC);

-- =====================================================
-- TABLE 6: admin_metrics
-- Cached metrics for admin dashboard performance
-- =====================================================
CREATE TABLE admin_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_date DATE NOT NULL,
  total_users INTEGER DEFAULT 0,
  active_subscriptions INTEGER DEFAULT 0,
  cancelled_subscriptions INTEGER DEFAULT 0,
  mrr_cents INTEGER DEFAULT 0,
  new_users_today INTEGER DEFAULT 0,
  quiz_completions_today INTEGER DEFAULT 0,
  calculated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (metric_date)
);

-- Index for admin_metrics
CREATE INDEX idx_admin_metrics_date ON admin_metrics(metric_date DESC);

-- =====================================================
-- UPDATED_AT TRIGGER FUNCTION
-- Automatically updates updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMMENTS (Documentation)
-- =====================================================
COMMENT ON TABLE users IS 'User profile and authentication data';
COMMENT ON TABLE subscriptions IS 'Kiwify subscription tracking';
COMMENT ON TABLE quiz_results IS 'Skin analysis quiz results';
COMMENT ON TABLE leads IS 'Lead capture before conversion';
COMMENT ON TABLE user_activity IS 'User engagement tracking';
COMMENT ON TABLE admin_metrics IS 'Cached metrics for dashboard';

-- =====================================================
-- INITIAL DATA (Optional)
-- =====================================================
-- Insert first admin metric entry (will be updated by CRON)
INSERT INTO admin_metrics (metric_date)
VALUES (CURRENT_DATE)
ON CONFLICT (metric_date) DO NOTHING;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- Schema Version: 1.0.0
-- Tables Created: 6
-- Indexes Created: 17
-- Triggers Created: 2
-- =====================================================
