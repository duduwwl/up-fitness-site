<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# UP Fitness Zona Sul — site

## Product and stack

One-page marketing site for a gym in Lavras/MG. Next.js 16.4 (App Router, Turbopack), React 19.3, TypeScript strict, Tailwind 4 (global CSS only) + CSS Modules, `motion` 14 for entrances. No database, no auth, no server actions. Scope and pending decisions: `PRODUCT.md`.

## Canonical commands

- `pnpm dev` — dev server
- `pnpm build` / `pnpm start` — production
- `pnpm check` — lint, typecheck (`next typegen && tsc`), typed lint, lint-rule self-check, Vitest, build
- `pnpm test` — unit tests (`src/**/*.test.ts`)
- `pnpm test:e2e` — Playwright on installed Edge (`channel: msedge`); build first

## Working agreements

- Every business fact comes from `src/content/site.ts`, with its source in a comment. Never invent prices, hours, phones, reviews or student counts. Unconfirmed items go in `pending` and are not rendered.
- Images that are not the unit's own must say so in the caption and be credited (`photos` in `site.ts`, footer credits).
- The contact form only opens WhatsApp with a composed message; never fake a "message received".
- Keep components under 350 lines (lint rule). Logger/DB rules from the toolkit are not active (no server code).

## Standards and documentation

When behaviour, commands or content sources change, update the owning doc in the same change: `PRODUCT.md`, `docs/architecture.md`, `docs/design.md`, `docs/quality.md`, `docs/setup.md`.

## Tools and style

- **Ponytail:** `full` for coding. `stop ponytail` disables it.
- **Caveman:** concise conversation in the user's language (Portuguese); normal wording in code, docs and commits. `stop caveman` disables it.
- **Superpowers:** use relevant skills, scale the process to the scope.
- **Context7:** current docs for libraries; never send secrets. Currently needs authorization via `/mcp` in this client; fallback is `node_modules/next/dist/docs/` and official sites.
- **RTK:** active native hook on this machine; do not double-wrap commands.
- **Graphify:** `graphify-out/` (code-only graph) for structural questions; regenerate with `graphify extract . --code-only --no-cluster`.
- **LLMs:** keep the session's client, model and auth; subagents use the session model unless a policy says otherwise.

## Skills for Next.js

Project skills in `.claude/skills/` (copied, locked in `skills-lock.json`): `vercel-react-best-practices`, `vercel-composition-patterns`, `web-design-guidelines`, `writing-guidelines`, `vercel-react-view-transitions`, `vercel-optimize`, `deploy-to-vercel`, `vercel-cli-with-tokens`, `find-skills`. Deployment skills are for explicit requests only.

## Project capabilities

- No PostgreSQL → no Postgres skill. No shadcn. No Sentry. CI repair not configured (no repository yet).
- Security review: see `docs/quality.md`.

## Git and collaboration

No Git hooks, branch rules or protections. Do not publish, push or deploy without an explicit request.

## Delegation and review

Independent review via a subagent is welcome for UI and a11y changes; verify its findings before acting.

## Conventions and context

- Copy in pt-BR, direct and commercial; no guaranteed physical results.
- Design rules (one motif: the UP arrow; no gradients, glass, eyebrows, icon cards): `docs/design.md`.
- Memory: Claude native project memory plus this file as the index into canonical docs.
