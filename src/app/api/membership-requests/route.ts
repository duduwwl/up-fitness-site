import { membershipRequestSchema, createManagementCode, hashManagementCode, CONSENT_VERSION } from "@/lib/membership-request";
import { createAdminClient } from "@/lib/supabase-admin";
import { enforceSameOrigin, errorResponse, readJsonBody, requestFingerprint, RequestError, verifyTurnstile } from "@/lib/server-security";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    enforceSameOrigin(request);
    const input = membershipRequestSchema.safeParse(await readJsonBody(request));
    if (!input.success || input.data.website) throw new RequestError(422, "Revise os dados informados.");
    await verifyTurnstile(input.data.turnstileToken, request);

    if (process.env.E2E_MOCK_SUBMISSIONS === "true" && !process.env.VERCEL) {
      return Response.json({
        requestId: input.data.idempotencyKey,
        managementCode: "e2e-management-code-not-for-production-00000000",
        expiresAt: new Date(Date.now() + 180 * 86_400_000).toISOString(),
      }, { status: 201 });
    }

    const admin = createAdminClient();
    const fingerprint = requestFingerprint(request);
    const { data: allowed, error: limitError } = await admin.rpc("consume_membership_request_rate_limit", {
      request_scope: "submit",
      request_fingerprint: fingerprint,
    });
    if (limitError) throw limitError;
    if (!allowed) throw new RequestError(429, "Muitas tentativas. Aguarde 15 minutos.");

    const managementCode = createManagementCode();
    const { data, error } = await admin.from("membership_requests").insert({
      id: input.data.idempotencyKey,
      plan_slug: input.data.planSlug,
      full_name: input.data.fullName,
      email: input.data.email,
      phone: input.data.phone,
      payment_method: input.data.paymentMethod,
      consent_version: CONSENT_VERSION,
      management_token_hash: hashManagementCode(managementCode),
    }).select("id, expires_at").single();
    if (error?.code === "23505") throw new RequestError(409, "Esta solicitação já foi recebida.");
    if (error) throw error;

    void admin.rpc("purge_expired_membership_requests");
    return Response.json({ requestId: data.id, managementCode, expiresAt: data.expires_at }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
