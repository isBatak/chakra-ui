import type { TSESLint, TSESTree } from "@typescript-eslint/utils"
import { getGeneratedStyleProps } from "./style-props"
import {
  getPropsType,
  getTypeInfo,
  isDeclaredOutsideGeneratedTypes,
} from "./type-info"
import type { MessageId, RuleContext } from "./types"
import {
  isConditionalLike,
  isRawCallExpression,
  isStaticValue,
  jsxName,
} from "./utils"

const CHAKRA_PACKAGE = "@chakra-ui/react"

const RUNTIME_NOTE =
  "This value causes a new style object to be allocated on every render."

export function createStylePositionVisitor(
  context: RuleContext,
  reportableMessageIds: ReadonlySet<MessageId>,
): TSESLint.RuleListener {
  const styleProps = getGeneratedStyleProps()
  const trackedComponentFactories = new Set<string>()
  const trackedCreateSystemFunctions = new Set<string>()
  const trackedUseChakraContextFunctions = new Set<string>()
  const trackedSystemObjects = new Set<string>()
  const trackedSystemCssFunctions = new Set<string>()
  const trackedChakraNamespaces = new Set<string>()
  const typeInfo = getTypeInfo(context)

  function memberPropertyName(node: TSESTree.MemberExpression) {
    if (!node.computed && node.property.type === "Identifier") {
      return node.property.name
    }
    if (node.computed && node.property.type === "Literal") {
      return typeof node.property.value === "string"
        ? node.property.value
        : null
    }
    return null
  }

  function isChakraNamespaceMember(node: TSESTree.Node, propertyName: string) {
    return (
      node.type === "MemberExpression" &&
      node.object.type === "Identifier" &&
      trackedChakraNamespaces.has(node.object.name) &&
      memberPropertyName(node) === propertyName
    )
  }

  function isCreateSystemCall(node: TSESTree.Node) {
    if (node.type !== "CallExpression") return false
    return (
      (node.callee.type === "Identifier" &&
        trackedCreateSystemFunctions.has(node.callee.name)) ||
      isChakraNamespaceMember(node.callee, "createSystem")
    )
  }

  function isUseChakraContextCall(node: TSESTree.Node) {
    if (node.type !== "CallExpression") return false
    return (
      (node.callee.type === "Identifier" &&
        trackedUseChakraContextFunctions.has(node.callee.name)) ||
      isChakraNamespaceMember(node.callee, "useChakraContext")
    )
  }

  function isSystemObject(node: TSESTree.Node): boolean {
    if (node.type === "Identifier") {
      return trackedSystemObjects.has(node.name)
    }
    return (
      isCreateSystemCall(node) ||
      isUseChakraContextCall(node) ||
      isChakraNamespaceMember(node, "defaultSystem")
    )
  }

  function isSystemCssMember(
    node: TSESTree.Node,
  ): node is TSESTree.MemberExpression {
    return (
      node.type === "MemberExpression" &&
      memberPropertyName(node) === "css" &&
      isSystemObject(node.object)
    )
  }

  function report(node: TSESTree.Node, messageId: MessageId, subject: string) {
    if (!reportableMessageIds.has(messageId)) return
    context.report({
      node,
      messageId,
      data: { subject, runtimeNote: RUNTIME_NOTE },
    })
  }

  function checkValue(node: TSESTree.Node, subject: string) {
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
    if (isStaticValue(context, node)) return

    const messageId = isConditionalLike(node)
      ? "dynamicConditional"
      : "dynamicStyleValue"
    report(node, messageId, subject)
  }

  return {
    ImportDeclaration(node) {
      const isChakraImport = node.source.value === CHAKRA_PACKAGE

      for (const specifier of node.specifiers) {
        if (isChakraImport && specifier.type === "ImportNamespaceSpecifier") {
          trackedChakraNamespaces.add(specifier.local.name)
          continue
        }
        if (
          specifier.type !== "ImportSpecifier" ||
          specifier.imported.type !== "Identifier"
        ) {
          continue
        }
        if (isChakraImport && specifier.imported.name === "defaultSystem") {
          trackedSystemObjects.add(specifier.local.name)
        }
        if (isChakraImport && specifier.imported.name === "createSystem") {
          trackedCreateSystemFunctions.add(specifier.local.name)
        }
        if (isChakraImport && specifier.imported.name === "useChakraContext") {
          trackedUseChakraContextFunctions.add(specifier.local.name)
        }
        if (isChakraImport && specifier.imported.name === "chakra") {
          trackedComponentFactories.add(specifier.local.name)
        }
      }
    },

    VariableDeclarator(node) {
      if (!node.init) return

      if (node.id.type === "Identifier") {
        if (isSystemObject(node.init)) {
          trackedSystemObjects.add(node.id.name)
        } else if (isSystemCssMember(node.init)) {
          trackedSystemCssFunctions.add(node.id.name)
        }
        return
      }

      if (node.id.type !== "ObjectPattern" || !isSystemObject(node.init)) return
      for (const property of node.id.properties) {
        if (
          property.type === "Property" &&
          property.key.type === "Identifier" &&
          property.key.name === "css" &&
          property.value.type === "Identifier"
        ) {
          trackedSystemCssFunctions.add(property.value.name)
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
          isDeclaredOutsideGeneratedTypes(typeInfo, resolvedPropsType, propName)
        ) {
          continue
        }
        if (attribute.value?.type !== "JSXExpressionContainer") continue
        const expression = attribute.value.expression
        if (expression.type === "JSXEmptyExpression") continue

        checkValue(expression, propName)
      }
    },

    CallExpression(node) {
      if (isRawCallExpression(node)) return

      const calleeName =
        node.callee.type === "Identifier" ? node.callee.name : null
      const isFactory =
        (calleeName !== null && trackedComponentFactories.has(calleeName)) ||
        isChakraNamespaceMember(node.callee, "chakra")
      const isSystemCss =
        (calleeName !== null && trackedSystemCssFunctions.has(calleeName)) ||
        isSystemCssMember(node.callee)
      if (!isFactory && !isSystemCss) return

      const styleArguments = isFactory
        ? node.arguments.slice(1)
        : node.arguments
      const subject = isFactory
        ? `${context.sourceCode.getText(node.callee)}(...)`
        : `${context.sourceCode.getText(node.callee)}(...)`
      for (const argument of styleArguments) {
        if (argument.type !== "SpreadElement") {
          checkValue(argument, subject)
        }
      }
    },
  }
}
