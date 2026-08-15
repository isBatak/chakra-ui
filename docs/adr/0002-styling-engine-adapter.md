# ADR 0002: Styling engine adapter

Status: Proposed

## Decision

Allow Emotion and Panda components in the same React application so migration can be gradual.

The root provider sets the preferred engine:

```tsx
<ChakraProvider stylingEngine="emotion">
  <App />
</ChakraProvider>
```

A lightweight provider can override it for a subtree, and a component prop can override it for one component:

```tsx
<ChakraProvider stylingEngine="emotion">
  <LegacyPage />

  <StylingEngineProvider value="panda">
    <MigratedPage />

    <Button stylingEngine="emotion">
      Temporary fallback
    </Button>
  </StylingEngineProvider>

  <Button stylingEngine="panda">
    Migrated button
  </Button>
</ChakraProvider>
```

Names are provisional.

## Resolution order

Resolve the engine in this order:

1. Component `stylingEngine` prop.
2. Nearest `StylingEngineProvider`.
3. Root `ChakraProvider` preference.
4. Emotion compatibility default.

The component-only prop is consumed internally and must not reach the DOM.

Engine selection is configuration, not an animation or frequent runtime toggle. Changing it may remount the engine-specific rendered element.

## Provider responsibilities

`ChakraProvider` owns the system, theme, global styles, and root engine preference.

`StylingEngineProvider` only overrides engine selection. It must not re-inject resets, global styles, cascade-layer declarations, or color-mode state.

This separation allows multiple nested migration boundaries without duplicating global output.

## Adapter boundary

Components depend on a stable Chakra adapter contract, not directly on Emotion or Panda.

The public `chakra()` factory returns a stable Chakra wrapper. At render time, the wrapper resolves the selected engine and delegates styling to the matching implementation.

```ts
type StylingEngine = "emotion" | "panda"

interface StylingEngineAdapter {
  createElement: ChakraFactoryImplementation
  createRecipeContext: typeof createRecipeContext
  createSlotRecipeContext: typeof createSlotRecipeContext
  token(path: string, fallback?: string): string
}

function resolveStylingEngine(
  componentPreference?: StylingEngine,
): StylingEngine
```

This is illustrative, not accepted API.

Recipe and style-context helpers must resolve the same engine as the component. A parent recipe context must not accidentally force a different engine on its slots unless explicitly designed to do so.

## Build-time constraint

Panda extracts CSS at build time. Runtime providers and component props cannot generate missing Panda CSS.

Therefore:

- Panda scans all potentially migrated components.
- `@chakra-ui/panda-preset` and generated Panda CSS are included once.
- Colocated `tracking.ts` files identify Chakra component usage.
- Emotion remains available for components that resolve to Emotion.
- Tree shaking should remove an engine only when an application statically opts out of it through a future build entry point.

## Current client components

Current components are client components and read the Emotion-backed system context. In Panda mode:

- Emotion insertion and theme hooks must not run.
- Hooks needed only for Emotion should use Panda-safe implementations, not unconditional React no-ops.
- Token and recipe access should use generated, static data where possible.
- Client boundaries should be removed where no runtime behavior remains.

Mixed subtrees must share Ark/Zag state normally; the styling engine boundary should affect presentation, not component behavior.

## POC

1. Render one component with Emotion and Panda on the same page.
2. Override the root engine for a subtree.
3. Override one component inside that subtree.
4. Test a multipart component whose slots inherit the selected engine.
5. Confirm Panda CSS is extracted for component-prop and subtree usage.
6. Confirm nested providers do not duplicate global styles.
7. Check SSR hydration, refs, `asChild`, portals, and color mode.

## Risks

- Shipping both engines increases bundle size.
- Dynamic selection limits tree shaking.
- Provider-selected factories can make static extraction harder to analyze.
- Switching engines after mount may replace DOM or component identity.
- Emotion and Panda cascade layers may conflict on the same element.
- Portals must retain the logical provider selection.
- A component tree can become harder to debug when every component overrides its engine.

## Guardrails

- Prefer subtree migration over per-component overrides.
- Use the component prop for exceptions and debugging.
- Add a development data attribute or DevTools signal showing the resolved engine.
- Warn when a compound component mixes unsupported engine combinations.
- Keep behavior and accessibility independent from the styling adapter.

## Exit rule

Drop runtime dual-engine support if it requires both runtimes after migration, breaks extraction or hydration, or adds significant branching to every component.

Separate static package entry points remain a fallback for the final v4 release.
