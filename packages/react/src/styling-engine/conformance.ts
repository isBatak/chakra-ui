import { describe, expect, it } from "vitest"
import type {
  StylingEngineAdapter,
  StylingEngineStyleOutput,
} from "./types"

interface StylingEngineConformanceFixture<SystemStyle> {
  name: string
  adapter: StylingEngineAdapter<SystemStyle>
  singleStyle: SystemStyle
  composedStyles: readonly SystemStyle[]
  expectInsertion(output: StylingEngineStyleOutput): void
}

export function runStylingEngineConformance<SystemStyle>(
  fixture: StylingEngineConformanceFixture<SystemStyle>,
) {
  const { adapter } = fixture

  describe(`${fixture.name} styling engine conformance`, () => {
    it("splits element props from style props without changing the input", () => {
      const props = { id: "button", color: "red" }

      expect(adapter.splitProps(props)).toEqual({
        elementProps: { id: "button" },
        styleProps: { color: "red" },
      })
      expect(props).toEqual({ id: "button", color: "red" })
    })

    it("resolves single and composed style inputs", () => {
      const single = adapter.css(fixture.singleStyle)
      const composed = adapter.css(fixture.composedStyles)

      expect(single.className).toBeTruthy()
      expect(composed.className).toBeTruthy()
      fixture.expectInsertion(single)
      fixture.expectInsertion(composed)
    })

    it("resolves recipes and slot recipes", () => {
      const recipe = adapter.recipe({
        name: "button",
        props: { size: "sm" },
      })
      const slots = adapter.slotRecipe({
        name: "dialog",
        props: { size: "sm" },
      })

      expect(recipe.className).toBeTruthy()
      expect(Object.keys(slots).length).toBeGreaterThan(0)
      fixture.expectInsertion(recipe)
      Object.values(slots).forEach(fixture.expectInsertion)
    })

    it("merges class names in order and ignores false values", () => {
      expect(adapter.cx("base", false, null, undefined, "user")).toBe(
        "base user",
      )
    })

    it("resolves tokens and preserves the fallback", () => {
      expect(adapter.token("colors.red")).toBe("#f00")
      expect(adapter.token("missing", "fallback")).toBe("fallback")
    })
  })
}
