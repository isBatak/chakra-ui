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

## Panda preset

Build and publish the Panda representation of the Chakra theme in the existing `@chakra-ui/panda-preset` package.

The preset owns Panda-specific:

- token and semantic-token serialization
- conditions and utilities
- recipes and slot recipes
- global styles and cascade layers
- color-palette aliases
- Panda compatibility transforms

Framework packages must not duplicate this Panda theme representation.

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

The preset build aggregates the tracking metadata. The published preset must not introduce a runtime dependency from `panda-preset` back to a framework package.

The preset is generated or adapted from the shared theme source. It must not become a second source of truth.

## Compatibility checks

- CSS variable names and color-palette aliases
- semantic token conditions
- recipe defaults and compound variants
- cascade-layer ordering
- global styles and reset behavior
- generated types

## Open questions

- Is the neutral schema the current system config, Panda's preset schema, or a smaller Chakra-owned format?
- Do v3 custom themes need an automatic converter?
- Does the preset also export the Chakra parser plugin, or should that remain a separate package?
