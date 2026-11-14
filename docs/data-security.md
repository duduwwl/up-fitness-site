# Dados, permissões e segurança

## Escopo real

O banco persiste somente pedidos demonstrativos de matrícula. Conteúdo institucional e planos continuam versionados em `src/content/site.ts`. O formulário de contato continua abrindo o WhatsApp e não é persistido. Supabase Auth não é necessário porque o produto não oferece contas. Supabase Storage não é necessário porque não existem uploads.

## Diagrama

```text
Navegador
  ├─ conteúdo público ───────────────> Next.js/Vercel
  └─ pedido + Turnstile ─────────────> POST /api/membership-requests
                                          │ validação + rate limit
                                          ├─ valida token ─────> Cloudflare Turnstile
                                          └─ secret key ──────> Supabase/Postgres
                                                                 ├─ public.membership_requests
                                                                 └─ private.request_rate_limits
```

Não há acesso do navegador à Data API do Supabase. A `SUPABASE_SECRET_KEY` existe somente no runtime Vercel.

## Tabelas

| Tabela | Finalidade | Retenção |
|---|---|---|
| `public.membership_requests` | Registrar interesse real em um plano, sem efetuar cobrança | 180 dias ou exclusão pelo titular |
| `private.request_rate_limits` | Limitar abuso por impressão HMAC de IP e User-Agent | Limpeza oportunista após 24 horas |

Não existem tabelas de cartão, pagamento, senha, usuário, sessão, arquivo, instrutor ou agenda.

## Classificação de campos

| Campo | Classe | Finalidade | Acesso | Exclusão |
|---|---|---|---|---|
| `id`, `plan_slug`, `payment_method`, `status`, timestamps | Interno | Processar e acompanhar o pedido | Backend e equipe autorizada | Com o pedido |
| `full_name`, `email`, `phone` | Pessoal | Contatar o interessado | Backend e equipe autorizada | Em até 180 dias ou imediatamente pelo titular |
| `consent_version`, `consented_at` | Pessoal/compliance | Provar finalidade aceita | Backend e equipe autorizada | Com o pedido |
| `management_token_hash` | Sensível derivado | Autorizar exportação/exclusão sem conta | Backend; texto original nunca é armazenado | Com o pedido |
| `fingerprint` | Pseudônimo | Rate limiting | Backend | Após 24 horas quando houver nova operação |

O código de gestão aparece uma vez ao titular. O banco guarda somente SHA-256. IP bruto, User-Agent bruto, CPF e dados de cartão não são armazenados.

## Papéis e permissões

| Papel | Ler pedidos | Criar | Alterar | Excluir | Administrar banco |
|---|---:|---:|---:|---:|---:|
| Visitante `anon` | Não | Não | Não | Não | Não |
| Cliente `authenticated` | Não | Não | Não | Não | Não |
| Backend Vercel `service_role`/secret | Sim | Sim | Sim | Sim | Somente operações programadas |
| Funcionário | Somente pelo Dashboard Supabase autorizado | Não pela Data API pública | Conforme função no Dashboard | Conforme função no Dashboard | Não |
| Administrador do projeto | Sim | Sim | Sim | Sim | Sim, com MFA e auditoria do provedor |

RLS está ativa e forçada em `membership_requests`. Não há policy para `anon` ou `authenticated`: a negação é padrão. A função de rate limit usa `SECURITY DEFINER`, `search_path` vazio, parâmetros e `EXECUTE` exclusivo de `service_role`.

## STRIDE

