import type { EmotionCache } from "@emotion/cache"
import { createEmotionAdapter } from "@chakra-ui/emotion"
import { createPandaAdapter } from "@chakra-ui/panda"
import type {
  StylingEngineAdapter,
  StylingEngineStyleOutput,
} from "@chakra-ui/react/styling-engine"
import type { SystemContext } from "@chakra-ui/react/styled-system"
import { describe, expect, it } from "vitest"

const system = {
  splitCssProps(props: Record<string, unknown>) {
    const { color, ...elementProps } = props
    return [{ color }, elementProps]
  },
  getRecipeFn() {
    return () => ({ color: "red" })
  },
  getSlotRecipeFn() {
    return () => ({ root: { color: "red" } })
  },
  token(path: string, fallback?: string) {
    return path === "colors.red" ? "#f00" : fallback
  },
} as unknown as SystemContext

const adapters: Array<{
  name: string
  adapter: StylingEngineAdapter<Record<string, unknown>>
  hasInsertion: boolean
}> = [
  {
    name: "Emotion",
    adapter: createEmotionAdapter({
      system,
      cache: {
        key: "css",
        registered: {},
        sheet: {},
      } as EmotionCache,
    }),
    hasInsertion: true,
  },
  {
    name: "Panda",
    adapter: createPandaAdapter({
      isStyleProp: (prop) => prop === "color",
      css: () => "panda-css",
      recipes: { button: () => "panda-button" },
      slotRecipes: { dialog: () => ({ root: "panda-dialog__root" }) },
      token: system.token,
    }),
    hasInsertion: false,
  },
]

const expectStyleOutput = (
  output: StylingEngineStyleOutput,
  hasInsertion: boolean,
) => {
  expect(output.className).not.toBe("")
  if (hasInsertion) expect(output.insertion).not.toBeNull()
  else expect(output.insertion).toBeNull()
}

describe.each(adapters)("$name adapter", ({ adapter, hasInsertion }) => {
  it("passes the shared styling-engine contract", () => {
    expect(adapter.splitProps({ id: "button", color: "red" })).toEqual({
      elementProps: { id: "button" },
      styleProps: { color: "red" },
    })

    expectStyleOutput(adapter.css({ color: "red" }), hasInsertion)
    expectStyleOutput(
      adapter.recipe({ name: "button", props: {} }),
      hasInsertion,
    )
    expectStyleOutput(
      adapter.slotRecipe({ name: "dialog", props: {} }).root,
      hasInsertion,
    )

    expect(adapter.cx("base", false, "user")).toBe("base user")
    expect(adapter.token("colors.red")).toBe("#f00")
    expect(adapter.token("missing", "fallback")).toBe("fallback")
  })
})
