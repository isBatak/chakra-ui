# Epic 2 — Factory prototype

## Outcome

A minimal, engine-neutral Chakra factory consumes the StyleSystem adapter
methods and generated types.

## Related ADRs

- [ADR 0003 — Factory and style contexts](../0003-factory-and-style-contexts.md)
- [ADR 0002 — Styling engine adapter](../0002-styling-engine-adapter.md)
- [ADR 0010 — Canonical styling-system types](../0010-canonical-styling-system-types.md)

## Tasks

- [x] 2.1 Map each factory operation to one StyleSystem method.
- [x] 2.2 Map each factory API to one generated public type.
- [x] 2.3 Write the smallest factory API needed by `chakra("button")`.
- [x] 2.4 Keep Emotion and Panda imports out of the factory package.
- [x] 2.5 Implement intrinsic element creation.
- [x] 2.6 Forward refs.
- [x] 2.7 Preserve intrinsic HTML props.
- [x] 2.8 Support `as`.
- [x] 2.9 Support Ark v5 `asChild`.
- [x] 2.10 Delegate prop splitting to the active StyleSystem.
- [x] 2.11 Delegate style and recipe resolution to the active StyleSystem.
- [x] 2.12 Delegate class-name merging to the active StyleSystem.
- [x] 2.13 Test one intrinsic element with Emotion.
- [x] 2.14 Test the same intrinsic element with Panda.
- [x] 2.15 Test runtime prop filtering.
- [x] 2.16 Test compile-time prop inference.

## Gate

`chakra("button")` passes runtime and type tests through both adapters without
engine-specific factory logic.

Status: passed.

## Evidence

- Factory-to-adapter method map
- Factory-to-type map
- Emotion test result
- Panda test result

Evidence is recorded by the shared `runFactoryAdapterConformance` fixture and
the focused factory runtime and type suites. Emotion and Panda render the same
`chakra("button")` fixture, filter `bg` and `css` from the DOM, preserve native
props and consumer classes, and resolve the inline recipe through their own
adapter. The type suite verifies intrinsic props, polymorphic `as`, refs, Ark v5
`asChild`, recipe helpers, and engine-neutral JSX style props.
