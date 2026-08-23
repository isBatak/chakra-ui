import { createEmotionAdapter } from "@chakra-ui/emotion"
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

export function EmotionOnlyFixture(props: { children?: ReactNode }) {
  return (
    <StylingEngineProvider value={emotionAdapter}>
      {props.children}
    </StylingEngineProvider>
  )
}
