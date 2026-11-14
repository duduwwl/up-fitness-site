import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "../database.generated";
import type { CreatePaymentInput, PaymentResult, WebhookEvent } from "./types";

type Admin = SupabaseClient<Database>;

/** Grava a cobrança recém-criada e devolve o id interno. */
export async function recordPayment(
  admin: Admin,
  input: CreatePaymentInput,
  result: PaymentResult,
): Promise<string> {
  const { data, error } = await admin
    .from("payments")
    .insert({
      membership_request_id: input.membershipRequestId ?? null,
      provider: "stone",
      provider_order_id: result.providerOrderId,
      provider_charge_id: result.providerChargeId ?? null,
      method: result.method,
      amount_cents: result.amountCents,
      status: result.status,
      pix_qr_code: result.pix?.qrCode ?? null,
      pix_qr_code_url: result.pix?.qrCodeUrl ?? null,
      pix_expires_at: result.pix?.expiresAt ?? null,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

/** Aplica um evento de webhook de forma idempotente. */
export async function applyWebhook(
  admin: Admin,
  event: WebhookEvent,
): Promise<"applied" | "duplicate" | "ignored"> {
  const { error: insertError } = await admin.from("payment_events").insert({
    provider: "stone",
    event_id: event.id,
    event_type: event.type,
    payload: event.raw as Json,
  });
  if (insertError) {
    if (insertError.code === "23505") return "duplicate";
    throw insertError;
  }

  if (!event.status || !event.providerOrderId) return "ignored";
  const patch: Database["public"]["Tables"]["payments"]["Update"] = { status: event.status };
  if (event.status === "paid") patch.paid_at = new Date().toISOString();
  const { error: updateError } = await admin
    .from("payments")
    .update(patch)
    .eq("provider", "stone")
    .eq("provider_order_id", event.providerOrderId);
  if (updateError) throw updateError;
  return "applied";
}
