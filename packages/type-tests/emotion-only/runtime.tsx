import { createEmotionAdapter } from "@chakra-ui/emotion"
import { StylingEngineProvider } from "@chakra-ui/react/styling-engine"
import type { SystemContext } from "@chakra-ui/react/styled-system"
import type { ReactNode } from "react"

const system = {
  splitCssProps: (props: Record<string, unknown>) => [{}, props],
  getRecipeFn: () => () => ({}),
  getSlotRecipeFn: () => () => ({}),
  cva: () => Object.assign(() => ({}), { merge: () => () => ({}) }),
  token: (_path: string, fallback?: string) => fallback ?? "",
} as unknown as SystemContext

const adapter = createEmotionAdapter({ system })

export function EmotionOnlyFixture(props: { children?: ReactNode }) {
  return (
    <StylingEngineProvider value={adapter}>
      {props.children}
    </StylingEngineProvider>
  )
}
