
-- 1. Unique constraint na tabela leads (para upsert funcionar)
ALTER TABLE public.leads ADD CONSTRAINT leads_email_key UNIQUE (email);

-- 2. Unique constraint na tabela subscriptions (idempotência)
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_kiwify_id_key UNIQUE (kiwify_subscription_id);

-- 3. Unique constraint em admin_metrics.metric_date
ALTER TABLE public.admin_metrics ADD CONSTRAINT admin_metrics_date_key UNIQUE (metric_date);

-- 4. Criar funcao refresh_admin_metrics
CREATE OR REPLACE FUNCTION public.refresh_admin_metrics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO admin_metrics (metric_date, total_users, active_subscriptions, cancelled_subscriptions, mrr_cents, new_users_today, quiz_completions_today)
  SELECT
    CURRENT_DATE,
    (SELECT count(*) FROM users),
    (SELECT count(*) FROM subscriptions WHERE status = 'active'),
    (SELECT count(*) FROM subscriptions WHERE status IN ('cancelled','chargedback','refunded')),
    (SELECT COALESCE(sum(amount_cents), 0) FROM subscriptions WHERE status = 'active'),
    (SELECT count(*) FROM users WHERE created_at::date = CURRENT_DATE),
    (SELECT count(*) FROM quiz_results WHERE created_at::date = CURRENT_DATE)
  ON CONFLICT (metric_date) DO UPDATE SET
    total_users = EXCLUDED.total_users,
    active_subscriptions = EXCLUDED.active_subscriptions,
    cancelled_subscriptions = EXCLUDED.cancelled_subscriptions,
    mrr_cents = EXCLUDED.mrr_cents,
    new_users_today = EXCLUDED.new_users_today,
    quiz_completions_today = EXCLUDED.quiz_completions_today,
    calculated_at = now();
END;
$$;

-- 5. Criar tabela user_roles para segurança
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 6. Corrigir RLS - dropar políticas permissivas
DROP POLICY IF EXISTS "Service role full access users" ON public.users;
DROP POLICY IF EXISTS "Service role full access subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Service role full access leads" ON public.leads;
DROP POLICY IF EXISTS "Service role full access quiz" ON public.quiz_results;
DROP POLICY IF EXISTS "Service role full access activity" ON public.user_activity;
DROP POLICY IF EXISTS "Service role full access metrics" ON public.admin_metrics;

-- 7. Recriar políticas seguras
CREATE POLICY "Admins can read metrics" ON public.admin_metrics
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage metrics" ON public.admin_metrics
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read all users" ON public.users
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage users" ON public.users
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read all subscriptions" ON public.subscriptions
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read leads" ON public.leads
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read all activity" ON public.user_activity
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read all quiz results" ON public.quiz_results
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
