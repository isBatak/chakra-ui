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
  theme/          # framework-neutral theme definitions
  shared/         # framework-neutral utilities and metadata
  panda-plugin/   # Chakra factory extraction support
  cli/
  codemod/
```

Keep the existing React package in place. Do not add a `packages/frameworks` nesting level.

Release all four framework packages with one lockstep Chakra version.

## Sharing model

Follow Ark UI's boundary:

- Share framework-neutral utilities, component anatomy, recipes, tokens, metadata, and code-generation inputs.
- Keep rendering, providers, refs, lifecycle code, and framework adapters inside each framework package.
- Depend on the matching Ark UI and Zag.js framework packages.
- Do not create a shared component abstraction that pretends React, Solid, Vue, and Svelte render identically.

The exact `shared`, `theme`, and `panda-plugin` package names are provisional. Create a package only when it has a real build or publishing boundary.

## Dependency direction

```text
theme ───────────────┐
shared ──────────────┼─> react
                     ├─> solid
                     ├─> vue
                     └─> svelte

framework package -> matching Ark UI package -> matching Zag.js package
```

Shared packages must not depend on a UI framework or a framework package.

## Component layout

Use the same component names across framework packages:

```text
packages/react/src/components/button/
packages/solid/src/components/button/
packages/vue/src/components/button/
packages/svelte/src/components/button/
```

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
3. Verify theme and recipe reuse without importing framework runtime code.
4. Measure how much source is genuinely shared.
5. Add the remaining frameworks only after the boundary is validated.

## Open questions

- Should framework packages depend directly on `theme`, or consume generated Panda output?
- Are `theme` and `shared` public packages or private workspace packages?
- Should charts follow the same four-framework policy?
- How are framework parity exceptions approved?
