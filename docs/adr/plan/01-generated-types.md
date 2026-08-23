# Epic 1 — Generated public types

## Outcome

The StyleSystem and factory types exist before component implementation starts.

## Related ADRs

- [ADR 0010 — Canonical styling-system types](../0010-canonical-styling-system-types.md)
- [ADR 0002 — Styling engine adapter](../0002-styling-engine-adapter.md)
- [ADR 0003 — Factory and style contexts](../0003-factory-and-style-contexts.md)

## Tasks

- [x] 1.1 List public style, recipe, slot-recipe, condition, and factory types.
- [x] 1.2 Use `@pandacss/types` where a Panda type is required.
- [x] 1.3 Keep `@pandacss/dev` out of runtime dependencies.
- [x] 1.4 Generate Chakra-owned public aliases.
- [x] 1.5 Generate intrinsic factory prop types.
- [x] 1.6 Generate polymorphic `as` types.
- [x] 1.7 Generate Ark `asChild` types.
- [x] 1.8 Generate recipe and slot-recipe prop helpers.
- [x] 1.9 Generate JSX style props for Emotion parity.
- [x] 1.10 Make unused engine-specific props safe no-ops.
- [x] 1.11 Add type tests for Emotion-only.
- [x] 1.12 Add type tests for Panda-only.
- [x] 1.13 Add type tests for dual-engine.
- [x] 1.14 Test a user project with a different compatible Panda version.

## Gate

The factory can consume stable, engine-neutral public types without requiring
`@pandacss/dev`.

## Evidence

- Generated type diff
- Dependency tree
- Type-test matrix

The dependency tree and type-test matrix are recorded in
[`packages/type-tests/README.md`](../../../packages/type-tests/README.md).
