import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import type { StylingEngineAdapter } from "../styling-engine"
import { StylingEngineProvider } from "../styling-engine"
import { chakra } from "./factory"

export interface FactoryAdapterConformanceOptions {
  name: string
  adapter: StylingEngineAdapter
  styleClassName: RegExp
  recipeClassName: RegExp
}

/** Runs the same intrinsic factory fixture against a concrete adapter. */
export function runFactoryAdapterConformance(
  options: FactoryAdapterConformanceOptions,
) {
  describe(`${options.name} chakra factory`, () => {
    afterEach(cleanup)

    it("renders, filters style props, and resolves an inline recipe", () => {
      const Button = chakra("button", {
        base: { fontWeight: "bold" },
      })

      render(
        <StylingEngineProvider value={options.adapter}>
          <Button
            type="button"
            name="save"
            data-kind="primary"
            bg="red"
            css={{ color: "white" }}
            className="consumer"
          >
            Save
          </Button>
        </StylingEngineProvider>,
      )

      const button = screen.getByRole("button", { name: "Save" })
      expect(button.getAttribute("name")).toBe("save")
      expect(button.getAttribute("data-kind")).toBe("primary")
      expect(button.hasAttribute("bg")).toBe(false)
      expect(button.hasAttribute("css")).toBe(false)
      expect(button.className).toMatch(options.styleClassName)
      expect(button.className).toMatch(options.recipeClassName)
      const generatedClasses = button.className
        .split(" ")
        .filter(
          (value) =>
            options.styleClassName.test(value) ||
            options.recipeClassName.test(value),
        )
      expect(generatedClasses).toHaveLength(2)
      expect(button.className.split(" ")).toContain("consumer")
    })
  })
}
