# UP Fitness Site Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the UP Fitness landing page, internal demonstrative checkout, imagery, interactions, responsiveness, and publication without replacing the approved hero video.

**Architecture:** Preserve the existing static-exported Next.js site and content source. Add isolated client components only for the opening and checkout interactions; keep presentation in existing section components and CSS Modules. Use official local media, static Google Maps embedding, session-only browser state, and no backend.

**Tech Stack:** Next.js 16 static export, React 19, TypeScript, CSS Modules, Motion 14, Vitest, Playwright, Axe.

**Spec:** `docs/superpowers/specs/2026-11-06-site-completion-design.md`

## Global Constraints

- Preserve the current responsive muted hero video and its controls.
- Add no dependency and no external UI kit.
- Use only confirmed facts and official UP Fitness imagery.
- Never collect, retain, transmit, or imply processing of real payment credentials.
- Keep GitHub Pages static export under `/up-fitness-site`.
- Respect `prefers-reduced-motion` and WCAG 2.2 AA.

## Review Focus

- A first visit shows the opening, while same-session and reduced-motion visits never flash it.
- A plan query with an invalid or missing slug falls back safely without crashing or presenting the wrong price.
- Checkout rejects invalid personal fields, never renders real card inputs, and labels Pix as non-payable.
- Icon-only navigation remains understandable and operable by keyboard and screen reader.
- Maps, optimized images, and both exported routes load without broken requests at every tested width.

---

### Task 1: Official media set and brand assets

**Files:**
- Modify: `public/images/*`
- Modify: `src/content/site.ts`
- Test: `e2e/site.spec.ts`

**Interfaces:**
- Consumes: official `@upfitness_lavras` sources recorded in `src/content/site.ts`.
- Produces: final `photos` entries with local `src`, intrinsic `width`, `height`, accurate `alt`, and source metadata.

- [ ] **Step 1: Add a failing media integrity test**

Assert every rendered image completes with non-zero natural dimensions, every official photo URL resolves locally, and visible section images contain no unrelated landmark captions.

- [ ] **Step 2: Run the focused media test**

Run: `pnpm exec playwright test e2e/site.spec.ts --grep "official media"`

Expected: FAIL on the current weak/obsolete media composition.

- [ ] **Step 3: Inspect and prepare official assets**

Select the strongest relevant official academy, equipment, team, training, facade, and logo images. Export optimized WebP files at sufficient dimensions, preserving aspect ratio and factual content. Remove obsolete local images only after all callers move.

- [ ] **Step 4: Update the content source**

Update `photos` and logo metadata in `src/content/site.ts`; keep credits and source URLs in code while removing redundant visible captions.

- [ ] **Step 5: Run the media test**

Expected: PASS with no broken, stretched, unrelated, or undersized rendered asset.

### Task 2: Brand opening and distinctive navbar

**Files:**
- Create: `src/components/brand-opening.tsx`
- Create: `src/components/brand-opening.module.css`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/header.tsx`
- Modify: `src/components/header.module.css`
- Modify: `src/components/icons.tsx`
- Test: `e2e/site.spec.ts`

**Interfaces:**
- Consumes: `sessionStorage` key `up-fitness-opening`, `contact.instagramUnit`, and `whatsappUrl(visitMessage)`.
- Produces: `BrandOpening(): JSX.Element`, `WhatsAppIcon(): JSX.Element`, and `InstagramIcon(): JSX.Element`.

- [ ] **Step 1: Write failing behavior tests**

Assert `#brand-opening` appears only on first normal-motion visit, exits by `1250ms`, dismisses by click or key, does not flash during same-session reload, and does not appear under reduced motion. Assert header icon links have accessible names, safe external-link attributes, visible focus, and no arrow SVG.

- [ ] **Step 2: Run the focused tests**

Run: `pnpm exec playwright test e2e/site.spec.ts --grep "brand opening|social navigation"`

Expected: FAIL because opening and Instagram control do not exist.

- [ ] **Step 3: Implement the opening**

Create `BrandOpening` with pre-hydration suppression, `40ms` letter staggering, horizontal highlight, `1250ms` timeout, click/keydown cleanup, scroll lock, and reduced-motion bypass. Mount it as the first body child.

- [ ] **Step 4: Replace navbar CTA**

Add simple inline WhatsApp and Instagram SVG components. Replace desktop and mobile written CTA/arrow combinations with accessible icon controls while preserving existing mobile menu behavior.

- [ ] **Step 5: Run focused tests**

Expected: all opening and social navigation tests PASS.

### Task 3: Recompose Structure, Unit, FAQ, and Footer

**Files:**
- Modify: `src/components/structure.tsx`
- Modify: `src/components/structure.module.css`
- Modify: `src/components/unit.tsx`
- Modify: `src/components/unit.module.css`
- Modify: `src/components/faq.tsx`
- Modify: `src/components/faq.module.css`
- Modify: `src/components/footer.tsx`
- Modify: `src/components/footer.module.css`
- Modify: `src/components/icons.tsx`
- Test: `e2e/site.spec.ts`

