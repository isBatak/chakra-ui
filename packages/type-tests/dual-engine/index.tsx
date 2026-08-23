import type { ChakraComponent, ChakraRecipeProps } from "@chakra-ui/react"

type SharedButton = ChakraComponent<"button", ChakraRecipeProps<"button">>

declare const EmotionButton: SharedButton
declare const PandaButton: SharedButton

const emotionButton = <EmotionButton variant="solid" css={{ p: "4" }} />
const pandaButton = <PandaButton variant="solid" css={{ p: "4" }} />

export { emotionButton, pandaButton }
export type { SharedButton }
