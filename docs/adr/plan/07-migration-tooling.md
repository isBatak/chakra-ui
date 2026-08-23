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

- [x] 7.1 Assume Emotion for the default migration path.
- [x] 7.2 Detect `panda.config.*` when Panda is present.
- [x] 7.3 Preserve the user-owned ChakraProvider.
- [x] 7.4 Do not overwrite existing theme files.
- [x] 7.5 Add only missing imports or dependencies.
- [x] 7.6 Produce a readable proposed diff.
- [x] 7.7 Keep automatic diff application out of scope.
- [x] 7.8 Document manual Panda and dual-engine opt-in.
- [x] 7.9 Document how to share or extend theme definitions.
- [x] 7.10 Exclude CLI integration tests from this plan.

## Gate

Migration instructions are additive, explicit, reversible, and do not overwrite
user code.

## Evidence

- Example migration diff
- [Manual engine migration and verification checklist](../manual-engine-migration.md)

The `chakra migrate` command is a read-only analyzer. It prints the selected
engine, a focused `package.json` dependency diff, missing Provider imports, and
manual Provider/theme steps. It always ends with `No files were changed.`

Focused evidence:

```sh
vitest run packages/cli/__tests__/migration.test.ts \
  packages/cli/__tests__/context.test.ts \
  packages/cli/__tests__/snippet.test.ts
tsc --noEmit -p packages/cli/tsconfig.json
```
