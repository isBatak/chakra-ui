import type { Meta } from "@storybook/react-vite"
import { EmotionStylingEngine } from "../../emotion/src"
import { createPandaStylingEngine } from "../../panda/src"
import { Box, Button, defaultSystem } from "../src"

const PandaStylingEngine = createPandaStylingEngine<Record<string, unknown>>({
  isStyleProp: defaultSystem.isValidProperty,
  css: () => "panda-story-style",
  recipes: { button: () => "panda-story-button" },
  slotRecipes: {},
  token: defaultSystem.token,
})

export default {
  title: "Components / Button",
  decorators: [
    (Story) => (
      <EmotionStylingEngine>
        <Box p="10">
          <Story />
        </Box>
      </EmotionStylingEngine>
    ),
  ],
} satisfies Meta

export function PandaEngineBoundary() {
  return (
    <PandaStylingEngine>
      <Button>Panda button</Button>
    </PandaStylingEngine>
  )
}

export { ButtonBasic as Basic } from "compositions/examples/button-basic"
export { ButtonSizeTable as Sizes } from "compositions/examples/button-size-table"
export { ButtonVariantTable as Variants } from "compositions/examples/button-variant-table"
export { ButtonWithDisabled as Disabled } from "compositions/examples/button-with-disabled"
export { ButtonWithDisabledLink as DisabledLink } from "compositions/examples/button-with-disabled-link"
export { ButtonWithGroup as Group } from "compositions/examples/button-with-group"
export { ButtonWithGroupFlushed as GroupFlushed } from "compositions/examples/button-with-group-flushed"
export { ButtonWithIconComposition as IconComposition } from "compositions/examples/button-with-icon-composition"
export { ButtonWithIcons as Icon } from "compositions/examples/button-with-icons"
export { ButtonWithLoading as Loading } from "compositions/examples/button-with-loading"
export { ButtonWithLoadingToggle as LoadingToggle } from "compositions/examples/button-with-loading-toggle"
export { ButtonWithCustomSpinner as CustomSpinner } from "compositions/examples/button-with-custom-spinner"
export { ButtonWithSpinnerPlacement as SpinnerPlacement } from "compositions/examples/button-with-spinner-placement"
export { ButtonWithSplitMenu as SplitMenu } from "compositions/examples/button-with-split-menu"
export { ButtonWithRadius as Radius } from "compositions/examples/button-with-radius"
export { ButtonWithResponsiveSize as ResponsiveSize } from "compositions/examples/button-with-responsive-size"
export { ButtonWithStyleOverride as StyleOverrides } from "compositions/examples/button-with-style-override"
