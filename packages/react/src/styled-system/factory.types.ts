import type { Assign } from "@ark-ui/react"
import type {
  ComponentRef,
  ComponentProps,
  ComponentPropsWithoutRef,
  ElementType,
  JSX,
  Ref,
  ReactElement,
  ReactNode,
} from "react"
import type {
  Dict,
  DistributiveOmit,
  DistributiveUnion,
  Pretty,
} from "../utils"
import type {
  ChakraSystem,
  RegisteredChakraSystem,
} from "./canonical.types"
import type { MinimalNested, SystemStyleObject } from "./css.types"
import type { SystemProperties } from "./generated/system.gen"
import type {
  RecipeDefinition,
  RecipeSelection,
  RecipeVariantRecord,
} from "./recipe.types"

export interface UnstyledProp {
  /**
   * If `true`, the element will opt out of the theme styles.
   */
  unstyled?: boolean | undefined
}

export interface PolymorphicProps {
  as?: ElementType | undefined
  asChild?: boolean | undefined
}

export interface ArkAsChildProps {
  /** Compose the Chakra component onto its single child using Ark UI v5. */
  asChild?: boolean | undefined
  children?: ReactNode | undefined
}

export type PolymorphicRef<T extends ElementType> = Ref<ComponentRef<T>>

export interface HtmlProps {
  htmlSize?: number | undefined
  htmlWidth?: string | number | undefined
  htmlHeight?: string | number | undefined
  htmlTranslate?: "yes" | "no" | undefined
  htmlContent?: string | undefined
}

export type HtmlProp =
  | "color"
  | "size"
  | "translate"
  | "transition"
  | "width"
  | "height"
  | "content"

export type PatchHtmlProps<T> = DistributiveOmit<T, HtmlProp> & HtmlProps

export type JsxHtmlProps<T extends Dict, P extends Dict = {}> = Assign<
  PatchHtmlProps<T>,
  P
>

export interface ChakraComponent<
  T extends ElementType,
  P extends Dict = {},
> {
  (
    props: HTMLChakraProps<T, P> & {
      as?: undefined
      ref?: PolymorphicRef<T> | undefined
    },
  ): ReactElement | null
  <As extends ElementType>(
    props: HTMLChakraProps<As, P> & {
      as: As
      ref?: PolymorphicRef<As> | undefined
    },
  ): ReactElement | null
  displayName?: string | undefined
}

export type HTMLChakraProps<
  T extends ElementType,
  P extends Dict = {},
> = JsxHtmlProps<
  ComponentPropsWithoutRef<T>,
  Assign<JsxStyleProps, P> & PolymorphicProps & ArkAsChildProps
>

export type ChakraIntrinsicElementProps<
  T extends keyof JSX.IntrinsicElements,
  P extends Dict = {},
> = HTMLChakraProps<T, P>

export type JsxElement<T extends ElementType, P extends Dict> =
  T extends ChakraComponent<infer A, infer B>
    ? ChakraComponent<A, Pretty<DistributiveUnion<P, B>>>
    : ChakraComponent<T, P>

export interface JsxFactory {
  <T extends ElementType>(component: T): ChakraComponent<T, {}>
  <T extends ElementType, P extends RecipeVariantRecord>(
    component: T,
    recipe: RecipeDefinition<P>,
    options?: JsxFactoryOptions<Assign<ComponentProps<T>, RecipeSelection<P>>>,
  ): JsxElement<T, RecipeSelection<P>>
}

type JsxElements = {
  [K in keyof JSX.IntrinsicElements]: ChakraComponent<K, {}>
}

export type StyledFactoryFn = JsxFactory & JsxElements

export type DataAttr = Record<
  `data-${string}`,
  string | number | undefined | null | boolean
>

export interface JsxFactoryOptions<TProps> {
  forwardProps?: string[] | undefined
  defaultProps?: (Partial<TProps> & DataAttr) | undefined
  forwardAsChild?: boolean | undefined
  displayName?: string | undefined
  shouldForwardProp?(prop: string, variantKeys: string[]): boolean
}

export interface JsxStyleProps
  extends SystemProperties, MinimalNested<SystemStyleObject> {
  css?:
    | SystemStyleObject
    | undefined
    | Omit<(SystemStyleObject | undefined)[], keyof any[]>
}

/** Public JSX style props shared by every engine implementation. */
export type ChakraJsxStyleProps<
  System extends ChakraSystem = RegisteredChakraSystem,
> = System["properties"] & MinimalNested<SystemStyleObject> & {
    css?: JsxStyleProps["css"]
  }

type RecipeType<System extends ChakraSystem, Key extends PropertyKey> =
  Key extends keyof System["recipes"]
    ? System["recipes"][Key] extends { __type: infer Props }
      ? Props
      : {}
    : never

type SlotRecipeType<
  System extends ChakraSystem,
  Key extends PropertyKey,
> = Key extends keyof System["slotRecipes"]
  ? System["slotRecipes"][Key] extends { __type: infer Props }
    ? Props
    : {}
  : never

export type ChakraRecipeProps<
  Key extends keyof RegisteredChakraSystem["recipes"],
  System extends ChakraSystem = RegisteredChakraSystem,
> = RecipeType<System, Key>

export type ChakraSlotRecipeProps<
  Key extends keyof RegisteredChakraSystem["slotRecipes"],
  System extends ChakraSystem = RegisteredChakraSystem,
> = SlotRecipeType<System, Key>

export type InferRecipeProps<T> =
  T extends ChakraComponent<any, infer P> ? P : {}
