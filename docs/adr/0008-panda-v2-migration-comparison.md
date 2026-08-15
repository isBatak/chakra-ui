# ADR 0008: Compare the Panda v2 migration design

Status: Proposed

## Context

Panda v2 already contains a detailed Chakra migration attempt:

[Panda v2: Chakra UI design-system migration](https://github.com/chakra-ui/panda/blob/v2/design-notes/chakra-ui-design-system-migration.md)

This ADR compares that design with the proposals in this folder. The existing Panda note should be treated as prior art, not duplicated or ignored.

## Shared direction

Both approaches agree that:

- Panda is the default styling engine.
- Chakra components keep a runtime for behavior, Ark integration, prop splitting, and class composition.
- Panda generates CSS and deterministic class names at build time.
- Chakra owns the default theme, recipes, and generated styling artifacts.
- Consumer extensions must affect generated CSS and TypeScript types.
- Component usage needs extraction metadata.
- Emotion should not insert styles in the final Panda path.

## Comparison

| Area | Panda v2 design note | Current ADRs |
| --- | --- | --- |
| Final runtime | Direct generated styled-system imports; no runtime engine registry | A stable `chakra()` wrapper backed by Panda and Ark |
| Gradual migration | Focuses on the final Panda architecture | Adds temporary Emotion/Panda JSX boundaries |
| Packaging | `@chakra-ui/styled-system` owns runtime, types, preset, and build info | Keeps `@chakra-ui/panda-preset` and explores shared theme packages |
| App customization | App generates one composed styled-system and aliases Chakra imports to it | Preset-first POC; app composition was not fully specified |
| Extraction | Published manifests and `panda.components.json` | Colocated `tracking.ts` plus a parser-plugin fallback |
| Frameworks | React example over generic Panda design-system contracts | Official React, Solid, Vue, and Svelte packages |
| Factory | Components directly use generated CSS and recipe helpers | `chakra()` combines Panda's factory with Ark's factory |
| Diagnostics | Panda validates aliases, paths, manifests, and dynamic usage | ESLint prepares application styling and flags dynamic pitfalls |

## Decision

Use the Panda v2 design note as the baseline candidate for the final static Panda architecture.

Keep these additions from the current ADRs:

- Emotion/Panda boundaries as a temporary migration mechanism.
- Ark + Panda composition behind the public `chakra()` API.
- Official multi-framework packages and docs.
- Colocated component tracking as authoring input.
- Consumer-facing ESLint guidance.

The final Panda-only path should avoid runtime engine selection. Once an application finishes migration, engine boundaries and Emotion should be removable.

## Reconciliation plan

### Styled-system packaging

Prototype the Panda note's `@chakra-ui/styled-system` package.

Compare it with keeping the existing `@chakra-ui/panda-preset` package:

1. `styled-system` owns the preset, generated runtime, declarations, and build info.
2. `panda-preset` remains a public preset and `styled-system` consumes it.
3. `panda-preset` becomes a compatibility export of `styled-system/panda.preset`.

Do not decide the package split until the POC validates publishing, app overrides, and type resolution.

### Component extraction

Prefer Panda v2's manifest and component-metadata contracts when available.

Colocated `tracking.ts` files may generate `panda.components.json`; they should not become a competing runtime metadata system.

Use the `parser:before` factory plugin only as a fallback for factory calls that official import maps and component metadata cannot recognize.

### Migration boundaries

Treat `EmotionStylingEngine` and `PandaStylingEngine` as transitional compatibility APIs.

The Panda note's direct generated imports remain the desired end state because they improve tree shaking and avoid permanent runtime registry indirection.

### Multi-framework support

Give every framework package its own component manifest and framework renderer while sharing the neutral theme, recipes, anatomy, and generation inputs.

Panda should compose all framework packages through the same design-system contract.

## POC questions

1. Can `designSystem: "@chakra-ui/react"` compose Chakra and app theme extensions with correct CSS and types?
2. Can `tracking.ts` generate the component manifest required by Panda?
3. Can Chakra's public `chakra()` factory resolve through an app-composed styled-system without a parser rewrite?
4. Can Emotion and Panda coexist temporarily without affecting the final Panda bundle?
5. Should `@chakra-ui/panda-preset` remain public, or become an export of `@chakra-ui/styled-system`?
6. Can the manifest and alias model work consistently in Vite, Next webpack, and Turbopack?

## Related ADRs

- [Styling engine boundaries](./0002-styling-engine-adapter.md)
- [Factory and style contexts](./0003-factory-and-style-contexts.md)
- [Shared theme model](./0005-shared-theme.md)
- [Multi-framework package structure](./0006-package-structure.md)
- [Dynamic styling lint rule](./0007-eslint-dynamic-styling.md)
