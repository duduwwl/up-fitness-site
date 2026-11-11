import { getPaymentProvider, paymentsEnabled, recordPayment, brlStringToCents, type CreatePaymentInput } from "@/lib/payments";
import { paymentCreateSchema } from "@/lib/payments/schema";
import { getPlanBySlug } from "@/lib/plans";
import { createAdminClient } from "@/lib/supabase-admin";
import { enforceSameOrigin, errorResponse, readJsonBody, requestFingerprint, RequestError } from "@/lib/server-security";

export const runtime = "nodejs";

// SCAFFOLD: inerte até PAYMENTS_ENABLED=true e as chaves STONE_* configuradas.
export async function POST(request: Request) {
  try {
    enforceSameOrigin(request);
    if (!paymentsEnabled()) throw new RequestError(503, "Pagamentos online ainda não estão ativos.");
    const provider = getPaymentProvider();
    if (!provider) throw new RequestError(503, "Provedor de pagamento não configurado.");

    const parsed = paymentCreateSchema.safeParse(await readJsonBody(request));
    if (!parsed.success || parsed.data.website) throw new RequestError(422, "Revise os dados informados.");
    const body = parsed.data;
    if (body.method === "credit_card" && !body.cardToken) {
      throw new RequestError(422, "Informe o token do cartão.");
    }

    const admin = createAdminClient();
    const { data: allowed, error: limitError } = await admin.rpc("consume_membership_request_rate_limit", {
      request_scope: "payment",
      request_fingerprint: requestFingerprint(request),
    });
    if (limitError) throw limitError;
    if (!allowed) throw new RequestError(429, "Muitas tentativas. Aguarde 15 minutos.");

    const { data: membership, error: membershipError } = await admin
      .from("membership_requests")
      .select("id, plan_slug, full_name, email, phone")
      .eq("id", body.membershipRequestId)
      .single();
    if (membershipError || !membership) throw new RequestError(404, "Pedido não encontrado.");

    const plan = getPlanBySlug(membership.plan_slug);
    if (!plan) throw new RequestError(422, "Plano inválido.");

    const createInput: CreatePaymentInput = {
      method: body.method,
      amountCents: brlStringToCents(plan.price),
      description: `Plano ${plan.name} — UP Fitness`,
      customer: { name: membership.full_name, email: membership.email, phone: membership.phone },
      idempotencyKey: body.idempotencyKey,
      membershipRequestId: membership.id,
      cardToken: body.cardToken,
      installments: body.installments,
    };

    const result = await provider.createPayment(createInput);
    const paymentId = await recordPayment(admin, createInput, result);

    return Response.json({ paymentId, status: result.status, pix: result.pix ?? null }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
