# EPIC 2 — Infraestrutura de Produção

## Status
InProgress

## Objetivo
Garantir que toda a infraestrutura de backend esteja pronta para receber tráfego real de anúncios:
banco sempre disponível, dados limpos, dashboard refletindo apenas compras reais,
e webhook Kiwify gravando valores corretos.

## Contexto
Durante o desenvolvimento, foram criados dados de teste no banco Supabase (4 assinaturas
com `status = 'active'`, valores incorretos de `amount_cents`), resultando em:
- Dashboard mostrando 4 assinaturas ativas falsas
- MRR exibindo ~R$5.000 sem nenhuma venda real
- Projeto pausado por inatividade (free tier)

O plano Pro foi contratado para resolver o auto-pause. Falta limpar os dados e corrigir
o webhook antes do lançamento.

## Stories

| # | Story | Status |
|---|-------|--------|
| 2.1 | Ativar plano Pro + limpar dados de teste | 🔴 Pendente |
| 2.2 | Deploy da edge function `bright-responder` corrigida | 🔴 Pendente |
| 2.3 | Validar dashboard pós-limpeza | 🔴 Pendente |

---

## Story 2.1 — Ativar Supabase Pro + Limpar Dados de Teste

### Status
Pendente (aguardando ação manual no Supabase)

### Por que é bloqueante
O free tier pausa projetos após 7 dias sem atividade no banco. Durante campanhas de anúncios,
um dia sem conversões pode pausar o projeto → usuários veem tela branca ou erro no quiz →
conversões zeradas até reativação manual. O webhook do Kiwify também falha silenciosamente,
impedindo acesso de quem pagou.

### Acceptance Criteria

- [ ] Plano Pro ativado em Supabase → Organization → Billing
- [ ] Projeto voltou ao status **Active** (não mais Paused)
- [ ] SQL de limpeza executado no SQL Editor do Supabase:

```sql
-- Apaga assinaturas de teste (não apaga usuários)
DELETE FROM subscriptions;

-- Apaga eventos de pagamento de teste no log de atividade
DELETE FROM user_activity
WHERE activity_type IN (
  'purchase_approved',
  'subscription_canceled',
  'subscription_renewed',
  'subscription_late',
  'refund',
  'chargeback'
);

-- Limpa o cache de métricas para o dashboard recalcular do zero
DELETE FROM admin_metrics;
```

- [ ] Dashboard admin mostra: **0 assinaturas, R$ 0,00 MRR**
- [ ] Tabela `subscriptions` vazia no Supabase Table Editor

### O que NÃO será apagado
- Usuários de teste na tabela `users` e Supabase Auth → podem continuar existindo
- Eventos de funil (`quiz_events`) → dados válidos de teste do quiz
- Resultados de quiz (`quiz_results`) → dados de perfil válidos

---

## Story 2.2 — Deploy da Edge Function `bright-responder` Corrigida

### Status
Pendente (código já corrigido localmente, aguardando deploy)

### O que foi corrigido
O campo `amount_cents` tinha o fallback `|| 1700` (R$17 — valor incorreto).
Agora a lógica é:

```ts
// Prioridade: amount_cents direto do Kiwify
// → depois converte payment.amount (em reais) × 100
// → fallback seguro: 19900 = R$199/mês (preço do plano SkinBella)
amount_cents: payment?.amount_cents
  || (payment?.amount ? Math.round(Number(payment.amount) * 100) : 19900),
```

### Acceptance Criteria

- [ ] Edge function deployada via CLI **ou** atualizada manualmente no dashboard

**Via CLI (opção mais rápida):**
```bash
supabase login
supabase link --project-ref kkfvlbqhxvexpjrdlgpx
supabase functions deploy bright-responder
```

**Via Dashboard (alternativa):**
1. Supabase → Edge Functions → bright-responder → Edit
2. Localizar linha com `amount_cents:` (~linha 170)
3. Substituir por:
```ts
      amount_cents: payment?.amount_cents
        || (payment?.amount ? Math.round(Number(payment.amount) * 100) : 19900),
```
4. Salvar e fazer deploy

- [ ] Testar o webhook: disparar um `compra_aprovada` de teste via Kiwify (modo sandbox)
  e verificar que `amount_cents = 19900` foi gravado corretamente

---

## Story 2.3 — Validar Dashboard Pós-Limpeza

### Status
Pendente (depende de 2.1 e 2.2)

### Acceptance Criteria

- [ ] Abrir `/app/admin` → Dashboard mostra:
  - Total Usuários: número real de usuários de teste (ex: 3-5)
  - Assinaturas Ativas: **0**
  - MRR: **R$ 0,00**
  - Canceladas: **0**
- [ ] Abrir `/app/admin/assinaturas` → tabela vazia, sem registros
- [ ] Simular uma compra via webhook de teste do Kiwify e confirmar que:
  - 1 assinatura aparece com `amount_cents = 19900` (R$199,00)
  - MRR atualiza para R$ 199,00
  - Evento aparece em "Últimos Eventos do Webhook"
- [ ] Remover a assinatura de teste após validação (DELETE manual ou via SQL)

---

## Notas de Infraestrutura

### Supabase Pro — o que muda
| Feature | Free | Pro |
|---------|------|-----|
| Auto-pause | Após 7 dias de inatividade | ❌ Nunca pausa |
| Database | 500 MB | 8 GB |
| Bandwidth | 2 GB/mês | 250 GB/mês |
| Edge Functions | 500k/mês | 2M/mês |
| Suporte | Community | Email |
| Preço | $0 | $25/mês (~R$150) |

### Workaround anti-pause (caso queira manter free temporariamente)
Configurar cron no **cron-job.org** (gratuito) a cada 3 dias:
- URL: `https://kkfvlbqhxvexpjrdlgpx.supabase.co/rest/v1/quiz_events?limit=1`
- Header: `apikey: <VITE_SUPABASE_PUBLISHABLE_KEY>`

### Prioridade de execução
🔴 **2.1 → 2.2 → 2.3** devem ser concluídas ANTES de qualquer campanha de anúncios.
Rodar anúncios com banco pausado ou MRR errado invalida todo o tracking de ROI.
