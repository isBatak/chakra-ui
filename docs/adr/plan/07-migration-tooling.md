# Epic 7 — Migration tooling

## Outcome

A v3 Emotion application can adopt v4 without destructive CLI behavior.

## Related ADRs

- [ADR 0008 — Panda CSS v2 migration comparison](../0008-panda-v2-migration-comparison.md)
- [ADR 0011 — Ejected theme ownership](../0011-ejected-theme-ownership.md)
- [ADR 0007 — ESLint dynamic styling](../0007-eslint-dynamic-styling.md)
- [ADR 0002 — Styling engine adapter](../0002-styling-engine-adapter.md)
- [ADR 0005 — Shared theme](../0005-shared-theme.md)

## Tasks

- [ ] 7.1 Assume Emotion for the default migration path.
- [ ] 7.2 Detect `panda.config.*` when Panda is present.
- [ ] 7.3 Preserve the user-owned ChakraProvider.
- [ ] 7.4 Do not overwrite existing theme files.
- [ ] 7.5 Add only missing imports or dependencies.
- [ ] 7.6 Produce a readable proposed diff.
- [ ] 7.7 Keep automatic diff application out of scope.
- [x] 7.8 Document manual Panda and dual-engine opt-in.
- [x] 7.9 Document how to share or extend theme definitions.
- [x] 7.10 Exclude CLI integration tests from this plan.

## Gate

Migration instructions are additive, explicit, reversible, and do not overwrite
user code.

## Evidence

- Example migration diff
- [Manual engine migration and verification checklist](../manual-engine-migration.md)
