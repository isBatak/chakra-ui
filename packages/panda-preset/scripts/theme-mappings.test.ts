import { describe, expect, test } from "vitest"
import { applyPandaThemeMappings } from "./theme-mappings"

describe("applyPandaThemeMappings", () => {
  test("can be imported without running the sync script", () => {
    expect(
      applyPandaThemeMappings(
        'import { containerRecipe } from "./container"\nexport const recipes = {\n  container: containerRecipe,\n}',
        "recipes/index.ts",
      ),
    ).toBe("export const recipes = {\n}")
  })

  test("maps legacy shadow references", () => {
    expect(
      applyPandaThemeMappings(
        'export const shadows = { value: "0 0 1px black" }',
        "semantic-tokens/shadows.ts",
      ),
    ).toContain("{colors.black}")
  })
})
