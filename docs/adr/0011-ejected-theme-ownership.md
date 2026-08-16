# ADR 0011: Ejected theme ownership

Status: Proposed

## Context

Some teams prefer theme files inside the application rather than hidden behind a package. This makes overrides easier to inspect and gives developers and AI tools direct access to the complete theme.

Chakra already supports this direction through [`chakra eject`](https://chakra-ui.com/docs/get-started/cli#chakra-eject).

## Decision

Keep the packaged Chakra theme as the default.

Use `chakra eject` as the opt-in path for copying the theme source into the consumer's codebase. After ejection, the application owns that copy and may change its structure and recipes.

Chakra should document the small amount of glue code required to connect an ejected theme to:

- Emotion only
- Panda only
- both engines during gradual migration

This glue belongs in the consumer's installed Chakra configuration and provider code. Chakra should not add a second runtime theme-loading mechanism.

## Expected CLI behavior

- Do not overwrite existing consumer-owned theme files.
- Clearly list the files created by `chakra eject`.
- Tell the user that future Chakra theme updates are no longer automatic.
- Keep automated upstream diffs or merges out of the initial scope.

## Consequences

- Theme code is visible and easy to customize.
- AI tools can inspect the actual application theme.
- Consumers accept responsibility for maintaining their ejected copy.
- Chakra still maintains one packaged source of truth for users who do not eject.
- Emotion and Panda adapters must accept the same ejected theme contract described in [ADR 0005](./0005-shared-theme.md).

## Open question

Should the CLI generate engine-specific adapter files based on the detected Panda configuration, or install examples for both engines?
