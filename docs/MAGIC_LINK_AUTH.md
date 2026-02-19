# 🔐 Magic Link Authentication - SkinBella App

**Criado por:** @dev (Dex) - Backend Squad
**Data:** 16/02/2026
**Story:** 1.4 - Implement Magic Link Authentication
**Status:** ✅ Implementado

---

## 📋 VISÃO GERAL

Magic Link é um método de autenticação **passwordless** (sem senha) onde o usuário recebe um link por email para fazer login. No SkinBella, implementamos com validação adicional: **apenas usuários com subscription ativa podem acessar o app**.

---

## 🔑 FLUXO DE AUTENTICAÇÃO

### 1️⃣ Login Flow

```
Usuário insere email
    ↓
Verificar se email tem subscription ativa (Supabase query)
    ↓
    ├─ SIM → Enviar magic link (Supabase Auth)
    │         ↓
    │         Email enviado ✅
    │         ↓
    │         Usuário clica no link do email
    │         ↓
    │         Redirect para /app
    │         ↓
    │         Protected Route verifica subscription
    │         ↓
    │         Acesso liberado 🎉
    │
    └─ NÃO → Mostrar mensagem: "Você precisa assinar"
              ↓
              Botão "Assinar agora" → Kiwify checkout
```

### 2️⃣ Protected Routes Flow

```
Usuário tenta acessar /app
    ↓
ProtectedRoute verifica:
    ├─ user existe? → NÃO → Redirect /login
    ├─ loading? → SIM → Mostrar spinner
    └─ hasActiveSubscription? → NÃO → Redirect /login?error=subscription_required
                                 SIM → Render página 🎉
```

---

## 📁 ARQUIVOS CRIADOS

### 1. `src/lib/auth.ts`

**Funções exportadas:**

| Função | Descrição | Retorno |
|--------|-----------|---------|
| `hasActiveSubscription(email)` | Verifica se email tem subscription ativa | `Promise<boolean>` |
| `sendMagicLink(email)` | Envia magic link (se tiver subscription) | `Promise<{success, error?, needsSubscription?}>` |
| `verifyMagicLink(token)` | Verifica token do magic link | `Promise<{success, error?}>` |
| `getCurrentUser()` | Retorna usuário autenticado | `Promise<User \| null>` |
| `signOut()` | Faz logout | `Promise<{success, error?}>` |
| `getSubscriptionStatus(userId)` | Retorna subscription do usuário | `Promise<Subscription \| null>` |
| `isAdmin()` | Verifica se usuário é admin | `Promise<boolean>` |

**Constantes:**
- `KIWIFY_CHECKOUT_URL` - URL do checkout Kiwify (de `.env`)

---

### 2. `src/hooks/useAuth.tsx`

**AuthProvider** - Context Provider para autenticação

**useAuth() Hook** - Acessa estado de autenticação em qualquer componente

**Campos disponíveis:**

```typescript
const { user, session, loading, signOut, hasActiveSubscription, subscriptionStatus } = useAuth()
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `user` | `User \| null` | Usuário Supabase autenticado |
| `session` | `Session \| null` | Sessão ativa |
| `loading` | `boolean` | Carregando estado de auth |
| `signOut` | `() => Promise<void>` | Função de logout |
| `hasActiveSubscription` | `boolean` | Subscription ativa? |
| `subscriptionStatus` | `'active' \| 'cancelled' \| ...` | Status atual da subscription |

---

### 3. `src/components/ProtectedRoute.tsx`

**Props:**

```typescript
interface ProtectedRouteProps {
  children: ReactNode
  requireSubscription?: boolean // Default: true
}
```

**Uso:**

```tsx
<ProtectedRoute>
  <AppShell />
</ProtectedRoute>

// Ou sem exigir subscription
<ProtectedRoute requireSubscription={false}>
  <PublicContent />
