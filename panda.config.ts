import { defineConfig } from "@pandacss/dev"
import { createChakraPandaPreset } from "./packages/react/src/styled-engine/panda/preset"

const jsxFactory = "styled"

export default defineConfig({
  presets: ["@pandacss/preset-base", createChakraPandaPreset({ jsxFactory })],
  preflight: true,
  jsxFramework: "react",
  jsxFactory,
  include: [
    "./packages/react/__stories__/button.stories.tsx",
    "./packages/react/src/components/**/*.{ts,tsx}",
  ],
  outdir: "styled-system",
})
