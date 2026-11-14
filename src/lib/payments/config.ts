import "server-only";

// Configuração do provedor Stone (plataforma Pagar.me). Tudo é lido de variáveis de
// ambiente server-only; nada é embutido no bundle do navegador. Enquanto não houver
// chave, readStoneConfig() devolve null e o scaffold permanece inerte.

export interface StoneConfig {
  apiKey: string;
  publicKey: string;
  webhookSecret: string;
  apiBaseUrl: string;
}

/** Interruptor geral: só quando "true" as rotas de pagamento saem do modo inerte. */
export function paymentsEnabled(): boolean {
  return process.env.PAYMENTS_ENABLED === "true";
}

export function readStoneConfig(): StoneConfig | null {
  const apiKey = process.env.STONE_API_KEY;
  if (!apiKey) return null;
  return {
    apiKey,
    publicKey: process.env.STONE_PUBLIC_KEY ?? "",
    webhookSecret: process.env.STONE_WEBHOOK_SECRET ?? "",
    apiBaseUrl: process.env.STONE_API_BASE_URL ?? "https://api.pagar.me/core/v5",
  };
}
