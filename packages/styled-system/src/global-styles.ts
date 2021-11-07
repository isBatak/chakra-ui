import kebabCase from "lodash.kebabcase"
import { Dict } from "@chakra-ui/utils"
import { css } from "./css"

import type { WithGlobalStyles } from "./types"

export function toGlobalStyles<T extends Dict>(rawTheme: T) {
  const theme = rawTheme

  const globalStyles = Object.keys(theme.components).reduce(
    (previousValue, currentValue) => {
      const component = theme.components[currentValue]

      if (component.baseStyle) {
        previousValue[`.chakra-${kebabCase(currentValue)}`] = css(
          component.baseStyle,
        )(theme)
      }

      return previousValue
    },
    {},
  )

  Object.assign(theme, {
    __globalStyles: globalStyles,
  })

  return theme as WithGlobalStyles<T>
}
