-- =====================================================
-- Admin Metrics Auto-Refresh Function
-- =====================================================
-- Recalcula métricas em tempo real para dashboard admin
-- Chamada automaticamente pelo webhook após processar eventos

CREATE OR REPLACE FUNCTION refresh_admin_metrics()
RETURNS void AS $$
DECLARE
  today DATE := CURRENT_DATE;
BEGIN
  -- Inserir ou atualizar métricas do dia atual
  INSERT INTO admin_metrics (
    metric_date,
    total_users,
    active_subscriptions,
    cancelled_subscriptions,
    mrr_cents,
    new_users_today,
    quiz_completions_today,
    calculated_at
  )
  VALUES (
    today,
    -- Total de usuários
    (SELECT COUNT(*) FROM users),

    -- Assinaturas ativas
    (SELECT COUNT(*) FROM subscriptions WHERE status = 'active'),

    -- Assinaturas canceladas
    (SELECT COUNT(*) FROM subscriptions WHERE status IN ('cancelled', 'refunded', 'chargedback')),

    -- MRR (Monthly Recurring Revenue) em centavos
    (SELECT COALESCE(SUM(amount_cents), 0) FROM subscriptions WHERE status = 'active'),

    -- Novos usuários hoje
    (SELECT COUNT(*) FROM users WHERE DATE(created_at) = today),

    -- Quiz completions hoje
    (SELECT COUNT(*) FROM quiz_results WHERE DATE(created_at) = today),

    -- Timestamp do cálculo
    NOW()
  )
  ON CONFLICT (metric_date)
  DO UPDATE SET
    total_users = EXCLUDED.total_users,
    active_subscriptions = EXCLUDED.active_subscriptions,
    cancelled_subscriptions = EXCLUDED.cancelled_subscriptions,
    mrr_cents = EXCLUDED.mrr_cents,
    new_users_today = EXCLUDED.new_users_today,
    quiz_completions_today = EXCLUDED.quiz_completions_today,
    calculated_at = NOW();

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentário da função
COMMENT ON FUNCTION refresh_admin_metrics() IS
'Recalcula todas as métricas do dashboard admin em tempo real. Chamada pelo webhook Kiwify após processar eventos.';
