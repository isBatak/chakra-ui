import type { TSESLint } from "@typescript-eslint/utils"

export type Engine = "emotion" | "panda" | "both"

export interface RuleOptions {
  engine?: Engine
  checkConditionals?: boolean
  styleFunctions?: string[]
  componentFactories?: string[]
  styleProps?: "generated" | string[]
  typeAware?: boolean
  generatedTypePatterns?: string[]
}

export type Options = [RuleOptions?]
export type MessageId =
  | "dynamicConditional"
  | "dynamicPropName"
  | "dynamicStyleValue"

export type RuleContext = TSESLint.RuleContext<MessageId, Options>
