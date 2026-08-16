# Chakra UI v4 architecture plan

Status: Proposed  
Scope: React, Panda CSS v2, Ark UI v5 POC, and final Ark UI v6 beta integration

## Goal

Move Chakra toward build-time CSS while keeping the v4 scope focused on React and avoiding an immediate Emotion removal.

## ADRs

1. [Docs-first proof of concept](./0001-docs-first-poc.md)
2. [Styling engine adapter](./0002-styling-engine-adapter.md)
3. [Factory and style contexts](./0003-factory-and-style-contexts.md)
4. [Multi-framework documentation](./0004-multi-framework-docs.md)
5. [Shared theme model](./0005-shared-theme.md)
6. [Multi-framework package structure](./0006-package-structure.md)
7. [Lint dynamic styling pitfalls](./0007-eslint-dynamic-styling.md)
8. [Compare the Panda v2 migration design](./0008-panda-v2-migration-comparison.md)
9. [Upgrade to Ark UI v6](./0009-ark-ui-v6.md)
10. [Canonical styling-system type contract](./0010-canonical-styling-system-types.md)
11. [Ejected theme ownership](./0011-ejected-theme-ownership.md)

## Theme ownership

The packaged theme remains the default. Consumers use the existing `chakra eject` command when they want a local, application-owned copy. After ejection, the application owns maintenance and the glue code that connects its theme to Panda and Emotion.

Panda's local MCP server is the alternative when AI tools need resolved theme details but the application does not want to eject and maintain the theme source.

In v4, consumers own application theme extensions and `ChakraSystemRegister` augmentation. Documentation recommends one shared, extension-only `theme.ts` entry point consumed by both engines because it reduces configuration drift. Chakra's default theme remains packaged. Panda merges the consumer extension through `theme.extend`. Emotion passes the packaged configuration and the consumer's `defineConfig` result as separate arguments to the system constructor. Consumers may instead define the extension separately in Emotion and Panda configuration, but they are responsible for keeping both configurations aligned. Automatic augmentation generation is preferred future work and is out of scope.

## Implementation plan

The [ordered implementation plan](./PLAN.md) links to one focused file per epic. Each epic uses small, strictly ordered tasks, requested evidence, and a hard review gate.

The critical path is:

1. Resolve scope and measurable success.
2. Freeze the current Ark UI v5 behavior baseline.
3. Prove generated public types.
4. Prove the shared theme and package generation model.
5. Prove the Chakra factory and extraction.
6. Prove recipe contexts with representative components.
7. Run the docs-first Panda POC across supported bundlers.
8. Prove one import across Emotion-only, Panda-only, and dual-engine modes.
9. Build Panda migration tooling from proven APIs.
10. Integrate the published Ark UI v6 beta.
11. Make the prerelease decision from collected evidence.

## Supported styling modes

Components always use the stable public import:

```tsx
import { Button } from "@chakra-ui/react"
```

No separate `chakra.config.*` file is required. The Chakra CLI detects and validates Chakra's build-time integration from `panda.config.*`; runtime components never inspect configuration files.

The Chakra CLI installs a user-owned Provider component when one does not exist. That source file contains the explicit root engine boundary and can be edited by the application. The CLI never overwrites an existing Provider file.

For the easiest v3 → v4 migration, the upgraded Provider snippet defaults to Emotion. The convention supports three modes without requiring component import changes:

- Emotion-only: the installed Provider wraps Chakra with `EmotionStylingEngine`. This is the v3 migration default.
- Panda-only: the CLI updates the Provider to use `PandaStylingEngine` and configures `panda.config.*`.
- Both engines: the Provider uses Panda at the root and the application wraps legacy subtrees in `EmotionStylingEngine`.

`@chakra-ui/react` owns engine-neutral components. `@chakra-ui/panda` is the recommended v4 Panda integration package and may re-export or consume the existing preset. `@chakra-ui/panda-preset` remains available for existing consumers. It stays framework-neutral, does not depend on React, and can be used without `@chakra-ui/react`. The component style types are public and stable, while documentation marks the engine adapter implementation contract as experimental in v4. API names and import paths do not use `experimental` or `unstable`. Adapter authors import the contract from `@chakra-ui/react/styling-engine`; normal component consumers do not need that entry point. Engine packages own their integrations and boundaries:

```tsx
import { Button } from "@chakra-ui/react"
import { PandaStylingEngine } from "@chakra-ui/panda"
import { EmotionStylingEngine } from "@chakra-ui/emotion"
```

This leaves room for future Tailwind, styled-components, or other adapter packages without changing component imports or props. Every adapter conforms to the same Panda-canonical public style types. The adapter implementation contract is not considered stable until Panda, Emotion, and at least one independent third adapter validate it through a later ADR. Engine-specific capabilities stay inside the adapter package and never widen `@chakra-ui/react` component props.

```tsx
<PandaStylingEngine>
  <ChakraProvider>
    <App />
  </ChakraProvider>
</PandaStylingEngine>
```

The Emotion-only Provider snippet replaces the outer boundary with `EmotionStylingEngine`. The dual-engine Provider keeps Panda at the root and the application nests Emotion boundaries only around legacy subtrees.

Rendering a Chakra component without any engine boundary throws a clear configuration error. Chakra never selects an implicit fallback engine.

Panda starts as an opt-in beta. The ESLint plugin's `emotion`, `panda`, and `both` modes prepare and validate an application for its selected styling mode.

## Exit criteria

- App-composed Panda types form the canonical engine-neutral contract and cross Chakra's public package boundary without `any` or `@ts-ignore`.
- Panda and Emotion adapters pass the same public component-prop type tests.
- `chakra()` retains style props, recipes, refs, and Ark v5 `asChild` behavior during the Panda POC.
- Final integration validates Ark v6 `render` and deprecated `asChild` against an official npm beta.
- One multipart component validates style-context compatibility.
- One unchanged `@chakra-ui/react` component import graph works with the CLI-installed Provider snippet in all three modes.
- Panda-only output installs `@chakra-ui/panda` but does not install or bundle `@chakra-ui/emotion`, Emotion runtime code, or Emotion styles.
- Emotion-only output contains no Panda runtime or generated application CSS.
- The dual-engine fixture uses Panda outside boundaries and resolves explicit Emotion legacy boundaries without duplicating global output.
- Theme tokens have one source of truth.
- The POC works in Vite, Next.js webpack, and Next.js Turbopack.
- Build time, generated CSS, client JavaScript, hydration, and visuals stay within agreed budgets.

Epics 0–8 use Ark UI v5. Ark v6 work starts only after npm publishes an official beta; timestamped alpha builds and source checkouts are not accepted as the v4 dependency.

No public v4 API is accepted by these ADRs or this plan yet.
