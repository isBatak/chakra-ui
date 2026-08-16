# Chakra UI v4 implementation plan

Status: Proposed  
Scope: React, Panda CSS v2, Ark UI v5 for the POC, and Ark UI v6 beta for final integration  
Source: ADRs 0001–0011

## Start here

Work on one unchecked task at a time.

1. Open the current epic.
2. Complete the first unchecked task.
3. Attach the evidence requested by that epic.
4. Stop when you reach its gate.
5. Get the gate reviewed before opening the next epic.

Do not start a later epic because it looks easier or more interesting. The order protects the project from doing expensive work on an invalid assumption.

## Fixed POC choices

- Simple component: Button
- Multipart component: Dialog
- Representative docs page: Dialog
- Public component import: `@chakra-ui/react`
- Engine modes: Emotion-only, Panda-only, and both
- Provider model: user-owned component installed by the Chakra CLI
- Root boundary: explicit inside the installed Provider snippet
- Panda-only root: `PandaStylingEngine`
- v3 → v4 migration default: `EmotionStylingEngine`
- Emotion-only root: `EmotionStylingEngine`
- Dual-engine root/default: `PandaStylingEngine`
- Core package: engine-neutral `@chakra-ui/react`
- Panda adapter package: `@chakra-ui/panda`
- Recommended v4 Panda entry point: `@chakra-ui/panda`
- Compatibility package retained: `@chakra-ui/panda-preset`
- Panda preset remains framework-neutral and has no React dependency
- Theme source stays packaged by default
- `chakra eject` is the opt-in path for local theme ownership
- Users maintain the ejected copy and connect it to their engine adapters
- Panda MCP is the non-ejection option for AI theme inspection
- Consumers own v4 theme extension and module augmentation
- Documentation recommends one shared `theme.ts` consumed by both engines
- Separate Emotion and Panda theme extensions remain supported when consumers keep them aligned
- Automatic augmentation generation is preferred future work and out of v4 scope
- Emotion adapter package: `@chakra-ui/emotion`
- Panda boundary: `PandaStylingEngine` imported from `@chakra-ui/panda`
- Legacy override: `EmotionStylingEngine` imported from `@chakra-ui/emotion`
- Public component style types: one stable Panda-canonical, engine-neutral contract
- Engine adapter implementation contract: documented as experimental in v4
- Adapter API names and import paths do not use `experimental` or `unstable`
- Adapter contract entry point: `@chakra-ui/react/styling-engine`
- Adapter contract stabilization requires a third engine and a new ADR
- Every adapter must conform to the same core component props
- Engine-specific capabilities stay inside the adapter package
- Future engine adapters may be published without changing component imports or props
- Configuration: `panda.config.*` plus Chakra CLI detection
- Users own and may edit the installed Provider component
- Missing engine behavior: throw a clear configuration error
- The CLI never overwrites an existing Provider file
- Provider diff generation is preferred future work and out of v4 scope
- Separate `chakra.config.*`: none

## Epic checklist

Complete these files from top to bottom:

- [ ] [Epic 0 — Lock scope and success criteria](./plan/00-scope-and-success.md)
- [ ] [Epic 1 — Freeze the Ark UI v5 baseline](./plan/01-ark-ui-v5-baseline.md)
- [ ] [Epic 2 — Prove the generated public type contract](./plan/02-generated-types.md)
- [ ] [Epic 3 — Generate both engines from one theme](./plan/03-theme-and-packaging.md)
- [ ] [Epic 4 — Implement the Panda-backed Chakra factory](./plan/04-chakra-factory.md)
- [ ] [Epic 5 — Rebuild recipe contexts](./plan/05-recipe-contexts.md)
- [ ] [Epic 6 — Run the Dialog docs POC](./plan/06-docs-poc.md)
- [ ] [Epic 7 — Prove all three engine modes](./plan/07-engine-modes.md)
- [ ] [Epic 8 — Build migration tooling](./plan/08-migration-tooling.md)
- [ ] [Epic 9 — Integrate the published Ark UI v6 beta](./plan/09-ark-ui-v6.md)
- [ ] [Epic 10 — Make the prerelease decision](./plan/10-prerelease.md)

## What counts as done

A task is done only when its result can be inspected.

For code tasks, add the smallest relevant automated test.  
For type tasks, add a type test.  
For build tasks, attach the command and output.  
For measurements, attach the value and measurement method.  
For decisions, link the written decision.  
For visual work, attach the comparison.

Never use `any`, an assertion, or `@ts-ignore` to make a gate appear to pass. Record the blocker and stop.

## Scope boundaries

- v4 supports React only.
- Other framework support is planned for v5.
- Panda starts as an opt-in beta.
- Epics 0–8 use Ark UI v5.
- Epic 9 starts only after npm publishes an official Ark UI v6 beta.
- Timestamped Ark v6 alpha builds and source checkouts do not satisfy the availability gate.
- No ADR is accepted merely because its tasks appear in this plan.
