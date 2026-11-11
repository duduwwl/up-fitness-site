import { applyWebhook, getPaymentProvider, paymentsEnabled, type WebhookEvent } from "@/lib/payments";
import { createAdminClient } from "@/lib/supabase-admin";

export const runtime = "nodejs";

// SCAFFOLD: recebe os webhooks da Stone/Pagar.me. Inerte até PAYMENTS_ENABLED=true.
// Verifica a assinatura sobre o corpo CRU antes de confiar no conteúdo.
export async function POST(request: Request) {
  if (!paymentsEnabled()) return new Response(null, { status: 404 });
  const provider = getPaymentProvider();
  if (!provider) return new Response(null, { status: 404 });

  const rawBody = await request.text();
  let event: WebhookEvent;
  try {
    event = provider.parseWebhook(rawBody, request.headers);
  } catch {
    return new Response("invalid signature", { status: 401 });
  }

  try {
    await applyWebhook(createAdminClient(), event);
  } catch {
    // Erro transitório: devolve 500 para o provedor reenviar o evento.
    return new Response("error", { status: 500 });
  }
  return Response.json({ received: true });
}
