import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { runButtonAdapterConformance } from "../../react/src/components/button/button.adapter-conformance"
import { runDialogAdapterConformance } from "../../react/src/components/dialog/dialog.adapter-conformance"
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
      dialog: () => ({
        trigger: "dialog-trigger",
        backdrop: "dialog-backdrop",
        positioner: "dialog-positioner",
        content: "dialog-content",
        header: "dialog-header",
        title: "dialog-title",
        description: "dialog-description",
        body: "dialog-body",
        footer: "dialog-footer",
        closeTrigger: "dialog-closeTrigger",
      }),
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
      trigger: { className: "dialog-trigger", insertion: null },
      backdrop: { className: "dialog-backdrop", insertion: null },
      positioner: { className: "dialog-positioner", insertion: null },
      content: { className: "dialog-content", insertion: null },
      header: { className: "dialog-header", insertion: null },
      title: { className: "dialog-title", insertion: null },
      description: { className: "dialog-description", insertion: null },
      body: { className: "dialog-body", insertion: null },
      footer: { className: "dialog-footer", insertion: null },
      closeTrigger: {
        className: "dialog-closeTrigger",
        insertion: null,
      },
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

  runButtonAdapterConformance({
    name: "Panda",
    adapter: createPandaAdapter({
      isStyleProp: (prop) =>
        ["alignItems", "css", "display", "flexWrap", "justifyContent"].includes(
          prop,
        ),
      css: () => "panda-style",
      recipes: {
        button: (props) =>
          `button-${props.size ?? "md"}-${props.variant ?? "solid"}`,
      },
      resolveRecipe: () => "panda-group-layout",
      slotRecipes: {},
      token: (path, fallback) => fallback ?? path,
    }),
    buttonClassName: /button-(sm|lg)-outline/,
    defaultButtonClassName: /button-md-solid/,
    groupClassName: /panda-group-layout/,
    standaloneHtml: readFileSync(
      "packages/panda/src/fixtures/button.html",
      "utf8",
    ).trim(),
    groupHtml: readFileSync(
      "packages/panda/src/fixtures/button-group.html",
      "utf8",
    ).trim(),
  })

  runDialogAdapterConformance({
    name: "Panda",
    adapter,
    slotClassName: (slot) => `dialog-${slot}`,
    html: readFileSync(
      "packages/panda/src/fixtures/dialog.html",
      "utf8",
    ).trim(),
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
