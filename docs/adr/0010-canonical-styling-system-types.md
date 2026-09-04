# ADR 0010: Canonical styling-system type contract

Status: Proposed

## Context

Global/module augmentation can solve much of the generated-types problem, but React context cannot automatically change a component's generic type.

Avoid separate `PandaSystem` and `EmotionSystem` component types.

The stronger solution is: one canonical public Chakra type system, with two runtime implementations.

```tsx
<Button variant="solid">Click me</Button>
```

The nearest engine boundary changes runtime rendering—not the public props.

## Decision

Generate one canonical, engine-neutral Chakra type contract from the shared theme. Make Panda's generated contract authoritative and make both Panda and Emotion conform to it.

Do not make users select the styling-system type through component generics.

## Generate one canonical contract

Generate engine-neutral Chakra types before producing Panda or Emotion output:

```ts
interface ChakraSystem {
  tokens: Tokens
  conditions: Conditions
  properties: SystemProperties
  recipes: Recipes
  slotRecipes: SlotRecipes
}
```

`@chakra-ui/react/styling-engine` exports the adapter-author contract. Every engine adapter implements it. The component-facing types are canonical; the adapter implementation interface remains experimental in v4:

```ts
interface StylingEngine<System extends ChakraSystem> {
  css(value: SystemStyleObject<System>): string
  recipe<K extends keyof System["recipes"]>(
    key: K,
    props: RecipeProps<System, K>,
  ): string
}
```

Panda, Emotion, and future adapters may implement styling differently, but component props come from the same contract. An adapter that cannot represent the canonical inputs does not satisfy the Chakra adapter contract.

## Use module augmentation for application extensions

For v4, the consumer manually augments Chakra's default system:

```ts
declare module "@chakra-ui/react" {
  interface ChakraSystemRegister {
    system: AppSystem
  }
}
```

Chakra resolves the registered system:

```ts
interface ChakraSystemRegister {}

type RegisteredSystem =
  ChakraSystemRegister extends { system: infer System }
    ? System
    : DefaultChakraSystem
```

Then:

```ts
type ButtonProps = HTMLChakraProps<
  "button",
  RecipeProps<RegisteredSystem, "button">
>
```

This gives application-added tokens and variants to every component. The consumer is responsible for keeping this augmentation aligned with the theme extension used by Panda and Emotion:

```tsx
<Button variant="marketing" colorPalette="brand" />
```

This is similar to libraries that use application-wide type registration: one application-wide type contract, selected through module augmentation.

## Make Panda types canonical

Because Panda is the v4 default, Panda's generated contract should be authoritative.

The Emotion compatibility package should adapt to those inputs:

```ts
const emotionEngine: StylingEngine<RegisteredSystem> = {
  css(style) {
    return emotionCss(convertToEmotion(style))
  },

  recipe(key, props) {
    return emotionRecipe(key, props)
  },
}
```

This avoids exposing two almost-identical public type systems.

If something is supported only by Emotion, it should live in `@chakra-ui/emotion` instead of widening every Chakra component:

```tsx
import { EmotionBox } from "@chakra-ui/emotion"
```

## Why component generics will not fully solve it

This is technically possible:

```tsx
<Button<PandaSystem> variant="solid" />
<Button<EmotionSystem> variant="solid" />
```

But the provider cannot supply that generic:

```tsx
<EmotionStylingEngine>
  <Button /> {/* TypeScript cannot infer EmotionSystem from context */}
</EmotionStylingEngine>
```

TypeScript checks `Button` independently from its React ancestors. It cannot connect the nearest provider's runtime value to the child's generic parameter.

It would also allow invalid combinations:

```tsx
<EmotionStylingEngine>
  <Button<PandaSystem />
</EmotionStylingEngine>
```

Generic polymorphic components also become complicated when combined with:

- `forwardRef`
- `as` and `asChild`
- intrinsic element props
- recipe inference
- slot recipes
- compound components

Generics could still be an internal escape hatch, but should not be the main user API.

## Important distinction

The theme origin may be identical, but these types can still differ:

- Accepted conditional and responsive values
- The `css` prop's input shape
- Recipe runtime return type: style objects versus class strings
- Generated token literals
- Slot recipe metadata
- Runtime-only Emotion values that Panda cannot statically extract

Do not merge Panda's and Emotion's generated types afterward. Generate one neutral contract first, then make both engines conform to it.

## Intended API

```tsx
// Panda runtime by default
<Button variant="solid">Click me</Button>

<EmotionStylingEngine>
  {/* Same props and types; different runtime implementation */}
  <Button variant="solid">Click me</Button>
</EmotionStylingEngine>
```

The architecture is:

```text
shared theme/schema
        ↓
canonical Chakra types
        ↓
  ┌─────┴─────┐
Panda runtime  Emotion adapter
```

## Type-first POC

The same `ButtonProps` declarations must compile under both runtimes, while app-added Panda variants work through module augmentation.

Validate:

1. Default tokens, conditions, recipes, and slot recipes.
2. App-added tokens and recipe variants.
3. `HTMLChakraProps` and `SystemStyleObject`.
4. `as`, `asChild`, intrinsic props, and ref inference.
5. Recipe and slot-recipe inference.
6. The `css` prop under both runtime implementations.
7. Clean public declarations with no `any` or `@ts-ignore`.
8. Emotion-only capabilities remaining isolated in `@chakra-ui/emotion`.

## Deferred automation

Automatically generating `ChakraSystemRegister` from `panda.config.*` is the preferred future direction, but it is out of scope for v4. The v4 POC documents the manual declaration and validates it in consumer fixtures.

## Consequences

- Consumers use the same component types under both runtimes.
- Engine boundaries affect runtime behavior only.
- Panda codegen owns application type augmentation.
- Emotion cannot introduce incompatible inputs into core component props.
- Runtime selection and compile-time type selection remain intentionally separate.
- The compatibility layer must reject or isolate Emotion features that Panda cannot represent.
- Future Tailwind, styled-components, or other adapters must pass the same canonical type suite.
- Passing the type suite does not make the adapter implementation API stable in v4.

## Related ADRs

- [Styling engine boundaries](./0002-styling-engine-adapter.md)
- [Factory and style contexts](./0003-factory-and-style-contexts.md)
- [Shared theme model](./0005-shared-theme.md)
- [Compare the Panda v2 migration design](./0008-panda-v2-migration-comparison.md)
