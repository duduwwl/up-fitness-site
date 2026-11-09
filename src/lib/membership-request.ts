import { createHash, randomBytes } from "node:crypto";
import { z } from "zod";

export const CONSENT_VERSION = "2026-11-08";
export const planSlugs = ["economico", "bimestral", "trimestral", "semestral", "anual"] as const;

const safeText = z.string().trim().refine((value) => !/[\u0000-\u001f\u007f]/.test(value), "Texto inválido.");
const phone = z.string().transform((value, context) => {
  const digits = value.replace(/\D/g, "");
  const normalized = digits.startsWith("55") ? digits : `55${digits}`;
  if (!/^55[1-9][0-9]{9,10}$/.test(normalized)) {
    context.addIssue({ code: "custom", message: "Telefone inválido." });
    return z.NEVER;
  }
  return normalized;
});

export const membershipRequestSchema = z.object({
  planSlug: z.enum(planSlugs),
  fullName: safeText.min(2).max(100).transform((value) => value.replace(/\s+/g, " ")),
  email: z.string().trim().max(254).email().transform((value) => value.toLowerCase()),
  phone,
  paymentMethod: z.enum(["pix", "card"]),
  consent: z.literal(true),
  turnstileToken: z.string().max(2048).optional().default(""),
  idempotencyKey: z.string().uuid(),
  website: z.string().max(0).optional().default(""),
}).strict();

export const privacyRequestSchema = z.object({
  requestId: z.string().uuid(),
  managementCode: z.string().min(32).max(128),
}).strict();

export type MembershipRequestInput = z.infer<typeof membershipRequestSchema>;

export function createManagementCode() {
  return randomBytes(32).toString("base64url");
}

export function hashManagementCode(code: string) {
  return createHash("sha256").update(code, "utf8").digest("hex");
}
