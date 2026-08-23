import pandaPreset from "../../panda-preset/src"
import { defineConfig, defineSystem } from "../src/styled-system"
import { defaultTheme } from "../src/theme"

const pandaTheme = pandaPreset.theme?.extend

describe("engine-neutral theme", () => {
  test("feeds the proven Button and Dialog recipes to both engines", () => {
    expect(pandaTheme?.recipes?.button).toEqual(defaultTheme.recipes.button)
    expect(pandaTheme?.slotRecipes?.dialog).toEqual(
      defaultTheme.slotRecipes.dialog,
    )
  })

  test("keeps the Panda preset extendable", () => {
    expect(pandaPreset.theme).toEqual({ extend: pandaTheme })
    expect(pandaTheme?.tokens).toBeDefined()
    expect(pandaTheme?.semanticTokens).toBeDefined()
  })
})

describe("defineSystem", () => {
  test("merges multiple Emotion config inputs in order", () => {
    const base = defineConfig({
      theme: {
        tokens: {
          colors: {
            brand: { value: "#0055cc" },
          },
        },
      },
    })
    const extension = defineConfig({
      theme: {
        tokens: {
          colors: {
            accent: { value: "#ff0055" },
            brand: { value: "#0044aa" },
          },
        },
      },
    })

    const system = defineSystem(base, extension)

    expect(system.token("colors.brand")).toBe("#0044aa")
    expect(system.token("colors.accent")).toBe("#ff0055")
  })
})
