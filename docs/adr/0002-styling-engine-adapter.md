# ADR 0002: Styling engine adapter

Status: Proposed

## Decision

Select the styling engine at the application root:

```tsx
<ChakraProvider stylingEngine="panda">
  <App />
</ChakraProvider>
```

The provider supplies an internal adapter for the factory, recipes, style contexts, global styles, tokens, and engine-specific hooks. The shape should resemble a framework adapter: components depend on a stable Chakra contract, not directly on Emotion or Panda.

## Constraints

Panda extracts CSS at build time. A runtime provider cannot make extraction conditional. During the POC, Panda CSS must be generated even when Emotion is selected.

Current components are client components and read the Emotion-backed system context. In Panda mode:

- Emotion insertion and theme hooks must not run.
- Hooks needed only for Emotion should use Panda-safe implementations, not unconditional React no-ops.
- Token and recipe access should use generated, static data where possible.
- Client boundaries should be removed where no runtime behavior remains.

## POC contract

```ts
interface StylingEngineAdapter {
  chakra: ChakraFactory
  createRecipeContext: typeof createRecipeContext
  createSlotRecipeContext: typeof createSlotRecipeContext
  token(path: string, fallback?: string): string
}
```

This is illustrative, not accepted API.

## Risks

- Both engines may increase bundle size.
- Provider-selected factories can make static extraction harder to analyze.
- Context-created component identities must remain stable.
- Emotion and Panda cascade layers may conflict.

## Exit rule

Drop dual-engine support if it requires both runtimes in production, breaks extraction, or adds significant component branching.
