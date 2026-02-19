# 🚀 Supabase Setup Guide - SkinBella App

**Criado por:** @dev (Dex) - Backend Squad
**Data:** 16/02/2026
**Story:** 1.1 - Setup Supabase Project & Initial Schema

---

## 📋 PASSO A PASSO

### **PASSO 1: Criar Projeto Supabase**

1. **Acesse:** https://supabase.com/dashboard
2. **Clique:** "New Project"
3. **Preencha:**
   - **Name:** `skinbella-app`
   - **Database Password:** [ESCOLHA UMA SENHA FORTE]
   - **Region:** South America (São Paulo) - `sa-east-1`
   - **Pricing Plan:** Free (para começar)
4. **Clique:** "Create new project"
5. **Aguarde:** ~2 minutos (projeto sendo provisionado)

---

### **PASSO 2: Aplicar Schema (Migration)**

**Opção A: Via Dashboard (Recomendado para início)**

1. No projeto Supabase, vá para **SQL Editor** (menu lateral)
2. Clique em **"New Query"**
3. Copie TODO o conteúdo de `supabase/migrations/20260216000001_initial_schema.sql`
4. Cole no editor SQL
5. Clique em **"Run"** (ou Ctrl+Enter)
6. Aguarde confirmação: ✅ "Success. No rows returned"

**Opção B: Via Supabase CLI** (se tiver CLI instalado)

```bash
# Instalar Supabase CLI (se não tiver)
npm install -g supabase

# Fazer login
supabase login

# Link do projeto
supabase link --project-ref [SEU_PROJECT_REF]

# Aplicar migration
supabase db push
```

---

### **PASSO 3: Obter Credenciais**

No dashboard do Supabase:

1. Vá para **Settings** > **API**
2. Copie os valores:

**Project URL:**
```
https://[project-ref].supabase.co
```

**anon (public) key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**service_role (secret) key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### **PASSO 4: Configurar Environment Variables**

#### **Frontend (.env)**

Crie arquivo `.env` na raiz do projeto `/Users/ayan/skinbella-app/`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://[SEU_PROJECT_REF].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Kiwify Configuration
VITE_KIWIFY_CLIENT_ID=93262c1e-b523-4725-b31e-0ab86c972209
VITE_KIWIFY_CLIENT_SECRET=cecac45ae3a5d9da1d4cf4a215955fbbfea5a762f5eaaffbfa196499e84e07c7
VITE_KIWIFY_ACCOUNT_ID=k9ChijVVH0MzKhf
VITE_KIWIFY_CHECKOUT_URL=https://pay.kiwify.com.br/[SEU_PRODUTO_ID]

# App Configuration
VITE_APP_NAME=SkinBella
VITE_APP_URL=http://localhost:5173
```

#### **Supabase Edge Functions (.env)**

Criar depois quando formos implementar Edge Functions (Story 1.6).

---

### **PASSO 5: Testar Conexão**

Criar arquivo de teste `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test connection
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (error) throw error

    console.log('✅ Supabase connected successfully!')
    return true
  } catch (error) {
    console.error('❌ Supabase connection failed:', error)
    return false
  }
}
```

Testar no console do browser:
```javascript
import { testConnection } from './lib/supabase'
await testConnection()
```

---

### **PASSO 6: Instalar Dependências**

```bash
cd /Users/ayan/skinbella-app
npm install @supabase/supabase-js
```

---

## ✅ ACCEPTANCE CRITERIA

- ✅ Projeto Supabase criado
- ✅ Schema aplicado (6 tabelas criadas)
- ✅ Environment variables configuradas
- ✅ Conexão testada com sucesso
- ✅ Dependência @supabase/supabase-js instalada

---

## 📊 VERIFICAÇÃO

Execute no SQL Editor do Supabase:

```sql
-- Verificar tabelas criadas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Deve retornar:
-- admin_metrics
-- leads
-- quiz_results
-- subscriptions
-- user_activity
-- users

-- Verificar índices
SELECT indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY indexname;

-- Deve retornar 17+ índices
```

---

## 🔗 Links Úteis

- **Supabase Dashboard:** https://supabase.com/dashboard
- **Supabase Docs:** https://supabase.com/docs
- **SQL Reference:** https://www.postgresql.org/docs/

---

## 🆘 Troubleshooting

**Erro: "relation does not exist"**
→ Migration não foi aplicada. Volte ao PASSO 2.

**Erro: "Invalid API key"**
→ Verifique se copiou a `anon key` correta (não a `service_role`).

**Erro: "Network error"**
→ Verifique o `VITE_SUPABASE_URL` (deve ter https://).

---

**Status:** 📝 Guia completo
**Próximo:** Execute os passos acima e reporte quando concluído!

---

*Criado por @dev (Dex) - Backend Squad* 💻
