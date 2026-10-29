# Código e arquitetura

## Stack real

- Next.js 16.4.3 (App Router, Turbopack), React 19.3, TypeScript 5.9 strict.
- Estilo: Tailwind 4 só no CSS global (`src/app/globals.css`, tokens e utilitários próprios) e CSS Modules por componente.
- Animação: `motion` 14.8 (`LazyMotion` + `domAnimation`), com `Reveal` adaptado do "In View" da motion-primitives (MIT).
- Fontes: `next/font/google` — Barlow Condensed 800 (títulos) e Barlow 400/600 (texto).
- Testes: Vitest 5 (unitário, Node) e Playwright 1.64 + axe-core (E2E).
- Gerenciador: pnpm 12 com `nodeLinker: hoisted` (`pnpm-workspace.yaml`) para encurtar caminhos no Windows.

## Mapa do código

```
src/
├── app/
│   ├── layout.tsx            fontes, metadados, skip link, MotionRoot
│   ├── page.tsx              ordem das seções + JSON-LD (só dados confirmados)
│   ├── globals.css           tokens, tipografia, botões, motivo da seta
│   ├── icon.svg              favicon
│   └── opengraph-image.tsx   imagem de compartilhamento (gerada no build)
├── components/               uma seção por arquivo + .module.css
│   ├── header.tsx            client: menu mobile (Escape, foco, aria-expanded)
│   ├── hero.tsx              pilha de pastas com abas em seta
│   ├── open-status.tsx       client: "aberta agora" no fuso de São Paulo
│   ├── structure.tsx, plans.tsx, band.tsx, unit.tsx, faq.tsx
│   ├── contact.tsx           client: formulário que abre o WhatsApp
│   ├── footer.tsx, icons.tsx, reveal.tsx
├── content/site.ts           ÚNICA fonte de dados comerciais + pendências
└── lib/
    ├── hours.ts              cálculo de aberto/fechado (testado)
    ├── contact-message.ts    validação e texto do WhatsApp (testado)
    ├── links.ts, nav.ts
e2e/site.spec.ts              fluxos no navegador
public/images/                fotos com licença aberta + credits.json
eslint-rules/, scripts/       regras de qualidade do toolkit e autoteste
```

## Fronteiras e fluxo

- Tudo é estático (`○ /` no build). Não há rotas de API, server actions nem variáveis de ambiente.
- Componentes de servidor por padrão; client só onde há estado: menu, status ao vivo, formulário, animações.
- Dados de fora do site: nenhum em tempo de execução. Links externos levam a `wa.me`, Google Maps, Instagram e à página de vendas (Actuar).

## Dados e migrações

Sem persistência. O núcleo padrão do toolkit (Drizzle + PostgreSQL, `pg`, Pino, `server-only`, Zod) foi omitido porque o produto não grava nem recebe dados. Se um dia houver formulário com backend, reavaliar Zod + `server-only` + serviço de envio.

## Decisões

| Data | Decisão | Motivo |
|---|---|---|
| 2026-10-29 | Sem banco/logger/Zod | Site sem dados próprios; validação simples em `contact-message.ts` |
| 2026-10-29 | `nodeLinker: hoisted` | Windows sem `LongPathsEnabled`; caminhos do store do pnpm passavam de 260 caracteres |
| 2026-10-29 | Regra do Turbopack restrita a CSS global | O scaffold aplicava `@tailwindcss/turbopack` com `as: "*.css"` também em `*.module.css`, quebrando os CSS Modules |
| 2026-10-29 | Fontes reduzidas a 3 arquivos | LCP mobile caiu de 3,1 s para 2,2–2,3 s (Lighthouse, laboratório) |
| 2026-10-29 | `motion` em vez de CSS puro | Biblioteca pedida para pesquisa; usada só para entradas e o menu, com `reducedMotion="user"` e `<noscript>` de segurança |
| 2026-10-29 | Canvas UI, Spell UI e Watermelon não usados | Efeitos experimentais/decorativos (WebGL atrás de flag, vidro, partículas, raios) contrariam o briefing; sem necessidade de blocos prontos |

## Manutenção

Mudou estrutura, dependência ou fronteira? Atualize este arquivo na mesma alteração.
