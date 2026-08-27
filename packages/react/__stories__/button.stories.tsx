import type { Meta } from "@storybook/react-vite"
import { css, cx } from "../../../styled-system/css"
import { button } from "../../../styled-system/recipes"
import { Box, Button, VStack } from "../src"
import { EmotionStylingEngine } from "../src/styling-engine/emotion"
import { PandaStylingEngine } from "../src/styling-engine/panda"

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

export const Test = () => (
  <VStack gap="4">
    <Button>Emotion Button</Button>

    <PandaStylingEngine>
      <Button>Panda Button</Button>
      <button className={cx(css({ colorPalette: "blue" }), button())}>
        Button
      </button>
    </PandaStylingEngine>
  </VStack>
)

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
