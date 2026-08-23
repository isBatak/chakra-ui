import type { ElementType, JSX } from "react"
import type { StylingEngineAdapter } from "../styling-engine"
import type { RegisteredChakraSystem } from "./canonical.types"
import type {
  ArkAsChildProps,
  ChakraComponent,
  ChakraJsxStyleProps,
  ChakraRecipeProps,
  ChakraSlotRecipeProps,
  HTMLChakraProps,
  JsxFactory,
  PolymorphicProps,
  PolymorphicRef,
} from "./factory.types"

/** Styling work performed by the factory. Rendering remains React's concern. */
export type FactoryStylingOperation =
  | "splitProps"
  | "resolveStyles"
  | "resolveRecipe"
  | "resolveSlotRecipe"
  | "mergeClassNames"
  | "resolveToken"

/**
 * The single adapter method responsible for each factory styling operation.
 * This map is compile-checked against the engine-neutral adapter contract.
 */
export const factoryAdapterMethodMap = {
  splitProps: "splitProps",
  resolveStyles: "css",
  resolveRecipe: "recipe",
  resolveSlotRecipe: "slotRecipe",
  mergeClassNames: "cx",
  resolveToken: "token",
} as const satisfies Record<FactoryStylingOperation, keyof StylingEngineAdapter>

/** The smallest callable surface required by `chakra("button")`. */
export interface IntrinsicChakraFactory {
  <Element extends keyof JSX.IntrinsicElements>(
    component: Element,
  ): ChakraComponent<Element>
}

/**
 * Compile-time map from every public factory surface to its canonical type.
 * It documents the ABI without introducing an engine runtime dependency.
 */
export interface FactoryPublicTypeMap {
  factory: JsxFactory
  intrinsicFactory: IntrinsicChakraFactory
  component: ChakraComponent<ElementType>
  intrinsicProps: HTMLChakraProps<"button">
  styleProps: ChakraJsxStyleProps<RegisteredChakraSystem>
  polymorphicProps: PolymorphicProps
  polymorphicRef: PolymorphicRef<"button">
  asChildProps: ArkAsChildProps
  recipeProps: ChakraRecipeProps<keyof RegisteredChakraSystem["recipes"]>
  slotRecipeProps: ChakraSlotRecipeProps<
    keyof RegisteredChakraSystem["slotRecipes"]
  >
}
