# ADR 0007: Lint dynamic styling pitfalls

Status: Proposed

## Decision

Add `@chakra-ui/eslint-plugin` with an engine-aware `no-dynamic-styling` rule.

The rule prevents common runtime-style patterns that are expensive with Emotion and may not be extractable by Panda.

References:

- [Chakra styling performance](https://chakra-ui.com/guides/styling-performance)
- [Panda dynamic styling](https://panda-css.com/docs/guides/dynamic-styling)

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

Do not inspect arbitrary component props unless the component or prop is known through imports, generated metadata, or configuration.

## Preferred patterns

Diagnostics should recommend the closest static alternative:

- recipe variants for a finite set of visual states
- `data-*` attributes for UI state
- CSS custom properties for truly continuous runtime values
- Panda `staticCss` for known runtime values that must be pre-generated
- `css.raw()` or recipe `.raw()` when extraction needs an explicit hint
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
- statically analyzable conditional branches when conditional checks are disabled
- same-file `const` values that resolve to static literals
- recipes and data-attribute selectors
- CSS variables passed through `style`
- `css.raw()` and recipe `.raw()`
- values explicitly covered by configured Panda `staticCss`

## Configuration

```js
{
  rules: {
    "@chakra-ui/no-dynamic-styling": ["warn", {
      engine: "migration",
      checkConditionals: true,
      styleFunctions: ["css", "chakra"],
      styleProps: "generated"
    }]
  }
}
```

Modes:

- `emotion`: focus on render-time allocation and conditional-style cost.
- `panda`: focus on values Panda cannot statically extract.
- `migration`: apply the compatible superset; recommended during v4 migration.

The exact option names are provisional.

## Detection model

Use generated Chakra style-property and recipe metadata instead of maintaining a second handwritten property list.

Resolve local constants only when they are in the same file and statically analyzable. Treat function calls, computed runtime lookups, props, state, and values imported from unknown modules as dynamic.

Panda can extract some conditional branches. In migration mode, report them as a performance warning when recipe variants or data attributes express the intent more clearly.

## Fix policy

Start without automatic fixes. Converting runtime styles to recipes, data attributes, or CSS variables changes component structure and can alter behavior.

Diagnostics should include a short suggestion and documentation link. Add narrowly safe suggestions later.

## Package structure

```text
packages/
  eslint-plugin/  # @chakra-ui/eslint-plugin
    src/rules/no-dynamic-styling.ts
```

The CLI may offer the rule during v4 migration setup, but it must remain independently configurable.

## POC

1. Add invalid and valid fixtures from both official guides.
2. Test Chakra style props, `css()`, `chakra()`, and recipes.
3. Generate the recognized style-property list from Chakra's system metadata.
4. Run the rule against the docs and React package.
5. Measure findings and false positives before recommending it by default.

## Open questions

- Should migration mode be warning-only in the recommended config?
- Can the rule reliably read `staticCss` from Panda configuration?
- Should conditional values with two static branches be allowed in Panda mode?
- Should framework-specific syntax live in one rule or framework adapters?
