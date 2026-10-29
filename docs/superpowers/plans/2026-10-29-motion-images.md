# Approved motion and image implementation plan

Goal: Word blur entrances, scaled plan group, supplied yellow FlameWrap prices, footer reveal and better image delivery.
Architecture: Reuse MotionRoot and existing components; keep all content as accessible HTML. Use supplied flame implementation with native support detection. Preserve photo attribution and original copies.

- [ ] Add SSR text word wrappers and one viewport observer; reduced motion and no-JS stay readable.
- [ ] Reuse plan variants for staggered scale; wrap prices with supplied FlameWrap.
- [ ] Make footer sticky behind main only when it fits the viewport.
- [ ] Create high-quality responsive WebP photo derivatives from existing full-resolution files.
- [ ] Run lint, types, unit tests and build, then browser checks and publish.
