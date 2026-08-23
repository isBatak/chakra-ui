import { createPandaAdapter } from "@chakra-ui/panda"
import { StylingEngineProvider } from "@chakra-ui/react/styling-engine"
import type { ReactNode } from "react"

const adapter = createPandaAdapter({
  isStyleProp: () => false,
  css: () => "",
  recipes: {},
  slotRecipes: {},
  token: (_path, fallback) => fallback ?? "",
})

export function PandaOnlyFixture(props: { children?: ReactNode }) {
  return (
    <StylingEngineProvider value={adapter}>
      {props.children}
    </StylingEngineProvider>
  )
}
