import { defineConfig } from "@pandacss/dev"
import { buttonTracking } from "./packages/react/src/components/button/tracking"
import { spinnerTracking } from "./packages/react/src/components/spinner/tracking"
import { defaultBaseConfig } from "./packages/react/src/preset-base"
import { createChakraFactoryPlugin } from "./packages/react/src/styled-engine/panda/chakra-factory-plugin"
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
  spinnerRecipe,
  textStyles,
  tokens,
} from "./packages/react/src/theme"

const jsxFactory = "styled"

export default defineConfig({
  presets: ["@pandacss/preset-base"],
  preflight: true,
  plugins: [createChakraFactoryPlugin({ jsxFactory })],
  jsxFramework: "react",
  jsxFactory,
  include: [
    "./packages/react/__stories__/button.stories.tsx",
    "./packages/react/src/components/{absolute-center,loader,span,spinner}/**/*.{ts,tsx}",
  ],
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
        spinner: {
          jsx: [...spinnerTracking],
          ...spinnerRecipe,
        },
      },
    },
  },
  outdir: "styled-system",
})
