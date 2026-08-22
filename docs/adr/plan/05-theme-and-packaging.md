# Epic 5 — Theme and package boundaries

## Outcome

One theme model feeds both engines without requiring a Chakra config file.

## Tasks

- [ ] 5.1 Define the engine-neutral theme entry point.
- [ ] 5.2 Align the Chakra theme format with Panda CSS v2 where possible.
- [ ] 5.3 Support Panda preset extension through `theme.extend`.
- [ ] 5.4 Support multiple Emotion `defineConfig` inputs in `defineSystem`.
- [ ] 5.5 Keep the temporary v3-to-Panda transformer optional.
- [ ] 5.6 Put Panda-specific implementation in the Panda package.
- [ ] 5.7 Keep Emotion-specific implementation in the Emotion package.
- [ ] 5.8 Export everything through the single `@chakra-ui/react` import.
- [ ] 5.9 Detect Panda through `panda.config.*` and Chakra CLI workflows.
- [ ] 5.10 Do not introduce `chakra.config.*`.
- [ ] 5.11 Do not overwrite a user-installed ChakraProvider.
- [ ] 5.12 Document the closed-component provider as user-owned code.

## Gate

The package graph stays engine-neutral at the core, and both engines consume the same theme definitions.

## Evidence

- Package dependency graph
- Theme parity fixture
- Export test
