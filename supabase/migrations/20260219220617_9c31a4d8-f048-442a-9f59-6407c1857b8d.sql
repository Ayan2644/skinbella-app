
-- Create users table
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  kiwify_customer_id TEXT,
  full_name TEXT,
  profile_photo_url TEXT,
  is_admin BOOLEAN DEFAULT false,
  is_blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON public.users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid()::text = id::text);
CREATE POLICY "Service role full access users" ON public.users FOR ALL USING (true) WITH CHECK (true);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  kiwify_subscription_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'paused', 'refunded', 'late')),
  plan_name TEXT,
  amount_cents INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Service role full access subscriptions" ON public.subscriptions FOR ALL USING (true) WITH CHECK (true);

-- Create quiz_results table
CREATE TABLE public.quiz_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  skin_age INTEGER,
  scores JSONB DEFAULT '{}',
  answers JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quiz results" ON public.quiz_results FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own quiz results" ON public.quiz_results FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Service role full access quiz" ON public.quiz_results FOR ALL USING (true) WITH CHECK (true);

-- Create leads table
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  quiz_completed BOOLEAN DEFAULT false,
  quiz_result_id UUID,
  converted_to_user BOOLEAN DEFAULT false,
  user_id UUID,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);

-- Create user_activity table
CREATE TABLE public.user_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_type TEXT NOT NULL,
  activity_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity" ON public.user_activity FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own activity" ON public.user_activity FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Service role full access activity" ON public.user_activity FOR ALL USING (true) WITH CHECK (true);

-- Create admin_metrics table
CREATE TABLE public.admin_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_date DATE NOT NULL,
  total_users INTEGER DEFAULT 0,
  active_subscriptions INTEGER DEFAULT 0,
  cancelled_subscriptions INTEGER DEFAULT 0,
  mrr_cents INTEGER DEFAULT 0,
  new_users_today INTEGER DEFAULT 0,
  quiz_completions_today INTEGER DEFAULT 0,
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access metrics" ON public.admin_metrics FOR ALL USING (true) WITH CHECK (true);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
