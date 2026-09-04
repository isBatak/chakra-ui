import type { SystemContext } from "@chakra-ui/react/styled-system"
import type { EmotionCache } from "@emotion/cache"
import { describe, expect, it } from "vitest"
import { createEmotionAdapter } from "./adapter"

const system = {
  splitCssProps(props: Record<string, unknown>) {
    const { color, ...elementProps } = props
    return [{ color }, elementProps]
  },
  getRecipeFn() {
    return (props: Record<string, unknown>) => ({ recipe: props })
  },
  getSlotRecipeFn() {
    return (props: Record<string, unknown>) => ({
      root: { root: props },
      label: { label: props },
    })
  },
  token(path: string, fallback?: string) {
    return path === "colors.red" ? "#f00" : fallback
  },
} as unknown as SystemContext

describe("createEmotionAdapter", () => {
  const adapter = createEmotionAdapter({
    system,
    cache: { key: "css", registered: {}, sheet: {} } as EmotionCache,
  })

  it("conforms to the styling engine contract", () => {
    expect(adapter.splitProps({ id: "button", color: "red" })).toEqual({
      elementProps: { id: "button" },
      styleProps: { color: "red" },
    })
    const result = adapter.css({ color: "red" })
    expect(result.className).toMatch(/^css-/)
    expect(result.insertion).not.toBeNull()
    expect(
      adapter.recipe({ name: "button", props: { size: "sm" } }).className,
    ).toMatch(/^css-/)
    expect(
      adapter.slotRecipe({ name: "dialog", props: { size: "sm" } }),
    ).toMatchObject({
      root: { className: expect.stringMatching(/^css-/) },
      label: { className: expect.stringMatching(/^css-/) },
    })
    expect(adapter.cx("base", false, "user")).toBe("base user")
    expect(adapter.token("colors.red")).toBe("#f00")
    expect(adapter.token("missing", "fallback")).toBe("fallback")
  })
})
