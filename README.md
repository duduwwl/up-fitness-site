# UP Fitness Zona Sul — site

Site institucional da academia UP Fitness Zona Sul (Lavras/MG), com pedido demonstrativo de matrícula persistido no Supabase e execução server-side na Vercel.

## Rodar

Requer Node 24 e pnpm 12.

```bash
pnpm install
pnpm dev
```

Abra http://localhost:3000.

Versão de produção:

```bash
pnpm build
pnpm start
```

Verificação completa (lint, tipos, testes unitários e build):

```bash
pnpm check
```

Banco local (requer Docker):

```bash
pnpm db:start
pnpm db:check
```

Testes E2E no Microsoft Edge instalado (rode `pnpm build` antes):

```bash
pnpm test:e2e
```

## Onde mudar o conteúdo

Todos os dados comerciais (preços, horários, endereço, contatos, fotos e créditos) estão em `src/content/site.ts`. As informações ainda não confirmadas ficam na lista `pending` desse arquivo e não aparecem no site.

## Documentação

- [PRODUCT.md](PRODUCT.md): escopo, público, pendências e aceite.
- [AGENTS.md](AGENTS.md): comandos e acordos para agentes.
- [docs/architecture.md](docs/architecture.md): estrutura e decisões.
- [docs/design.md](docs/design.md): direção visual e acessibilidade.
- [docs/onboarding.md](docs/onboarding.md): preparação local.
- [docs/quality.md](docs/quality.md): verificações e medições.
- [docs/setup.md](docs/setup.md): versões, fontes e evidências do setup.
- [docs/data-security.md](docs/data-security.md): dados, RLS, papéis, STRIDE, LGPD e OWASP.
- [docs/operations.md](docs/operations.md): ambientes, backup, migração, rotação e rollback.

## Publicação

O runtime alvo é Vercel porque os endpoints protegidos não funcionam em exportação estática. O deployment antigo do GitHub Pages permanece apenas como versão legada até a URL Vercel ser validada.

