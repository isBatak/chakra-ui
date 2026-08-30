"use client"

import { useMemo } from "react"
import { emotionStyled } from "../../styled-system/factory"
import { useChakraContext } from "../../styled-system/provider"
import { createAdapter } from "../create-adapter"
import { StyledEngine } from "../styled-engine"

export interface EmotionStyledEngineProps {
  children: React.ReactNode
}

export function EmotionStyledEngine({ children }: EmotionStyledEngineProps) {
  const system = useChakraContext()
  const adapter = useMemo(
    () =>
      createAdapter({
        styled: emotionStyled,
        recipe(name, props) {
          const { unstyled, ...restProps } = props
          const recipe = system.getRecipeFn(name)
          const [variantProps, otherProps] = recipe.splitVariantProps(restProps)

          return {
            className: recipe.className,
            styles: unstyled ? {} : recipe(variantProps),
            props: otherProps,
          }
        },
      }),
    [system],
  )

  return <StyledEngine adapter={adapter}>{children}</StyledEngine>
}
