#!/bin/bash

echo "🧪 Testing Kiwify Webhook"
echo ""

URL="https://jhlzidgpibxwjgikdqor.supabase.co/functions/v1/bright-responder"
TOKEN="j2d8lnauxs0"

echo "📋 Test 1: Compra Aprovada (Purchase)"
echo "----------------------------------------"
curl -X POST "$URL" \
  -H "x-kiwify-token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "compra_aprovada",
    "customer": {
      "email": "teste@skinbella.com",
      "name": "Maria Silva",
      "id": "cust_123"
    },
    "product": {
      "name": "SkinBella App",
      "id": "prod_456"
    },
    "payment": {
      "amount": 17.00
    },
    "subscription": {
      "id": "sub_789",
      "started_at": "2026-02-17T00:00:00Z"
    }
  }' | jq .

echo ""
echo ""
echo "📋 Test 2: Subscription Canceled"
echo "----------------------------------------"
curl -X POST "$URL" \
  -H "x-kiwify-token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "assinatura_cancelada",
    "subscription_id": "sub_789",
    "canceled_at": "2026-02-17T12:00:00Z"
  }' | jq .

echo ""
echo ""
echo "📋 Test 3: Lead Event (Carrinho Abandonado)"
echo "----------------------------------------"
curl -X POST "$URL" \
  -H "x-kiwify-token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "carrinho_abandonado",
    "customer": {
      "email": "lead@example.com",
      "name": "João Lead"
    }
  }' | jq .

echo ""
echo ""
echo "✅ Tests completed!"
