import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// =====================================================
// TYPES
// =====================================================

type KiwifyEvent =
  | 'boleto_gerado'
  | 'pix_gerado'
  | 'carrinho_abandonado'
  | 'compra_recusada'
  | 'compra_aprovada'
  | 'compra_reembolsada'
  | 'chargeback'
  | 'assinatura_cancelada'
  | 'assinatura_atrasada'
  | 'assinatura_renovada'
  | 'subscription_canceled'
  | 'subscription_late'
  | 'subscription_renewed'

interface WebhookPayload {
  event: KiwifyEvent
  timestamp?: string
  webhook_id?: string
  product_id?: string
  [key: string]: any
}

// =====================================================
// HELPERS
// =====================================================

function normalizeEventName(event: string): KiwifyEvent {
  const mapping: Record<string, KiwifyEvent> = {
    'assinatura_cancelada': 'subscription_canceled',
    'assinatura_atrasada': 'subscription_late',
    'assinatura_renovada': 'subscription_renewed'
  }
  return (mapping[event] as KiwifyEvent) || (event as KiwifyEvent)
}

function validateWebhookToken(token: string | null): boolean {
  const expectedToken = Deno.env.get('KIWIFY_WEBHOOK_TOKEN')

  if (!token || !expectedToken) {
    console.error('❌ Token validation failed:', {
      hasToken: !!token,
      hasExpectedToken: !!expectedToken
    })
    return false
  }

  return token === expectedToken
}

// =====================================================
// HANDLERS
// =====================================================

async function handlePurchaseApproved(supabase: any, payload: any) {
  console.log('📦 Processing compra_aprovada...')

  const { customer, subscription, product, payment, sale } = payload

  if (!customer?.email) {
    throw new Error('Missing customer email in payload')
  }

  const { data: user, error: userError } = await supabase
    .from('users')
    .upsert({
      email: customer.email,
      kiwify_customer_id: customer.id || customer.customer_id || sale?.customer_id,
      full_name: customer.name || customer.full_name
    }, {
      onConflict: 'email',
      ignoreDuplicates: false
    })
    .select()
    .single()

  if (userError) {
    console.error('❌ Error creating user:', userError)
    throw userError
  }

  console.log('✅ User created/updated:', { user_id: user.id, email: user.email })

  const subscriptionData = {
    user_id: user.id,
    kiwify_subscription_id: subscription?.id || subscription?.subscription_id || `sale-${sale?.id || Date.now()}`,
    status: 'active',
    plan_name: product?.name || product?.product_name || 'SkinBella App',
    amount_cents: payment?.amount ? Math.round(payment.amount * 100) : 1700,
    started_at: subscription?.started_at || sale?.approved_date || new Date().toISOString(),
    expires_at: subscription?.expires_at || null
  }

  const { data: sub, error: subError } = await supabase
    .from('subscriptions')
    .insert(subscriptionData)
    .select()
    .single()

  if (subError) {
    console.error('❌ Error creating subscription:', subError)
    throw subError
  }

  console.log('✅ Subscription created:', { subscription_id: sub.id })

  const { error: leadError } = await supabase
    .from('leads')
    .update({ converted_to_user: true, user_id: user.id })
    .eq('email', customer.email)
    .eq('converted_to_user', false)

  if (!leadError) {
    console.log('✅ Lead converted to user')
  }

  return { user_id: user.id, subscription_id: sub.id }
}

