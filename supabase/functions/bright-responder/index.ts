import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// =====================================================
// CORS Headers
// =====================================================
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-kiwify-token',
}

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

async function validateWebhookToken(req: Request, bodyText: string): Promise<boolean> {
  const secretToken = Deno.env.get('KIWIFY_WEBHOOK_TOKEN')
  if (!secretToken) {
    console.error('❌ KIWIFY_WEBHOOK_TOKEN not configured')
    return false
  }

  // Check direct token match in headers first
  const headerToken = req.headers.get('x-kiwify-token') 
    || req.headers.get('x-webhook-token')
    || req.headers.get('authorization')?.replace('Bearer ', '')

  if (headerToken && headerToken === secretToken) {
    console.log('✅ Token validated via header')
    return true
  }

  // Kiwify sends HMAC-SHA1 signature as ?signature= query param
  const url = new URL(req.url)
  const signature = url.searchParams.get('signature')

  if (signature && bodyText) {
    try {
      const encoder = new TextEncoder()
      const key = await crypto.subtle.importKey(
        'raw', encoder.encode(secretToken),
        { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']
      )
      const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(bodyText))
      const expectedSig = Array.from(new Uint8Array(sig))
        .map(b => b.toString(16).padStart(2, '0')).join('')

      console.log('🔑 HMAC check:', { received: signature.substring(0, 12) + '...', expected: expectedSig.substring(0, 12) + '...' })
      return signature === expectedSig
    } catch (e) {
      console.error('❌ HMAC validation error:', e)
      return false
    }
  }

  console.error('❌ No valid token or signature found')
  return false
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

// =====================================================
// HANDLERS
// =====================================================

async function handlePurchaseApproved(supabaseAdmin: any, payload: any) {
  console.log('📦 Processing compra_aprovada...')

  const { customer, subscription, product, payment, sale } = payload
  const email = customer?.email

  if (!email) {
    throw new Error('Missing customer email in payload')
  }

  // 1. Create user in Supabase Auth (if not exists)
  let authUserId: string

  const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
  const existingUser = existingUsers?.users?.find((u: any) => u.email === email)

  if (existingUser) {
    authUserId = existingUser.id
    console.log('✅ Auth user already exists:', authUserId)
  } else {
    // Create new auth user with a random password (user will login via magic link)
    const randomPassword = crypto.randomUUID() + crypto.randomUUID()
    const { data: newAuthUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: randomPassword,
      email_confirm: true, // Auto-confirm since they paid
      user_metadata: {
        full_name: customer.name || customer.full_name || '',
        source: 'kiwify_purchase'
      }
    })

    if (authError) {
      console.error('❌ Error creating auth user:', authError)
      throw authError
    }

    authUserId = newAuthUser.user.id
    console.log('✅ Auth user created:', authUserId)
  }

  // 2. Create or update user in users table (using auth user id)
  const { data: user, error: userError } = await supabaseAdmin
    .from('users')
    .upsert({
      id: authUserId, // Link to auth user
      email,
      kiwify_customer_id: customer.id || customer.customer_id || sale?.customer_id || null,
      full_name: customer.name || customer.full_name || null
    }, {
      onConflict: 'id',
      ignoreDuplicates: false
    })
    .select()
    .single()

  if (userError) {
    console.error('❌ Error creating user record:', userError)
    throw userError
  }

  console.log('✅ User record created/updated:', { user_id: user.id, email: user.email })

  // 3. Create subscription (idempotent via unique kiwify_subscription_id)
  const kiwifySubId = subscription?.id || subscription?.subscription_id || `sale-${sale?.id || Date.now()}`
  
  const { data: sub, error: subError } = await supabaseAdmin
    .from('subscriptions')
    .upsert({
      user_id: authUserId,
      kiwify_subscription_id: kiwifySubId,
      status: 'active',
      plan_name: product?.name || product?.product_name || 'SkinBella App',
      // Kiwify envia payment.amount em reais (ex: 199.00) → converter para centavos
      // Fallback seguro: 19900 = R$199/mês (preço do plano SkinBella)
      amount_cents: payment?.amount_cents
        || (payment?.amount ? Math.round(Number(payment.amount) * 100) : 19900),
      started_at: subscription?.started_at || sale?.approved_date || new Date().toISOString(),
      expires_at: subscription?.expires_at || null
    }, {
      onConflict: 'kiwify_subscription_id',
      ignoreDuplicates: false
    })
    .select()
    .single()

  if (subError) {
    console.error('❌ Error creating subscription:', subError)
    throw subError
  }

  console.log('✅ Subscription created/updated:', { subscription_id: sub.id, status: 'active' })

  // 4. Convert lead (if exists)
  await supabaseAdmin
    .from('leads')
    .update({ converted_to_user: true, user_id: authUserId })
    .eq('email', email)
    .eq('converted_to_user', false)

  // 5. Log activity
  await supabaseAdmin
    .from('user_activity')
    .insert({
      user_id: authUserId,
      activity_type: 'purchase_approved',
      activity_data: {
        kiwify_subscription_id: kiwifySubId,
        plan: sub.plan_name,
        amount_cents: sub.amount_cents,
        event_timestamp: new Date().toISOString()
      }
    })

  return { user_id: authUserId, subscription_id: sub.id, status: 'active' }
}

