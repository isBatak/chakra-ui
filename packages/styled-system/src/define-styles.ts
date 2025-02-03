import { SystemStyleObject } from "./system.types"

type Dict<T = any> = { [key: string]: T }

// ------------------------------------------------------------------ //

export type StyleFunctionProps = {
  colorScheme: string
  colorMode: "light" | "dark"
  orientation?: "horizontal" | "vertical" | undefined
  theme: Dict
  [key: string]: any
}

export type SystemStyleFunction = (
  props: StyleFunctionProps,
) => SystemStyleObject

export type SystemStyleInterpolation = SystemStyleObject | SystemStyleFunction

// ------------------------------------------------------------------ //

export function defineStyle<T extends SystemStyleInterpolation>(styles: T) {
  return styles
}

// ------------------------------------------------------------------ //

type DefaultProps = {
  size?: string | undefined
  variant?: string | undefined
  colorScheme?: string | undefined
}

export type StyleConfig = {
  baseStyle?: SystemStyleInterpolation | undefined
  sizes?: { [size: string]: SystemStyleInterpolation } | undefined
  variants?: { [variant: string]: SystemStyleInterpolation } | undefined
  defaultProps?: DefaultProps | undefined
}

/**
 * Defines the style config for a single-part component.
 */
export function defineStyleConfig<
  BaseStyle extends SystemStyleInterpolation,
  Sizes extends Dict<SystemStyleInterpolation>,
  Variants extends Dict<SystemStyleInterpolation>,
>(config: {
  baseStyle?: BaseStyle | undefined
  sizes?: Sizes | undefined
  variants?: Variants | undefined
  defaultProps?:
    | {
        size?: keyof Sizes | undefined
        variant?: keyof Variants | undefined
        colorScheme?: string | undefined
      }
    | undefined
}) {
  return config
}

// ------------------------------------------------------------------ //

type Anatomy = { keys: string[] }

export type PartsStyleObject<Parts extends Anatomy = Anatomy> = Partial<
  Record<Parts["keys"][number], SystemStyleObject>
>

export type PartsStyleFunction<Parts extends Anatomy = Anatomy> = (
  props: StyleFunctionProps,
) => PartsStyleObject<Parts>

export type PartsStyleInterpolation<Parts extends Anatomy = Anatomy> =
  | PartsStyleObject<Parts>
  | PartsStyleFunction<Parts>

export interface MultiStyleConfig<Parts extends Anatomy = Anatomy> {
  parts: Parts["keys"]
  baseStyle?: PartsStyleInterpolation<Parts> | undefined
  sizes?: { [size: string]: PartsStyleInterpolation<Parts> } | undefined
  variants?: { [variant: string]: PartsStyleInterpolation<Parts> } | undefined
  defaultProps?: DefaultProps | undefined
}

// ------------------------------------------------------------------ //

/**
 * Returns an object of helpers that can be used to define
 * the style configuration for a multi-part component.
 */
export function createMultiStyleConfigHelpers<Part extends string>(
  parts: Part[] | Readonly<Part[]>,
) {
  return {
    definePartsStyle<
      PartStyles extends PartsStyleInterpolation<{ keys: Part[] }>,
    >(config: PartStyles) {
      return config
    },
    defineMultiStyleConfig<
      BaseStyle extends PartsStyleInterpolation<{ keys: Part[] }>,
      Sizes extends Dict<PartsStyleInterpolation<{ keys: Part[] }>>,
      Variants extends Dict<PartsStyleInterpolation<{ keys: Part[] }>>,
    >(config: {
      baseStyle?: BaseStyle | undefined
      sizes?: Sizes | undefined
      variants?: Variants | undefined
      defaultProps?:
        | {
            size?: keyof Sizes | undefined
            variant?: keyof Variants | undefined
            colorScheme?: string | undefined
          }
        | undefined
    }) {
      return { parts: parts as Part[], ...config }
    },
  }
}
