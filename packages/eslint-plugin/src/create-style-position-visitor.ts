import type { JSONSchema, TSESLint, TSESTree } from "@typescript-eslint/utils"
import { createConditionalDataAttributeFix } from "./conditional-fix"
import { getGeneratedStyleProps } from "./style-props"
import {
  getPropsType,
  getTypeInfo,
  isDeclaredOutsideGeneratedTypes,
} from "./type-info"
import type { MessageId, RuleContext, RuleOptions } from "./types"
import {
  isConditionalLike,
  isRawCallExpression,
  isStaticValue,
  jsxName,
} from "./utils"

const DEFAULT_OPTIONS: Required<RuleOptions> = {
  engine: "both",
  checkConditionals: true,
  styleFunctions: ["css", "chakra"],
  componentFactories: ["chakra"],
  styleProps: "generated",
  typeAware: true,
  generatedTypePatterns: ["styled-system"],
}

const ENGINE_NOTES = {
  emotion:
    "Emotion reallocates a new style object for this value on every render.",
  panda: "Panda can't statically extract this value at build time.",
  both: "Emotion reallocates a new style object for this value on every render, and Panda can't statically extract it at build time.",
} as const

export const STYLE_POSITION_SCHEMA: readonly JSONSchema.JSONSchema4[] = [
  {
    type: "object",
    properties: {
      engine: { type: "string", enum: ["emotion", "panda", "both"] },
      checkConditionals: { type: "boolean" },
      styleFunctions: {
        type: "array",
        items: { type: "string" },
        minItems: 1,
      },
      componentFactories: {
        type: "array",
        items: { type: "string" },
        minItems: 1,
      },
      styleProps: {
        oneOf: [
          { type: "string", enum: ["generated"] },
          { type: "array", items: { type: "string" } },
        ],
      },
      typeAware: { type: "boolean" },
      generatedTypePatterns: {
        type: "array",
        items: { type: "string" },
        minItems: 1,
      },
    },
    additionalProperties: false,
  },
]

export function createStylePositionVisitor(
  context: RuleContext,
  reportableMessageIds: ReadonlySet<MessageId>,
): TSESLint.RuleListener {
  const options: Required<RuleOptions> = {
    ...DEFAULT_OPTIONS,
    ...context.options[0],
  }
  const styleProps =
    options.styleProps === "generated"
      ? getGeneratedStyleProps()
      : new Set(options.styleProps)
  const styleFunctionNames = new Set(options.styleFunctions)
  const componentFactoryNames = new Set(options.componentFactories)
  const trackedStyleFunctions = new Set<string>()
  const trackedComponentFactories = new Set<string>()
  const typeInfo = options.typeAware ? getTypeInfo(context) : null

  function report(
    node: TSESTree.Node,
    messageId: MessageId,
    subject: string,
    fix?: TSESLint.ReportFixFunction | null,
  ) {
    if (!reportableMessageIds.has(messageId)) return
    context.report({
      node,
      messageId,
      data: { subject, engineNote: ENGINE_NOTES[options.engine] },
      fix: fix ?? undefined,
    })
  }

  function checkValue(
    node: TSESTree.Node,
    subject: string,
    getFix?: () => TSESLint.ReportFixFunction | null,
  ) {
    if (node.type === "ObjectExpression") {
      for (const property of node.properties) {
        if (property.type !== "Property") continue
        if (property.computed) {
          report(property.key, "dynamicPropName", subject)
          continue
        }
        checkValue(property.value, subject)
      }
      return
    }
    if (isStaticValue(context, node, options)) return

    const messageId = isConditionalLike(node)
      ? "dynamicConditional"
      : "dynamicStyleValue"
    report(
      node,
      messageId,
      subject,
      messageId === "dynamicConditional" ? getFix?.() : null,
    )
  }

  return {
    ImportDeclaration(node) {
      for (const specifier of node.specifiers) {
        if (
          specifier.type !== "ImportSpecifier" ||
          specifier.imported.type !== "Identifier"
        ) {
          continue
        }
        if (styleFunctionNames.has(specifier.imported.name)) {
          trackedStyleFunctions.add(specifier.local.name)
        }
        if (componentFactoryNames.has(specifier.imported.name)) {
          trackedComponentFactories.add(specifier.local.name)
        }
      }
    },

    JSXOpeningElement(node) {
      const elementName = jsxName(node.name)
      let propsType: ReturnType<typeof getPropsType> | undefined
      const resolvePropsType = () => {
        if (propsType === undefined) {
          propsType = typeInfo ? getPropsType(typeInfo, node) : null
        }
        return propsType
      }

      for (const attribute of node.attributes) {
        if (attribute.type === "JSXSpreadAttribute") {
          if (attribute.argument.type !== "ObjectExpression") continue
          for (const property of attribute.argument.properties) {
            if (
              property.type === "Property" &&
              property.computed &&
              property.key.type !== "Literal"
            ) {
              report(property.key, "dynamicPropName", elementName)
            }
          }
          continue
        }

        if (
          attribute.name.type !== "JSXIdentifier" ||
          !styleProps.has(attribute.name.name)
        ) {
          continue
        }
        const propName = attribute.name.name
        const resolvedPropsType = resolvePropsType()
        if (
          typeInfo &&
          resolvedPropsType &&
          isDeclaredOutsideGeneratedTypes(
            typeInfo,
            resolvedPropsType,
            propName,
            options.generatedTypePatterns,
          )
        ) {
          continue
        }
        if (attribute.value?.type !== "JSXExpressionContainer") continue
        const expression = attribute.value.expression
        if (expression.type === "JSXEmptyExpression") continue

        checkValue(expression, propName, () =>
          createConditionalDataAttributeFix(
            context,
            node,
            attribute,
            expression,
            propName,
          ),
        )
      }
    },

    CallExpression(node) {
      if (isRawCallExpression(node) || node.callee.type !== "Identifier") return

      const calleeName = node.callee.name
      const isFactory = trackedComponentFactories.has(calleeName)
      if (!isFactory && !trackedStyleFunctions.has(calleeName)) return

      const styleArguments = isFactory
        ? node.arguments.slice(1)
        : node.arguments
      for (const argument of styleArguments) {
        if (argument.type !== "SpreadElement") {
          checkValue(argument, `${calleeName}(...)`)
        }
      }
    },
  }
}
