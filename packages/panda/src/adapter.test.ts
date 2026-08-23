import { describe, expect, it } from "vitest"
import { createPandaAdapter } from "./adapter"

describe("createPandaAdapter", () => {
  const adapter = createPandaAdapter({
    isStyleProp: (prop) => prop === "color",
    css: (...styles: Array<Record<string, unknown>>) =>
      `css-${styles.length}`,
    recipes: {
      button: (props) => `button-${props.size}`,
    },
    slotRecipes: {
      dialog: () => ({ root: "dialog-root", content: "dialog-content" }),
    },
    token: (path, fallback) =>
      path === "colors.red" ? "#f00" : (fallback ?? path),
  })

  it("conforms to the styling engine contract", () => {
    expect(adapter.splitProps({ id: "button", color: "red" })).toEqual({
      elementProps: { id: "button" },
      styleProps: { color: "red" },
    })
    expect(adapter.css([{ color: "red" }, { margin: "2" }])).toEqual({
      className: "css-2",
      insertion: null,
    })
    expect(
      adapter.recipe({ name: "button", props: { size: "sm" } }),
    ).toEqual({
      className: "button-sm",
      insertion: null,
    })
    expect(
      adapter.slotRecipe({ name: "dialog", props: {} }),
    ).toEqual({
      root: { className: "dialog-root", insertion: null },
      content: { className: "dialog-content", insertion: null },
    })
    expect(adapter.cx("base", false, "user")).toBe("base user")
    expect(adapter.token("colors.red")).toBe("#f00")
    expect(adapter.token("missing", "fallback")).toBe("fallback")
  })

  it("reports unknown recipes", () => {
    expect(() => adapter.recipe({ name: "missing", props: {} })).toThrow(
      "Unknown Panda recipe: missing",
    )
    expect(() =>
      adapter.slotRecipe({ name: "missing", props: {} }),
    ).toThrow("Unknown Panda slot recipe: missing")
  })
})
