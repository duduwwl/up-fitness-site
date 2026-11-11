// Conversão de preço em reais (formato brasileiro, ex. "89,90") para centavos inteiros,
// que é a unidade usada pela API da Stone/Pagar.me.

export function brlStringToCents(price: string): number {
  const normalized = price.replace(/\s|R\$/g, "").replace(/\./g, "").replace(",", ".");
  const value = Number(normalized);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`Preço inválido: ${price}`);
  }
  return Math.round(value * 100);
}

export function centsToBrl(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
