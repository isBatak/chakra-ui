import { omit } from "@chakra-ui/utils"
import { ThemeTypings } from "./theme.types"
import { ResponsiveValue } from "./utils"

export interface ThemingProps<ThemeComponent extends string = any> {
  variant?:
    | ResponsiveValue<
        ThemeComponent extends keyof ThemeTypings["components"]
          ? ThemeTypings["components"][ThemeComponent]["variants"]
          : string
      >
    | undefined
  size?:
    | ResponsiveValue<
        ThemeComponent extends keyof ThemeTypings["components"]
          ? ThemeTypings["components"][ThemeComponent]["sizes"]
          : string
      >
    | undefined
  colorScheme?: ThemeTypings["colorSchemes"] | undefined
  orientation?: "vertical" | "horizontal" | undefined
  styleConfig?: Record<string, any> | undefined
}

export function omitThemingProps<T extends ThemingProps>(props: T) {
  return omit(props, ["styleConfig", "size", "variant", "colorScheme"])
}
