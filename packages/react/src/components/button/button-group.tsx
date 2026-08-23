"use client"

import { forwardRef } from "react"
import type { RecipeProps } from "../../styled-system"
import { Group, type GroupProps } from "../group"
import { ButtonPropsProvider } from "./button"

export interface ButtonGroupProps extends GroupProps, RecipeProps<"button"> {}

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  function ButtonGroup({ size, variant, ...groupProps }, ref) {
    return (
      <ButtonPropsProvider value={{ size, variant }}>
        <Group ref={ref} {...groupProps} />
      </ButtonPropsProvider>
    )
  },
)

ButtonGroup.displayName = "ButtonGroup"
