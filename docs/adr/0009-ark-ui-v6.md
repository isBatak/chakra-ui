# ADR 0009: Upgrade to Ark UI v6

Status: Proposed

## Context

Chakra v4 should align with [Ark UI v6 RFC #3616](https://github.com/chakra-ui/ark/issues/3616).

The RFC introduces three relevant changes:

- `asChild` is replaced by an explicit `render` prop.
- indicators use state-aware `render` callbacks
- generic `data-scope` and `data-part` attributes become component-specific attributes
- anatomy exports move to framework anatomy entry points

## Decision

Use Ark UI v6 as the behavior and composition foundation for Chakra v4.

Do not design the new Chakra factory around Ark's current `asChild` implementation. Prototype Ark v6 `render` composition first.

Chakra may keep `asChild` temporarily as a compatibility feature, but it would be Chakra-owned migration behavior rather than inherited Ark v6 behavior.

## Composition

Ark v5:

```tsx
<Popover.Trigger asChild>
  <Button>Open</Button>
</Popover.Trigger>
```

Ark v6:

```tsx
<Popover.Trigger render={<Button>Open</Button>} />
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

1. Upgrade one simple component and one multipart component to Ark v6.
2. Replace `asChild` usage with `render`.
3. Test the Panda + Ark `chakra()` factory through `render`.
4. Migrate Combobox selectors to component-specific attributes.
5. Generate the same selectors into `@chakra-ui/panda-preset`.
6. Add DOM/recipe integration snapshots.
7. Repeat the POC in one non-React framework.

## Open questions

- Does Chakra v4 expose `render` directly or keep a deprecated `asChild` adapter?
- Will Ark v6 export stable selector or part metadata?
- Are component-specific attribute names identical across React, Solid, Vue, and Svelte?
- Can all duplicated Panda preset selectors be generated from the shared theme source?

## Related ADRs

- [Factory and style contexts](./0003-factory-and-style-contexts.md)
- [Shared theme model](./0005-shared-theme.md)
- [Multi-framework package structure](./0006-package-structure.md)
