import type {
  RecipeConfig as PandaRecipeConfig,
  RecipeVariantRecord as PandaRecipeVariantRecord,
  SlotRecipeConfig as PandaSlotRecipeConfig,
  SlotRecipeVariantRecord as PandaSlotRecipeVariantRecord,
} from "@pandacss/types"
import type { Conditions } from "./generated/conditions.gen"
import type { ConfigRecipes, ConfigSlotRecipes } from "./generated/recipes.gen"
import type { SystemProperties } from "./generated/system.gen"
import type { Tokens } from "./generated/token.gen"

/**
 * Canonical public styling contract shared by every styling engine.
 */
export interface ChakraSystem {
  tokens: object
  conditions: object
  properties: object
  recipes: object
  slotRecipes: object
}

/**
 * Applications augment this interface to register their generated system.
 */
export interface ChakraSystemRegister {}

export interface DefaultChakraSystem extends ChakraSystem {
  tokens: Tokens
  conditions: Conditions
  properties: SystemProperties
  recipes: ConfigRecipes
  slotRecipes: ConfigSlotRecipes
}

export type ResolveChakraSystem<Register> = Register extends {
  system: infer System extends ChakraSystem
}
  ? System
  : DefaultChakraSystem

export type RegisteredChakraSystem = ResolveChakraSystem<ChakraSystemRegister>

/** Chakra-owned alias for Panda-compatible recipe metadata. */
export type ChakraRecipeConfig<
  Variants extends PandaRecipeVariantRecord = PandaRecipeVariantRecord,
> = PandaRecipeConfig<Variants>

/** Chakra-owned alias for Panda-compatible slot-recipe metadata. */
export type ChakraSlotRecipeConfig<
  Slot extends string = string,
  Variants extends PandaSlotRecipeVariantRecord<Slot> =
    PandaSlotRecipeVariantRecord<Slot>,
> = PandaSlotRecipeConfig<Slot, Variants>

export type ChakraSystemTokens<
  System extends ChakraSystem = RegisteredChakraSystem,
> = System["tokens"]

export type ChakraSystemConditions<
  System extends ChakraSystem = RegisteredChakraSystem,
> = System["conditions"]

export type ChakraSystemProperties<
  System extends ChakraSystem = RegisteredChakraSystem,
> = System["properties"]

export type ChakraSystemRecipes<
  System extends ChakraSystem = RegisteredChakraSystem,
> = System["recipes"]

export type ChakraSystemSlotRecipes<
  System extends ChakraSystem = RegisteredChakraSystem,
> = System["slotRecipes"]
