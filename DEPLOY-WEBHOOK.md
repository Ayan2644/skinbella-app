# 🚀 Deploy Webhook - Passo a Passo

## ⚠️ IMPORTANTE
O arquivo `supabase/functions/kiwify-webhook/index.ts` foi atualizado com a versão COMPLETA que:
- ✅ Trata body vazio (webhooks de teste)
- ✅ Processa todos os 10 eventos da Kiwify
- ✅ Salva users, subscriptions e leads no banco
- ✅ Valida token de segurança

---

## 📝 Como fazer deploy:

### Opção 1: Copiar e Colar no Dashboard (RECOMENDADO)

1. **Abrir o arquivo:**
   ```bash
   cat /Users/ayan/skinbella-app/supabase/functions/kiwify-webhook/index.ts
   ```

2. **Copiar TODO o conteúdo** (Cmd+A, Cmd+C)

3. **Ir no Supabase Dashboard:**
   - Edge Functions → kiwify-webhook (ou bright-responder)
   - Aba "Code"
   - Apagar tudo
   - Colar o novo código
   - Clicar "Save" (ou Deploy)

4. **Verificar logs:**
   - Aba "Logs"
   - Deve aparecer: `🚀 Kiwify Webhook Edge Function started!`

---

### Opção 2: Deploy via CLI (se tiver instalado)

```bash
cd /Users/ayan/skinbella-app
npx supabase functions deploy kiwify-webhook --no-verify-jwt
```

---

## 🧪 Testar depois do deploy:

```bash
cd /Users/ayan/skinbella-app
chmod +x test-webhook.sh
./test-webhook.sh
```

Isso vai testar:
1. Compra aprovada (cria user + subscription)
2. Cancelamento (atualiza status)
3. Lead (cria lead na tabela)

---

## 📊 Ver dados no Supabase:

Depois dos testes, verificar:

```sql
-- Users criados
SELECT * FROM users ORDER BY created_at DESC LIMIT 5;

-- Subscriptions
SELECT * FROM subscriptions ORDER BY created_at DESC LIMIT 5;

-- Leads
SELECT * FROM leads ORDER BY created_at DESC LIMIT 5;
```

---

## 🔧 Troubleshooting:

**Se der erro de parsing:**
- Copie o arquivo linha por linha
- Verifique se não há caracteres especiais
- Tente usando a versão simplificada primeiro

**Se não salvar no banco:**
- Verifique os logs
- Confirme que SUPABASE_SERVICE_ROLE_KEY está configurado
- Teste cada evento separadamente

**Token inválido:**
- Confirme: KIWIFY_WEBHOOK_TOKEN = j2d8lnauxs0
- Verifique se está na aba "Secrets"
