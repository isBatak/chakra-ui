import type { TSESLint, TSESTree } from "@typescript-eslint/utils"
import type { RuleContext } from "./types"

function toKebabCase(name: string) {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()
}

function isFixableLiteral(
  node: TSESTree.Node,
): node is TSESTree.StringLiteral | TSESTree.NumberLiteral {
  return (
    node.type === "Literal" &&
    (typeof node.value === "string" || typeof node.value === "number")
  )
}

export function createConditionalDataAttributeFix(
  context: RuleContext,
  openingElement: TSESTree.JSXOpeningElement,
  attribute: TSESTree.JSXAttribute,
  conditional: TSESTree.Node,
  propName: string,
): TSESLint.ReportFixFunction | null {
  if (
    conditional.type !== "ConditionalExpression" ||
    conditional.test.type !== "Identifier"
  ) {
    return null
  }
  if (
    !isFixableLiteral(conditional.consequent) ||
    !isFixableLiteral(conditional.alternate)
  ) {
    return null
  }

  const dataAttrName = `data-${toKebabCase(conditional.test.name)}`
  const hasConflict = openingElement.attributes.some((candidate) => {
    if (candidate === attribute) return false
    if (candidate.type === "JSXSpreadAttribute") return true
    return (
      candidate.name.type === "JSXIdentifier" &&
      (candidate.name.name === dataAttrName || candidate.name.name === "css")
    )
  })
  if (hasConflict) return null

  const sourceCode = context.sourceCode ?? context.getSourceCode()
  const consequentText = sourceCode.getText(conditional.consequent)
  const alternateText = sourceCode.getText(conditional.alternate)
  const replacement = `${dataAttrName}={${conditional.test.name} || undefined} css={{ ${propName}: ${alternateText}, '&[${dataAttrName}]': { ${propName}: ${consequentText} } }}`

  return (fixer) => fixer.replaceText(attribute, replacement)
}
