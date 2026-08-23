import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { StylingEngineProvider } from "@chakra-ui/react/styling-engine"
import "@testing-library/jest-dom/vitest"
import { type RenderOptions, render as rtlRender } from "@testing-library/react"
import user from "@testing-library/user-event"
import { createEmotionAdapter } from "../../../emotion/src"

const emotionAdapter = createEmotionAdapter({
  system: defaultSystem,
})

const Provider = (props: any) => (
  <StylingEngineProvider value={emotionAdapter}>
    <ChakraProvider {...props} value={defaultSystem} />
  </StylingEngineProvider>
)

export interface ChakraRenderOptions extends RenderOptions {
  provider?: boolean
}

export function render(
  ui: React.ReactElement,
  opts: ChakraRenderOptions = {},
): ReturnType<typeof rtlRender> & { user: typeof user } {
  const { provider = true, ...options } = opts

  if (provider) {
    options.wrapper = Provider
  }

  const result = rtlRender(ui, options)

  return { user, ...result }
}
