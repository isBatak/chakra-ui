export type ColorMode = "light" | "dark"

export type ColorModeWithSystem = ColorMode | "system" | undefined

/**
 * @deprecated use `ColorModeWithSystem` instead
 */
export type ConfigColorMode = ColorModeWithSystem

export interface ColorModeOptions {
  initialColorMode?: ColorModeWithSystem | undefined
  useSystemColorMode?: boolean | undefined
  disableTransitionOnChange?: boolean | undefined
}

export interface ColorModeContextType {
  forced?: boolean | undefined
  colorMode: ColorMode
  toggleColorMode: () => void
  setColorMode: (value: any) => void
}
