# ADR 0003: Factory and style contexts

Status: Proposed

## Decision

Keep the public factory name `chakra()`.

For Panda mode, compose Panda's generated JSX factory with Ark UI's factory:

- String elements become Ark elements first.
- Panda adds style props and recipes.
- Ark owns polymorphism and `asChild`.
- Cache intrinsic elements so `chakra.div` has stable identity.

Conceptually:

```ts
chakra.button = panda(ark.button)
chakra(Component, recipe) = panda(Component, recipe)
```

## Static extraction

Panda must recognize calls to the public `chakra()` factory. Prototype a narrowly scoped `parser:before` plugin that rewrites imported `chakra(...)` calls to a configured Panda JSX-factory alias for extraction only.

Potential implementation:

```ts
import { definePlugin } from "@pandacss/dev"

const chakraFactoryImport =
  /import\\s*{[^}]*\\bchakra\\b[^}]*}\\s*from\\s*['"](?:@chakra-ui\\/react|(?:\\.\\.\\/)+styled-system\\/factory)['"]/

/**
 * Teach Panda extraction about Chakra's public factory without renaming it
 * or transforming unrelated functions named `chakra`.
 */
export const chakraFactoryPlugin = definePlugin({
  name: "@chakra-ui/panda-chakra-factory",
  hooks: {
    "parser:before": ({ content }) => {
      if (!chakraFactoryImport.test(content)) return

      return [
        'import { panda as __chakraPandaExtract } from "@chakra-ui/react/jsx"',
        content.replace(
          /\\bchakra(\\s*)\\(/g,
          "__chakraPandaExtract$1(",
        ),
      ].join("\\n")
    },
  },
})
```

The generated JSX-factory import path is provisional. This example handles direct `chakra(...)` calls; the POC must extend or replace it for aliased imports, namespace imports, `chakra.div`, and other supported factory forms.

The plugin must:

- Match only Chakra factory imports.
- Avoid unrelated functions named `chakra`.
- Support package and relative imports.
- Have extraction fixtures for direct calls and intrinsic properties.

Prefer an official Panda import-map/factory extension if it can provide the same result without source rewriting.

## Style contexts

Panda's generated `createStyleContext` is not API-compatible with Chakra's recipe contexts. The adapter must normalize:

- root and slot styles
- props providers
- `unstyled`
- recipe splitting and defaults
- class-name merging

Test one multipart component before choosing between wrapping Panda's helper or retaining Chakra's context API over Panda-generated recipes.

## Open questions

- Can Ark's factory fully replace Chakra's custom `asChild` logic?
- Can provider selection preserve stable component identity?
- Should each engine expose a separate internal package entry point?
