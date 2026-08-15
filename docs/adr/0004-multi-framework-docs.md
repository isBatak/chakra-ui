# ADR 0004: Official multi-framework documentation

Status: Proposed

## Decision

Chakra v4 targets official React, Solid, Vue, and Svelte components, built on the matching Ark UI and Zag.js packages.

Every component example should provide framework tabs. A framework selector in the sidebar sets the default tab across the site.

## UX

- Frameworks: React, Solid, Vue, Svelte.
- Persist the selection locally.
- Changing the sidebar selection updates the preferred tab, not the current URL.
- A reader may still select a different tab for one example.
- Missing examples must be labeled; never silently show React code.

## Content model

Store examples by component, example name, and framework:

```ts
examples.button.basic.react
examples.button.basic.solid
examples.button.basic.vue
examples.button.basic.svelte
```

Shared prose should describe behavior and accessibility. Framework-specific prose should be exceptional.

## Delivery plan

1. Build the selector and tab preference model.
2. Convert one component page end to end.
3. Define framework example validation.
4. Add coverage reporting for missing framework examples.
5. Scale only after authoring effort is measured.

## Open questions

- Are all four packages released together or independently?
- Must every framework reach feature parity before the first v4 prerelease?
- Which framework owns the canonical example when APIs differ?
