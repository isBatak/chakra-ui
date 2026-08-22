import { describe, expect, it } from "vitest"
import type { SystemContext, SystemStyleObject } from "@chakra-ui/react/styled-system"
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

const resolveStyle = (style: SystemStyleObject | readonly SystemStyleObject[]) => ({
  className: "emotion-class",
  insertion: JSON.stringify(style),
})

describe("createEmotionAdapter", () => {
  const adapter = createEmotionAdapter({ system, resolveStyle })

  it("conforms to the styling engine contract", () => {
    expect(adapter.splitProps({ id: "button", color: "red" })).toEqual({
      elementProps: { id: "button" },
      styleProps: { color: "red" },
    })
    expect(adapter.css({ color: "red" })).toEqual({
      className: "emotion-class",
      insertion: JSON.stringify({ color: "red" }),
    })
    expect(adapter.recipe({ name: "button", props: { size: "sm" } }).className)
      .toBe("emotion-class")
    expect(
      adapter.slotRecipe({ name: "dialog", props: { size: "sm" } }),
    ).toMatchObject({
      root: { className: "emotion-class" },
      label: { className: "emotion-class" },
    })
    expect(adapter.cx("base", false, "user")).toBe("base user")
    expect(adapter.token("colors.red")).toBe("#f00")
    expect(adapter.token("missing", "fallback")).toBe("fallback")
  })
})
