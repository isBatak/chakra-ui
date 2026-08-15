# ADR 0002: Styling engine boundaries

Status: Proposed

## Decision

Allow Emotion and Panda components in the same React application so migration can be gradual.

Do not expose a dynamic `stylingEngine` prop on `ChakraProvider` or individual components. Select the engine with fixed JSX boundaries:

```tsx
<ChakraProvider>
  <App />
</ChakraProvider>

// Legacy application during gradual migration
<ChakraProvider>
  <EmotionStylingEngine>
    <LegacyApp />
  </EmotionStylingEngine>
</ChakraProvider>
```

A boundary can wrap a migrated subtree or one component:

```tsx
<ChakraProvider>
  <EmotionStylingEngine>
    <LegacyPage />

    <PandaStylingEngine>
      <MigratedSection />

      <EmotionStylingEngine>
        <TemporaryFallback />
      </EmotionStylingEngine>
    </PandaStylingEngine>

    <PandaStylingEngine>
      <Button>Migrated button</Button>
    </PandaStylingEngine>
  </EmotionStylingEngine>
</ChakraProvider>
```

Names are provisional.

## Resolution

A component uses the nearest styling-engine boundary.

When no boundary exists, use Panda as the Chakra v4 default.

A legacy application that still needs Emotion wraps its root or remaining legacy subtree in `EmotionStylingEngine`. There is no silent runtime fallback from Panda to Emotion.

The CLI and build integration may detect `panda.config.*` to install or validate `@chakra-ui/panda-preset`, generated CSS, and extraction settings. Runtime components cannot reliably inspect project configuration files, so config detection must not become a hidden runtime engine selector.

The boundary components provide a fixed adapter and accept only `children`. They do not accept an engine value that application state can toggle.

Changing engines requires changing the JSX boundary. This makes the migration visible in code review and discourages engine selection as interactive runtime state.

## Provider responsibilities

`ChakraProvider` owns the system, theme, global styles, and color mode. It does not select a styling engine.

`EmotionStylingEngine` and `PandaStylingEngine` only provide a fixed engine adapter. They must not re-inject resets, global styles, cascade-layer declarations, or color-mode state.

This separation allows nested migration boundaries without duplicating global output.

## Adapter boundary

Components depend on a stable Chakra adapter contract, not directly on Emotion or Panda.

The public `chakra()` factory returns a stable Chakra wrapper. At render time, the wrapper reads the nearest fixed boundary and delegates styling to the matching implementation.

```ts
interface StylingEngineAdapter {
  createElement: ChakraFactoryImplementation
  createRecipeContext: typeof createRecipeContext
  createSlotRecipeContext: typeof createSlotRecipeContext
  token(path: string, fallback?: string): string
}

const EmotionStylingEngine = createStylingEngineBoundary(emotionAdapter)
const PandaStylingEngine = createStylingEngineBoundary(pandaAdapter)
```

This is illustrative, not accepted API.

Recipe and style-context helpers must resolve the same engine as the component. A multipart component should normally have one boundary around its root so all slots use the same adapter.

## Why boundaries instead of props

Fixed boundaries:

- make migration intent explicit
- discourage state-driven engine changes
- avoid adding an engine prop to every component
- prevent the internal prop from leaking to the DOM
- give DevTools and code search a clear migration boundary
- let one wrapper handle the root, a subtree, or a single component

A conditional application can still mount different boundaries, but that is an explicit structural choice and may remount the affected subtree.

## Build-time constraint

Panda extracts CSS at build time. JSX boundaries cannot generate missing Panda CSS.

Therefore:

- Panda scans all potentially migrated components.
- `@chakra-ui/panda-preset` and generated Panda CSS are included once.
- Colocated `tracking.ts` files identify Chakra component usage.
- Emotion remains available inside Emotion boundaries.
- Tree shaking should remove an engine only when an application statically opts out through a future build entry point.

## Current client components

Current components are client components and read the Emotion-backed system context. In Panda boundaries:

- Emotion insertion and theme hooks must not run.
- Hooks needed only for Emotion should use Panda-safe implementations, not unconditional React no-ops.
- Token and recipe access should use generated, static data where possible.
- Client boundaries should be removed where no runtime behavior remains.

Mixed boundaries must share Ark/Zag state normally; an engine boundary affects presentation, not component behavior.

## POC

1. Render Emotion and Panda versions of one component on the same page.
2. Confirm Panda is used when no boundary exists.
3. Wrap a legacy application in an Emotion boundary, then override one subtree with Panda.
4. Override one component with a nested boundary.
5. Test a multipart component with one boundary around its root.
6. Confirm Panda CSS is extracted for all Panda-boundary usage.
7. Confirm nested boundaries do not duplicate global styles.
8. Check SSR hydration, refs, `asChild`, portals, and color mode.

## Risks

- Shipping both engines increases bundle size.
- Context-based selection limits tree shaking.
- Provider-selected factories can make static extraction harder to analyze.
- Replacing a boundary after mount may remount its subtree.
- Emotion and Panda cascade layers may conflict on the same page.
- Portals must retain the logical boundary context.
- Excessive single-component boundaries can make the tree noisy.

## Guardrails

- Prefer one boundary around a migrated feature or route.
- Use a single-component boundary only for incremental exceptions.
- Wrap a compound component at its root rather than mixing engines between slots.
- Add a development data attribute or DevTools signal showing the resolved engine.
- Keep behavior and accessibility independent from the styling adapter.

## Exit rule

Drop runtime dual-engine support if it requires both runtimes after migration, breaks extraction or hydration, or adds significant branching to every component.

Separate static package entry points remain a fallback for the final v4 release.
