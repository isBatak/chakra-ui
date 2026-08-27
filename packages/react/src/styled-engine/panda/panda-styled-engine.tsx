"use client"

import { styled } from "../../../../../styled-system/jsx"
import type { StyledFactoryFn } from "../../styled-system/factory.types"
import { createAdapter } from "../create-adapter"
import { StyledEngine } from "../styled-engine"
import { recipes } from "./recipes"

export interface PandaStyledEngineProps {
  children: React.ReactNode
}

const adapter = createAdapter({
  styled: styled as unknown as StyledFactoryFn,
  recipe(name, props) {
    const { unstyled, ...restProps } = props
    const recipe = recipes[name as keyof typeof recipes]

    if (!recipe) throw new Error(`Unknown Panda recipe: ${name}`)

    const [variantProps, otherProps] = recipe.splitVariantProps(restProps)

    return {
      className: unstyled ? undefined : recipe(variantProps),
      props: otherProps,
    }
  },
})

export function PandaStyledEngine({ children }: PandaStyledEngineProps) {
  return <StyledEngine adapter={adapter}>{children}</StyledEngine>
}
