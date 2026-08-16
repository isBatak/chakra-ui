# ADR 0005: Shared theme model

Status: Proposed

## Decision

Keep one framework-neutral Chakra theme source that can feed both:

- the current styled-system/Emotion runtime
- Panda configuration and generated CSS

Tokens, semantic tokens, conditions, recipes, slot recipes, text styles, layer styles, animation styles, keyframes, and global styles must not be maintained twice.

## Approach

Define a neutral theme schema, then provide engine adapters:

```ts
const theme = defineChakraTheme({ /* source of truth */ })

createEmotionSystem(theme)
createPandaPreset(theme)
```

During the POC, adapt only the subset used by migrated docs.

A compatibility transformer may be used temporarily to expose concrete gaps. For example, the [voice-coach Panda 2 adapter](https://github.com/isBatak/voice-coach/blob/main/packages/ds/src/theme/panda-2-chakra-preset.ts) rewrites v3 semantic-token references, color-palette aliases, recipes, slot recipes, and style collections for Panda 2.

That transformer is evidence, not the target architecture. The target is a theme shape that both engines consume without converting consumer theme data. Reaching that target may require changes to the Chakra v3 theme format and the Emotion styled-system so it reaches feature parity with Panda CSS v2. Any temporary transformer must document the remaining incompatibilities and its removal condition.

The packaged theme remains the default source. ADR 0011 defines `chakra eject` as the opt-in path for consumer-owned source. Ejected consumers own the adapter glue and maintenance of their copy.

For v4, consumers also own application theme extension wiring. They may:

1. apply the same extension separately to Emotion and Panda configuration, or
2. define a shared `theme.ts` entry point and consume it from both engines.

Automatic generation of this glue is preferred future work and is out of scope for v4.

## Panda preset

Keep publishing the Panda representation of the Chakra theme in the existing `@chakra-ui/panda-preset` package for compatibility.

Make `@chakra-ui/panda` the recommended v4 integration package. It owns the Panda adapter and `PandaStylingEngine`, and it may consume or re-export the existing preset. Existing `@chakra-ui/panda-preset` consumers do not need an immediate package migration.

`@chakra-ui/panda-preset` remains framework-neutral:

- it must not depend on React or `@chakra-ui/react`
- it must remain usable from a standalone Panda configuration
- it contains no React provider or styling-engine boundary
- React-specific runtime integration belongs to `@chakra-ui/panda`

The preset owns Panda-specific:

- token and semantic-token serialization
- conditions and utilities
- recipes and slot recipes
- global styles and cascade layers
- color-palette aliases
- Panda compatibility transforms

Framework packages must not duplicate this Panda theme representation. They consume the framework-neutral preset through their own runtime adapters.

The Chakra Panda extraction/parser plugin belongs to `@chakra-ui/panda`, not `@chakra-ui/panda-preset`. The preset remains focused on framework-neutral theme data.

`@chakra-ui/panda` does not re-export `@chakra-ui/styled-system` APIs. Consumers import shared theme and styled-system APIs directly from `@chakra-ui/styled-system`.

Chakra v4 does not provide an automatic converter for consumer-owned v3 themes. Migration documentation explains the manual changes. Temporary internal adapters may support Chakra's packaged theme during the POC, but they are not a public consumer migration API.

## Component tracking

Each styled component keeps a small `tracking.ts` file beside its implementation. It defines only the JSX identifiers that should activate the component recipe:

```ts
export const buttonJsx = [/Button$/, /^ButtonGroup$/] as const
```

The Panda recipe consumes that colocated metadata:

```ts
export const buttonRecipe = defineRecipe({
  className: "button",
  jsx: [...buttonJsx],
})
```

This lets Panda generate recipe CSS when Chakra components are used, without placing extraction rules in a central list that drifts from the component.

For schema parity, the Emotion styled-system accepts all Panda recipe metadata. `jsx` and `className` are the highest-priority fields because Chakra components need extraction tracking and stable recipe class names. Emotion ignores Panda-only metadata. These fields are typed no-ops and must add no runtime behavior, generated styles, or production bundle code.

Use the dedicated, declaration-only `@pandacss/types` package as the canonical source for `RecipeConfig`, `SlotRecipeConfig`, and related Panda metadata types instead of maintaining Chakra-owned copies. The current `@chakra-ui/react` package already uses Panda infrastructure through `@pandacss/is-valid-prop`. Imports from `@pandacss/types` must be type-only. Do not depend on the full `@pandacss/dev` build package for these definitions.

Version compatibility is declared through package dependency ranges. Chakra v4 requires `@pandacss/dev` and `@pandacss/types` from the same supported minor release line. The Chakra CLI does not inspect, enforce, or test this relationship.

Only `@chakra-ui/panda` declares `@pandacss/dev` as a peer dependency. Emotion-only consumers, `@chakra-ui/react`, and `@chakra-ui/styled-system` do not require `@pandacss/dev`.

The preset build aggregates the tracking metadata. The published preset must not introduce a runtime dependency from `panda-preset` back to a framework package.

The preset is generated or adapted from the shared theme source. It must not become a second source of truth.

## Compatibility checks

- CSS variable names and color-palette aliases
- semantic token conditions
- recipe defaults and compound variants
- cascade-layer ordering
- global styles and reset behavior
- generated types
- recipe metadata types remain aligned with `@pandacss/types`
- Emotion accepts all Panda recipe metadata without emitting runtime code or styles

## Open questions

- Which minimal changes make the Chakra theme format directly consumable by Panda CSS v2 and Emotion?
- Which Panda CSS v2 features are missing from the Emotion styled-system?
