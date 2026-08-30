import type { TSESTree } from "@typescript-eslint/utils"
import type { RuleContext } from "./types"

export function jsxName(node: TSESTree.JSXTagNameExpression): string {
  if (node.type === "JSXIdentifier") return node.name
  if (node.type === "JSXMemberExpression") {
    return `${jsxName(node.object)}.${jsxName(node.property)}`
  }
  return ""
}

export function isConditionalLike(
  node: TSESTree.Node,
): node is TSESTree.ConditionalExpression | TSESTree.LogicalExpression {
  return (
    node.type === "ConditionalExpression" || node.type === "LogicalExpression"
  )
}

export function isRawCallExpression(node: TSESTree.Node) {
  return (
    node.type === "CallExpression" &&
    node.callee.type === "MemberExpression" &&
    !node.callee.computed &&
    node.callee.property.type === "Identifier" &&
    node.callee.property.name === "raw"
  )
}

function resolveVariable(
  context: RuleContext,
  identifierNode: TSESTree.Identifier,
) {
  let scope = context.sourceCode?.getScope
    ? context.sourceCode.getScope(identifierNode)
    : context.getScope()
  while (scope) {
    const reference = scope.references.find(
      (candidate) => candidate.identifier === identifierNode,
    )
    if (reference?.resolved) return reference.resolved
    if (!scope.upper) break
    scope = scope.upper
  }
  return null
}

function isStaticConstIdentifier(
  context: RuleContext,
  node: TSESTree.Identifier,
): boolean {
  const variable = resolveVariable(context, node)
  if (!variable || variable.defs.length !== 1) return false

  const def = variable.defs[0]
  if (
    def.type !== "Variable" ||
    !def.parent ||
    def.parent.kind !== "const" ||
    !def.node.init
  ) {
    return false
  }
  return isStaticValue(context, def.node.init)
}

export function isStaticValue(
  context: RuleContext,
  node: TSESTree.Node,
): boolean {
  switch (node.type) {
    case "Literal":
      return true
    case "TemplateLiteral":
      return node.expressions.length === 0
    case "ObjectExpression":
      return node.properties.every(
        (property) =>
          property.type === "Property" &&
          !property.computed &&
          isStaticValue(context, property.value),
      )
    case "ArrayExpression":
      return node.elements.every(
        (element) =>
          element !== null &&
          element.type !== "SpreadElement" &&
          isStaticValue(context, element),
      )
    case "ConditionalExpression":
    case "LogicalExpression": {
      const [left, right] =
        node.type === "ConditionalExpression"
          ? [node.consequent, node.alternate]
          : [node.left, node.right]
      return isStaticValue(context, left) && isStaticValue(context, right)
    }
    case "UnaryExpression":
      return (
        (node.operator === "-" || node.operator === "+") &&
        isStaticValue(context, node.argument)
      )
    case "Identifier":
      return node.name === "undefined" || isStaticConstIdentifier(context, node)
    case "CallExpression":
      return isRawCallExpression(node)
    default:
      return false
  }
}
