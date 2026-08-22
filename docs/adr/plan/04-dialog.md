# Epic 4 — Dialog multipart prototype

## Outcome

The factory, types, and both StyleSystem adapters prove one Ark v5 multipart component.

## Related ADRs

- [ADR 0003 — Factory and style contexts](../0003-factory-and-style-contexts.md)
- [ADR 0002 — Styling engine adapter](../0002-styling-engine-adapter.md)
- [ADR 0010 — Canonical styling-system types](../0010-canonical-styling-system-types.md)

## Tasks

- [ ] 4.1 List the Dialog parts and their Ark v5 primitives.
- [ ] 4.2 Define and generate the Dialog slot-recipe prop types.
- [ ] 4.3 Define the slot-style context.
- [ ] 4.4 Build Dialog Root without styling logic.
- [ ] 4.5 Build Trigger and CloseTrigger with `asChild`.
- [ ] 4.6 Build Positioner, Backdrop, and Content with the factory.
- [ ] 4.7 Build Header, Title, Body, and Footer with the factory.
- [ ] 4.8 Resolve every slot through the StyleSystem.
- [ ] 4.9 Preserve Ark refs, props, data attributes, portal, and presence.
- [ ] 4.10 Test open, close, Escape, focus return, and nested composition.
- [ ] 4.11 Test every slot with Emotion.
- [ ] 4.12 Test every slot with Panda.
- [ ] 4.13 Add public type tests.
- [ ] 4.14 Test user `className` with both adapters.
- [ ] 4.15 Save rendered HTML fixtures.

## Gate

Dialog passes Ark behavior, public type, and slot-style tests through the same factory and adapters used by Button.

## Evidence

- Part-to-primitive map
- Type-test result
- Emotion test result
- Panda test result
