# ADR 0001: Docs-first Panda proof of concept

Status: Proposed

## Decision

Use the documentation app as the first Panda CSS migration target.

Pin the proof of concept to Panda CSS v2 and Chakra's current Ark UI v5 dependency. Do not migrate the React package in this phase.

Run the Ark UI v6 integration only after npm publishes an official v6 beta. Do not block the Panda POC on Ark v6 alpha snapshots or an Ark source checkout.

## Why

The docs exercise tokens, recipes, responsive styles, color mode, SSR, code examples, and many components while keeping production-package risk low.

## Scope

- Configure Panda and generated code in the docs app.
- Migrate one simple component, one multipart component, and one page.
- Keep the current Emotion docs path available for comparison.
- Record build time, CSS size, hydration warnings, and visual differences.

## Not in scope

- Publishing v4 packages.
- Removing Emotion.
- Migrating every docs page.
- Finalizing the public adapter API.
- Upgrading to Ark UI v6 before an official beta is published.

## Open questions

- Should the POC use a dedicated docs route or a provider toggle on the same route?
