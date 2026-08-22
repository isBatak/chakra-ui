# Epic 7 — Engine modes

## Outcome

Emotion-only, Panda-only, and dual-engine applications are independently verified.

## Tasks

- [ ] 7.1 Create the Emotion-only fixture.
- [ ] 7.2 Verify no Panda runtime package is loaded.
- [ ] 7.3 Create the Panda-only fixture.
- [ ] 7.4 Verify no Emotion runtime package is loaded.
- [ ] 7.5 Create the dual-engine fixture.
- [ ] 7.6 Select the root engine explicitly.
- [ ] 7.7 Switch one subtree to the other engine.
- [ ] 7.8 Switch back inside a nested subtree.
- [ ] 7.9 Verify Button, ButtonGroup, and Dialog in every fixture.
- [ ] 7.10 Verify SSR and hydration.
- [ ] 7.11 Verify class names remain additive.
- [ ] 7.12 Verify missing adapter errors identify the boundary.

## Gate

All three fixtures pass build, type, runtime, SSR, hydration, and component tests.

## Evidence

- Mode matrix
- Bundle dependency report
- Test links
