import { expectTypeOf, it } from "vitest"
import type {
  ChakraSystem,
  ChakraSystemConditions,
  ChakraSystemProperties,
  ChakraSystemRecipes,
  ChakraSystemSlotRecipes,
  ChakraSystemTokens,
  DefaultChakraSystem,
  RegisteredChakraSystem,
} from "./canonical.types"

it("exposes the canonical styling-system inventory", () => {
  expectTypeOf<RegisteredChakraSystem>().toEqualTypeOf<DefaultChakraSystem>()
  expectTypeOf<ChakraSystemTokens>().toEqualTypeOf<ChakraSystem["tokens"]>()
  expectTypeOf<ChakraSystemConditions>().toEqualTypeOf<
    ChakraSystem["conditions"]
  >()
  expectTypeOf<ChakraSystemProperties>().toEqualTypeOf<
    ChakraSystem["properties"]
  >()
  expectTypeOf<ChakraSystemRecipes>().toEqualTypeOf<ChakraSystem["recipes"]>()
  expectTypeOf<ChakraSystemSlotRecipes>().toEqualTypeOf<
    ChakraSystem["slotRecipes"]
  >()
})
