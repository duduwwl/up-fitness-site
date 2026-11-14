import "server-only";
import { readStoneConfig } from "./config";
import { StoneProvider } from "./stone";
import type { PaymentProvider } from "./types";

export { paymentsEnabled } from "./config";
export { brlStringToCents } from "./amount";
export { recordPayment, applyWebhook } from "./store";
export type { CreatePaymentInput, PaymentResult, PaymentMethod, WebhookEvent } from "./types";

/** Devolve o provedor configurado, ou null quando as chaves ainda não foram definidas. */
export function getPaymentProvider(): PaymentProvider | null {
  const config = readStoneConfig();
  return config ? new StoneProvider(config) : null;
}
