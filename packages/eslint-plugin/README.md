# @chakra-ui/eslint-plugin

ESLint rules for Chakra UI styling patterns.

## Installation

```sh
pnpm add -D @chakra-ui/eslint-plugin eslint
```

## Flat config

```js
import chakraUi from "@chakra-ui/eslint-plugin"

export default [chakraUi.configs["flat/recommended"]]
```

Or configure the rule directly:

```js
import chakraUi from "@chakra-ui/eslint-plugin"

export default [
  {
    plugins: { "@chakra-ui": chakraUi },
    rules: {
      "@chakra-ui/no-dynamic-conditional-styling": "warn",
    },
  },
]
```

## Legacy config

```json
{
  "extends": ["plugin:@chakra-ui/recommended"]
}
```

## Rules

### `@chakra-ui/no-dynamic-conditional-styling`

Reports ternaries and `??`/`||` fallbacks in Chakra style props, `chakra(...)`
factory styles, and Chakra system CSS calls. System calls include
`defaultSystem.css(...)` and systems created with `createSystem(...)` or
returned by `useChakraContext()`. Safe top-level JSX ternaries can be
automatically rewritten to a `data-*` selector; ambiguous cases remain
diagnostic-only.

The rule accepts an options object with `checkConditionals`, `styleProps`,
`typeAware`, and `generatedTypePatterns` settings.