</ProtectedRoute>
```

---

### 4. `src/pages/Login.tsx` (atualizado)

**Mudanças:**

- ❌ Removido campo de senha
- ✅ Apenas campo de email
- ✅ Validação de subscription antes de enviar link
- ✅ Tela de "Email enviado" após sucesso
- ✅ Botão "Assinar agora" para não-assinantes
- ✅ Mensagens de erro amigáveis

**Estados:**

```typescript
const [email, setEmail] = useState('')
const [loading, setLoading] = useState(false)
const [emailSent, setEmailSent] = useState(false)
```

---

### 5. `src/App.tsx` (atualizado)

**Mudanças:**

```tsx
// Antes
<BrowserRouter>
  <Routes>
    <Route path="/app" element={<AppShell />}>...</Route>
  </Routes>
</BrowserRouter>

// Depois
<BrowserRouter>
  <AuthProvider>
    <Routes>
      <Route path="/app" element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
        ...
      </Route>
    </Routes>
  </AuthProvider>
</BrowserRouter>
```

---

## 🧪 COMO TESTAR

### ⚠️ IMPORTANTE: Email Templates

**ANTES DE TESTAR**, configure o template de email no Supabase:

1. Acesse **Authentication** > **Email Templates** no Supabase Dashboard
2. Selecione **Magic Link**
3. Personalize (opcional):

```html
<h2>Acesse o SkinBella</h2>
<p>Clique no link abaixo para acessar seu painel:</p>
<p><a href="{{ .ConfirmationURL }}">Acessar SkinBella</a></p>
<p>O link expira em 1 hora.</p>
```

---

### Teste 1: Email SEM Subscription

**Cenário:** Email não está no banco de dados

**Passos:**
1. Acesse `/login`
2. Insira email: `teste@exemplo.com` (que NÃO está no banco)
3. Clique em "Enviar link de acesso"

**Resultado esperado:**
- ❌ Toast vermelho: "Assinatura necessária"
- Mensagem: "Você precisa assinar para acessar o app"
- Botão "Assinar agora" visível

---

### Teste 2: Email COM Subscription INATIVA

**Cenário:** Email existe mas subscription está `cancelled`

**Preparação:**
```sql
-- Criar user de teste com subscription cancelled
INSERT INTO users (email, full_name) VALUES ('teste-cancelado@exemplo.com', 'Teste Cancelado');

INSERT INTO subscriptions (user_id, kiwify_subscription_id, status, amount_cents)
SELECT id, 'test-sub-001', 'cancelled', 9900
FROM users WHERE email = 'teste-cancelado@exemplo.com';
```

**Passos:**
1. Acesse `/login`
2. Insira email: `teste-cancelado@exemplo.com`
3. Clique em "Enviar link de acesso"

**Resultado esperado:**
- ❌ Toast vermelho: "Assinatura necessária"

---

### Teste 3: Email COM Subscription ATIVA ✅

**Preparação:**
```sql
-- Criar user de teste com subscription ativa
INSERT INTO users (email, full_name) VALUES ('teste-ativo@exemplo.com', 'Teste Ativo');

INSERT INTO subscriptions (user_id, kiwify_subscription_id, status, amount_cents, started_at)
SELECT id, 'test-sub-002', 'active', 9900, NOW()
FROM users WHERE email = 'teste-ativo@exemplo.com';
```

**Passos:**
1. Acesse `/login`
2. Insira email: `teste-ativo@exemplo.com`
3. Clique em "Enviar link de acesso"

**Resultado esperado:**
- ✅ Toast verde: "Link enviado!"
- Tela "Verifique seu email" exibida
- Email recebido com magic link

4. Verifique o email inbox de `teste-ativo@exemplo.com`
5. Clique no link do email

**Resultado esperado:**
- Redirect para `/app`
- Usuário autenticado
- Dashboard carregado 🎉

---

### Teste 4: Protected Route (sem autenticação)

**Passos:**
1. Abra navegador em modo anônimo
2. Acesse diretamente: `http://localhost:5173/app`

**Resultado esperado:**
- Redirect automático para `/login`

---

### Teste 5: Protected Route (subscription inativa)

**Preparação:**
```sql
-- Cancelar subscription do user de teste
UPDATE subscriptions
SET status = 'cancelled', cancelled_at = NOW()
WHERE user_id = (SELECT id FROM users WHERE email = 'teste-ativo@exemplo.com');
```

