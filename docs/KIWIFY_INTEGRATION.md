# 🔗 Integração Kiwify - SkinBella App

**Criado por:** @dev (Dex) - Backend Squad
**Data:** 17/02/2026
**Referência:** Story 1.6+ - Kiwify Webhooks Integration
**Status:** 📋 Planejamento

---

## 📋 VISÃO GERAL

A integração com a Kiwify permite que o SkinBella App:
1. ✅ **Crie usuários automaticamente** quando alguém compra
2. ✅ **Ative subscriptions** após pagamento aprovado
3. ✅ **Cancele acesso** quando subscription for cancelada
4. ✅ **Renove subscriptions** automaticamente

---

## 🎯 WEBHOOKS NECESSÁRIOS

Para o SkinBella, vamos usar **3 webhooks principais**:

| Evento | Webhook Kiwify | O que fazer no App |
|--------|----------------|-------------------|
| **Compra Aprovada** | `compra_aprovada` | Criar user + subscription ativa |
| **Subscription Cancelada** | `subscription_canceled` | Atualizar status → cancelled |
| **Subscription Renovada** | `subscription_renewed` | Manter subscription ativa |

---

## 🔐 AUTENTICAÇÃO KIWIFY API

### **Opção 1: OAuth2 (Recomendado para produção)**

**Flow:** Client Credentials

**Endpoint:** `https://public-api.kiwify.com/oauth/token`

**Headers:**
```
x-kiwify-account-id: k9ChijVVH0MzKhf
```

**Body:**
```json
{
  "grant_type": "client_credentials",
  "client_id": "93262c1e-b523-4725-b31e-0ab86c972209",
  "client_secret": "cecac45ae3a5d9da1d4cf4a215955fbbfea5a762f5eaaffbfa196499e84e07c7",
  "scope": "webhooks"
}
```

**Response:**
```json
{
  "access_token": "Bearer token...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

---

## 📡 CRIAR WEBHOOK NA KIWIFY

### **Endpoint:**
```
POST https://public-api.kiwify.com/v1/webhooks
```

### **Headers:**
```
Authorization: Bearer {access_token}
x-kiwify-account-id: k9ChijVVH0MzKhf
Content-Type: application/json
```

### **Body:**
```json
{
  "name": "SkinBella App Webhooks",
  "url": "https://SEU_PROJETO.supabase.co/functions/v1/kiwify-webhook",
  "products": "all",
  "triggers": [
    "compra_aprovada",
    "subscription_canceled",
    "subscription_renewed"
  ],
  "token": "SECRET_TOKEN_PARA_VALIDAR"
}
```

**Response (200 OK):**
```json
{
  "id": "webhook-uuid",
  "name": "SkinBella App Webhooks",
  "url": "https://...",
  "products": "all",
  "triggers": ["compra_aprovada", "subscription_canceled", "subscription_renewed"],
  "token": "SECRET_TOKEN_PARA_VALIDAR",
  "created_at": "2026-02-17T00:00:00Z",
  "updated_at": "2026-02-17T00:00:00Z"
}
```

---

## 📦 PAYLOADS DOS WEBHOOKS

### **1. compra_aprovada (Purchase Approved)**

**Quando dispara:** Pagamento aprovado (PIX, boleto, cartão)

**Payload esperado** (baseado em padrões comuns):
```json
{
  "event": "compra_aprovada",
  "order_id": "order-uuid",
  "product_id": "product-uuid",
  "customer": {
    "id": "customer-uuid",
    "email": "cliente@example.com",
    "name": "Nome do Cliente",
    "phone": "+5511999999999"
  },
  "subscription": {
    "id": "subscription-uuid",
    "status": "active",
    "plan": "mensal",
    "amount_cents": 2900,
    "started_at": "2026-02-17T00:00:00Z",
    "expires_at": null
  },
  "payment_method": "pix",
  "amount_cents": 2900,
  "created_at": "2026-02-17T00:00:00Z"
}
```

**O que fazer:**
1. ✅ Criar usuário no Supabase Auth (se não existir)
2. ✅ Criar registro na tabela `users`
3. ✅ Criar registro na tabela `subscriptions` (status: active)
4. ✅ Enviar email de boas-vindas (opcional)
5. ✅ Retornar 200 OK para Kiwify

---

### **2. subscription_canceled (Subscription Cancelled)**

**Quando dispara:** Cliente cancela assinatura

**Payload esperado:**
```json
{
  "event": "subscription_canceled",
  "subscription_id": "subscription-uuid",
  "customer": {
    "id": "customer-uuid",
    "email": "cliente@example.com",
    "name": "Nome do Cliente"
  },
  "canceled_at": "2026-02-17T00:00:00Z",
  "reason": "customer_request"
}
```

**O que fazer:**
1. ✅ Buscar subscription por `kiwify_subscription_id`
2. ✅ Atualizar `status` → `cancelled`
3. ✅ Atualizar `cancelled_at` → timestamp
4. ✅ RLS bloqueia acesso automaticamente
5. ✅ Enviar email de confirmação (opcional)
6. ✅ Retornar 200 OK

---

### **3. subscription_renewed (Subscription Renewed)**

**Quando dispara:** Renovação automática mensal

**Payload esperado:**
```json
{
  "event": "subscription_renewed",
  "subscription_id": "subscription-uuid",
  "customer": {
    "id": "customer-uuid",
    "email": "cliente@example.com"
  },
  "renewed_at": "2026-03-17T00:00:00Z",
  "next_billing_date": "2026-04-17T00:00:00Z",
  "amount_cents": 2900
}
```

**O que fazer:**
1. ✅ Verificar se subscription existe
2. ✅ Atualizar `expires_at` → next_billing_date (se aplicável)
3. ✅ Manter `status` → `active`
4. ✅ Registrar em `user_activity` (opcional)
5. ✅ Retornar 200 OK

---

## 🔒 SEGURANÇA DOS WEBHOOKS

### **Validação de Token**

Kiwify envia um `token` customizado no webhook. Valide antes de processar:

```typescript
// Em kiwify-webhook/index.ts
const KIWIFY_WEBHOOK_TOKEN = Deno.env.get('KIWIFY_WEBHOOK_TOKEN')

