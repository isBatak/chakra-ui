import { noDynamicConditionalStyling } from "./rules/no-dynamic-conditional-styling"

export const rules = {
  "no-dynamic-conditional-styling": noDynamicConditionalStyling,
}

const recommendedRules = {
  "@chakra-ui/no-dynamic-conditional-styling": "warn",
} as const

interface Plugin {
  meta: { name: string }
  rules: typeof rules
  configs: {
    recommended: {
      plugins: string[]
      rules: typeof recommendedRules
    }
    "flat/recommended": {
      plugins: { "@chakra-ui": Plugin }
      rules: typeof recommendedRules
    }
  }
}

export const meta = {
  name: "@chakra-ui/eslint-plugin",
}

const plugin: Plugin = {
  meta,
  rules,
  configs: {} as Plugin["configs"],
}

plugin.configs.recommended = {
  plugins: ["@chakra-ui"],
  rules: recommendedRules,
}
plugin.configs["flat/recommended"] = {
  plugins: { "@chakra-ui": plugin },
  rules: recommendedRules,
}

export const configs = plugin.configs
export { noDynamicConditionalStyling }
export default plugin
