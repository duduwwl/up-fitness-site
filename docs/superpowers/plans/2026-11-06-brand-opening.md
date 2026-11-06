# UP Fitness Brand Opening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the approved one-time, 1.25-second UP Fitness brand opening before the landing page.

**Architecture:** A client `BrandOpening` component owns dismissal and session state. A small pre-hydration script suppresses the overlay before first paint for repeat sessions and reduced-motion users; a CSS module owns all visuals and responsive motion.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS Modules, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-06-brand-opening-design.md`

## Global Constraints

- Use no new dependency.
- Display `UP FITNESS` for at most `1.25s` and only once per browser session.
- Dismiss on click or any key.
- Skip for `prefers-reduced-motion: reduce`.
- Preserve the existing landing page, skip link, and accessibility.

## Review Focus

- First visit: overlay is visible and disappears by `1.25s`.
- Repeat visit in the same session: overlay never becomes visible.
- Reduced motion: overlay never becomes visible.
- Early dismissal: click and keyboard both remove the overlay.
- Small and landscape screens: brand fits without horizontal overflow.

---

### Task 1: Brand opening behavior and presentation

**Files:**
- Create: `src/components/brand-opening.tsx`
- Create: `src/components/brand-opening.module.css`
- Modify: `src/app/layout.tsx`
- Test: `e2e/site.spec.ts`

**Interfaces:**
- Consumes: root layout body and browser `sessionStorage` key `up-fitness-opening`.
- Produces: `BrandOpening(): JSX.Element` mounted before the skip link.

- [ ] **Step 1: Write failing Playwright tests**

Add tests asserting first-visit visibility, automatic dismissal within `1.25s`, same-session suppression, reduced-motion suppression, click dismissal, keyboard dismissal, and no overflow at `320x900`, `768x900`, `1440x900`, and `844x390`.

- [ ] **Step 2: Run the focused tests and verify failure**

Run: `pnpm exec playwright test e2e/site.spec.ts --grep "brand opening"`

Expected: FAIL because `#brand-opening` does not exist.

- [ ] **Step 3: Implement `BrandOpening()`**

Create the client component with the exact `up-fitness-opening` session key, `1250ms` timeout, click dismissal, keydown dismissal, and inline pre-hydration suppression for repeat sessions and reduced motion. Render `UP FITNESS` as individually delayed letters and include a decorative highlight.

- [ ] **Step 4: Add responsive CSS motion**

Use a fixed full-viewport black layer above the site, yellow brand text sized with `clamp()`, letter delays of `40ms`, horizontal highlight, and an exit animation. Ensure the component hides entirely under reduced motion.

- [ ] **Step 5: Mount before the skip link**

Import and render `BrandOpening` as the first body child in `src/app/layout.tsx`, leaving the existing content unchanged.

- [ ] **Step 6: Run focused tests**

Run: `pnpm exec playwright test e2e/site.spec.ts --grep "brand opening"`

Expected: all brand-opening tests PASS.

- [ ] **Step 7: Run full verification**

Run: `pnpm check && pnpm test:e2e`

Expected: lint, types, unit tests, build, all responsive tests, WCAG tests, and brand-opening tests PASS.

- [ ] **Step 8: Commit and publish**

```bash
git add docs/superpowers/specs/2026-11-06-brand-opening-design.md docs/superpowers/plans/2026-11-06-brand-opening.md src/components/brand-opening.tsx src/components/brand-opening.module.css src/app/layout.tsx e2e/site.spec.ts
git commit -m "feat: add branded site opening"
git push origin main
```

Confirm the GitHub Pages workflow succeeds and the public page serves the new opening.