async function handleSubscriptionEvent(supabaseAdmin: any, payload: any, event: string) {
  console.log(`📋 Processing ${event}...`)

  const subId = payload.subscription_id || payload.subscription?.id || payload.subscription?.subscription_id

  if (!subId) {
    throw new Error('Missing subscription_id in payload')
  }

  let updateData: Record<string, unknown> = {}

  switch (event) {
    case 'subscription_canceled':
      updateData = {
        status: 'cancelled',
        cancelled_at: payload.canceled_at || payload.cancelled_at || new Date().toISOString()
      }
      break
    case 'subscription_late':
      updateData = { status: 'late' }
      break
    case 'subscription_renewed':
      updateData = {
        status: 'active',
        cancelled_at: null,
        expires_at: payload.expires_at || payload.next_billing_date || payload.subscription?.expires_at || null
      }
      break
  }

  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .update(updateData)
    .eq('kiwify_subscription_id', subId)
    .select('id, user_id, status')
    .single()

  if (error) {
    console.error(`❌ Error updating subscription:`, error)
    throw error
  }

  // Log activity
  if (data?.user_id) {
    await supabaseAdmin.from('user_activity').insert({
      user_id: data.user_id,
      activity_type: `subscription_${event.replace('subscription_', '')}`,
      activity_data: { kiwify_subscription_id: subId, new_status: updateData.status, event_timestamp: new Date().toISOString() }
    })
  }

  console.log(`✅ Subscription updated: ${data.id} → ${updateData.status}`)
  return { subscription_id: data.id, status: updateData.status }
}

async function handleRefundEvent(supabaseAdmin: any, payload: any, eventType: string) {
  console.log(`💰 Processing ${eventType}...`)

  const subId = payload.subscription_id || payload.subscription?.id || payload.subscription?.subscription_id

  if (!subId) {
    throw new Error('Missing subscription_id in payload')
  }

  const status = eventType === 'chargeback' ? 'chargedback' : 'refunded'

  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .update({
      status,
      cancelled_at: payload.refunded_at || payload.chargedback_at || new Date().toISOString()
    })
    .eq('kiwify_subscription_id', subId)
    .select('id, user_id')
    .single()

  if (error) {
    console.error(`❌ Error processing ${eventType}:`, error)
    throw error
  }

  if (data?.user_id) {
    await supabaseAdmin.from('user_activity').insert({
      user_id: data.user_id,
      activity_type: eventType,
      activity_data: { kiwify_subscription_id: subId, status, event_timestamp: new Date().toISOString() }
    })
  }

  console.log(`✅ Subscription ${status}: ${data.id}`)
  return { subscription_id: data.id, status }
}

