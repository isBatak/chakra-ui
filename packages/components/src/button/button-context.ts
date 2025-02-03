import { ThemingProps } from "@chakra-ui/styled-system"
import { createContext } from "@chakra-ui/utils"

export interface ButtonGroupContext extends ThemingProps<"Button"> {
  /**
   * @default false
   */
  isDisabled?: boolean | undefined
}

export const [ButtonGroupProvider, useButtonGroup] =
  createContext<ButtonGroupContext>({
    strict: false,
    name: "ButtonGroupContext",
  })
