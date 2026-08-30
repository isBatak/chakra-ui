# eslint-plugin-chakra-ui

ESLint rules for Chakra UI styling patterns.

## Installation

```sh
pnpm add -D eslint-plugin-chakra-ui eslint
```

## Flat config

```js
import chakraUi from "eslint-plugin-chakra-ui"

export default [chakraUi.configs["flat/recommended"]]
```

Or configure the rule directly:

```js
import chakraUi from "eslint-plugin-chakra-ui"

export default [
  {
    plugins: { "chakra-ui": chakraUi },
    rules: {
      "chakra-ui/no-dynamic-conditional-styling": "warn",
    },
  },
]
```

## Legacy config

```json
{
  "extends": ["plugin:chakra-ui/recommended"]
}
```

## Rules

### `chakra-ui/no-dynamic-conditional-styling`

Reports ternaries and `??`/`||` fallbacks in Chakra style props and imported
Panda style functions. Safe top-level JSX ternaries can be automatically
rewritten to a `data-*` selector; ambiguous cases remain diagnostic-only.

The rule accepts an options object with `engine`, `checkConditionals`,
`styleFunctions`, `componentFactories`, `styleProps`, `typeAware`, and
`generatedTypePatterns` settings.