if (request.headers.get('x-webhook-token') !== KIWIFY_WEBHOOK_TOKEN) {
  return new Response('Unauthorized', { status: 401 })
}
```

### **Validação de IP (Opcional)**

Se Kiwify fornecer IPs fixos, valide:

```typescript
const allowedIPs = ['1.2.3.4', '5.6.7.8']
const clientIP = request.headers.get('x-forwarded-for')

if (!allowedIPs.includes(clientIP)) {
  return new Response('Forbidden', { status: 403 })
}
```

---

## 🏗️ ARQUITETURA DA IMPLEMENTAÇÃO

### **Componentes:**

```
Kiwify
  ↓ (webhook POST)
Supabase Edge Function: kiwify-webhook
  ↓
Handler específico (order-paid.ts, subscription-canceled.ts, etc)
  ↓
Supabase Database (users, subscriptions)
  ↓
RLS protege acesso
```

### **Arquivos a criar:**

```
supabase/functions/kiwify-webhook/
├── index.ts                          # Main handler
├── handlers/
│   ├── compra-aprovada.ts           # Purchase approved
│   ├── subscription-canceled.ts     # Subscription cancelled
│   └── subscription-renewed.ts      # Subscription renewed
└── utils/
    ├── validate-webhook.ts          # Token validation
    └── logger.ts                    # Logging utilities
