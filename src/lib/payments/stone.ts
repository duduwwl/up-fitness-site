import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { StoneConfig } from "./config";
import type {
  CreatePaymentInput,
  PaymentMethod,
  PaymentProvider,
  PaymentResult,
  PaymentStatus,
  WebhookEvent,
} from "./types";

// Adapter da Stone sobre a Core API v5 do Pagar.me (https://api.pagar.me/core/v5).
// Autenticação HTTP Basic: usuário = chave secreta, senha vazia.

type PagarmeTransaction = {
  qr_code?: string;
  qr_code_url?: string;
  expires_at?: string;
};

type PagarmeCharge = {
  id?: string;
  status?: string;
  payment_method?: string;
  last_transaction?: PagarmeTransaction;
};

type PagarmeOrder = {
  id?: string;
  status?: string;
  charges?: PagarmeCharge[];
};

type PagarmeWebhook = {
  id?: string;
  type?: string;
  data?: PagarmeOrder & { order_id?: string };
};

const STATUS_MAP: Record<string, PaymentStatus> = {
  pending: "pending",
  processing: "processing",
  waiting_payment: "pending",
  authorized_pending_capture: "processing",
  paid: "paid",
  overpaid: "paid",
  underpaid: "paid",
  failed: "failed",
  with_error: "failed",
  not_authorized: "failed",
  canceled: "canceled",
  voided: "canceled",
  refunded: "refunded",
  chargedback: "refunded",
};

function mapStatus(raw: string | undefined): PaymentStatus {
  return (raw && STATUS_MAP[raw]) || "pending";
}

function splitPhone(phone: string) {
  // phone chega como 55 + DDD(2) + número(8 ou 9). Ex.: 5535999999999.
  const digits = phone.replace(/\D/g, "");
  const national = digits.startsWith("55") ? digits.slice(2) : digits;
  return {
    country_code: "55",
    area_code: national.slice(0, 2),
    number: national.slice(2),
  };
}

export class StoneProvider implements PaymentProvider {
  readonly id = "stone";
  constructor(private readonly config: StoneConfig) {}

  private authHeader(): string {
    return `Basic ${Buffer.from(`${this.config.apiKey}:`).toString("base64")}`;
  }

  private buildOrderBody(input: CreatePaymentInput): Record<string, unknown> {
    const payment: Record<string, unknown> =
      input.method === "pix"
        ? { payment_method: "pix", pix: { expires_in: 3600 } }
        : {
            payment_method: "credit_card",
            credit_card: {
              installments: input.installments ?? 1,
              statement_descriptor: "UPFITNESS",
              card_token: input.cardToken,
            },
          };
    return {
      items: [{ amount: input.amountCents, description: input.description, quantity: 1 }],
      customer: {
        name: input.customer.name,
        email: input.customer.email,
        type: "individual",
        document: input.customer.document,
        phones: { mobile_phone: splitPhone(input.customer.phone) },
      },
      payments: [payment],
    };
  }

  async createPayment(input: CreatePaymentInput): Promise<PaymentResult> {
    if (input.method === "credit_card" && !input.cardToken) {
      throw new Error("Cartão exige um card_token gerado no navegador com a chave pública.");
    }
    const response = await fetch(`${this.config.apiBaseUrl}/orders`, {
      method: "POST",
      headers: {
        authorization: this.authHeader(),
        "content-type": "application/json",
        "idempotency-key": input.idempotencyKey,
      },
      body: JSON.stringify(this.buildOrderBody(input)),
      signal: AbortSignal.timeout(15_000),
    });
    const order = (await response.json()) as PagarmeOrder;
    if (!response.ok || !order.id) {
      throw new Error(`Stone recusou o pedido (HTTP ${response.status}).`);
    }
    const charge = order.charges?.[0];
    const transaction = charge?.last_transaction;
    const method: PaymentMethod = input.method;
    return {
      providerOrderId: order.id,
      providerChargeId: charge?.id,
      status: mapStatus(charge?.status ?? order.status),
      method,
      amountCents: input.amountCents,
      pix:
        method === "pix" && transaction?.qr_code
          ? {
              qrCode: transaction.qr_code,
              qrCodeUrl: transaction.qr_code_url,
              expiresAt: transaction.expires_at,
            }
          : undefined,
    };
  }

  parseWebhook(rawBody: string, headers: Headers): WebhookEvent {
    if (!this.config.webhookSecret) {
      throw new Error("STONE_WEBHOOK_SECRET não configurado.");
    }
    const header = headers.get("x-hub-signature") ?? "";
    const received = header.includes("=") ? header.split("=")[1] : header;
    const expected = createHmac("sha256", this.config.webhookSecret).update(rawBody).digest("hex");
    const a = Buffer.from(received);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new Error("Assinatura de webhook inválida.");
    }
    const event = JSON.parse(rawBody) as PagarmeWebhook;
    const data = event.data ?? {};
    const charge = data.charges?.[0];
    return {
      id: event.id ?? "",
      type: event.type ?? "unknown",
      providerOrderId: data.order_id ?? data.id,
      providerChargeId: charge?.id,
      status: mapStatus(charge?.status ?? data.status),
      raw: event,
    };
  }
}
