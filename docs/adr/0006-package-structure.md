# ADR 0006: Multi-framework package structure

Status: Proposed

## Decision

Use top-level framework packages, matching Ark UI's repository model:

```text
packages/
  react/          # @chakra-ui/react
  solid/          # @chakra-ui/solid
  vue/            # @chakra-ui/vue
  svelte/         # @chakra-ui/svelte
  theme/          # framework-neutral theme source
  panda-preset/   # @chakra-ui/panda-preset
  shared/         # framework-neutral utilities and metadata
  panda-plugin/   # Chakra factory extraction support
  cli/
  codemod/
```

Keep the existing React and Panda preset packages in place. Do not add a `packages/frameworks` nesting level.

Release all four framework packages with one lockstep Chakra version.

## Sharing model

Follow Ark UI's boundary:

- Share framework-neutral utilities, component anatomy, recipes, tokens, metadata, and code-generation inputs.
- Keep rendering, providers, refs, lifecycle code, and framework adapters inside each framework package.
- Depend on the matching Ark UI and Zag.js framework packages.
- Package the Panda theme representation in `@chakra-ui/panda-preset`.
- Do not create a shared component abstraction that pretends React, Solid, Vue, and Svelte render identically.

The exact `shared`, `theme`, and `panda-plugin` package names are provisional. The existing `panda-preset` package is retained.

## Dependency direction

```text
theme ──> panda-preset ──┐
theme ───────────────────┼─> react
shared ──────────────────┼─> solid
                         ├─> vue
                         └─> svelte

framework package -> matching Ark UI package -> matching Zag.js package
```

Shared packages must not depend on a UI framework or a framework package. The Panda preset may depend on the neutral theme, never the reverse.

## Component layout

Use the same component names across framework packages:

```text
packages/react/src/components/button/
  button.tsx
  tracking.ts
packages/solid/src/components/button/
  button.tsx
  tracking.ts
packages/vue/src/components/button/
  button.vue
  tracking.ts
packages/svelte/src/components/button/
  button.svelte
  tracking.ts
```

Each `tracking.ts` exports the Panda recipe `jsx` matchers for that framework's public component names. Keep this file declarative: no runtime component imports or behavior.

The Panda preset build aggregates these matchers into recipe definitions. Generated build input prevents a published `panda-preset -> framework package` dependency cycle.

Shared definitions should use stable component IDs so documentation, tests, and generators can compare framework coverage.

## Release rules

- One version and coordinated release.
- A breaking change in any official framework package triggers the same Chakra major/minor policy.
- CI builds and tests every framework package.
- Release notes label framework-specific changes.
- Missing parity must be explicit before publishing.

## POC

1. Create only the minimum shared boundary needed for one component.
2. Implement that component in React and one additional framework.
3. Consume the Panda theme through `@chakra-ui/panda-preset`.
4. Verify theme and recipe reuse without importing framework runtime code.
5. Measure how much source is genuinely shared.
6. Add the remaining frameworks only after the boundary is validated.

## Open questions

- Are `theme` and `shared` public packages or private workspace packages?
- Is the factory extraction plugin exported by `panda-preset` or a separate package?
- Should charts follow the same four-framework policy?
- How are framework parity exceptions approved?
