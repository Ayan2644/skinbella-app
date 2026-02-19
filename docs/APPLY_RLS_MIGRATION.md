# 🚀 Guia Rápido: Aplicar RLS Migration

**Story:** 1.2 - Implement Row Level Security
**Tempo estimado:** 5 minutos

---

## ✅ PASSO A PASSO

### **PASSO 1: Abrir SQL Editor**

1. Acesse: https://supabase.com/dashboard
2. Selecione o projeto **skinbella-app**
3. Menu lateral → **SQL Editor**
4. Clique em **"New Query"**

---

### **PASSO 2: Copiar Migration**

1. Abra o arquivo: `supabase/migrations/20260216000002_rls_policies.sql`
2. Selecione **TODO o conteúdo** (Ctrl+A / Cmd+A)
3. Copie (Ctrl+C / Cmd+C)

---

### **PASSO 3: Colar e Executar**

1. No SQL Editor do Supabase, **cole** o código (Ctrl+V / Cmd+V)
2. Clique em **"Run"** (ou pressione Ctrl+Enter)
3. Aguarde confirmação:

```
✅ Success. No rows returned
```

**Se aparecer erro:** Copie a mensagem de erro completa e me envie!

---

### **PASSO 4: Verificar RLS Ativo**

No mesmo SQL Editor, execute:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Resultado esperado:**

```
tablename        | rowsecurity
-----------------+-------------
admin_metrics    | t
leads            | t
quiz_results     | t
subscriptions    | t
user_activity    | t
users            | t
```

Todas as tabelas devem ter `rowsecurity = t` (true).

---

### **PASSO 5: Listar Políticas Criadas**

Execute:

```sql
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**Resultado esperado:** ~15 políticas listadas, incluindo:

- Active subscribers can read own data
- Users can update own data
- Service role can insert users
- Users can read own subscriptions
- etc.

---

## ✅ CONFIRMAÇÃO DE SUCESSO

Se você viu:

- ✅ "Success. No rows returned" na execução
- ✅ Todas as 6 tabelas com `rowsecurity = t`
- ✅ ~15 políticas listadas

**RLS está ativo! 🎉**

---

## ⚠️ TROUBLESHOOTING

### Erro: "function has_active_subscription already exists"

**Solução:** Migration já foi aplicada antes. Tudo certo!

---

### Erro: "relation users does not exist"

**Causa:** Migration 001 (schema inicial) não foi aplicada

**Solução:**
1. Primeiro aplique `20260216000001_initial_schema.sql`
2. Depois aplique `20260216000002_rls_policies.sql`

---

### Erro: "permission denied for table pg_policies"

**Causa:** Usuário sem permissão de admin no Supabase

**Solução:** Use a conta owner do projeto Supabase

---

## 📊 PRÓXIMOS PASSOS

Após confirmar que RLS está ativo:

1. ✅ Story 1.2 concluída
2. ⏭️ Story 1.3: Setup Supabase Storage
3. ⏭️ Story 1.4: Magic Link Authentication

---

**Dúvidas?** Me envie a mensagem de erro completa!

---

*@dev (Dex) - Backend Squad* 💻
