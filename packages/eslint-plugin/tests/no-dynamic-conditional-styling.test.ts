import { type Rule, RuleTester } from "eslint"
import { describe, it } from "vitest"
import { noDynamicConditionalStyling } from "../src/rules/no-dynamic-conditional-styling"

RuleTester.describe = describe
RuleTester.it = it

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
})

ruleTester.run(
  "no-dynamic-conditional-styling",
  noDynamicConditionalStyling as unknown as Rule.RuleModule,
  {
    valid: [
      "function Component({ color }) { return <Box color={color} /> }",
      "function Component({ propName }) { return <Box {...{ [propName]: 'blue.500' }} /> }",
      {
        code: "function Component({ active }) { return <Box bg={active ? 'blue.500' : 'gray.100'} /> }",
        options: [{ checkConditionals: false }],
      },
    ],
    invalid: [
      {
        code: "function Component({ isActive }) { return <Box bg={isActive ? 'blue.500' : 'gray.100'} /> }",
        output:
          "function Component({ isActive }) { return <Box data-is-active={isActive || undefined} css={{ bg: 'gray.100', '&[data-is-active]': { bg: 'blue.500' } }} /> }",
        errors: [{ messageId: "dynamicConditional" }],
      },
      {
        code: "function Component({ isActive }) { return <Box bg={!isActive ? 'blue.500' : 'gray.100'} /> }",
        output: null,
        errors: [{ messageId: "dynamicConditional" }],
      },
      {
        code: "import { css } from './styled-system/css'; const value = css({ color: colors[type] ?? 'gray.100' })",
        output: null,
        errors: [{ messageId: "dynamicConditional" }],
      },
    ],
  },
)
