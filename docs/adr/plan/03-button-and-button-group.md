# Epic 3 — Button and ButtonGroup prototype

## Outcome

The factory, types, and both StyleSystem adapters prove a single-part component
and its group composition.

## Related ADRs

- [ADR 0003 — Factory and style contexts](../0003-factory-and-style-contexts.md)
- [ADR 0002 — Styling engine adapter](../0002-styling-engine-adapter.md)
- [ADR 0010 — Canonical styling-system types](../0010-canonical-styling-system-types.md)

## Tasks

- [x] 3.1 Define and generate the Button recipe prop types.
- [x] 3.2 Build Button with the factory.
- [x] 3.3 Preserve loading, disabled, ref, `as`, and `asChild` behavior.
- [x] 3.4 Apply recipe defaults through the StyleSystem.
- [x] 3.5 Apply variant and size selections.
- [x] 3.6 Preserve user `className`.
- [x] 3.7 Define the ButtonGroup context contract.
- [x] 3.8 Build ButtonGroup layout.
- [x] 3.9 Pass shared size and variant values to child Buttons.
- [x] 3.10 Allow a child Button to override a group value.
- [ ] 3.11 Test standalone Button with Emotion.
- [ ] 3.12 Test ButtonGroup with Emotion.
- [ ] 3.13 Test standalone Button with Panda.
- [ ] 3.14 Test ButtonGroup with Panda.
- [ ] 3.15 Add public type tests.
- [ ] 3.16 Save rendered HTML fixtures.

## Gate

Button and ButtonGroup pass behavior, type, recipe, context, ref, and HTML tests
through both adapters.

## Evidence

- Component API diff
- Type-test result
- Emotion test result
- Panda test result
