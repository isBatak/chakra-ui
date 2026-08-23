import type { RecipeConfig, SlotRecipeConfig } from "@pandacss/types"
import { expectTypeOf, it } from "vitest"
import type {
  ChakraRecipeConfig,
  ChakraSlotRecipeConfig,
  ChakraSystem,
  ChakraSystemConditions,
  ChakraSystemProperties,
  ChakraSystemRecipes,
  ChakraSystemSlotRecipes,
  ChakraSystemTokens,
  DefaultChakraSystem,
  RegisteredChakraSystem,
  ResolveChakraSystem,
} from "./canonical.types"

it("exposes the canonical styling-system inventory", () => {
  expectTypeOf<RegisteredChakraSystem>().toEqualTypeOf<DefaultChakraSystem>()
  expectTypeOf<ChakraSystemTokens>().toEqualTypeOf<
    DefaultChakraSystem["tokens"]
  >()
  expectTypeOf<ChakraSystemConditions>().toEqualTypeOf<
    DefaultChakraSystem["conditions"]
  >()
  expectTypeOf<ChakraSystemProperties>().toEqualTypeOf<
    DefaultChakraSystem["properties"]
  >()
  expectTypeOf<ChakraSystemRecipes>().toEqualTypeOf<
    DefaultChakraSystem["recipes"]
  >()
  expectTypeOf<ChakraSystemSlotRecipes>().toEqualTypeOf<
    DefaultChakraSystem["slotRecipes"]
  >()
  expectTypeOf<ChakraRecipeConfig>().toEqualTypeOf<RecipeConfig>()
  expectTypeOf<ChakraSlotRecipeConfig>().toEqualTypeOf<SlotRecipeConfig>()
})

it("resolves an application-registered extension", () => {
  interface AppSystem extends ChakraSystem {
    tokens: DefaultChakraSystem["tokens"] & {
      brand: "primary"
    }
    recipes: DefaultChakraSystem["recipes"] & {
      marketingButton: { __type: { variant?: "hero" } }
    }
  }

  expectTypeOf<
    ResolveChakraSystem<{ system: AppSystem }>
  >().toEqualTypeOf<AppSystem>()
})
