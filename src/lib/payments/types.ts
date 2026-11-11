// Tipos neutros de pagamento. Não dependem do provedor, para que trocar Stone por
// outro gateway no futuro seja só escrever outro adapter que implemente PaymentProvider.

export type PaymentMethod = "pix" | "credit_card";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "paid"
  | "failed"
  | "canceled"
  | "refunded";

export interface PaymentCustomer {
  name: string;
  email: string;
  /** Telefone só com dígitos, com DDI: ex. 5535999999999. */
  phone: string;
  /** CPF só com dígitos. Opcional neste scaffold. */
  document?: string;
}

export interface CreatePaymentInput {
  method: PaymentMethod;
  amountCents: number;
  description: string;
  customer: PaymentCustomer;
  idempotencyKey: string;
  membershipRequestId?: string;
  /** Cartão: token gerado no navegador com a chave pública (nunca o número do cartão). */
  cardToken?: string;
  installments?: number;
}

export interface PaymentPixResult {
  qrCode: string;
  qrCodeUrl?: string;
  expiresAt?: string;
}

export interface PaymentResult {
  providerOrderId: string;
  providerChargeId?: string;
  status: PaymentStatus;
  method: PaymentMethod;
  amountCents: number;
  pix?: PaymentPixResult;
}

export interface WebhookEvent {
  id: string;
  type: string;
  providerOrderId?: string;
  providerChargeId?: string;
  status?: PaymentStatus;
  raw: unknown;
}

export interface PaymentProvider {
  readonly id: string;
  createPayment(input: CreatePaymentInput): Promise<PaymentResult>;
  /** Valida a assinatura e extrai o evento. Lança se a assinatura for inválida. */
  parseWebhook(rawBody: string, headers: Headers): WebhookEvent;
}
