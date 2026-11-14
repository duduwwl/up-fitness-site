import { z } from "zod";

// Corpo aceito por POST /api/payments/create. O valor NUNCA vem do cliente: é
// calculado no servidor a partir do plano do pedido de matrícula.
export const paymentCreateSchema = z
  .object({
    membershipRequestId: z.string().uuid(),
    method: z.enum(["pix", "credit_card"]),
    cardToken: z.string().min(1).max(256).optional(),
    installments: z.number().int().min(1).max(12).optional(),
    idempotencyKey: z.string().uuid(),
    website: z.string().max(0).optional().default(""),
  })
  .strict();

export type PaymentCreateInput = z.infer<typeof paymentCreateSchema>;
