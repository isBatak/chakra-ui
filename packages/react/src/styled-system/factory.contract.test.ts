import { expectTypeOf, it } from "vitest"
import type { StylingEngineAdapter } from "../styling-engine"
import {
  type FactoryPublicTypeMap,
  type IntrinsicChakraFactory,
  factoryAdapterMethodMap,
} from "./factory.contract"
import type { ChakraComponent, HTMLChakraProps } from "./factory.types"

it("maps every factory styling operation to an adapter method", () => {
  expectTypeOf(factoryAdapterMethodMap).toMatchTypeOf<
    Record<keyof typeof factoryAdapterMethodMap, keyof StylingEngineAdapter>
  >()

  expectTypeOf(factoryAdapterMethodMap).toEqualTypeOf<{
    readonly splitProps: "splitProps"
    readonly resolveStyles: "css"
    readonly resolveRecipe: "recipe"
    readonly resolveSlotRecipe: "slotRecipe"
    readonly mergeClassNames: "cx"
    readonly resolveToken: "token"
  }>()
})

it("defines the minimal chakra button API with canonical public types", () => {
  expectTypeOf<IntrinsicChakraFactory>().toMatchTypeOf<
    (component: "button") => ChakraComponent<"button">
  >()
  expectTypeOf<FactoryPublicTypeMap["intrinsicProps"]>().toEqualTypeOf<
    HTMLChakraProps<"button">
  >()
})
