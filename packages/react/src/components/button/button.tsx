"use client"

import { forwardRef, useMemo } from "react"
import { createContext } from "../../create-context"
import { mergeProps } from "../../merge-props"
import {
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
  chakra,
} from "../../styled-system"
import { useStylingEngine } from "../../styling-engine"
import { dataAttr } from "../../utils"
import { Loader } from "../loader"

const [ButtonPropsProvider, useButtonPropsContext] =
  createContext<ButtonContextValue>({
    strict: false,
    name: "ButtonPropsContext",
    providerName: "ButtonPropsProvider",
  })

export interface ButtonLoadingProps {
  /**
   * If `true`, the button will show a loading spinner.
   * @default false
   */
  loading?: boolean | undefined
  /**
   * The text to show while loading.
   */
  loadingText?: React.ReactNode | undefined
  /**
   * The spinner to show while loading.
   */
  spinner?: React.ReactNode | undefined
  /**
   * The placement of the spinner
   * @default "start"
   */
  spinnerPlacement?: "start" | "end" | undefined
}

export interface ButtonBaseProps
  extends RecipeProps<"button">, UnstyledProp, ButtonLoadingProps {}

export type ButtonContextValue = Partial<ButtonBaseProps>

export interface ButtonProps extends HTMLChakraProps<
  "button",
  ButtonBaseProps
> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(inProps, ref) {
    const system = useStylingEngine()
    const propsContext = useButtonPropsContext()
    const props = useMemo<ButtonProps>(
      () => mergeProps(propsContext, inProps) as ButtonProps,
      [propsContext, inProps],
    )
    const {
      loading,
      loadingText,
      children,
      spinner,
      spinnerPlacement,
      size,
      variant,
      unstyled,
      ...rest
    } = props
    const recipe = unstyled
      ? undefined
      : system.recipe({ name: "button", props: { size, variant } })

    return (
      <>
        {recipe?.insertion}
        <chakra.button
          type="button"
          ref={ref}
          {...rest}
          data-loading={dataAttr(loading)}
          disabled={loading || rest.disabled}
          className={system.cx(recipe?.className, props.className)}
        >
          {!props.asChild && loading ? (
            <Loader
              spinner={spinner}
              text={loadingText}
              spinnerPlacement={spinnerPlacement}
            >
              {children}
            </Loader>
          ) : (
            children
          )}
        </chakra.button>
      </>
    )
  },
)

Button.displayName = "Button"

export { ButtonPropsProvider }
