# UP Fitness Site Completion Design

## Intent

Finish the UP Fitness landing page as a polished, specific presentation of the Zona Sul unit. Preserve the approved hero video and confirmed business information while completing every earlier visual and functional request that remains missing.

## Goals

- Add the approved brand opening before the landing page.
- Replace weak, low-quality, or irrelevant imagery with relevant official UP Fitness imagery and better crops.
- Rebuild weak sections so they feel designed for this academy, not generated from a generic template.
- Make plan selection continue to an internal, demonstrative checkout.
- Keep the entire experience responsive, accessible, fast, and reliable on phone, tablet, desktop, and phone landscape.

## Anti-goals

- Do not replace the current hero video.
- Do not invent facilities, services, prices, testimonials, staff identities, or business claims.
- Do not send users to the external sales page from plan cards.
- Do not process payments, store personal data, or imply that the demonstration completes a real purchase.
- Do not add decorative motion to every element or use unrelated stock imagery.

## Chosen Approach

Reform only the weak areas and preserve approved work. Keep the current Next.js architecture, content source, reveal system, and hero video. Add focused components and routes without a new UI library or animation dependency.

### Alternatives considered

- Rebuild the entire landing page: rejected because it would discard approved work and increase regression risk.
- Apply cosmetic patches only: rejected because internal checkout, map, navigation, and section structure require real behavior and layout changes.

## Experience Design

### Brand opening

- Before the first landing-page view in a browser session, cover the viewport with UP Fitness black.
- Animate `UP FITNESS` in yellow, letter by letter, with a horizontal highlight.
- Finish after `1.25s`; click or any key dismisses it earlier.
- Skip repeat views in the same session and skip entirely for `prefers-reduced-motion: reduce`.
- Prevent background scrolling and unwanted first-paint flashes while active.

### Navbar

- Keep the full UP Fitness logo visible and strengthen the black/yellow identity.
- Replace the written WhatsApp CTA and arrow with an accessible WhatsApp icon button.
- Add an adjacent Instagram icon button.
- Keep desktop section navigation and the existing accessible mobile menu.
- Remove decorative external-link arrows from requested controls.

### Hero

- Preserve the current muted, looping, responsive video and `DÊ UM UP` composition.
- Preserve play/pause and reduced-motion behavior.
- Keep status text and AI disclaimer removed.

### Structure

- Replace the current awkward overlapping image composition with an editorial, responsive layout using relevant official unit/training imagery.
- Use the cleanest available official images at their best source resolution; crop intentionally, never stretch.
- Present confirmed amenities in a compact, structured grid with less repetitive copy and a clear visual hierarchy.
- Avoid decorative arrow frames and visible photo captions unless the caption adds information.

### Plans

- Keep all five confirmed plans, including the R$ 89,90 economic plan from 12h to 16h.
- Treat R$ 179,90, R$ 169,90, R$ 159,90, and R$ 149,90 as the value of each monthly installment for their respective contract terms, matching the supplied official pricing table.
- Cards use white backgrounds with yellow borders at rest.
- Hover, keyboard focus, and touch-selected state use yellow without reducing contrast.
- Keep scale/reveal motion restrained and disable it for reduced motion.
- Remove arrow symbols.
- Each plan button opens `/contratacao?plano=<slug>` inside the site.

### Demonstrative checkout

- Add an internal `/contratacao` page and preserve the selected plan from the query string.
- Present three clear stages: confirm plan, customer details, simulated payment summary.
- Accept only the minimum demonstration fields: name, email, phone, CPF placeholder, and payment-method choice.
- Offer both Pix and credit card as demonstrative payment methods.
- For card, show only a visual simulated-payment summary; never request a real card number, CVV, or expiration date.
- For Pix, show a non-payable demonstration code/QR placeholder clearly marked as invalid for payment.
- Do not request or store a real card number, CVV, expiration date, Pix payment, password, or banking credential.
- Show a permanent `Demonstração — nenhum pagamento será realizado` notice.
- Validate fields in the browser, preserve keyboard/focus behavior, and show a local confirmation screen.
- Provide a route back to the plans and a final option to contact the academy through WhatsApp.
- Static GitHub Pages remains the hosting target; no backend or real payment gateway is added.

### Unit and map

- Replace the two-photo block with an embedded Google Maps view of the confirmed academy address.
- Keep the full address, opening hours, and direct map/WhatsApp actions.
- Remove external-link arrows and visible redundant captions.
- Give the map a textual title and accessible fallback link.

### FAQ

- Replace the current low-quality treadmill image with a higher-quality, relevant official academy image.
- Keep the accessible one-at-a-time accordion.
- Improve spacing and hierarchy without adding generic filler.

### Footer

- Keep the full official UP Fitness logo, sized and cropped cleanly.
- No vector logo file is available; reconstruct a clean high-resolution presentation from the best official Instagram image without redesigning the mark.
- Preserve useful navigation and contact links.
- Remove decorative arrows and redundant photo-credit presentation from the visible composition.
- Retain accurate attribution in source content where needed.

## Image Policy

- Prefer original or highest-resolution files from the official `@upfitness_lavras` account.
- Use only images that clearly show the academy, equipment, training, team, or facade.
- Optimize final files as WebP/AVIF where supported; keep natural aspect ratio and useful focal points.
- Do not use unrelated Lavras landmarks, generic stock photos, or AI-generated fake academy interiors.
- If an official source is too small, use conservative enhancement and sharpening only; do not invent people, logos, equipment, or architecture.

## Motion Policy

- Reuse the installed Motion primitives and CSS transitions.
- Motion communicates entrance, selection, or state change; it must not run continuously except the muted hero video.
- Respect `prefers-reduced-motion` everywhere.
- Text remains readable before, during, and after animation.

## Responsive and Accessibility Requirements

- Verify widths `320`, `375`, `390`, `768`, `1024`, `1440`, and `1920` pixels plus `844x390` landscape.
- No horizontal overflow, clipped controls, unreachable content, or layout shift from image loading.
- WCAG 2.2 AA checks at mobile and desktop widths.
- Icon-only links require visible focus and accessible names.
- Dialog-like or staged checkout behavior must preserve focus and error announcements.
- The site remains usable without motion and without JavaScript-enhanced animation.

## Verification and Publication

- Run lint, type checks, rules, unit tests, production build, and the full Playwright suite.
- Add tests for opening behavior, icon navigation, internal plan routing, checkout validation, map presence, responsive layouts, reduced motion, and broken assets.
- Publish to `main`, wait for GitHub Pages success, and verify the public HTML, video, checkout route, and new assets return HTTP 200.

## Builder Calls

- Choose the strongest relevant official images after inspecting available source resolution and composition.
- Refine section copy for clarity while preserving only confirmed facts.
- Choose exact easing, spacing, crop positions, and breakpoints consistent with the existing visual system.
