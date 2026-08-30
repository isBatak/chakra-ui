import type { TSESLint } from "@typescript-eslint/utils"
import {
  STYLE_POSITION_SCHEMA,
  createStylePositionVisitor,
} from "../create-style-position-visitor"
import type { MessageId, Options } from "../types"

const REPORTABLE_MESSAGE_IDS = new Set<MessageId>(["dynamicConditional"])

export const noDynamicConditionalStyling: TSESLint.RuleModule<
  MessageId,
  Options
> = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow runtime-computed branches in a ternary or `??`/`||` fallback in a Chakra style position.",
    },
    schema: STYLE_POSITION_SCHEMA,
    messages: {
      dynamicConditional:
        "Conditional value for '{{subject}}' includes a runtime-computed style value that cannot be statically analyzed. Ensure every possible style value is statically defined, or use a CSS variable or recipe variant.",
      dynamicPropName:
        "Dynamic property name in '{{subject}}'. {{runtimeNote}}",
      dynamicStyleValue:
        "Dynamic style value for '{{subject}}'. {{runtimeNote}}",
    },
  },
  defaultOptions: [],
  create(context) {
    return createStylePositionVisitor(context, REPORTABLE_MESSAGE_IDS)
  },
}
