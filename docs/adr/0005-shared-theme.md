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
createPandaConfig(theme)
```

During the POC, adapt only the subset used by migrated docs.

## Panda preset

Do not assume `@chakra-ui/panda-preset` remains public or necessary. If Chakra owns the source theme and Panda generation, a separate preset may duplicate the adapter.

Keep it only if consumers need to extend Panda outside Chakra packages.

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
- Is `@chakra-ui/panda-preset` deprecated, repurposed, or retained?
