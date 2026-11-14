# Operação, ambientes, backup e rollback

## Ambientes

Use três projetos Supabase separados:

- Development: CLI local; dados fictícios.
- Preview: projeto cloud exclusivo; nunca recebe dados reais.
- Production: projeto cloud exclusivo; recebe pedidos reais.

Na Vercel, cadastre variáveis somente no ambiente correspondente. `SUPABASE_ENVIRONMENT` deve ser `development`, `preview` ou `production` e precisa coincidir com `VERCEL_ENV`. O endpoint falha fechado quando há divergência.

Variáveis públicas: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. Variáveis server-only: `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `SUPABASE_ENVIRONMENT`, `RATE_LIMIT_HMAC_SECRET`, `TURNSTILE_SECRET_KEY`, `ALLOWED_ORIGINS`.

`TURNSTILE_OPTIONAL=true` (opcional) libera o envio do formulário quando o widget Turnstile não renderiza, mantendo rate limit, honeypot e verificação de origem. Remova para voltar a exigir o desafio.

Pagamentos online (Stone/Pagar.me) vêm como scaffold **desligado**: `PAYMENTS_ENABLED`, `STONE_API_KEY`, `STONE_PUBLIC_KEY`, `STONE_WEBHOOK_SECRET`, `STONE_API_BASE_URL`. Guia de ativação em `docs/payments-stone.md`.

## Desenvolvimento e migração

```bash
pnpm db:start
pnpm db:check
pnpm exec supabase link --project-ref <preview-ref>
pnpm exec supabase db push --dry-run
pnpm exec supabase db push
pnpm exec supabase gen types typescript --linked > src/lib/database.generated.ts
```

Nunca execute teste destrutivo contra produção. Toda mudança entra primeiro em preview. Revise o diff SQL e faça backup antes de migração destrutiva. Use expandir/migrar/contrair em versões separadas.

## Backup e recuperação

1. Confirme no Dashboard qual retenção e Point-in-Time Recovery o plano contratado oferece.
2. Antes de release de banco, gere dump lógico criptografado e restrito: `supabase db dump --linked -f backup.sql`.
3. Guarde o dump fora do repositório. Nunca o envie a logs ou chat.
4. Restaure trimestralmente em projeto descartável e rode `pnpm db:test`.
5. Registre RPO/RTO acordados com a academia. Sem plano confirmado, eles permanecem pendentes.
6. Pedidos expirados são removidos oportunisticamente pelo backend. Agende `select public.purge_expired_membership_requests();` diariamente no Supabase Cron quando o projeto existir.

Backups podem conservar dados excluídos até expirar a retenção do provedor. A política de privacidade deve informar esse prazo real.

## Rollback

Aplicação:

1. Promova o último deployment Vercel saudável.
2. Confirme que a versão antiga entende o schema atual.
3. Rode smoke test em `/`, `/contratacao/` e `/privacidade/`.

Banco:

1. Não reverta automaticamente migração com dados.
2. Desative novos envios, exporte os registros e confirme restauração.
3. Execute `supabase/rollback/202611080001_membership_requests.sql` somente se a funcionalidade for removida e os dados forem preservados ou expirados.
4. Se houver corrupção, restaure em projeto novo e troque as variáveis após validar.

## Rotação

- `SUPABASE_SECRET_KEY`: crie nova chave, atualize Vercel, faça deploy, revogue a anterior.
- `RATE_LIMIT_HMAC_SECRET`: rotacionar reinicia as identidades de rate limit; faça em janela controlada.
- `TURNSTILE_SECRET_KEY`: rotacione no Cloudflare, atualize Vercel e teste antes de revogar.
- Qualquer segredo publicado deve ser tratado como comprometido antes de limpar o histórico.

## Release Vercel

```bash
pnpm check
pnpm audit --prod --audit-level high
pnpm test:e2e
vercel deploy
vercel logs --deployment <preview-id> --query "level:error"
vercel deploy --prod
vercel logs --environment production --query "level:error" --since 5m
```

Confirme manualmente Turnstile, persistência, exportação, exclusão, RLS e que preview não aponta para produção. Não configure domínio pago.