**Interfaces:**
- Consumes: final Task 1 photo entries, `amenities`, `hours`, `mapsUrl`, and official logo asset.
- Produces: academy-specific editorial sections and an accessible embedded map with fallback link.

- [ ] **Step 1: Write failing section tests**

Assert Structure uses relevant official media without visible captions or arrow frames; Unit contains a titled Google Maps iframe and no photo collage; FAQ uses the designated high-resolution official image; requested action links contain no arrow icon; Footer renders the full logo cleanly.

- [ ] **Step 2: Run the focused tests**

Run: `pnpm exec playwright test e2e/site.spec.ts --grep "academy sections"`

Expected: FAIL on current collage, captions, arrows, and missing map.

- [ ] **Step 3: Recompose Structure**

Use one strong primary image and one restrained supporting image, remove arrow frames and visible captions, tighten confirmed amenity copy, and convert the amenity list into a balanced responsive grid.

- [ ] **Step 4: Replace Unit photos with Google Maps**

Embed the confirmed address through a lazy-loaded Google Maps iframe with descriptive title, rounded responsive frame, and existing direct map fallback. Keep hours and contact actions; remove arrow icons.

- [ ] **Step 5: Refine FAQ and Footer**

Replace FAQ media with the selected high-quality official image, preserve accordion behavior, remove visible redundant caption, and cleanly render the complete official logo in the footer.

- [ ] **Step 6: Run focused tests**

Expected: all academy section tests PASS.

### Task 4: Plan cards and internal checkout

**Files:**
- Create: `src/lib/plans.ts`
- Create: `src/app/contratacao/page.tsx`
- Create: `src/components/checkout.tsx`
- Create: `src/components/checkout.module.css`
- Modify: `src/components/plans.tsx`
- Modify: `src/components/plans.module.css`
- Modify: `src/content/site.ts`
- Test: `src/lib/plans.test.ts`
- Test: `e2e/site.spec.ts`

**Interfaces:**
- Produces: `planSlug(name: string): string`, `getPlanBySlug(slug: string | null): Plan | undefined`, and `Checkout({ initialPlanSlug }: { initialPlanSlug?: string }): JSX.Element`.
- Consumes: the five `plans` entries and static query-string navigation under `/contratacao?plano=<slug>`.

- [ ] **Step 1: Write failing plan unit tests**

Assert stable slugs for all five plans, correct lookups, and `undefined` for missing/unknown slugs.

- [ ] **Step 2: Run unit tests and verify failure**

Run: `pnpm vitest run src/lib/plans.test.ts`

Expected: FAIL because plan helpers do not exist.

- [ ] **Step 3: Implement plan helpers and internal links**

Add the two plan helper functions. Change every plan CTA to `/up-fitness-site/contratacao?plano=<slug>` without external target or arrow. Restyle all cards white with yellow borders at rest and yellow hover/focus/touch-selected treatment.

- [ ] **Step 4: Write failing checkout E2E tests**

Assert selected plan summary, monthly installment wording, fallback for invalid slug, required-field errors and focus, Pix demonstration screen, card demonstration screen with no number/CVV/expiry fields, local confirmation, and return/contact actions.

- [ ] **Step 5: Implement checkout route and component**

Build a static-export-compatible route whose client component reads `window.location.search` after mount. Add three stages, minimum personal fields, CPF format validation, Pix/card selection, permanent demonstration notice, non-payable Pix placeholder, simulated card summary, and local confirmation only.

- [ ] **Step 6: Run plan and checkout tests**

Run: `pnpm vitest run src/lib/plans.test.ts && pnpm exec playwright test e2e/site.spec.ts --grep "plans|checkout"`

Expected: PASS.

### Task 5: Whole-site verification and publication

**Files:**
- Modify: `e2e/site.spec.ts`
- Modify if needed: `.github/workflows/pages.yml`

**Interfaces:**
- Consumes: Tasks 1-4 complete.
- Produces: verified static export and public GitHub Pages deployment.

- [ ] **Step 1: Extend responsive and accessibility coverage**

Exercise `/` and `/contratacao` at widths `320`, `375`, `390`, `768`, `1024`, `1440`, and `1920`, plus `844x390`; assert no overflow, broken requests, broken media, console errors, inaccessible icon links, or Axe WCAG 2.2 AA violations.

- [ ] **Step 2: Run complete local checks**

Run: `pnpm check && pnpm test:e2e`

Expected: lint, typecheck, custom rules, unit tests, build, all E2E, responsive, reduced-motion, and accessibility checks PASS.

- [ ] **Step 3: Visually inspect key breakpoints**

Capture and inspect opening, landing page, plans, map, FAQ, footer, Pix checkout, and card checkout at `390`, `768`, and `1440` widths. Fix only observed acceptance failures and rerun affected checks.

- [ ] **Step 4: Commit and publish**

Commit the focused implementation, push `main`, wait for `Deploy Pages` success, and verify public `/`, `/contratacao`, hero video, map container, and new media return HTTP 200.
