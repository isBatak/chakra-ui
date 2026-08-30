import { definePlugin, definePreset } from "@pandacss/dev"
import { badgeTracking } from "../../components/badge/tracking"
import { buttonTracking } from "../../components/button/tracking"
import { checkmarkTracking } from "../../components/checkmark/tracking"
import { codeTracking } from "../../components/code/tracking"
import { colorSwatchTracking } from "../../components/color-swatch/tracking"
import { containerTracking } from "../../components/container/tracking"
import { headingTracking } from "../../components/heading/tracking"
import { iconTracking } from "../../components/icon/tracking"
import { inputAddonTracking } from "../../components/input-addon/tracking"
import { inputTracking } from "../../components/input/tracking"
import { kbdTracking } from "../../components/kbd/tracking"
import { linkTracking } from "../../components/link/tracking"
import { markTracking } from "../../components/mark/tracking"
import { radiomarkTracking } from "../../components/radiomark/tracking"
import { separatorTracking } from "../../components/separator/tracking"
import { skeletonTracking } from "../../components/skeleton/tracking"
import { skipNavLinkTracking } from "../../components/skip-nav/tracking"
import { spinnerTracking } from "../../components/spinner/tracking"
import { textareaTracking } from "../../components/textarea/tracking"
import {
  animationStyles,
  badgeRecipe,
  breakpoints,
  buttonRecipe,
  checkmarkRecipe,
  codeRecipe,
  colorSwatchRecipe,
  containerRecipe,
  cssVarsPrefix,
  cssVarsRoot,
  globalCss,
  headingRecipe,
  iconRecipe,
  inputAddonRecipe,
  inputRecipe,
  kbdRecipe,
  keyframes,
  layerStyles,
  linkRecipe,
  markRecipe,
  radiomarkRecipe,
  semanticTokens,
  separatorRecipe,
  skeletonRecipe,
  skipNavLinkRecipe,
  spinnerRecipe,
  textStyles,
  textareaRecipe,
  tokens,
} from "../../theme"
import { createChakraFactoryPlugin } from "./chakra-factory-plugin"

export interface ChakraPandaPresetOptions {
  jsxFactory: string
}

export function createChakraPandaPreset({
  jsxFactory,
}: ChakraPandaPresetOptions) {
  const preset = {
    name: "@chakra-ui/react/panda",
    prefix: { cssVar: cssVarsPrefix },
    cssVarRoot: cssVarsRoot,
    plugins: [
      createChakraFactoryPlugin({ jsxFactory }),
      definePlugin({
        name: "@chakra-ui/remove-panda-container-pattern",
        hooks: {
          "config:resolved": ({ config, utils }) =>
            utils.omit(config, ["patterns.container"]),
        },
      }),
    ],
    globalCss,
    conditions: {
      extend: {
        dark: ".dark &, .dark .chakra-theme:not(.light) &",
        light: ":root &, .light &",
      },
    },
    theme: {
      extend: {
        breakpoints,
        keyframes,
        tokens,
        semanticTokens,
        textStyles,
        layerStyles,
        animationStyles,
        recipes: {
          badge: {
            jsx: [...badgeTracking],
            ...badgeRecipe,
          },
          button: {
            jsx: [...buttonTracking],
            ...buttonRecipe,
          },
          checkmark: {
            jsx: [...checkmarkTracking],
            ...checkmarkRecipe,
          },
          code: {
            jsx: [...codeTracking],
            ...codeRecipe,
          },
          colorSwatch: {
            jsx: [...colorSwatchTracking],
            ...colorSwatchRecipe,
          },
          container: {
            jsx: [...containerTracking],
            ...containerRecipe,
          },
          heading: {
            jsx: [...headingTracking],
            ...headingRecipe,
          },
          icon: {
            jsx: [...iconTracking],
            ...iconRecipe,
          },
          input: {
            jsx: [...inputTracking],
            ...inputRecipe,
          },
          inputAddon: {
            jsx: [...inputAddonTracking],
            ...inputAddonRecipe,
          },
          kbd: {
            jsx: [...kbdTracking],
            ...kbdRecipe,
          },
          link: {
            jsx: [...linkTracking],
            ...linkRecipe,
          },
          mark: {
            jsx: [...markTracking],
            ...markRecipe,
          },
          radiomark: {
            jsx: [...radiomarkTracking],
            ...radiomarkRecipe,
          },
          separator: {
            jsx: [...separatorTracking],
            ...separatorRecipe,
          },
          skeleton: {
            jsx: [...skeletonTracking],
            ...skeletonRecipe,
          },
          skipNavLink: {
            jsx: [...skipNavLinkTracking],
            ...skipNavLinkRecipe,
          },
          spinner: {
            jsx: [...spinnerTracking],
            ...spinnerRecipe,
          },
          textarea: {
            jsx: [...textareaTracking],
            ...textareaRecipe,
          },
        },
      },
    },
  }

  return definePreset(preset as unknown as Parameters<typeof definePreset>[0])
}
