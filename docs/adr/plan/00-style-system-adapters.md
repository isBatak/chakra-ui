# Epic 0 — StyleSystem adapters

## Outcome

Emotion and Panda implement the StyleSystem methods and types consumed by the factory. Implement Emotion first.

## Related ADRs

- [ADR 0002 — Styling engine adapter](../0002-styling-engine-adapter.md)
- [ADR 0010 — Canonical styling-system types](../0010-canonical-styling-system-types.md)

## Contract tasks

- [ ] 0.1 Define the minimal StyleSystem interface from the ADR contracts.
- [ ] 0.2 Define inputs and outputs for prop splitting.
- [ ] 0.3 Define inputs and outputs for style resolution.
- [ ] 0.4 Define inputs and outputs for recipe resolution.
- [ ] 0.5 Define inputs and outputs for slot-recipe resolution.
- [ ] 0.6 Define class-name merging behavior.
- [ ] 0.7 Add adapter conformance tests that call these methods directly.

## Emotion adapter — do first

- [ ] 0.8 Create the Emotion adapter package.
- [ ] 0.9 Implement style-prop splitting.
- [ ] 0.10 Implement token and condition resolution.
- [ ] 0.11 Implement recipe resolution.
- [ ] 0.12 Implement slot-recipe resolution.
- [ ] 0.13 Implement CSS insertion.
- [ ] 0.14 Implement class-name merging.
- [ ] 0.15 Support the `css` and JSX style props required for v3 migration.
- [ ] 0.16 Freeze direct adapter fixtures before Panda work starts.

## Panda adapter — do second

- [ ] 0.17 Create the Panda adapter in the Panda package.
- [ ] 0.18 Depend on the lowest compatible Panda packages.
- [ ] 0.19 Implement style-prop splitting.
- [ ] 0.20 Implement token and condition resolution.
- [ ] 0.21 Implement recipe resolution.
- [ ] 0.22 Implement slot-recipe resolution.
- [ ] 0.23 Emit Panda-compatible class names and extraction metadata.
- [ ] 0.24 Implement class-name merging.
- [ ] 0.25 Run the shared conformance tests against both adapters.

## Gate

Both adapters implement the same StyleSystem contract without depending on the Chakra factory or components.

## Evidence

- Final StyleSystem interface
- Emotion fixtures
- Panda fixtures
- Adapter conformance report
