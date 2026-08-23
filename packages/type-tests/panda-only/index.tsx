import type {
  ChakraComponent,
  ChakraJsxStyleProps,
  ChakraRecipeProps,
} from "@chakra-ui/react"

declare const Button: ChakraComponent<"button", ChakraRecipeProps<"button">>

const pandaButton = (
  <Button variant="solid" css={{ color: "red.500" }}>
    Panda
  </Button>
)

const pandaStyle = {
  color: "red.500",
} satisfies ChakraJsxStyleProps

export { pandaButton, pandaStyle }
