import { createPandaAdapter } from "@chakra-ui/panda"
import { StylingEngineProvider } from "@chakra-ui/react/styling-engine"
import type { ReactNode } from "react"

const dialogSlots = [
  "trigger",
  "backdrop",
  "positioner",
  "content",
  "header",
  "title",
  "description",
  "body",
  "footer",
  "closeTrigger",
] as const

const styleProps = new Set([
  "alignItems",
  "display",
  "flexWrap",
  "gap",
  "justifyContent",
])

export const pandaAdapter = createPandaAdapter({
  isStyleProp: (prop) => styleProps.has(prop),
  css: () => "panda-css",
  recipes: { button: () => "panda-button" },
  resolveRecipe: () => "panda-inline",
  slotRecipes: {
    dialog: () =>
      Object.fromEntries(
        dialogSlots.map((slot) => [slot, `panda-dialog__${slot}`]),
      ),
  },
  token: (_path, fallback) => fallback ?? "",
})

export function PandaOnlyFixture(props: { children?: ReactNode }) {
  return (
    <StylingEngineProvider value={pandaAdapter}>
      {props.children}
    </StylingEngineProvider>
  )
}
