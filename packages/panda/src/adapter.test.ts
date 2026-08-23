import { describe, expect, it } from "vitest"
import { runFactoryAdapterConformance } from "../../react/src/styled-system/factory.adapter-conformance"
import { runStylingEngineConformance } from "../../react/src/styling-engine/conformance"
import { createPandaAdapter } from "./adapter"

describe("createPandaAdapter", () => {
  const adapter = createPandaAdapter({
    isStyleProp: (prop) => prop === "color",
    css: (...styles: Array<Record<string, unknown>>) => `css-${styles.length}`,
    recipes: {
      button: (props) => `button-${props.size}`,
    },
    slotRecipes: {
      dialog: () => ({ root: "dialog-root", content: "dialog-content" }),
    },
    token: (path, fallback) =>
      path === "colors.red" ? "#f00" : (fallback ?? path),
  })

  runStylingEngineConformance({
    name: "Panda",
    adapter,
    singleStyle: { color: "red" },
    composedStyles: [{ color: "red" }, { margin: "2" }],
    expectInsertion(output) {
      expect(output.insertion).toBeNull()
    },
  })

  it("emits Panda class names for direct style and recipe fixtures", () => {
    expect(adapter.css([{ color: "red" }, { margin: "2" }])).toEqual({
      className: "css-2",
      insertion: null,
    })
    expect(adapter.recipe({ name: "button", props: { size: "sm" } })).toEqual({
      className: "button-sm",
      insertion: null,
    })
    expect(adapter.slotRecipe({ name: "dialog", props: {} })).toEqual({
      root: { className: "dialog-root", insertion: null },
      content: { className: "dialog-content", insertion: null },
    })
  })

  it("reports unknown recipes", () => {
    expect(() => adapter.recipe({ name: "missing", props: {} })).toThrow(
      "Unknown Panda recipe: missing",
    )
    expect(() => adapter.slotRecipe({ name: "missing", props: {} })).toThrow(
      "Unknown Panda slot recipe: missing",
    )
  })
})

runFactoryAdapterConformance({
  name: "Panda",
  adapter: createPandaAdapter({
    isStyleProp: (prop) => prop === "bg" || prop === "css",
    css: () => "panda-style",
    recipes: {},
    resolveRecipe: (definitions) =>
      definitions.length === 1 ? "panda-inline-recipe" : "",
    slotRecipes: {},
    token: (path, fallback) => fallback ?? path,
  }),
  styleClassName: /panda-style/,
  recipeClassName: /panda-inline-recipe/,
})
