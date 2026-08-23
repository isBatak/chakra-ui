import { createEmotionAdapter } from "@chakra-ui/emotion"
import { createPandaAdapter } from "@chakra-ui/panda"
import type { SystemContext } from "@chakra-ui/react/styled-system"

const system = {
  splitCssProps: (props: Record<string, unknown>) => [{}, props],
  getRecipeFn: () => () => ({}),
  getSlotRecipeFn: () => () => ({}),
  cva: () => Object.assign(() => ({}), { merge: () => () => ({}) }),
  token: (_path: string, fallback?: string) => fallback ?? "",
} as unknown as SystemContext

export const emotionAdapter = createEmotionAdapter({ system })

export const pandaAdapter = createPandaAdapter({
  isStyleProp: () => false,
  css: () => "",
  recipes: {},
  slotRecipes: {},
  token: (_path, fallback) => fallback ?? "",
})
