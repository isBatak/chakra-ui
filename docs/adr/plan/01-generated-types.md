# Epic 1 — Generated public types

## Outcome

The StyleSystem and factory types exist before component implementation starts.

## Tasks

- [ ] 1.1 List public style, recipe, slot-recipe, condition, and factory types.
- [ ] 1.2 Use `@pandacss/types` where a Panda type is required.
- [ ] 1.3 Keep `@pandacss/dev` out of runtime dependencies.
- [ ] 1.4 Generate Chakra-owned public aliases.
- [ ] 1.5 Generate intrinsic factory prop types.
- [ ] 1.6 Generate polymorphic `as` types.
- [ ] 1.7 Generate Ark `asChild` types.
- [ ] 1.8 Generate recipe and slot-recipe prop helpers.
- [ ] 1.9 Generate JSX style props for Emotion parity.
- [ ] 1.10 Make unused engine-specific props safe no-ops.
- [ ] 1.11 Add type tests for Emotion-only.
- [ ] 1.12 Add type tests for Panda-only.
- [ ] 1.13 Add type tests for dual-engine.
- [ ] 1.14 Test a user project with a different compatible Panda version.

## Gate

The factory can consume stable, engine-neutral public types without requiring `@pandacss/dev`.

## Evidence

- Generated type diff
- Dependency tree
- Type-test matrix
