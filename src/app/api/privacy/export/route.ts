import { privacyRequestSchema, hashManagementCode } from "@/lib/membership-request";
import { createAdminClient } from "@/lib/supabase-admin";
import { enforceSameOrigin, errorResponse, readJsonBody, requestFingerprint, RequestError } from "@/lib/server-security";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    enforceSameOrigin(request);
    const input = privacyRequestSchema.safeParse(await readJsonBody(request));
    if (!input.success) throw new RequestError(422, "Dados de gestão inválidos.");
    const admin = createAdminClient();
    const { data: allowed, error: limitError } = await admin.rpc("consume_membership_request_rate_limit", {
      request_scope: "export", request_fingerprint: requestFingerprint(request),
    });
    if (limitError) throw limitError;
    if (!allowed) throw new RequestError(429, "Muitas tentativas. Aguarde 15 minutos.");
    const { data, error } = await admin.from("membership_requests")
      .select("id, plan_slug, full_name, email, phone, payment_method, status, consent_version, consented_at, created_at, updated_at, expires_at")
      .eq("id", input.data.requestId)
      .eq("management_token_hash", hashManagementCode(input.data.managementCode))
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new RequestError(404, "Solicitação não encontrada.");
    return Response.json({ data }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return errorResponse(error);
  }
}
