import type {
  ChakraComponent,
  ChakraJsxStyleProps,
  ChakraRecipeProps,
} from "@chakra-ui/react"

declare const Button: ChakraComponent<"button", ChakraRecipeProps<"button">>

const emotionButton = (
  <Button variant="solid" css={{ color: "red.500" }}>
    Emotion
  </Button>
)

const emotionStyle = {
  color: "red.500",
} satisfies ChakraJsxStyleProps

export { emotionButton, emotionStyle }
