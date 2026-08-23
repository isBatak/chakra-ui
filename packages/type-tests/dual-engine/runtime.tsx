import { createEmotionAdapter } from "@chakra-ui/emotion"
import { createPandaAdapter } from "@chakra-ui/panda"
import type { SystemContext } from "@chakra-ui/react/styled-system"
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

const system = {
  splitCssProps: (props: Record<string, unknown>) => {
    const style: Record<string, unknown> = {}
    const element: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(props)) {
      const target = styleProps.has(key) ? style : element
      target[key] = value
    }
    return [style, element]
  },
  getRecipeFn: () => () => ({ color: "red" }),
  getSlotRecipeFn: () => () =>
    Object.fromEntries(dialogSlots.map((slot) => [slot, { color: "red" }])),
  cva: () => Object.assign(() => ({}), { merge: () => () => ({}) }),
  token: (_path: string, fallback?: string) => fallback ?? "",
} as unknown as SystemContext

export const emotionAdapter = createEmotionAdapter({ system })

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
  token: (path, fallback) => (path === "engine" ? "panda" : (fallback ?? "")),
})

export function DualEngineFixture(props: { children?: ReactNode }) {
  return (
    <StylingEngineProvider value={pandaAdapter}>
      {props.children}
    </StylingEngineProvider>
  )
}
