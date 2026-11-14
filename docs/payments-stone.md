# Pagamentos online com a Stone (Pagar.me) — guia de ativação

Este projeto já tem a **estrutura** da integração de pagamentos pronta, mas ela vem
**desligada**. Nenhuma cobrança real acontece até você configurar as chaves e ligar o
interruptor. O checkout do site continua em modo demonstração enquanto isso.

A Stone processa pagamentos online pela plataforma **Pagar.me** (que pertence à Stone),
usando a **Core API v5** (`https://api.pagar.me/core/v5`). O scaffold cobre **Pix** e
**cartão de crédito**.

## O que já está pronto

- **Banco** (`supabase/migrations/202611100001_payments.sql`): tabelas `payments` e
  `payment_events`, com RLS forçada (só o backend escreve) e idempotência de webhook.
- **Camada de pagamento** (`src/lib/payments/`): uma abstração neutra (`PaymentProvider`)
  e o adapter da Stone/Pagar.me (`stone.ts`). Trocar de provedor no futuro é só escrever
  outro adapter.
- **Rotas de API** (desligadas por padrão):
  - `POST /api/payments/create` — cria a cobrança de um pedido de matrícula.
  - `POST /api/payments/stone/webhook` — recebe as notificações de status da Stone.
- **Variáveis de ambiente**: ver `.env.example` (bloco "Pagamentos online — Stone").

## Como o fluxo funciona

1. O cliente escolhe o plano e preenche os dados (já existe) → cria um `membership_request`.
2. O site chama `POST /api/payments/create` com o `membershipRequestId` e o método.
   O **valor é calculado no servidor** a partir do plano (nunca vem do navegador).
3. O backend chama a Stone, grava a cobrança em `payments` e devolve o Pix (QR code +
   copia-e-cola) ou o status do cartão.
4. Quando o pagamento muda de status, a Stone chama o **webhook**, que valida a
   assinatura e atualiza a linha em `payments`.

## Passo a passo para ativar

1. **Conta e chaves.** Crie/entre na conta Stone/Pagar.me e pegue, no painel:
   - a **chave secreta** (`sk_...`) → `STONE_API_KEY`
   - a **chave pública** (`pk_...`) → `STONE_PUBLIC_KEY` (usada para tokenizar o cartão
     no navegador, sem o número do cartão passar pelo nosso servidor).
2. **Banco.** Aplique a migration no projeto Supabase de produção
   (`supabase db push`, ou cole o SQL no SQL Editor).
3. **Webhook.** No painel da Stone/Pagar.me, cadastre a URL
   `https://up-fitness-site.vercel.app/api/payments/stone/webhook` e um **segredo de
   assinatura** → `STONE_WEBHOOK_SECRET`. O código valida HMAC-SHA256 do corpo cru contra
   o header `x-hub-signature`. Confirme no painel qual é o mecanismo exato de assinatura
   (alguns painéis usam Basic Auth na URL); ajuste `parseWebhook` em `stone.ts` se preciso.
4. **Variáveis na Vercel** (escopo Production): defina `PAYMENTS_ENABLED=true`,
   `STONE_API_KEY`, `STONE_PUBLIC_KEY`, `STONE_WEBHOOK_SECRET`. Redeploy.
5. **Ligar o checkout.** O checkout (`src/components/checkout.tsx`) hoje mostra um Pix
   ilustrativo. Para cobrar de verdade, troque o passo de pagamento por:
   chamar `POST /api/payments/create` e, no Pix, mostrar o QR code retornado; no cartão,
   tokenizar com a chave pública antes de enviar o `cardToken`.
6. **Testes.** Use as chaves de **sandbox/teste** da Stone e os cartões de teste do
   Pagar.me antes de ir para produção.

## Checklist antes de cobrar de verdade

- [ ] CPF do cliente coletado (a maioria das contas exige `customer.document`).
- [ ] Antifraude e política de parcelamento revisados no painel.
- [ ] Webhook testado (um pagamento sandbox deve virar `paid` em `payments`).
- [ ] Termos, reembolso e nota fiscal definidos (fora do escopo do código).
- [ ] `PAYMENTS_ENABLED` só em produção, com as chaves de produção.

## Segurança

- Chaves são **server-only** (nunca no bundle do navegador). O número do cartão nunca
  toca nosso servidor — ele é tokenizado no cliente com a chave pública.
- O webhook verifica a assinatura sobre o **corpo cru** antes de confiar no conteúdo, e é
  idempotente (o mesmo `event_id` não é processado duas vezes).
- As tabelas têm RLS forçada: só o `service_role` (backend) lê e escreve.