```

---

## 📝 PRÓXIMOS PASSOS (Stories)

### **Story 1.6: Setup Supabase Edge Function for Kiwify Webhooks**

**Tarefas:**
- [ ] Criar Edge Function `kiwify-webhook`
- [ ] Configurar endpoint público
- [ ] Validar token do webhook (segurança)
- [ ] Implementar logging completo
- [ ] Retry logic para falhas
- [ ] Deploy da função

**Acceptance Criteria:**
- ✅ Edge function deployada e acessível
- ✅ Webhook URL registrado na Kiwify
- ✅ Token validation funcionando
- ✅ Logs completos em Supabase

**Estimativa:** M (2 dias)

---

### **Story 1.7: Process Webhook - compra_aprovada**

**Tarefas:**
- [ ] Parser de payload `compra_aprovada`
- [ ] Criar registro em `users` (se não existe)
- [ ] Criar usuário no Supabase Auth
- [ ] Criar registro em `subscriptions` (status: active)
- [ ] Converter lead → user (atualizar `leads` table)
- [ ] Enviar email de boas-vindas (opcional)
- [ ] Retornar 200 OK para Kiwify
- [ ] Testar com webhook de teste

**Acceptance Criteria:**
- ✅ User criado no banco
- ✅ User criado no Auth
- ✅ Subscription ativa criada
- ✅ Lead convertido
- ✅ Email enviado (opcional)
- ✅ Webhook retorna 200 OK em <2s

**Estimativa:** M (2 dias)

---

### **Story 1.8: Process Webhook - subscription_canceled**

**Tarefas:**
- [ ] Parser de payload `subscription_canceled`
- [ ] Atualizar `subscriptions.status` → 'cancelled'
- [ ] Atualizar `cancelled_at` timestamp
- [ ] Bloquear acesso ao app (via RLS)
- [ ] Enviar email de confirmação de cancelamento (opcional)
- [ ] Retornar 200 OK

**Acceptance Criteria:**
- ✅ Status atualizado para 'cancelled'
- ✅ Usuário não consegue mais logar
- ✅ Email enviado (opcional)
- ✅ Webhook retorna 200 OK

**Estimativa:** S (1 dia)

---

### **Story 1.9: Process Webhook - subscription_renewed**

**Tarefas:**
- [ ] Parser de payload `subscription_renewed`
- [ ] Verificar se subscription existe
- [ ] Manter `status` → 'active'
- [ ] Atualizar `expires_at` se necessário
- [ ] Registrar atividade
- [ ] Retornar 200 OK

**Acceptance Criteria:**
- ✅ Subscription mantida ativa
- ✅ Próxima data de cobrança atualizada
- ✅ Webhook retorna 200 OK

**Estimativa:** S (1 dia)

---

## 🧪 COMO TESTAR WEBHOOKS

### **Opção 1: Webhook.site (Desenvolvimento)**

1. Acesse: https://webhook.site
2. Copie a URL única gerada
3. Use essa URL ao criar webhook na Kiwify
4. Veja payloads reais que a Kiwify envia

---

### **Opção 2: Ngrok (Local Testing)**

```bash
# Instalar ngrok
brew install ngrok  # macOS
# ou baixar de https://ngrok.com

# Expor porta local
ngrok http 54321  # Porta padrão do Supabase local

# Copiar URL pública (ex: https://abc123.ngrok.io)
# Usar no webhook da Kiwify
```

---

### **Opção 3: Supabase Edge Function (Produção)**

```bash
# Deploy edge function
supabase functions deploy kiwify-webhook

# URL será: https://jhlzidgpibxwjgikdqor.supabase.co/functions/v1/kiwify-webhook
```

---

## 🔗 RECURSOS

- **Kiwify Docs:** https://docs.kiwify.com.br
- **Kiwify API Reference:** https://docs.kiwify.com.br/api-reference
- **Supabase Edge Functions:** https://supabase.com/docs/guides/functions
- **Webhook.site:** https://webhook.site

---

## ⚠️ NOTAS IMPORTANTES

1. **Payloads exatos podem variar** - Precisamos testar com webhooks reais da Kiwify para confirmar estrutura
2. **Token de validação** - Gerar um token seguro (min 32 chars) e guardar no .env
3. **Retry logic** - Kiwify provavelmente retenta webhooks que falham (confirmar docs)
4. **Idempotência** - Webhook pode ser enviado 2x (usar `kiwify_subscription_id` como unique key)
5. **Logs** - Sempre logar payloads completos para debug

---

**Status:** 📋 Documentação completa
**Próximo:** Story 1.6 - Setup Edge Function

---

*Criado por @dev (Dex) - Backend Squad* 💻
