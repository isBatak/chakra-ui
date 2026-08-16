# ADR 0003: Factory and style contexts

Status: Proposed

## Decision

Keep the public factory name `chakra()`.

For Panda mode, compose Panda's generated JSX factory with Ark UI's factory:

- String elements become Ark elements first.
- Panda adds style props and recipes.
- Ark owns polymorphism and v6 `render` composition; Chakra must decide how long to preserve `asChild` compatibility.
- Cache intrinsic elements so `chakra.div` has stable identity.

Conceptually:

```ts
chakra.button = panda(ark.button)
chakra(Component, recipe) = panda(Component, recipe)
```

Potential `factory.ts` implementation:

```ts
import { ark } from "@ark-ui/react/factory"
import type { ElementType, JSX } from "react"
import { panda } from "../styled-system/jsx"
import type { PandaComponent } from "../styled-system/jsx"
import type {
  RecipeDefinition,
  RecipeVariantRecord,
} from "../styled-system/types"

type StyledProps = Record<string, unknown>

type ChakraElements = {
  [Element in keyof JSX.IntrinsicElements]: PandaComponent<
    (typeof ark)[Element]
  >
}

interface ChakraFactoryCall {
  <Component extends ElementType>(
    component: Component,
  ): PandaComponent<Component>

  <Component extends ElementType, Recipe extends { __type: StyledProps }>(
    component: Component,
    recipe: Recipe,
  ): PandaComponent<Component, Recipe["__type"]>

  <Component extends ElementType, Variants extends RecipeVariantRecord>(
    component: Component,
    recipe: RecipeDefinition<Variants>,
  ): PandaComponent<
    Component,
    { [Key in keyof Variants]?: keyof Variants[Key] }
  >
}

export type ChakraFactory = ChakraFactoryCall & ChakraElements

function createChakraFactory(): ChakraFactory {
  const cache = new Map<keyof JSX.IntrinsicElements, unknown>()

  return new Proxy(panda, {
    apply(target, thisArg, args: [ElementType, ...unknown[]]) {
      const [component, ...rest] = args
      const base = typeof component === "string" ? ark[component] : component

      return Reflect.apply(target, thisArg, [base, ...rest])
    },

    get(target, element: keyof JSX.IntrinsicElements | symbol) {
      if (typeof element !== "string") {
        return Reflect.get(target, element)
      }

      if (!cache.has(element)) {
        cache.set(element, panda(ark[element]))
      }

      return cache.get(element) ?? Reflect.get(target, element)
    },
  }) as unknown as ChakraFactory
}

export const chakra = createChakraFactory()
```

This prototype keeps `chakra(Component, recipe)` and `chakra.element` while routing intrinsic elements through Ark before Panda. Ark therefore supplies polymorphism and v6 `render` composition, Panda supplies styling and recipe behavior, and the cache preserves stable intrinsic component identity. The prototype must not assume Ark v6 still provides `asChild`.

Import paths and generated Panda types are provisional. The POC must verify refs, prop forwarding, recipe defaults, component selectors, server rendering, and every supported framework's equivalent factory.

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

## Explicit extraction hints

Remember Panda's `{fn}.raw()` identity helper, available on `css`, patterns, and recipes. It does not change the runtime value; it only tells the compiler to extract an otherwise indirect usage.

This is useful for Storybook args and custom component props:

```tsx
// Mark the object as valid CSS for the extractor.
<Button rootProps={css.raw({ bg: "red.400" })} />

export const Funky: Story = {
  // Mark this as a button recipe usage.
  args: button.raw({
    visual: "funky",
    shape: "circle",
    size: "sm",
  }),
}
```

Include `.raw()` in the POC for supported Chakra recipes, slot recipes, patterns, and CSS helpers. Document it as an explicit extraction escape hatch, not the default authoring style.

## Style contexts

Panda's generated `createStyleContext` is not API-compatible with Chakra's recipe contexts. The adapter must normalize:

- root and slot styles
- props providers
- `unstyled`
- recipe splitting and defaults
- class-name merging

Test one multipart component before choosing between wrapping Panda's helper or retaining Chakra's context API over Panda-generated recipes.

## Open questions

- Should Chakra adopt Ark v6's `render` prop directly, or temporarily preserve `asChild` in Chakra's compatibility layer?
- Can provider selection preserve stable component identity?
- Should each engine expose a separate internal package entry point?