async function handleSubscriptionEvent(supabase: any, payload: any, event: string) {
  console.log(`📋 Processing ${event}...`)

  const { subscription_id, subscription, customer_id, canceled_at, expires_at } = payload

  const subId = subscription_id || subscription?.id || subscription?.subscription_id

  if (!subId) {
    throw new Error('Missing subscription_id in payload')
  }

  let updateData: any = {}

  switch (event) {
    case 'subscription_canceled':
      updateData = {
        status: 'cancelled',
        cancelled_at: canceled_at || new Date().toISOString()
      }
      break

    case 'subscription_late':
      updateData = { status: 'late' }
      break

    case 'subscription_renewed':
      updateData = {
        status: 'active',
        expires_at: expires_at || subscription?.expires_at
      }
      break
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .update(updateData)
    .eq('kiwify_subscription_id', subId)
    .select()
    .single()

  if (error) {
    console.error(`❌ Error updating subscription:`, error)
    throw error
  }

  console.log(`✅ Subscription updated:`, { subscription_id: data.id, status: updateData.status })

  return { subscription_id: data.id, status: updateData.status }
}

async function handleRefundEvent(supabase: any, payload: any, event: string) {
  console.log(`💰 Processing ${event}...`)

  const { subscription_id, subscription, refunded_at, chargedback_at } = payload

  const subId = subscription_id || subscription?.id || subscription?.subscription_id

  if (!subId) {
    throw new Error('Missing subscription_id in payload')
  }

  const status = event === 'chargeback' ? 'chargedback' : 'refunded'

  const { data, error } = await supabase
    .from('subscriptions')
    .update({
      status,
      cancelled_at: refunded_at || chargedback_at || new Date().toISOString()
    })
    .eq('kiwify_subscription_id', subId)
    .select()
    .single()

  if (error) {
    console.error(`❌ Error processing refund:`, error)
    throw error
  }

  console.log(`✅ Subscription ${status}:`, { subscription_id: data.id })

  return { subscription_id: data.id, status }
}

async function handleLeadEvent(supabase: any, payload: any, event: string) {
  console.log(`📝 Processing lead event: ${event}...`)

  const { customer, product } = payload

  if (!customer?.email) {
    console.warn('⚠️ No customer email in lead event, skipping')
    return { skipped: true }
  }

  const { data, error } = await supabase
    .from('leads')
    .upsert({
      email: customer.email,
      source: event,
      quiz_completed: false,
      converted_to_user: false
    }, {
      onConflict: 'email',
      ignoreDuplicates: true
    })
    .select()

  if (error) {
    console.error('❌ Error creating lead:', error)
    throw error
  }

  console.log('✅ Lead created/updated:', { email: customer.email, source: event })

  return { lead_id: data?.[0]?.id }
}

// =====================================================
// MAIN HANDLER
// =====================================================

serve(async (req) => {
  console.log('\n🔔 Webhook received:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  })

  try {
    // 1. Validar método
    if (req.method !== 'POST') {
      console.warn('❌ Invalid method:', req.method)
      return new Response('Method Not Allowed', { status: 405 })
    }

    // 2. Validar token
    const webhookToken = req.headers.get('x-kiwify-token')

    console.log('🔑 Token validation:', {
      received: webhookToken,
      expected: Deno.env.get('KIWIFY_WEBHOOK_TOKEN')
    })

    if (!validateWebhookToken(webhookToken)) {
      console.error('❌ Invalid webhook token')
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // 3. Parse payload (com tratamento de body vazio)
    const contentType = req.headers.get('content-type') || ''
    const hasBody = req.headers.get('content-length') !== '0'

    let rawPayload: any = {}

    if (hasBody && contentType.includes('application/json')) {
      try {
        const text = await req.text()
        console.log('📦 Raw body text:', text)

        if (text && text.trim().length > 0) {
          rawPayload = JSON.parse(text)
        } else {
          console.warn('⚠️ Empty body received')
          return new Response(JSON.stringify({
            success: true,
            message: 'Webhook test received (empty body)',
            note: 'This is likely a test webhook. Real events will have payload.'
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        }
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError)
        return new Response(JSON.stringify({
          error: 'Invalid JSON payload',
          details: parseError.message
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    } else {
      console.warn('⚠️ No JSON body in request')
      return new Response(JSON.stringify({
        success: true,
        message: 'Webhook endpoint is working (no body)',
        note: 'Send POST with JSON body containing event data'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    console.log('📦 Parsed payload:', JSON.stringify(rawPayload, null, 2))

    const payload: WebhookPayload = rawPayload
    let event = payload.event

    if (!event) {
      console.error('❌ Missing event field in payload')
      return new Response(JSON.stringify({
        error: 'Missing event field in payload'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Normalizar nome do evento (PT-BR → EN)
    event = normalizeEventName(event)

    console.log('✅ Event normalized:', event)

    // 4. Criar cliente Supabase (service_role bypass RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey)

    // 5. Event Router
    let result

    switch (event) {
      case 'compra_aprovada':
        result = await handlePurchaseApproved(supabaseAdmin, payload)
        break

      case 'subscription_canceled':
        result = await handleSubscriptionEvent(supabaseAdmin, payload, event)
        break

      case 'subscription_late':
        result = await handleSubscriptionEvent(supabaseAdmin, payload, event)
        break

      case 'subscription_renewed':
        result = await handleSubscriptionEvent(supabaseAdmin, payload, event)
        break

      case 'compra_reembolsada':
        result = await handleRefundEvent(supabaseAdmin, payload, 'refund')
        break

      case 'chargeback':
        result = await handleRefundEvent(supabaseAdmin, payload, 'chargeback')
        break

      case 'boleto_gerado':
      case 'pix_gerado':
      case 'carrinho_abandonado':
      case 'compra_recusada':
        result = await handleLeadEvent(supabaseAdmin, payload, event)
        break

      default:
        console.warn(`⚠️ Unhandled event type: ${event}`)
        return new Response(JSON.stringify({
          success: true,
          message: 'Event received but not handled',
          event
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
    }

    // 6. Sucesso
    console.log(`✅ Event ${event} processed successfully:`, result)

    return new Response(JSON.stringify({
      success: true,
      event,
      result
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('❌ Error processing webhook:', error)

    return new Response(JSON.stringify({
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})

console.log('🚀 Kiwify Webhook Edge Function started!')
