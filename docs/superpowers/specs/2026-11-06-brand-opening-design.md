# UP Fitness Brand Opening Design

## Intent

Reproduce the opening sequence from the approved reference before the UP Fitness landing page appears, strengthening the brand without delaying repeat navigation.

## Requirements

- Cover the viewport with the UP Fitness black background before the landing page is shown.
- Animate `UP FITNESS` in yellow, letter by letter, with a horizontal highlight.
- Finish after `1.25s`; a click or any key dismisses it earlier.
- Show once per browser session through `sessionStorage`.
- Skip the opening when `prefers-reduced-motion: reduce` is active.
- Preserve keyboard access, skip-link behavior, layout stability, and the existing landing page.
- Work without horizontal overflow on phone, tablet, desktop, and phone landscape.

## Approach

Use one client component mounted in the root layout. An inline pre-hydration script decides whether the opening should render, preventing a flash for repeat visits and reduced-motion users. CSS handles letter, highlight, and exit motion; React only owns dismissal and cleanup.

## Alternatives Considered

- Show on every reload: rejected because it differs from the reference and repeatedly delays visitors.
- Animate after hydration only: rejected because repeat visitors could see a brief unwanted overlay.

## Non-goals

- No dependency, audio, video, navigation change, or redesign of landing-page sections.
- No persistent cookie across browser sessions.

