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

## Alternative: Panda MCP server

[Panda's local MCP server](https://panda-css.com/docs/ai/mcp-server) can expose the resolved design system to AI tools without ejecting the theme.

AI tools can query tokens, semantic tokens, recipes, patterns, conditions, configuration, and usage. This is a good option when the goal is AI visibility rather than local theme ownership.

MCP does not replace ejection when the consumer wants to directly edit and maintain the complete theme source.

## Consequences

- Theme code is visible and easy to customize.
- AI tools can inspect the design system through ejected files or Panda MCP.
- Consumers accept responsibility for maintaining their ejected copy.
- Chakra still maintains one packaged source of truth for users who do not eject.
- Emotion and Panda adapters must accept the same ejected theme contract described in [ADR 0005](./0005-shared-theme.md).

## Open question

Should the CLI generate engine-specific adapter files based on the detected Panda configuration, or install examples for both engines?
