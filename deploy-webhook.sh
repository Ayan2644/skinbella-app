#!/bin/bash

echo "🚀 Deploy Kiwify Webhook Edge Function"
echo ""

# Verificar se .env existe
if [ ! -f "supabase/functions/.env" ]; then
  echo "❌ Arquivo supabase/functions/.env não encontrado!"
  echo ""
  echo "Crie o arquivo com:"
  echo "  cp supabase/functions/.env.example supabase/functions/.env"
  echo "  # Edite e adicione SUPABASE_SERVICE_ROLE_KEY"
  exit 1
fi

echo "✅ Arquivo .env encontrado"
echo ""

# Deploy usando npx (não precisa instalar globalmente)
echo "📦 Fazendo deploy da Edge Function..."
npx supabase functions deploy kiwify-webhook --no-verify-jwt

echo ""
echo "✅ Deploy completo!"
echo ""
echo "URL do webhook:"
echo "https://jhlzidgpibxwjgikdqor.supabase.co/functions/v1/kiwify-webhook"
echo ""
echo "Próximo passo:"
echo "1. Copie a URL acima"
echo "2. Cole na interface da Kiwify (campo 'URL do Webhook')"
echo "3. Use o token: j2d8lnauxs0"
echo "4. Clique 'Testar Webhook'"
