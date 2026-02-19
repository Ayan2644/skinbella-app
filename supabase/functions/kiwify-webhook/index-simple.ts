import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

console.log("🚀 Kiwify Webhook started!")

serve(async (req: Request) => {
  console.log("🔔 Webhook received:", req.method, req.url)

  // Validar token
  const token = req.headers.get("x-kiwify-token")
  const expectedToken = Deno.env.get("KIWIFY_WEBHOOK_TOKEN")

  if (token !== expectedToken) {
    console.error("❌ Invalid token")
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    })
  }

  // Ler body
  const body = await req.text()
  console.log("📦 Body:", body)

  // Retornar sucesso
  return new Response(JSON.stringify({
    success: true,
    message: "Webhook recebido com sucesso!",
    body_length: body.length
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  })
})
