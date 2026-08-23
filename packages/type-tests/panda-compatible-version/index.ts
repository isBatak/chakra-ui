import type { ChakraRecipeConfig } from "@chakra-ui/react"
import type { RecipeConfig as PandaRecipeConfig } from "@pandacss/types"

declare const pandaRecipe: PandaRecipeConfig
declare const chakraRecipe: ChakraRecipeConfig

const chakraAcceptsCompatiblePanda: ChakraRecipeConfig = pandaRecipe
const compatiblePandaAcceptsChakra: PandaRecipeConfig = chakraRecipe

export { chakraAcceptsCompatiblePanda, compatiblePandaAcceptsChakra }
