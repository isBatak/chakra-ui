import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { useStylingEngine } from "@chakra-ui/react/styling-engine"
import { renderHook } from "@testing-library/react"
import type { ReactNode } from "react"
import { EmotionStylingEngine } from "./styling-engine"

describe("EmotionStylingEngine", () => {
  it("binds its adapter to the nearest Chakra system", () => {
    const wrapper = (props: { children: ReactNode }) => (
      <ChakraProvider value={defaultSystem}>
        <EmotionStylingEngine>{props.children}</EmotionStylingEngine>
      </ChakraProvider>
    )
    const { result } = renderHook(useStylingEngine, { wrapper })

    expect(
      result.current.recipe({ name: "button", props: {} }).className,
    ).toMatch(/^chakra-/)
    expect(EmotionStylingEngine.displayName).toBe("EmotionStylingEngine")
  })
})
