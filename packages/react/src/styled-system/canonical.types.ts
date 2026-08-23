import type { Conditions } from "./generated/conditions.gen"
import type {
  ConfigRecipes,
  ConfigSlotRecipes,
} from "./generated/recipes.gen"
import type { SystemProperties } from "./generated/system.gen"
import type { Tokens } from "./generated/token.gen"

/**
 * Canonical public styling contract shared by every styling engine.
 */
export interface ChakraSystem {
  tokens: Tokens
  conditions: Conditions
  properties: SystemProperties
  recipes: ConfigRecipes
  slotRecipes: ConfigSlotRecipes
}

/**
 * Applications augment this interface to register their generated system.
 */
export interface ChakraSystemRegister {}

export type DefaultChakraSystem = ChakraSystem

export type RegisteredChakraSystem =
  ChakraSystemRegister extends { system: infer System extends ChakraSystem }
    ? System
    : DefaultChakraSystem

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
