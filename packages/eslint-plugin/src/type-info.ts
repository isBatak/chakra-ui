import type { TSESTree } from "@typescript-eslint/utils"
import type ts from "typescript"
import type { RuleContext } from "./types"

interface TypeInfo {
  checker: ts.TypeChecker
  esTreeNodeToTSNodeMap: {
    get(node: TSESTree.Node): ts.Node
  }
}

export function getTypeInfo(context: RuleContext): TypeInfo | null {
  const parserServices =
    context.sourceCode?.parserServices ?? context.parserServices
  if (!parserServices?.program || !parserServices.esTreeNodeToTSNodeMap) {
    return null
  }
  return {
    checker: parserServices.program.getTypeChecker(),
    esTreeNodeToTSNodeMap: parserServices.esTreeNodeToTSNodeMap,
  }
}

export function getPropsType(
  typeInfo: TypeInfo,
  openingElementNode: TSESTree.JSXOpeningElement,
) {
  const tsNode = typeInfo.esTreeNodeToTSNodeMap.get(openingElementNode)
  if (!tsNode) return null

  let signature: ts.Signature | undefined
  try {
    signature = typeInfo.checker.getResolvedSignature(
      tsNode as ts.CallLikeExpression,
    )
  } catch {
    return null
  }

  const propsParam = signature?.parameters[0]
  if (!propsParam) return null
  return typeInfo.checker.getTypeOfSymbolAtLocation(propsParam, tsNode)
}

export function isDeclaredOutsideGeneratedTypes(
  typeInfo: TypeInfo,
  propsType: ts.Type,
  propName: string,
  generatedTypePatterns: string[],
) {
  const declarations = typeInfo.checker.getPropertyOfType(
    propsType,
    propName,
  )?.declarations
  if (!declarations?.length) return false

  return !declarations.some((declaration) => {
    const fileName = declaration.getSourceFile().fileName
    return generatedTypePatterns.some((pattern) => fileName.includes(pattern))
  })
}
