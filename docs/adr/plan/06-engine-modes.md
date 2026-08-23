# Epic 6 — Engine modes

## Outcome

Emotion-only, Panda-only, and dual-engine applications are independently
verified.

## Related ADRs

- [ADR 0002 — Styling engine adapter](../0002-styling-engine-adapter.md)
- [ADR 0005 — Shared theme](../0005-shared-theme.md)
- [ADR 0010 — Canonical styling-system types](../0010-canonical-styling-system-types.md)

## Tasks

- [x] 6.1 Create the Emotion-only fixture.
- [x] 6.2 Verify no Panda runtime package is loaded.
- [x] 6.3 Create the Panda-only fixture.
- [x] 6.4 Verify no Emotion runtime package is loaded.
- [x] 6.5 Create the dual-engine fixture.
- [x] 6.6 Select the root engine explicitly.
- [x] 6.7 Switch one subtree to the other engine.
- [x] 6.8 Switch back inside a nested subtree.
- [x] 6.9 Verify Button, ButtonGroup, and Dialog in every fixture.
- [ ] 6.10 Verify SSR and hydration.
- [x] 6.11 Verify class names remain additive.
- [x] 6.12 Verify missing adapter errors identify the boundary.

## Gate

All three fixtures pass build, type, runtime, SSR, hydration, and component
tests.

## Evidence

- Mode matrix: `packages/type-tests/{emotion-only,panda-only,dual-engine}`
- Runtime dependency report:
  `packages/type-tests/engine-mode-dependencies.test.ts`
- Type matrix: `pnpm --filter "./packages/type-tests/**" typecheck`
- Boundary runtime matrix:
  `pnpm vitest run packages/type-tests/{emotion-only,panda-only,dual-engine}/runtime.test.tsx packages/type-tests/missing-engine-boundary.test.tsx`
