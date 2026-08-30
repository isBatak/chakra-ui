import { definePlugin } from "@pandacss/dev"

const chakraFactoryImport =
  /import\s*{[^}]*\bchakra\b[^}]*}\s*from\s*["'](?:@chakra-ui\/react(?:\/styled-system)?|(?:\.\.?\/)+(?:[^/"']+\/)*styled-system)["']/

export interface ChakraFactoryPluginOptions {
  jsxFactory: string
}

/** Teach Panda extraction that Chakra's public `chakra()` and `chakra.*` use its JSX factory. */
export function createChakraFactoryPlugin({
  jsxFactory,
}: ChakraFactoryPluginOptions) {
  if (!/^[$A-Z_a-z][$\w]*$/.test(jsxFactory)) {
    throw new Error(`Invalid Panda JSX factory name: ${jsxFactory}`)
  }

  return definePlugin({
    name: "@chakra-ui/panda-chakra-factory",
    hooks: {
      "parser:before": ({ content }) => {
        if (!chakraFactoryImport.test(content)) return

        return [
          `import { ${jsxFactory} as __chakraPandaExtract } from "styled-system/jsx"`,
          content.replace(/\bchakra(?=\s*(?:\(|\.))/g, "__chakraPandaExtract"),
        ].join("\n")
      },
    },
  })
}
