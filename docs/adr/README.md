# Chakra UI v4 architecture plan

Status: Proposed  
Scope: Panda CSS v2 and Ark UI v6 exploration

## Goal

Move Chakra toward build-time CSS and official React, Solid, Vue, and Svelte packages without forcing an immediate Emotion removal.

## ADRs

1. [Docs-first proof of concept](./0001-docs-first-poc.md)
2. [Styling engine adapter](./0002-styling-engine-adapter.md)
3. [Factory and style contexts](./0003-factory-and-style-contexts.md)
4. [Multi-framework documentation](./0004-multi-framework-docs.md)
5. [Shared theme model](./0005-shared-theme.md)
6. [Multi-framework package structure](./0006-package-structure.md)
7. [Lint dynamic styling pitfalls](./0007-eslint-dynamic-styling.md)

## Initial plan

1. Add Panda v2 to the docs only.
2. Rebuild one representative component and page.
3. Add a root provider option for Emotion or Panda.
4. Validate the factory, recipes, hooks, SSR/RSC, and CSS output.
5. Prototype framework-aware examples and navigation.
6. Validate the shared-definition/framework-renderer package structure.
7. Decide whether dual engines are viable before migrating packages.

## Exit criteria

- The same React example works with either engine.
- Panda mode emits no Emotion styles.
- `chakra()` retains style props, recipes, refs, and `asChild`.
- One multipart component validates style-context compatibility.
- One page contains working React, Solid, Vue, and Svelte examples.
- Theme tokens have one source of truth.
- Framework packages can build and publish independently from shared source.

No public v4 API is accepted by these ADRs yet.
