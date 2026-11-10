import "server-only";
import { createHmac } from "node:crypto";

const MAX_BODY_BYTES = 16_384;

export async function readJsonBody(request: Request): Promise<unknown> {
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) throw new RequestError(413, "Solicitação muito grande.");
  const text = await request.text();
  if (Buffer.byteLength(text, "utf8") > MAX_BODY_BYTES) throw new RequestError(413, "Solicitação muito grande.");
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new RequestError(400, "Solicitação inválida.");
  }
}

export function enforceSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return;
  const allowed = new Set((process.env.ALLOWED_ORIGINS ?? "http://localhost:3000").split(",").map((item) => item.trim()));
  if (!allowed.has(origin)) throw new RequestError(403, "Origem não permitida.");
}

export function clientIp(request: Request) {
  return request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? "unknown";
}

export function requestFingerprint(request: Request) {
  const secret = process.env.RATE_LIMIT_HMAC_SECRET;
  if (!secret || secret.length < 32) throw new RequestError(503, "Serviço temporariamente indisponível.");
  const material = `${clientIp(request)}\n${request.headers.get("user-agent") ?? "unknown"}`;
  return createHmac("sha256", secret).update(material).digest("hex");
}

export async function verifyTurnstile(token: string, request: Request) {
  if (process.env.E2E_MOCK_SUBMISSIONS === "true" && !process.env.VERCEL) return;
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || !token) throw new RequestError(400, "Confirme que você não é um robô.");
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ secret, response: token, remoteip: clientIp(request), idempotency_key: crypto.randomUUID() }),
    signal: AbortSignal.timeout(5_000),
  }).catch(() => null);
  if (!response?.ok) throw new RequestError(503, "Não foi possível validar a solicitação.");
  const result = await response.json() as { success?: boolean };
  if (!result.success) throw new RequestError(400, "Verificação inválida ou expirada.");
}

export class RequestError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

export function errorResponse(error: unknown) {
  if (error instanceof RequestError) return Response.json({ error: error.message }, { status: error.status });
  return Response.json({ error: "Não foi possível concluir. Tente novamente." }, { status: 500 });
}
