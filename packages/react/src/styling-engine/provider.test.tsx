import { renderHook } from "@testing-library/react"
import type { ReactNode } from "react"
import {
  StylingEngineProvider,
  createStylingEngineBoundary,
  useStylingEngine,
} from "./provider"
import type { StylingEngineAdapter } from "./types"

function createAdapter(name: string): StylingEngineAdapter {
  return {
    splitProps: (props) => ({ elementProps: props, styleProps: {} }),
    css: () => ({ className: name, insertion: null }),
    recipe: () => ({ className: name, insertion: null }),
    slotRecipe: () => ({}),
    cx: (...values) => values.filter(Boolean).join(" "),
    token: () => name,
  }
}

describe("createStylingEngineBoundary", () => {
  it("provides its fixed adapter and lets a nested boundary override it", () => {
    const outerAdapter = createAdapter("outer")
    const innerAdapter = createAdapter("inner")
    const InnerBoundary = createStylingEngineBoundary(innerAdapter, "Inner")

    const wrapper = (props: { children: ReactNode }) => (
      <StylingEngineProvider value={outerAdapter}>
        <InnerBoundary>{props.children}</InnerBoundary>
      </StylingEngineProvider>
    )
    const { result } = renderHook(useStylingEngine, { wrapper })

    expect(result.current).toBe(innerAdapter)
    expect(InnerBoundary.displayName).toBe("Inner")
  })
})
