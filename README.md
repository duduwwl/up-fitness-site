# UP Fitness Zona Sul — site

Site institucional da academia UP Fitness Zona Sul (Lavras/MG): estrutura, planos, horários com status "aberta agora", endereço, dúvidas e contato pelo WhatsApp.

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

## Próxima entrega

Trocar as imagens ilustrativas por fotos autorizadas da unidade e o logo oficial em vetor.

## Publicação
GitHub Pages: https://duduwwl.github.io/up-fitness-site/
Build estático em out/; basePath /up-fitness-site. Atualizações na main publicam automaticamente.

