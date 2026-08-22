# Epic 8 — Migration tooling

## Outcome

A v3 Emotion application can adopt v4 without destructive CLI behavior.

## Tasks

- [ ] 8.1 Assume Emotion for the default migration path.
- [ ] 8.2 Detect `panda.config.*` when Panda is present.
- [ ] 8.3 Preserve the user-owned ChakraProvider.
- [ ] 8.4 Do not overwrite existing theme files.
- [ ] 8.5 Add only missing imports or dependencies.
- [ ] 8.6 Produce a readable proposed diff.
- [ ] 8.7 Keep automatic diff application out of scope.
- [ ] 8.8 Document manual Panda and dual-engine opt-in.
- [ ] 8.9 Document how to share or extend theme definitions.
- [ ] 8.10 Exclude CLI integration tests from this plan.

## Gate

Migration instructions are additive, explicit, reversible, and do not overwrite user code.

## Evidence

- Example migration diff
- Manual verification checklist