**Passos:**
1. Já autenticado como `teste-ativo@exemplo.com`
2. Tente acessar `/app`

**Resultado esperado:**
- Redirect para `/login?error=subscription_required`
- Toast: "Assinatura necessária"

---

### Teste 6: Sign Out

**Passos:**
1. Autenticado no `/app`
2. Clique no botão de logout (se existir no AppShell)
3. Ou execute no console:

```javascript
import { signOut } from '@/lib/auth'
await signOut()
```

**Resultado esperado:**
- Usuário deslogado
- Redirect para `/login`

---

## 🔧 CONFIGURAÇÃO SUPABASE AUTH

### Email Provider

Supabase usa **SMTP próprio** por padrão (5 emails/hora no plano Free).

**Para produção**, configure SMTP customizado:

1. **Authentication** > **Settings**
2. **SMTP Settings**
3. Configurar:
   - Host: `smtp.sendgrid.net` (ou outro)
   - Port: `587`
   - Username: `apikey`
   - Password: `SG.xxxxx` (SendGrid API key)

**Providers recomendados:**
- SendGrid (99 emails/dia free)
- Resend (100 emails/dia free)
- AWS SES (62k emails/mês free)

---

### Magic Link Settings

1. **Authentication** > **Settings** > **Auth Settings**
2. Configure:

| Setting | Valor | Descrição |
|---------|-------|-----------|
| **Site URL** | `http://localhost:5173` (dev) / `https://skinbella.app` (prod) | Redirect após login |
| **Redirect URLs** | `http://localhost:5173/app` | URLs permitidas para redirect |
| **Mailer OTP Expiry** | `3600` (1 hora) | Tempo de expiração do link |
| **Enable Email Signups** | `false` | **CRÍTICO:** Desabilitar signup via email |
| **Confirm Email** | `true` | Exigir confirmação de email |

---

## ⚙️ VARIÁVEIS DE AMBIENTE

Certifique-se de que `.env` contém:

```env
VITE_SUPABASE_URL=https://jhlzidgpibxwjgikdqor.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_KIWIFY_CHECKOUT_URL=https://pay.kiwify.com.br/YOUR_PRODUCT_ID
```

---

## 🚨 TROUBLESHOOTING

### Erro: "Email rate limit exceeded"

**Causa:** Plano Free do Supabase limita a 5 emails/hora

**Solução:**
- Configure SMTP customizado
- Ou aguarde 1 hora

---

### Erro: "Invalid login credentials"

**Causa:** Email não existe no banco OU subscription inativa

**Solução:**
- Verificar se user existe: `SELECT * FROM users WHERE email = 'xxx'`
- Verificar subscription: `SELECT * FROM subscriptions WHERE user_id = 'xxx'`

---

### Erro: "Email link is invalid or has expired"

**Causa:** Link expirou (1 hora) ou já foi usado

**Solução:**
- Solicitar novo magic link

---

### Magic link redirect para URL errada

**Causa:** `emailRedirectTo` configurado errado

**Solução:**
- Verificar em `lib/auth.ts`:
```typescript
emailRedirectTo: `${window.location.origin}/app`
```

---

## 📊 MÉTRICAS DE SUCESSO

- ✅ Magic link enviado em <2s
- ✅ Email recebido em <30s
- ✅ Apenas subscribers ativos acessam app
- ✅ Não-assinantes veem mensagem clara + botão Kiwify
- ✅ Protected routes funcionando 100%
- ✅ Link expira em 1 hora

---

## 🔮 PRÓXIMOS PASSOS

- ✅ Story 1.4 concluída
- ⏭️ Story 1.5: Remove Sign-Up Flow (simplicar mais)
- ⏭️ Story 1.6: Kiwify Webhooks (auto criar users)

---

## 📚 REFERÊNCIAS

- [Supabase Magic Link Docs](https://supabase.com/docs/guides/auth/auth-magic-link)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Status:** ✅ Magic Link implementado e documentado
**Próximo:** Story 1.5 - Remove Sign-Up Flow

---

*Criado por @dev (Dex) - Backend Squad* 💻
