"use client"

import { ark } from "@ark-ui/react/factory"
import * as React from "react"
import type { ElementType } from "react"
import { useStylingEngine } from "../styling-engine/provider"
import type { JsxFactoryOptions, StyledFactoryFn } from "./factory.types"

const htmlProps = new Set([
  "htmlWidth",
  "htmlHeight",
  "htmlSize",
  "htmlTranslate",
  "htmlContent",
])

function normalizeHtmlProp(prop: string) {
  return htmlProps.has(prop) ? prop.replace("html", "").toLowerCase() : prop
}

function getRecipeName(recipe: unknown): string | undefined {
  if (typeof recipe === "string") return recipe
  if (!recipe || typeof recipe !== "object") return undefined

  const value = recipe as { name?: unknown; __recipeName?: unknown }
  if (typeof value.__recipeName === "string") return value.__recipeName
  return typeof value.name === "string" ? value.name : undefined
}

const arkFactory = ark as unknown as {
  (component: ElementType): ElementType
  [element: string]: ElementType
}

function createStyled(
  component: ElementType,
  recipe?: unknown,
  options: JsxFactoryOptions<any> = {},
) {
  if (process.env.NODE_ENV !== "production" && component === undefined) {
    throw new Error(
      "You are trying to create a styled element with an undefined component.\nYou may have forgotten to import it.",
    )
  }

  const inheritedRecipes =
    typeof component !== "string" && "__chakra_recipes" in component
      ? (component.__chakra_recipes as readonly unknown[])
      : []
  const recipeDefinitions = recipe
    ? [...inheritedRecipes, recipe]
    : inheritedRecipes
  const baseComponent =
    typeof component === "string"
      ? arkFactory[component]
      : arkFactory(component)

  const Styled = React.forwardRef<unknown, Record<string, unknown>>(
    function ChakraComponent(inProps, ref) {
      const system = useStylingEngine()
      const props = Object.assign({}, options.defaultProps, inProps)
      const { elementProps, styleProps } = system.splitProps(props)
      const { className, as, asChild, children, ...rest } = elementProps
      const { css, ...directStyleProps } = styleProps
      const recipeName = getRecipeName(recipe)
      const inlineRecipes = recipeDefinitions.filter(
        (definition) => !getRecipeName(definition),
      )
      const recipeOutput =
        recipeName || inlineRecipes.length
          ? system.recipe({
              name: recipeName,
              definitions: inlineRecipes,
              props,
            })
          : undefined
      const styleInput = [
        ...((Array.isArray(css) ? css : [css]).filter(Boolean) as unknown[]),
        directStyleProps,
      ]
      const styleOutput = system.css(styleInput)
      const finalProps: Record<string, unknown> = {}

      for (const [key, value] of Object.entries(rest)) {
        if (key === "theme") continue
        if (options.shouldForwardProp?.(key, []) === false) continue
        finalProps[normalizeHtmlProp(key)] = value
      }

      let FinalTag = baseComponent
      finalProps.children = children
      finalProps.className = system.cx(
        recipeOutput?.className,
        styleOutput.className,
        className as string | undefined,
      )
      if (!finalProps.className) delete finalProps.className
      finalProps.ref = ref

      const forwardAsChild =
        options.forwardAsChild || options.forwardProps?.includes("asChild")

      if (asChild) {
        finalProps.asChild = true
      }

      if (as && forwardAsChild) {
        finalProps.asChild = true
        finalProps.children = React.createElement(as, null, children)
      } else if (as) {
        FinalTag = typeof as === "string" ? arkFactory[as] : arkFactory(as)
      }

      return (
        <React.Fragment>
          {recipeOutput?.insertion}
          {styleOutput.insertion}
          {React.createElement(FinalTag, finalProps)}
        </React.Fragment>
      )
    },
  )

  Styled.displayName =
    options.displayName ??
    `chakra(${
      typeof component === "string"
        ? component
        : component.displayName || component.name || "Component"
    })`

  Object.defineProperty(Styled, "__chakra_recipes", {
    value: recipeDefinitions,
  })

  return Styled
}

const cache = new Map<PropertyKey, unknown>()
const styledFn = createStyled as unknown as StyledFactoryFn

const chakraImpl = new Proxy(styledFn, {
  apply(target, thisArg, args) {
    return Reflect.apply(target, thisArg, args)
  },
  get(target, element) {
    if (typeof element !== "string") return Reflect.get(target, element)
    if (!cache.has(element)) cache.set(element, createStyled(element as any))
    return cache.get(element)
  },
})

export const chakra = chakraImpl as StyledFactoryFn
