import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.generated";
import { RequestError } from "./server-security";

export function createAdminClient() {
  const url = process.env.SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  const configuredEnvironment = process.env.SUPABASE_ENVIRONMENT;
  const runtimeEnvironment = process.env.VERCEL_ENV ?? "development";
  if (!url || !secret || configuredEnvironment !== runtimeEnvironment) {
    throw new RequestError(503, "Serviço temporariamente indisponível.");
  }
  return createClient<Database>(url, secret, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(5_000) }) },
  });
}
