import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || Deno.env.get("VITE_SUPABASE_URL") || "https://kkfvlbqhxvexpjrdlgpx.supabase.co";
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/bright-responder`;
const WEBHOOK_TOKEN = Deno.env.get("KIWIFY_WEBHOOK_TOKEN") || "j2d8lnauxs0";

const testEmail = `e2e-test-${Date.now()}@skinbella-test.com`;
const testSubId = `e2e-sub-${Date.now()}`;

Deno.test("E2E: compra_aprovada returns success with user and subscription IDs", async () => {
  const purchasePayload = {
    event: "compra_aprovada",
    customer: { email: testEmail, name: "E2E Test User", id: "cust_e2e" },
    product: { name: "SkinBella App", id: "prod_e2e" },
    payment: { amount: 17.0 },
    subscription: { id: testSubId, started_at: new Date().toISOString() },
  };

  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-kiwify-token": WEBHOOK_TOKEN,
    },
    body: JSON.stringify(purchasePayload),
  });

  const body = await res.json();
  assertEquals(res.status, 200, `Expected 200, got ${res.status}: ${JSON.stringify(body)}`);
  assertEquals(body.success, true, "Response should indicate success");
  assertEquals(body.event, "compra_aprovada", "Event should be echoed back");
  assertExists(body.result?.user_id, "Should return user_id");
  assertExists(body.result?.subscription_id, "Should return subscription_id");
  assertEquals(body.result?.status, "active", "Subscription status should be active");
});

Deno.test("E2E: unauthorized request returns 401", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-kiwify-token": "wrong-token",
    },
    body: JSON.stringify({ event: "compra_aprovada" }),
  });

  await res.text(); // consume body
  assertEquals(res.status, 401, `Expected 401, got ${res.status}`);
});

Deno.test("E2E: missing event returns 400", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-kiwify-token": WEBHOOK_TOKEN,
    },
    body: JSON.stringify({ no_event: true }),
  });

  const body = await res.json();
  assertEquals(res.status, 400);
  assertEquals(body.error, "Missing event field");
});

Deno.test("E2E: lead event (carrinho_abandonado) returns success", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-kiwify-token": WEBHOOK_TOKEN,
    },
    body: JSON.stringify({
      event: "carrinho_abandonado",
      customer: { email: `lead-${Date.now()}@test.com`, name: "Lead Test" },
    }),
  });

  const body = await res.json();
  assertEquals(res.status, 200);
  assertEquals(body.success, true);
  assertEquals(body.event, "carrinho_abandonado");
});

Deno.test("E2E: empty body returns webhook test OK", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-kiwify-token": WEBHOOK_TOKEN,
    },
    body: "",
  });

  const body = await res.json();
  assertEquals(res.status, 200);
  assertEquals(body.success, true);
});
