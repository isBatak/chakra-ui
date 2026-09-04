# ADR 0007: Prevent dynamic styling pitfalls

Status: Proposed

## Decision

Publish consumer-facing migration tooling in `@chakra-ui/eslint-plugin`.

Its `recommended` configuration enables the engine-aware `no-dynamic-styling` rule. Users run it across an existing application, resolve every finding, and reach a styling baseline compatible with both Emotion and Panda. This improves current Emotion performance and prepares the codebase for Panda or Chakra v4.

The rule targets patterns that are expensive with Emotion or cannot be reliably extracted by Panda.

References:

- [Chakra styling performance](https://chakra-ui.com/guides/styling-performance)
- [Panda dynamic styling](https://panda-css.com/docs/guides/dynamic-styling)

## Migration workflow

```js
// eslint.config.mjs
import chakra from "@chakra-ui/eslint-plugin"

export default [
  chakra.configs.recommended,
]
```

```sh
eslint . --fix
eslint . --max-warnings=0
```

Suggested workflow:

1. Install the plugin while the application still uses Chakra v3.
2. Enable the `recommended` configuration as warnings.
3. Apply safe automatic fixes.
4. Resolve structural findings using the diagnostic suggestions.
5. Make the rule error-level in CI.
6. Upgrade to Chakra v4 or enable Panda only after the application has zero findings.

The Chakra CLI or codemod may install this configuration, run ESLint, and produce a migration report. The ESLint plugin remains usable without the CLI.

Names and commands are provisional.

## Invalid patterns

Report dynamic values in recognized Chakra/Panda style positions:

```tsx
<Box color={color} />
<Box bg={isActive ? "blue.500" : "gray.100"} />
<Box css={{ color: getColor() }} />
<Box color={colorByType[type]} />
<div className={css({ color: runtimeColor })} />
```

The rule covers:

- Chakra style props
- `css()`, `chakra()`, and configured Panda factory calls
- recipe and slot-recipe calls
- nested style objects and responsive conditions
- renamed style props that hide extraction from Panda

Do not inspect arbitrary component props unless the component or prop is known through imports, generated metadata, or configuration.

## Preferred patterns

Diagnostics recommend the closest migration-safe alternative:

- recipe variants for finite visual states
- `data-*` attributes for UI state
- CSS custom properties for continuous runtime values
- Panda `staticCss` for known values that must be pre-generated
- `css.raw()` or recipe `.raw()` when extraction needs a hint
- direct style-prop names instead of renamed dynamic props

```tsx
<Box
  data-active={isActive || undefined}
  css={{ "&[data-active]": { bg: "blue.500" } }}
/>

<Box
  css={{ width: "var(--progress)" }}
  style={{ "--progress": `${progress}%` }}
/>

<Card variant={type} />
```

## Allowed patterns

Do not report:

- string, number, and boolean literals
- static style objects
- same-file `const` values that resolve to static literals
- recipes and data-attribute selectors
- CSS variables passed through `style`
- `css.raw()` and recipe `.raw()`
- values explicitly covered by configured Panda `staticCss`

Statically analyzable conditional branches may be allowed when conditional-performance checks are disabled.

## Rule configuration

```js
{
  rules: {
    "@chakra-ui/no-dynamic-styling": ["warn", {
      engine: "both",
      checkConditionals: true,
      styleFunctions: ["css", "chakra"],
      styleProps: "generated"
    }]
  }
}
```

Modes:

- `emotion`: detect render-time allocation and conditional-style costs.
- `panda`: detect values Panda cannot statically extract.
- `both`: apply the compatible Emotion and Panda superset; used by `recommended`.

## Detection model

Use generated Chakra style-property, component-tracking, and recipe metadata rather than a handwritten property list.

Resolve local constants only when they are in the same file and statically analyzable. Treat function calls, computed runtime lookups, props, state, and values imported from unknown modules as dynamic.

Panda can extract some conditional branches. `both` mode still reports them when recipe variants or data attributes better express the intent and avoid Emotion runtime work.

Each diagnostic has:

- a stable problem category
- a short explanation
- a preferred replacement pattern
- a link to focused migration documentation

This allows the CLI to group remaining work and report migration readiness.

## Fix policy

Provide automatic fixes only when semantics are preserved.

Structural conversions to recipes, data attributes, or CSS variables should use ESLint suggestions or codemods that the user explicitly selects. Do not silently rewrite component state, public props, or DOM structure.

An application is ready when all findings are fixed or explicitly reviewed and suppressed with a reason.

## Package structure

```text
packages/
  eslint-plugin/  # @chakra-ui/eslint-plugin
    src/rules/no-dynamic-styling.ts
    src/configs/recommended.ts
```

The plugin must support the currently maintained Chakra v3 toolchain so it can run before the v4 upgrade.

## POC

1. Add valid and invalid fixtures from both official guides.
2. Add fixtures from representative Chakra v3 applications.
3. Test style props, `css()`, `chakra()`, recipes, custom components, and renamed props.
4. Generate recognized properties and component names from Chakra metadata.
5. Run the migration config against the Chakra docs and example applications.
6. Measure findings, safe-fix coverage, and false positives.
7. Produce a zero-findings migration-readiness report.

## Scope

This rule prepares styling code for the v4 engine migration. Other v4 breaking API changes remain the responsibility of separate lint rules or codemods. They should not change the stable purpose or name of this performance rule.

## Open questions

- Which safe fixes belong in ESLint and which belong in codemods?
- Can the rule reliably read `staticCss` from Panda configuration?
- Should conditional values with two static branches be allowed in Panda mode?
- How should Vue, Solid, and Svelte syntax plug into the migration configuration?
