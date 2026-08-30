import type { TSESLint } from "@typescript-eslint/utils"

export interface RuleOptions {
  typeAware?: boolean
}

export type Options = [RuleOptions?]
export type MessageId =
  | "dynamicConditional"
  | "dynamicPropName"
  | "dynamicStyleValue"

export type RuleContext = TSESLint.RuleContext<MessageId, Options>
