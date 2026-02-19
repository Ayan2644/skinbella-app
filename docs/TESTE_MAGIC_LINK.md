# 🧪 Teste Rápido: Magic Link Authentication

**Story:** 1.4 - Implement Magic Link Authentication
**Tempo estimado:** 10 minutos

---

## ⚙️ PRÉ-REQUISITOS

### 1. Configurar Supabase Auth

1. Acesse: https://supabase.com/dashboard
2. Selecione projeto **skinbella-app**
3. Menu lateral → **Authentication** → **URL Configuration**
4. Configure:

| Campo | Valor |
|-------|-------|
| **Site URL** | `http://localhost:5173` |
| **Redirect URLs** | `http://localhost:5173/**` |

5. Clique **Save**

---

### 2. Desabilitar Email Signup (CRÍTICO!)

1. Ainda em **Authentication** → **Settings**
2. Encontre: **Enable Email Signups**
3. **DESABILITE** (toggle OFF)
4. Clique **Save**

**Por quê?** Apenas webhooks Kiwify devem criar usuários, não o próprio usuário.

---

### 3. Criar Usuário de Teste

Execute no **SQL Editor** do Supabase:

```sql
-- Criar usuário de teste com subscription ativa
INSERT INTO users (email, full_name)
VALUES ('seu-email-real@gmail.com', 'Teste Magic Link')
RETURNING id;

-- Copie o ID retornado acima e use abaixo
INSERT INTO subscriptions (user_id, kiwify_subscription_id, status, amount_cents, started_at)
VALUES (
  'cole-o-id-aqui',  -- ⬅️ COLE O ID DO USUÁRIO
  'test-sub-magic-001',
  'active',
  9900,
  NOW()
);
```

**⚠️ IMPORTANTE:** Use um email real que você tenha acesso!

---

## 🚀 TESTE PASSO A PASSO

### Teste 1: Iniciar Servidor

```bash
cd /Users/ayan/skinbella-app
npm run dev
```

Abra: http://localhost:5173/login

---

### Teste 2: Enviar Magic Link

1. Digite seu email de teste (que você inseriu no SQL acima)
2. Clique **"Enviar link de acesso"**

**Resultado esperado:**
- ✅ Toast verde: "Link enviado!"
- Tela: "Verifique seu email ✨"
- Email exibido na tela

---

### Teste 3: Verificar Email

1. Abra seu inbox (Gmail, etc)
2. Procure email de: **noreply@mail.app.supabase.co**
3. Assunto: "Magic Link" ou "Confirm Your Mail"

**⚠️ Não recebeu?**
- Verifique **Spam/Lixo Eletrônico**
- Aguarde até 2 minutos
- Verifique se email está correto no banco

---

### Teste 4: Clicar no Magic Link

1. Abra o email
2. Clique no link **"Log In"** ou **"Confirm your mail"**

**Resultado esperado:**
- ✅ Redirect para: `http://localhost:5173/app`
- Dashboard do app carregado
- Usuário autenticado

---

### Teste 5: Verificar Autenticação

No console do navegador (F12), execute:

```javascript
// Verificar user
const { data } = await supabase.auth.getUser()
console.log('User:', data.user)

// Deve retornar objeto com:
// - id: UUID
// - email: seu email
// - aud: "authenticated"
```

---

### Teste 6: Testar Protected Route

1. Abra uma **aba anônima** (Ctrl+Shift+N)
2. Acesse: `http://localhost:5173/app`

**Resultado esperado:**
- ✅ Redirect automático para `/login`
- Mensagem: "Você precisa estar autenticado"

---

### Teste 7: Testar Email Sem Subscription

1. Na tela de login (aba anônima)
2. Digite: `email-invalido@exemplo.com`
3. Clique **"Enviar link de acesso"**

**Resultado esperado:**
- ❌ Toast vermelho: "Assinatura necessária"
- Mensagem: "Você precisa assinar para acessar o app"
- Botão **"Assinar agora"** visível

---

### Teste 8: Clicar em "Assinar agora"

1. Clique no botão **"Assinar agora"**

**Resultado esperado:**
- ✅ Nova aba aberta
- URL do Kiwify checkout

---

## ✅ CHECKLIST DE VALIDAÇÃO

Marque cada item após testar:

- [ ] Servidor rodando sem erros
- [ ] Tela de login carregada
- [ ] Email com subscription ativa → Magic link enviado ✅
- [ ] Email recebido no inbox
- [ ] Clicar no link → Redirect para `/app`
- [ ] Dashboard carregado e funcional
- [ ] Aba anônima → Protected route redireciona para `/login`
- [ ] Email sem subscription → Mensagem de erro + botão Kiwify
- [ ] Botão "Assinar agora" → Abre checkout Kiwify

---

## 🎉 SUCESSO!

Se todos os 8 testes passaram:

✅ **Story 1.4 está funcionando perfeitamente!**

---

## 🚨 PROBLEMAS COMUNS

### "Rate limit exceeded"

**Solução:** Plano Free limita 5 emails/hora. Aguarde 1 hora ou configure SMTP customizado.

---

### Email não chegou

1. Verifique spam
2. Verifique SQL: `SELECT * FROM users WHERE email = 'seu@email.com'`
3. Tente outro email

---

### "Invalid login credentials"

1. Verifique subscription:
```sql
SELECT s.* FROM subscriptions s
JOIN users u ON s.user_id = u.id
WHERE u.email = 'seu@email.com';
```

2. Status deve ser `active`
3. `expires_at` deve ser NULL ou futuro

---

### Link expirou

Links expiram em 1 hora. Solicite novo magic link.

---

## 📊 PRÓXIMOS PASSOS

Após validar que tudo funciona:

1. ✅ Marcar Story 1.4 como concluída
2. 🚀 Avançar para Story 1.5 (Remove Sign-Up Flow)
3. 🚀 Ou Story 1.6 (Kiwify Webhooks)

---

**Dúvidas?** Me avise qual teste falhou e qual erro apareceu!

---

*💻 @dev (Dex) - Backend Squad*
