# Chakra UI v4 architecture plan

Status: Proposed  
Scope: Panda CSS v2 and Ark UI v6 exploration

## Goal

Move Chakra's React package toward build-time CSS without forcing an immediate Emotion removal. Chakra v4 focuses only on React; official Solid, Vue, and Svelte support is planned for Chakra v5.

## ADRs

1. [Docs-first proof of concept](./0001-docs-first-poc.md)
2. [Styling engine adapter](./0002-styling-engine-adapter.md)
3. [Factory and style contexts](./0003-factory-and-style-contexts.md)
5. [Shared theme model](./0005-shared-theme.md)
7. [Lint dynamic styling pitfalls](./0007-eslint-dynamic-styling.md)
8. [Compare the Panda v2 migration design](./0008-panda-v2-migration-comparison.md)
9. [Upgrade to Ark UI v6](./0009-ark-ui-v6.md)
10. [Canonical styling-system type contract](./0010-canonical-styling-system-types.md)

## Initial plan

1. Add Panda v2 to the docs only.
2. Rebuild one representative component and page.
3. Add fixed Emotion and Panda styling-engine boundaries, with Panda as the default.
4. Validate the factory, recipes, hooks, SSR/RSC, and CSS output.
5. Keep the documentation and package POC focused on React.
6. Decide whether dual engines are viable before migrating packages.

## Exit criteria

- The same React example works with either engine.
- Panda mode emits no Emotion styles.
- `chakra()` retains style props, recipes, refs, and `asChild`.
- One multipart component validates style-context compatibility.
- Theme tokens have one source of truth.
- The React package and Panda preset share one theme source without a runtime dependency cycle.

No public v4 API is accepted by these ADRs yet.
