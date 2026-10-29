# UP Fitness static hero implementation plan

Goal: Replace the opening folder composition with AI-generated editorial gym imagery in the UP black/yellow palette, preserving truthful image labeling and existing navigation destinations.
Architecture: Keep Hero as a server component, reuse next/image, shared CTA helpers, OpenStatus and the existing content source. Keep current mobile menu behavior.
Tech Stack: Next.js, React, CSS Modules.

- [ ] Generate and save image, record provenance and final prompt.
- [ ] Replace hero composition and refine typography, shared arrow and navbar spacing.
- [ ] Update documentation and validate lint, types, tests and static build through Pages CI.
- [ ] Verify live page and generated image delivery.
