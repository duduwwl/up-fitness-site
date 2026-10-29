# Preparação local

## Pré-requisitos

- Node 24 (validado com 24.22.1) e pnpm 12 (validado com 12.15.0).
- Para E2E: Microsoft Edge instalado (padrão no Windows). Para outro navegador, `PW_CHANNEL=chrome pnpm test:e2e` ou instale os navegadores do Playwright.
- Windows: prefira uma pasta de caminho curto (ex.: `C:\dev\up-fitness`). O sistema desta máquina está com `LongPathsEnabled=0`.

## Primeira execução

```bash
pnpm install
pnpm dev
```

Não há `.env`: o site não usa variáveis de ambiente nem credenciais.

## Banco de dados

Não há banco. Ver `docs/architecture.md`.

## Verificar

```bash
pnpm check
pnpm build && pnpm test:e2e
```

## Agentes

`CLAUDE.md` importa `AGENTS.md`. Skills do projeto em `.claude/skills/` (copiadas pela CLI `skills`; atualize com `npx skills@latest update --project --yes`).

## Problemas conhecidos

- Graphify falha em caminhos longos no Windows (`WinError 206`); rode `graphify extract . --code-only --no-cluster` depois de mover o projeto para uma pasta curta.
- O build avisa que `metadataBase` não está definido: esperado até existir domínio.
