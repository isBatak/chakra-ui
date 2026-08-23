# Epic 5 — Theme and package boundaries

## Outcome

One theme model feeds both engines without requiring a Chakra config file.

## Related ADRs

- [ADR 0005 — Shared theme](../0005-shared-theme.md)
- [ADR 0008 — Panda CSS v2 migration comparison](../0008-panda-v2-migration-comparison.md)
- [ADR 0011 — Ejected theme ownership](../0011-ejected-theme-ownership.md)
- [ADR 0002 — Styling engine adapter](../0002-styling-engine-adapter.md)

## Tasks

- [x] 5.1 Define the engine-neutral theme entry point.
- [x] 5.2 Align the Chakra theme format with Panda CSS v2 where possible.
- [x] 5.3 Support Panda preset extension through `theme.extend`.
- [x] 5.4 Support multiple Emotion `defineConfig` inputs in `defineSystem`.
- [x] 5.5 Keep the temporary v3-to-Panda transformer optional.
- [x] 5.6 Put Panda-specific implementation in the Panda package.
- [x] 5.7 Keep Emotion-specific implementation in the Emotion package.
- [x] 5.8 Export normal consumer component APIs through the single
      `@chakra-ui/react` import. Keep adapter-author APIs in their dedicated
      package entry points.
- [x] 5.9 Detect Panda through `panda.config.*` and Chakra CLI workflows.
- [x] 5.10 Do not introduce `chakra.config.*`.
- [x] 5.11 Do not overwrite a user-installed ChakraProvider.
- [x] 5.12 Document the closed-component provider as user-owned code.

## Gate

The package graph stays engine-neutral at the core, and both engines consume the
same theme definitions.

## Evidence

- Package dependency graph
- Theme parity fixture
- Export test

Package boundary and public export evidence lives in
`packages/react/src/package-boundaries.test.ts`.

Theme parity evidence lives in `packages/react/__tests__/theme-parity.test.ts`.
CLI configuration and Provider ownership evidence lives in
`packages/cli/__tests__/context.test.ts` and
`packages/cli/__tests__/snippet.test.ts`.
