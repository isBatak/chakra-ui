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
    fixable: "code",
    docs: {
      description:
        "Disallow a ternary or `??`/`||` fallback in a Chakra/Panda style position, isolated so it can be given a stricter severity.",
    },
    schema: STYLE_POSITION_SCHEMA,
    messages: {
      dynamicConditional:
        "Conditional value for '{{subject}}' forces a runtime style branch on every render. Prefer a data-* attribute selector or a recipe variant (e.g. `<Component variant={...} />`) instead of a ternary or `??`/`||` fallback in a style position.",
      dynamicPropName: "Dynamic property name in '{{subject}}'. {{engineNote}}",
      dynamicStyleValue:
        "Dynamic style value for '{{subject}}'. {{engineNote}}",
    },
  },
  defaultOptions: [],
  create(context) {
    return createStylePositionVisitor(context, REPORTABLE_MESSAGE_IDS)
  },
}
