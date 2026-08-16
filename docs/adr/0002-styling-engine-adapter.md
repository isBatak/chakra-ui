# ADR 0002: Styling engine boundaries

Status: Proposed

## Decision

Allow Emotion and Panda components in the same React application so migration can be gradual.

Do not expose a dynamic `stylingEngine` prop on `ChakraProvider` or individual components. The Chakra CLI installs a user-owned Provider component containing one fixed root engine boundary:

```tsx
// Panda-only Provider snippet
<PandaStylingEngine>
  <ChakraProvider>
    <App />
  </ChakraProvider>
</PandaStylingEngine>

// Emotion-only Provider snippet; default for v3 → v4 migration
<EmotionStylingEngine>
  <ChakraProvider>
    <LegacyApp />
  </ChakraProvider>
</EmotionStylingEngine>
```

A boundary can wrap a migrated subtree or one component:

```tsx
<PandaStylingEngine>
  <ChakraProvider>
    <MigratedApp />

    <EmotionStylingEngine>
      <LegacyPage />

      <PandaStylingEngine>
        <MigratedSection />
      </PandaStylingEngine>
    </EmotionStylingEngine>
  </ChakraProvider>
</PandaStylingEngine>
```

Names are provisional.

## Resolution

A component uses the nearest styling-engine boundary.

The installed Provider snippet contains a root boundary. There is no runtime engine inference or silent fallback.

If a Chakra component renders without an engine boundary, throw a configuration error that tells the user to install and mount an adapter from `@chakra-ui/panda` or `@chakra-ui/emotion`.

The v3 → v4 CLI migration installs or updates the Provider snippet with `EmotionStylingEngine` to preserve current behavior. Panda-only setup rewrites that owned snippet to `PandaStylingEngine`. Dual-engine setup keeps Panda in the Provider and wraps remaining legacy subtrees in Emotion boundaries.

The Provider snippet belongs to the application. Users may edit its structure after installation.

The CLI must never overwrite an existing Provider file. During migration it inspects the file, leaves it untouched, and stops with manual migration instructions. Applying those changes remains an explicit user action.

Generating a Provider diff is the preferred future improvement, but it is out of scope for this v4 plan.

The CLI and build integration may detect `panda.config.*` to install or validate `@chakra-ui/panda-preset`, generated CSS, and extraction settings. Runtime components cannot reliably inspect project configuration files, so config detection must not become a hidden runtime engine selector.

The boundary components provide a fixed adapter and accept only `children`. They do not accept an engine value that application state can toggle.

Changing engines requires changing the JSX boundary. This makes the migration visible in code review and discourages engine selection as interactive runtime state.

## Provider responsibilities

`ChakraProvider` owns the system, theme, global styles, and color mode. It does not select a styling engine. The fixed engine boundary wraps `ChakraProvider` inside the user-owned Provider snippet.

`EmotionStylingEngine` and `PandaStylingEngine` only provide a fixed engine adapter. They must not re-inject resets, global styles, cascade-layer declarations, or color-mode state.

This separation allows nested migration boundaries without duplicating global output.

## Adapter boundary

`@chakra-ui/react` owns an engine-neutral adapter contract. The contract is experimental in v4. Components depend on that contract, not directly on Emotion or Panda.

Each styling engine lives in a separate package:

- `@chakra-ui/panda` exports the Panda adapter and `PandaStylingEngine`.
- `@chakra-ui/emotion` exports the Emotion adapter and `EmotionStylingEngine`.
- Future packages may implement the same contract for Tailwind, styled-components, or another engine.

Component imports remain in `@chakra-ui/react` regardless of the installed engine packages.

## Stability

Treat the engine adapter implementation contract as experimental in v4. Panda and Emotion are the first validation implementations.

Communicate this status in the adapter documentation, release notes, and this ADR. Do not add `experimental` or `unstable` to API names, symbols, or import paths.

Export the adapter-author contract from the dedicated `@chakra-ui/react/styling-engine` entry point:

```ts
import type { StylingEngineAdapter } from "@chakra-ui/react/styling-engine"
```

Do not export adapter-author helpers from the main component entry point unless normal component consumers need them.

Do not mark the adapter contract stable until:

1. Panda and Emotion pass the complete conformance suite.
2. At least one independent third adapter, such as Tailwind or styled-components, implements it successfully.
3. A later ADR accepts the resulting contract.

The public component props and canonical style types are separate from this experimental status and remain part of Chakra's supported component API.

All adapters implement the same Panda-canonical public style contract. Those component-facing types are stable, but the adapter implementation API is not. An adapter cannot add engine-specific values to core component props. Capabilities unique to an engine must be exposed only from that adapter package.

The public `chakra()` factory returns a stable Chakra wrapper. At render time, the wrapper reads the nearest fixed boundary and delegates styling to the matching implementation.

```ts
interface StylingEngineAdapter {
  createElement: ChakraFactoryImplementation
  createRecipeContext: typeof createRecipeContext
  createSlotRecipeContext: typeof createSlotRecipeContext
  token(path: string, fallback?: string): string
}

// @chakra-ui/emotion
const EmotionStylingEngine = createStylingEngineBoundary(emotionAdapter)

// @chakra-ui/panda
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
