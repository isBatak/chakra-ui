import { defineConfig } from "@pandacss/dev"
import { buttonTracking } from "./packages/react/src/components/button/tracking"
import { defaultBaseConfig } from "./packages/react/src/preset-base"
import {
  animationStyles,
  breakpoints,
  buttonRecipe,
  cssVarsPrefix,
  cssVarsRoot,
  globalCss,
  keyframes,
  layerStyles,
  semanticTokens,
  textStyles,
  tokens,
} from "./packages/react/src/theme"

export default defineConfig({
  presets: ["@pandacss/preset-base"],
  preflight: true,
  jsxFramework: "react",
  include: ["./packages/react/__stories__/button.stories.tsx"],
  prefix: { cssVar: cssVarsPrefix },
  cssVarRoot: cssVarsRoot,
  globalCss,
  conditions: {
    extend: {
      dark: ".dark &, .dark .chakra-theme:not(.light) &",
      light: ":root &, .light &",
    },
  },
  //   utilities: {
  //     extend: defaultBaseConfig.utilities,
  //   },
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
        button: {
          jsx: [...buttonTracking],
          ...buttonRecipe,
        },
      },
    },
  },
  outdir: "styled-system",
})
