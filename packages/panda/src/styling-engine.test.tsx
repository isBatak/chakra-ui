import { useStylingEngine } from "@chakra-ui/react/styling-engine"
import { renderHook } from "@testing-library/react"
import type { ReactNode } from "react"
import { createPandaStylingEngine } from "./styling-engine"

describe("createPandaStylingEngine", () => {
  it("provides an adapter bound to generated Panda helpers", () => {
    const PandaStylingEngine = createPandaStylingEngine({
      isStyleProp: (prop) => prop === "color",
      css: () => "panda-css",
      recipes: { button: () => "panda-button" },
      slotRecipes: {},
      token: (_path, fallback) => fallback ?? "panda-token",
    })
    const wrapper = (props: { children: ReactNode }) => (
      <PandaStylingEngine>{props.children}</PandaStylingEngine>
    )
    const { result } = renderHook(useStylingEngine, { wrapper })

    expect(result.current.css({ color: "red" })).toEqual({
      className: "panda-css",
      insertion: null,
    })
    expect(PandaStylingEngine.displayName).toBe("PandaStylingEngine")
  })
})
