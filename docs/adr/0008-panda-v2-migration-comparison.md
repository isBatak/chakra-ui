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
| Framework scope | React example over generic Panda design-system contracts | Chakra v4 focuses only on React |
| Factory | Components directly use generated CSS and recipe helpers | `chakra()` combines Panda's factory with Ark's factory |
| Diagnostics | Panda validates aliases, paths, manifests, and dynamic usage | ESLint prepares application styling and flags dynamic pitfalls |

## Author clarification: single-engine core

The author of the Panda migration note clarified the intended model:

- Panda is built directly into `@chakra-ui/react`; core only knows Panda.
- Runtime styling composes generated class strings. CSS is emitted at build time.
- Emotion moves to an optional `@chakra-ui/emotion` compatibility package.
- A thin seam lets that package restore the old runtime behavior without making core dual-engine.
- Chakra keeps its public factory and framework glue, backed by Panda's generated runtime.
- Chakra recipe and slot-recipe contexts wrap Panda's equivalents.
- `css`, `cva`, and `sva` come from the generated styled-system.
- Chakra publishes the preset, manifest, component metadata, and build info as one Panda design system.
- Consumers configure `designSystem: "@chakra-ui/react"` and normally install only `@chakra-ui/react`.

This is closer to Mantine's optional Emotion integration than to a permanent runtime adapter.

For framework scope, Chakra v4 focuses only on React. Official Solid, Vue, and Svelte support is deferred to Chakra v5.

## Reported blocker: generated types

The migration attempt was blocked mainly by cleanly exposing Panda-generated types without `@ts-ignore`, especially:

- `HTMLChakraProps`
- `SystemStyleObject`
- recipe and slot-recipe variant inference
- public re-exports from the app-composed generated styled-system

These are API-boundary problems, not minor implementation details. Chakra's public component props currently combine React/Ark polymorphic props with generated system properties. `SystemStyleObject` depends on generated conditions and system properties. Recipe props also depend on generated recipe keys, values, slots, and tokens.

## Do the current ADRs have the same blocker?

**Yes. The Panda path inherits it, and the dual-engine adapter makes it harder.**

A JSX engine boundary is runtime context, but TypeScript resolves `ButtonProps`, `HTMLChakraProps`, `SystemStyleObject`, and recipe variants before runtime. The same `<Button>` cannot expose different prop types based on its nearest `EmotionStylingEngine` or `PandaStylingEngine`.

The adapter therefore needs one public type contract that is valid for both engines. That creates additional risks:

- An intersection can reject props supported by only one engine.
- A union can weaken inference and excess-property checking.
- Emotion style objects and Panda-extractable inputs do not have identical constraints.
- App-added Panda tokens and variants must flow into Chakra component props through generated declarations.
- Recipe contexts currently return style objects, while the desired Panda runtime returns class strings.
- Slot names, conditional values, polymorphism, `asChild`, and refs must remain inferred after wrapping generated helpers.

The boundaries help runtime migration, but they do not solve type selection. A permanent dual-engine core would have to stabilize a shared type ABI or accept weaker types.

## Revised direction

Prefer the author's single-engine core as the baseline:

1. Make Panda the only engine known by `@chakra-ui/react`.
2. Put legacy runtime styling in optional `@chakra-ui/emotion`.
3. Keep any Emotion seam narrow and temporary; do not make every component dispatch through an engine registry.
4. Preserve Chakra's factory and contexts, but implement them over generated Panda class-string helpers.
5. Treat generated type compatibility as the first POC gate, before migrating many components.
6. Keep Chakra v4 React-only and defer official Solid, Vue, and Svelte support to Chakra v5.

The existing engine-boundary ADR remains useful as an experiment, but it should not be considered the preferred architecture unless the POC proves that runtime coexistence preserves strict public types without duplicate component implementations.

## Type-first POC

Before a broad docs or component migration, build a small generated-type spike covering:

1. One intrinsic factory component using `HTMLChakraProps<"button">`.
2. One recipe component with an app-added variant.
3. One slot recipe with inferred slot and variant types.
4. One `css` prop using an app-added token and condition.
5. Ark `asChild`, polymorphic props, and ref inference.
6. Clean public re-exports from `@chakra-ui/react` with no `any` or `@ts-ignore`.
7. Default package declarations and app-composed declarations resolving through the same import boundary.
8. The optional Emotion package consuming the seam without widening Panda component props.

If this spike fails, the project should not hide the mismatch behind assertions. The options are to improve Panda's generated contracts, reduce Chakra's public type surface, or publish separate compatibility components/types.

## Decision

Use the Panda v2 design note and the author's clarified single-engine model as the baseline candidate for the final architecture.

Keep these additions from the current ADRs:

- Emotion/Panda boundaries only as a POC alternative; prefer an optional Emotion package with a thin compatibility seam.
- Ark + Panda composition behind the public `chakra()` API.
- Keep Chakra v4 focused on React and defer official Solid, Vue, and Svelte support to Chakra v5.
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

### Framework scope

Chakra v4 publishes and documents React only. Official Solid, Vue, and Svelte packages and documentation are planned for Chakra v5.

## POC questions

1. Can `designSystem: "@chakra-ui/react"` compose Chakra and app theme extensions with correct CSS and types?
2. Can `tracking.ts` generate the component manifest required by Panda?
3. Can Chakra's public `chakra()` factory resolve through an app-composed styled-system without a parser rewrite?
4. Can an optional `@chakra-ui/emotion` package plug into a narrow seam without making core dual-engine or weakening types?
5. Should `@chakra-ui/panda-preset` remain public, or become an export of `@chakra-ui/styled-system`?
6. Can the manifest and alias model work consistently in Vite, Next webpack, and Turbopack?
7. Can generated `HTMLChakraProps`, `SystemStyleObject`, recipe, and slot-recipe types be re-exported with no `any` or `@ts-ignore`?
8. Do engine boundaries provide enough migration value to justify their unresolved compile-time type contract?

## Related ADRs

- [Styling engine boundaries](./0002-styling-engine-adapter.md)
- [Factory and style contexts](./0003-factory-and-style-contexts.md)
- [Shared theme model](./0005-shared-theme.md)
- [Dynamic styling lint rule](./0007-eslint-dynamic-styling.md)
- [Canonical styling-system type contract](./0010-canonical-styling-system-types.md)