async function handleLeadEvent(supabaseAdmin: any, payload: any, event: string) {
  console.log(`📝 Processing lead event: ${event}...`)

  const email = payload.customer?.email
  if (!email) {
    console.warn('⚠️ No customer email in lead event, skipping')
    return { skipped: true }
  }

  const { data, error } = await supabaseAdmin
    .from('leads')
    .upsert({
      email,
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

  console.log('✅ Lead created/updated:', { email, source: event })
  return { lead_id: data?.[0]?.id }
}

// =====================================================
// MAIN HANDLER
// =====================================================

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  console.log('\n🔔 ===== BRIGHT-RESPONDER WEBHOOK =====')
  console.log('Method:', req.method)
  console.log('URL:', req.url)

  try {
    // 1. Only POST allowed
    if (req.method !== 'POST') {
      return jsonResponse({ error: 'Method Not Allowed' }, 405)
    }

    // 2. Read body first (needed for HMAC validation)
    const text = await req.text()
    console.log('📦 Raw body length:', text.length)

    // 3. Validate token (HMAC uses body)
    if (!await validateWebhookToken(req, text)) {
      console.error('❌ Invalid webhook token/signature')
      return jsonResponse({ error: 'Unauthorized' }, 401)
    }

    console.log('✅ Token/signature validated')

    // 4. Parse body
    if (!text || text.trim().length === 0) {
      console.log('⚠️ Empty body - webhook test ping')
      return jsonResponse({ success: true, message: 'Webhook test OK - empty body' })
    }

    let rawPayload: any
    try {
      rawPayload = JSON.parse(text)
    } catch {
      return jsonResponse({ error: 'Invalid JSON' }, 400)
    }

    console.log('📦 Event:', rawPayload.event)
    console.log('📦 Customer:', rawPayload.customer?.email)

    let event = rawPayload.event
    if (!event) {
      return jsonResponse({ error: 'Missing event field' }, 400)
    }

    event = normalizeEventName(event)
    console.log('✅ Normalized event:', event)

    // 4. Create Supabase admin client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey)

    // 5. Route event
    let result: any

    switch (event) {
      case 'compra_aprovada':
        result = await handlePurchaseApproved(supabaseAdmin, rawPayload)
        break

      case 'subscription_canceled':
      case 'subscription_late':
      case 'subscription_renewed':
        result = await handleSubscriptionEvent(supabaseAdmin, rawPayload, event)
        break

      case 'compra_reembolsada':
        result = await handleRefundEvent(supabaseAdmin, rawPayload, 'refund')
        break

      case 'chargeback':
        result = await handleRefundEvent(supabaseAdmin, rawPayload, 'chargeback')
        break

      case 'boleto_gerado':
      case 'pix_gerado':
      case 'carrinho_abandonado':
      case 'compra_recusada':
        result = await handleLeadEvent(supabaseAdmin, rawPayload, event)
        break

      default:
        console.warn(`⚠️ Unhandled event: ${event}`)
        return jsonResponse({ success: true, message: `Event ${event} received but not handled` })
    }

    // 6. Refresh admin metrics
    try {
      await supabaseAdmin.rpc('refresh_admin_metrics')
      console.log('📊 Admin metrics refreshed')
    } catch (e) {
      console.warn('⚠️ Metrics refresh failed (non-critical):', e)
    }

    console.log(`✅ Event ${event} processed successfully`)
    return jsonResponse({ success: true, event, result })

  } catch (error) {
    console.error('❌ Webhook error:', (error as Error).message)
    return jsonResponse({
      error: (error as Error).message,
    }, 500)
  }
})

console.log('🚀 Bright-Responder Edge Function started!')