| Ameaça | Abuso | Controle | Aceite | Risco residual |
|---|---|---|---|---|
| Spoofing | Terceiro envia pedido com contato alheio | Turnstile, rate limit, consentimento, código aleatório de gestão | Bot sem token recebe 400; sexta tentativa recebe 429 | Não há confirmação de e-mail/telefone nesta demonstração |
| Tampering | Alterar plano, status ou ID | Zod estrito, checks SQL, queries parametrizadas, RLS | Slug fora da allowlist e campos extras recebem 422 | Operador privilegiado ainda pode alterar pelo Dashboard |
| Repudiation | Negar consentimento | Versão e timestamp do consentimento | Registro contém versão imutável na criação | Sem assinatura digital do titular |
| Information disclosure | Ler pedidos de terceiros ou vazar chave | Sem cliente Supabase no browser, RLS default-deny, código de gestão com 256 bits, erros genéricos | `anon`/`authenticated` não leem; segredo ausente do bundle | Dashboard e backups dependem das práticas dos provedores |
| Denial of service | Flood no formulário ou Turnstile/Supabase lento | 16 KiB, timeout de 5 s, rate limit durável, Turnstile | Corpo grande recebe 413; falha externa fecha o fluxo | Ataque distribuído pode consumir cota do provedor |
| Elevation of privilege | Forjar papel ou chamar função privilegiada | Sem papel vindo do cliente; secret server-only; grants mínimos | Funções não executam para `anon`/`authenticated` | Comprometimento do runtime Vercel expõe privilégio de backend |

## OWASP Top 10 — revisão

- A01 Broken Access Control: RLS default-deny, sem acesso direto do browser, credencial de gestão de 256 bits.
- A02 Cryptographic Failures: TLS dos provedores; segredo em variáveis; HMAC para impressão; hash do código. Dados em repouso dependem do Supabase.
- A03 Injection: Zod estrito, Supabase parametrizado e constraints SQL. Nenhum SQL dinâmico.
- A04 Insecure Design: threat model acima; não coleta cartão, CPF, senha ou arquivos.
- A05 Security Misconfiguration: CSP, HSTS em produção, `nosniff`, `DENY`, Permissions Policy, preview `noindex`.
- A06 Vulnerable Components: `pnpm audit` integra o gate de release; lockfile é versionado.
- A07 Identification and Authentication Failures: não há contas. Operadores usam Supabase/Vercel com MFA obrigatório por processo.
- A08 Software and Data Integrity Failures: lockfile congelado em CI; migrações versionadas; dependências novas limitadas ao cliente oficial e Zod.
- A09 Logging and Monitoring Failures: o app não registra PII. Logs de funções e banco devem alertar em 429/5xx sem payload.
- A10 SSRF: nenhuma URL fornecida pelo usuário é buscada. Turnstile usa endpoint constante e timeout.

## Critérios de aceite

1. Migração recria o schema em banco vazio.
2. Testes pgTAP comprovam grants, RLS, constraints, rate limit e retenção.
3. Testes unitários rejeitam campos extras, slugs de injeção e consentimento ausente.
4. E2E prova os dois métodos demonstrativos, responsividade, WCAG, CSP e origem hostil.
5. Bundle e histórico não contêm chaves reais.
6. Preview e produção usam projetos Supabase distintos e `SUPABASE_ENVIRONMENT` correspondente.
7. Nenhum deploy ocorre com falha crítica/alta alcançável.

## Fontes oficiais

- Supabase API keys e chave secreta server-only: https://supabase.com/docs/guides/api/api-keys
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase CLI e migrações: https://supabase.com/docs/guides/local-development/cli/getting-started
- Supabase testes de banco: https://supabase.com/docs/guides/local-development/testing/overview
- Vercel ambientes: https://vercel.com/docs/environment-variables/manage-across-environments
- Vercel deploy por CLI: https://vercel.com/docs/projects/deploy-from-cli
- Turnstile validação server-side: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- OWASP Top 10: https://owasp.org/www-project-top-ten/

## Riscos residuais

- A academia precisa proteger contas Supabase/Vercel com MFA e menor privilégio.
- A disponibilidade depende de Vercel, Supabase e Cloudflare.
- O projeto contratado do Supabase pode ter política de backup diferente. Confirme antes de produção.
- A CSP usa `unsafe-inline` para compatibilidade com Next.js. Migrar para nonce reduz risco de script injetado.
- Não há verificação de posse do e-mail/telefone. O código de gestão protege exportação/exclusão, não a identidade informada.
