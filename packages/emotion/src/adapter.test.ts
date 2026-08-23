import type { SystemContext } from "@chakra-ui/react/styled-system"
import type { EmotionCache } from "@emotion/cache"
import { describe, expect, it } from "vitest"
import { runFactoryAdapterConformance } from "../../react/src/styled-system/factory.adapter-conformance"
import { runStylingEngineConformance } from "../../react/src/styling-engine/conformance"
import { createEmotionAdapter } from "./adapter"

const system = {
  splitCssProps(props: Record<string, unknown>) {
    const { bg, color, css, ...elementProps } = props
    return [{ bg, color, css }, elementProps]
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
  cva(definition: { base?: Record<string, unknown> }) {
    const recipe = () => definition.base ?? {}
    return Object.assign(recipe, { merge: () => recipe })
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

  runStylingEngineConformance({
    name: "Emotion",
    adapter,
    singleStyle: { color: "red" },
    composedStyles: [{ color: "red" }, { margin: "2" }],
    expectInsertion(output) {
      expect(output.insertion).not.toBeNull()
    },
  })

  it("emits Emotion class names for direct style and recipe fixtures", () => {
    expect(adapter.css({ color: "red" }).className).toMatch(/^css-/)
    expect(
      adapter.recipe({ name: "button", props: { size: "sm" } }).className,
    ).toMatch(/^css-/)
    expect(
      adapter.slotRecipe({ name: "dialog", props: { size: "sm" } }),
    ).toMatchObject({
      root: { className: expect.stringMatching(/^css-/) },
      label: { className: expect.stringMatching(/^css-/) },
    })
  })
})

runFactoryAdapterConformance({
  name: "Emotion",
  adapter: createEmotionAdapter({ system }),
  styleClassName: /chakra-[a-z0-9]+/,
  recipeClassName: /chakra-[a-z0-9]+/,
})
