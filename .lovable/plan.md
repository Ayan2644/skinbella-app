

# Plano: Correcao Completa do Fluxo Kiwify + Dashboard + Liberacao de Acesso

## Problemas Encontrados

### 1. KIWIFY_WEBHOOK_TOKEN nao esta configurado como secret
O webhook valida o token com `Deno.env.get('KIWIFY_WEBHOOK_TOKEN')`, mas esse secret NAO existe no projeto. Toda requisicao sera rejeitada com 401.

### 2. config.toml nao tem `verify_jwt = false` para o webhook
Sem isso, o Supabase exige um JWT valido para chamar a Edge Function. A Kiwify nao envia JWT, entao o webhook nunca sera alcancado (retorna 401 antes mesmo de chegar no codigo).

### 3. Webhook NAO cria usuario no Supabase Auth
O handler `handlePurchaseApproved` cria registro na tabela `users`, mas NAO cria o usuario no Supabase Auth. Quando a pessoa tentar fazer login com Magic Link, o sistema nao encontrara o usuario autenticavel. O login falhara.

### 4. Tabela `leads` nao tem constraint UNIQUE em `email`
O webhook faz `upsert({ onConflict: 'email' })` na tabela leads, mas nao existe constraint unique. Isso causa erro no banco.

### 5. Funcao `refresh_admin_metrics` nao existe
O webhook tenta chamar `supabase.rpc('refresh_admin_metrics')` apos processar cada evento, mas essa funcao nao foi criada no banco. O erro e tratado como non-critical, mas o Dashboard nunca recebe dados.

### 6. Dashboard depende de `admin_metrics` preenchida
O Dashboard busca dados da tabela `admin_metrics` por `metric_date = hoje`. Se a funcao RPC nao existe, essa tabela fica vazia e o Dashboard mostra "Nenhuma metrica encontrada".

### 7. Politica RLS de seguranca muito permissiva
A policy "Service role full access" esta aplicada a TODOS os roles (incluindo anon), nao apenas service_role. Qualquer pessoa pode ler/escrever em todas as tabelas.

### 8. Webhook sem CORS headers
Embora a Kiwify chame diretamente (sem CORS), a falta de headers pode causar problemas se testarmos via browser.

---

## Plano de Implementacao

### Etapa 1: Configurar Secret do Webhook
- Solicitar ao usuario que configure o `KIWIFY_WEBHOOK_TOKEN` via ferramenta de secrets

### Etapa 2: Atualizar `supabase/config.toml`
```toml
[functions.kiwify-webhook]
verify_jwt = false
```

### Etapa 3: Migration - Correcoes no banco de dados

```sql
-- 1. Unique constraint na tabela leads
ALTER TABLE public.leads ADD CONSTRAINT leads_email_key UNIQUE (email);

-- 2. Unique constraint na tabela subscriptions (para idempotencia)
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_kiwify_id_key UNIQUE (kiwify_subscription_id);

-- 3. Criar funcao refresh_admin_metrics
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

-- 4. Unique constraint em admin_metrics.metric_date (para ON CONFLICT funcionar)
ALTER TABLE public.admin_metrics ADD CONSTRAINT admin_metrics_date_key UNIQUE (metric_date);

-- 5. Corrigir RLS - dropar politicas permissivas e recriar restritas ao service_role
DROP POLICY IF EXISTS "Service role full access users" ON public.users;
DROP POLICY IF EXISTS "Service role full access subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Service role full access leads" ON public.leads;
DROP POLICY IF EXISTS "Service role full access quiz" ON public.quiz_results;
DROP POLICY IF EXISTS "Service role full access activity" ON public.user_activity;
DROP POLICY IF EXISTS "Service role full access metrics" ON public.admin_metrics;

-- Recriar com role check real (service_role usa JWT com role='service_role')
-- Para admin_metrics: admins podem ler
CREATE POLICY "Admins can read metrics" ON public.admin_metrics
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = (auth.uid())::text AND is_admin = true)
  );

-- Para users: admins podem ler todos
CREATE POLICY "Admins can read all users" ON public.users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = (auth.uid())::text AND is_admin = true)
  );

-- Para subscriptions: admins podem ler todas
CREATE POLICY "Admins can read all subscriptions" ON public.subscriptions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = (auth.uid())::text AND is_admin = true)
  );

-- Para leads: admins podem ler
CREATE POLICY "Admins can read leads" ON public.leads
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = (auth.uid())::text AND is_admin = true)
  );
```

### Etapa 4: Atualizar Edge Function `kiwify-webhook/index.ts`
Mudancas principais:
- Adicionar CORS headers
- No `handlePurchaseApproved`: criar usuario no Supabase Auth usando `supabaseAdmin.auth.admin.createUser()` antes de inserir na tabela `users`, linkando o `auth.uid` como `id` na tabela users
- Usar o ID do auth user como `user_id` na tabela `users` (para que RLS funcione com `auth.uid()`)
- Tratar caso de usuario ja existente no Auth (email ja cadastrado)

### Etapa 5: Melhorar o Dashboard
- Adicionar fallback: se `admin_metrics` estiver vazia, calcular metricas diretamente das tabelas `users` e `subscriptions`
- Adicionar card de "Ultimo Webhook" mostrando quando o ultimo evento foi processado
- Adicionar log de eventos recentes (ultimos webhooks recebidos) usando `user_activity`

### Etapa 6: Desativar DEV_MODE no ProtectedRoute
- Mudar `DEV_MODE = false` para que a autenticacao funcione de verdade em producao

---

## Resumo das Acoes

| Acao | Tipo | Prioridade |
|------|------|------------|
| Configurar KIWIFY_WEBHOOK_TOKEN | Secret | Critica |
| verify_jwt = false no config.toml | Config | Critica |
| Criar usuario no Auth ao comprar | Edge Function | Critica |
| Unique constraint em leads.email | Migration | Alta |
| Unique constraint em subscriptions.kiwify_subscription_id | Migration | Alta |
| Criar funcao refresh_admin_metrics | Migration | Alta |
| Unique em admin_metrics.metric_date | Migration | Alta |
| Corrigir RLS policies (seguranca) | Migration | Alta |
| Dashboard com fallback de dados | Frontend | Media |
| DEV_MODE = false | Frontend | Media |

