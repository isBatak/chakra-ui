import type { TSESLint } from "@typescript-eslint/utils"

export type Options = []
export type MessageId =
  | "dynamicConditional"
  | "dynamicPropName"
  | "dynamicStyleValue"

export type RuleContext = TSESLint.RuleContext<MessageId, Options>
