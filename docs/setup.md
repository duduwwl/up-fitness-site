# Setup e evidências

Data: 2026-10-29. Estados: **validado**, **configurado sem execução**, **pendente**.

## Origem

- Vibe Coding Toolkit, revisão `790a895304e0c08b70a5b215c9d334f1c86b816c`, receita `docs/prompts/11-next-project-bootstrap.md` (cópia temporária fora do projeto; nada do toolkit foi copiado além de `eslint-rules/`, `scripts/verify-quality-rules.mjs`, `.graphifyignore` e o perfil ESLint leve + tipado).
- Fontes técnicas: documentação embarcada em `node_modules/next/dist/docs/` (upgrade v16, `next/image`, Turbopack `rules.condition`), registro npm (`next` latest 16.4.3), repositórios oficiais das bibliotecas pesquisadas.
- Fontes de conteúdo: Instagram @upfitness_lavras e @upfitnessacademias (bio, destaques "Horários" e "Área kids", posts de jul–nov/2025), upfitness.actuar.com (planos, endereço, telefone), ficha TotalPass da unidade (horários, comodidades, CEP).

## Versões

Node 24.22.1 · pnpm 12.15.0 (`packageManager`) · Next 16.4.3 · React 19.3.0 · TypeScript 5.9.3 · Tailwind 4.3.3 · motion 14.8.0 · ESLint 9.39.5 · typescript-eslint 8.72.1 · Vitest 5.0.5 · Playwright 1.64.1 · @axe-core/playwright 4.14.0 · @types/node 24.19.2.

## Diferenças em relação ao padrão do toolkit

| Padrão | Aqui | Motivo |
|---|---|---|
| Drizzle + PostgreSQL, `pg`, Pino, `server-only`, Zod, `clsx`/`tailwind-merge` | omitidos | site sem persistência nem servidor; perfil ESLint leve (sem guardas de logger/dados) |
| `create-next-app` com `--use-pnpm` | igual + `--skip-install`, depois `nodeLinker: hoisted` | Windows com `LongPathsEnabled=0`; a pasta da sessão tem caminho longo |
| Regra `*.css` do scaffold | limitada a CSS global | o scaffold processava `*.module.css` como CSS global |
| Playwright Chromium | `channel: msedge` | Chromium 1248 exigido não estava baixado; Edge instalado evita download global |

## Componentes

| Componente | Estado | Evidência |
|---|---|---|
| Next.js scaffold (App Router, TS, Tailwind, ESLint, `src/`, `@/*`, `AGENTS.md`) | validado | build estático `○ /` |
| Scripts `lint`, `lint:typed`, `lint:rules`, `typecheck`, `test`, `test:watch`, `test:e2e`, `build`, `check` | validado | `pnpm check` aprovado; `lint:typed` ~9 s |
| Skills Vercel (`vercel-react-best-practices`, `vercel-composition-patterns`, `web-design-guidelines`, `writing-guidelines`, `vercel-react-view-transitions`, `vercel-optimize`, `deploy-to-vercel`, `vercel-cli-with-tokens`) + `find-skills` | instaladas em `.claude/skills/` (`--copy`, `--agent claude-code`), `skills-lock.json` | `vercel-react-native-skills` não instalada (não é app mobile). Descoberta numa sessão nova: pendente |
| Sobreposição global × local | anotada | `web-design-guidelines`, `vercel-react-best-practices` e `find-skills` também existem no escopo do usuário; mantidas (removê-las afetaria outros projetos) |
| next-dev-loop / next-bundle-optimizer | não instalados | não fazem parte do catálogo atual consultado; build e Lighthouse cobriram desempenho |
| supabase-postgres-best-practices | não se aplica | sem PostgreSQL |
| gh-fix-ci | não se aplica | sem repositório/GitHub Actions |
| differential-review | não se aplica agora | sem mudanças sensíveis; usar o prompt de segurança (`docs/quality.md`) |
| shadcn | não se aplica | UI própria, sem kit |
| Sentry MCP | não se aplica | nenhum serviço escolhido |
| Harness2 | adaptação nativa | caso de descoberta executado (abaixo) |
| Ponytail full, Caveman, Superpowers | validado (plugins ativos nesta sessão via hooks) | — |
| RTK | validado | hook nativo ativo (`rtk` em `~/AppData/Local/Microsoft/WinGet/...`) |
| Context7 | pendente | MCP do plugin exige autorização (`/mcp`); consulta real não executada. Usadas a doc embarcada do Next e fontes oficiais |
| Graphify 0.9.97 | pendente | `graphify extract . --code-only --no-cluster` falhou com `WinError 206` (caminho longo do cache). Rodar após mover o projeto para pasta curta |

## Verificações

- `pnpm check`: aprovado.
- `pnpm test:e2e` (Edge): 18/18, três execuções seguidas (uma execução anterior com 5 tempos esgotados logo após o build; ver `docs/quality.md`).
- `pnpm audit --prod` e `pnpm audit`: "No known vulnerabilities found".
- Lighthouse 12 mobile: LCP 2,2–2,3 s, CLS 0, TBT 30–40 ms; desktop LCP 0,7 s. Laboratório, não usuários reais.
- Aplicação servida em porta livre (3107/3108) com `pnpm start` e inspecionada no navegador do app; servidores encerrados ao final.

## Memória e instruções

- Carregamento: `CLAUDE.md` → `@AGENTS.md` (índice para `PRODUCT.md`, `docs/*`, `src/content/site.ts`). Memória nativa do Claude Code por projeto; nada de memória externa.
- Proveniência: cada fato comercial tem fonte comentada em `src/content/site.ts` e data em `checkedAt`. Invalidar quando a academia mudar preço/horário ou ao trocar o domínio.
- Recuperação em contexto limpo (subagente novo, mesma sessão e modelo leve): respondeu corretamente comando de verificação (`pnpm check`), fonte dos fatos (`src/content/site.ts`) e regra de pendências (`pending`, não renderizar). Não prova o comportamento após reiniciar o cliente.

## Fora do escopo deste setup

Sem publicação, push, deploy, compra de serviço, hooks de Git ou proteções de branch.

## GitHub Pages
Exportação estática com basePath /up-fitness-site e imagens sem otimizador de servidor. O workflow pages.yml valida e publica out/.


Hero: public/images/up-fitness-hero-ai.png, gerado pela ferramenta nativa Imagegen com referência fornecida pelo usuário. Prompt: fotografia editorial panorâmica de academia brasileira, equipamentos pretos com detalhes amarelos #ffcb05, luz natural, pessoas treinando, identidade UP Fitness, sem alegar retratar a unidade real. Manter aviso de ilustração.


Fotos: versões WebP derivadas dos arquivos originais, qualidade 90 e nitidez leve, máximo de 1920 px no lado maior e sem aumento artificial de resolução. Originais e créditos preservados. FlameWrap e shaders foram fornecidos pelo usuário; mantidos sem reescrever o algoritmo experimental.


