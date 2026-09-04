# ADR 0009: Upgrade to Ark UI v6

Status: Proposed — blocked until an official Ark UI v6 beta is published

## Context

Chakra v4 should align with [Ark UI v6 RFC #3616](https://github.com/chakra-ui/ark/issues/3616).

The RFC introduces three relevant changes:

- `render` becomes the preferred composition API.
- The Ark v6 React implementation keeps `asChild` as deprecated compatibility and marks it for removal in the next major.
- indicators use state-aware `render` callbacks
- generic `data-scope` and `data-part` attributes become component-specific attributes
- anatomy exports move to framework anatomy entry points

## Availability

As of August 16, 2026, npm has no official Ark UI v6 beta. The published release line remains v5; only timestamped v6 alpha snapshots are discoverable.

Use Ark UI v5 for the Panda, type, theme, factory, docs, engine-mode, and migration-tooling POCs. Do not use a timestamped alpha or source checkout as Chakra v4's dependency.

Move this upgrade to the final integration epic. Start it only when npm publishes an official v6 beta.

## Decision

Target Ark UI v6 as the final behavior and composition foundation for Chakra v4, after the beta availability gate passes.

Design the new Chakra factory around Ark v6 `render` composition.

Preserve `asChild` in Chakra v4 by inheriting Ark v6's deprecated React compatibility. Do not build a second Chakra-owned adapter. New Chakra internals and documentation should use `render`, while existing v3 applications can keep `asChild` during the v4 migration.

Remove Chakra's `asChild` support when the underlying Ark compatibility is removed in its next major.

## Composition

Ark v5:

```tsx
<Popover.Trigger asChild>
  <Button>Open</Button>
</Popover.Trigger>
```

Ark v6 preferred API:

```tsx
<Popover.Trigger render={<Button>Open</Button>} />
```

Ark v6 React compatibility:

```tsx
// Deprecated, but preserved for the v4 migration window.
<Popover.Trigger asChild>
  <Button>Open</Button>
</Popover.Trigger>
```

The `chakra()` factory must preserve refs, event handlers, class names, style props, and Panda recipe classes when used through `render`.

Test both element and callback forms:

```tsx
<Popover.Trigger render={<Button>Open</Button>} />

<Popover.Trigger
  render={(props) => <Button {...props}>Open</Button>}
/>
```

## Indicator migration

Review Chakra wrappers for Checkbox, Menu, Clipboard, Radio Group, and other indicator components.

Prefer one state-aware indicator API where Ark v6 exposes status to `render`. Chakra icons and layout defaults should not hide the underlying state model.

## Theme selector alignment

Ark v6 replaces generic part selectors such as:

```css
[data-scope="combobox"][data-part="trigger"]
```

with component-specific attributes such as:

```css
[data-combobox-trigger]
```

The exact final attribute names and values must be verified against the released Ark v6 DOM contract.

### Current recipe inventory

The current Chakra theme contains these direct Ark part selectors:

| Recipe | Current selector | Expected v6 direction |
| --- | --- | --- |
| `tag.ts` | `&:has([data-scope=avatar])` | `&:has([data-avatar-root])` |
| `combobox.ts` | `&:has([data-part=trigger])` | `&:has([data-combobox-trigger])` |
| `combobox.ts` | `&:has([data-part=clear-trigger])` | `&:has([data-combobox-clear-trigger])` |
| `combobox.ts` | `[data-scope=combobox][data-part=empty]` | `[data-combobox-empty]` |
| `splitter.ts` | `[data-part='resize-trigger'][data-orientation=...]` | `[data-splitter-resize-trigger][data-orientation=...]` |
| `steps.ts` | `& [data-part=separator]` | `& [data-steps-separator]` |

The same selectors are mirrored in:

- `packages/panda-preset/src/slot-recipes/tag.ts`
- `packages/panda-preset/src/slot-recipes/combobox.ts`
- `packages/panda-preset/src/slot-recipes/splitter.ts`
- `packages/panda-preset/src/slot-recipes/steps.ts`

Update the shared theme source once, then generate both Chakra and Panda preset output. Do not fix the two copies independently.

State conditions such as `_open`, `_checked`, and `_disabled` are separate from part identification. Audit them against the final Ark v6 output, but do not rename them solely because `data-scope` and `data-part` changed.

## Selector ownership

Avoid handwritten knowledge of Ark DOM attributes across recipes.

Prefer one of:

1. selectors exported from Ark v6
2. generated selectors from Ark anatomy metadata
3. Chakra-owned selector helpers tested against Ark's rendered DOM

Add integration snapshots that render every styled Ark part and verify that the recipe selector matches it.

## Anatomy imports

Use the new framework anatomy entry point where shared anatomy metadata is needed:

```ts
import { dialogAnatomy } from "@ark-ui/react/anatomy"
```

Framework packages should import anatomy from their matching Ark package rather than depending on React anatomy.

## POC

0. Confirm npm publishes an official Ark UI v6 beta. Stop if it does not.
1. Upgrade Button and Dialog to that exact beta.
2. Use `render` in new and migrated Chakra internals.
3. Verify existing `asChild` usage still works through Ark's deprecated compatibility.
4. Test the Panda + Ark `chakra()` factory through both `render` and deprecated `asChild`.
5. Migrate Combobox selectors to component-specific attributes.
6. Generate the same selectors into `@chakra-ui/panda-preset`.
7. Add DOM/recipe integration snapshots.

## Exit rule

Do not block the earlier Panda architecture work on Ark v6 availability. Do not cut the Chakra v4 prerelease until the accepted Ark v6 beta integration gate passes.

## Open questions

- Does the final Ark v6 release preserve the deprecated React `asChild` compatibility exactly as implemented in PR #3920?
- Will Ark v6 export stable selector or part metadata?
- Are component-specific attribute names identical across React, Solid, Vue, and Svelte?
- Can all duplicated Panda preset selectors be generated from the shared theme source?

## Related ADRs

- [Factory and style contexts](./0003-factory-and-style-contexts.md)
- [Shared theme model](./0005-shared-theme.md)
- [Multi-framework package structure](./0006-package-structure.md)
