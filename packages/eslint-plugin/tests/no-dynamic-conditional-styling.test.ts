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
      "import { css } from './styled-system/css'; const value = css({ color: colors[type] ?? 'gray.100' })",
      "const utility = { css: (value) => value }; utility.css({ color: active ? 'red' : 'blue' })",
      "import { useChakraContext } from './local-hooks'; useChakraContext().css({ color: active ? 'red' : 'blue' })",
      "import { chakra } from './local-factory'; chakra('div', { color: active ? 'red' : 'blue' })",
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
        code: "import { defaultSystem } from '@chakra-ui/react'; defaultSystem.css({ color: colors[type] ?? 'gray.100' })",
        output: null,
        errors: [{ messageId: "dynamicConditional" }],
      },
      {
        code: "import { defaultSystem as system } from '@chakra-ui/react'; const chakraCss = system.css; chakraCss({ color: active ? 'red.500' : 'gray.500' })",
        output: null,
        errors: [{ messageId: "dynamicConditional" }],
      },
      {
        code: "import { createSystem as makeSystem } from '@chakra-ui/react'; const system = makeSystem({}); system.css({ color: active ? 'red.500' : 'gray.500' })",
        output: null,
        errors: [{ messageId: "dynamicConditional" }],
      },
      {
        code: "import * as Chakra from '@chakra-ui/react'; Chakra.createSystem({}).css({ color: active ? 'red.500' : 'gray.500' })",
        output: null,
        errors: [{ messageId: "dynamicConditional" }],
      },
      {
        code: "import { defaultSystem } from '@chakra-ui/react'; const { css: chakraCss } = defaultSystem; chakraCss({ color: active ? 'red.500' : 'gray.500' })",
        output: null,
        errors: [{ messageId: "dynamicConditional" }],
      },
      {
        code: "import { useChakraContext } from '@chakra-ui/react'; const system = useChakraContext(); system.css({ color: active ? 'red.500' : 'gray.500' })",
        output: null,
        errors: [{ messageId: "dynamicConditional" }],
      },
      {
        code: "import { useChakraContext as useSystem } from '@chakra-ui/react'; const { css: chakraCss } = useSystem(); chakraCss({ color: active ? 'red.500' : 'gray.500' })",
        output: null,
        errors: [{ messageId: "dynamicConditional" }],
      },
      {
        code: "import * as Chakra from '@chakra-ui/react'; Chakra.useChakraContext().css({ color: active ? 'red.500' : 'gray.500' })",
        output: null,
        errors: [{ messageId: "dynamicConditional" }],
      },
      {
        code: "import { chakra as styled } from '@chakra-ui/react'; styled('div', { color: active ? 'red.500' : 'gray.500' })",
        output: null,
        errors: [{ messageId: "dynamicConditional" }],
      },
      {
        code: "import * as Chakra from '@chakra-ui/react'; Chakra.chakra('div', { color: active ? 'red.500' : 'gray.500' })",
        output: null,
        errors: [{ messageId: "dynamicConditional" }],
      },
    ],
  },
)
