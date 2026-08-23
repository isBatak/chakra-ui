import { cleanup, render, screen } from "@testing-library/react"
import { createRef } from "react"
import { afterEach, describe, expect, it } from "vitest"
import type { StylingEngineAdapter } from "../../styling-engine"
import { StylingEngineProvider } from "../../styling-engine"
import { Button } from "./button"
import { ButtonGroup } from "./button-group"

export interface ButtonAdapterConformanceOptions {
  name: string
  adapter: StylingEngineAdapter
  buttonClassName: RegExp
  defaultButtonClassName: RegExp
  groupClassName: RegExp
  standaloneHtml: string
  groupHtml: string
}

const normalizeHtml = (html: string) =>
  html
    .replace(/\s+/g, " ")
    .replace(/\s*>/g, ">")
    .replace(/>\s+/g, ">")
    .replace(/\s+</g, "<")
    .replace(/;"/g, '"')
    .trim()

/** Runs the public Button and ButtonGroup fixtures against a concrete adapter. */
export function runButtonAdapterConformance(
  options: ButtonAdapterConformanceOptions,
) {
  const renderWithAdapter = (node: React.ReactNode) =>
    render(
      <StylingEngineProvider value={options.adapter}>
        {node}
      </StylingEngineProvider>,
    )

  describe(`${options.name} Button`, () => {
    afterEach(cleanup)

    it("preserves behavior, refs, recipe classes, and consumer classes", () => {
      const ref = createRef<HTMLButtonElement>()
      const { container } = renderWithAdapter(
        <Button
          ref={ref}
          size="sm"
          variant="outline"
          loading
          spinner={null}
          className="consumer-button"
          data-testid="button"
        >
          Save
        </Button>,
      )

      const button = screen.getByTestId("button")
      expect(ref.current).toBe(button)
      expect((button as HTMLButtonElement).disabled).toBe(true)
      expect(button.getAttribute("data-loading")).toBe("")
      expect(button.className).toMatch(options.buttonClassName)
      expect(button.className.split(" ")).toContain("consumer-button")
      expect(normalizeHtml(container.innerHTML)).toBe(
        normalizeHtml(options.standaloneHtml),
      )
    })

    it("preserves as and Ark asChild behavior", () => {
      const { rerender } = renderWithAdapter(<Button as="a">Link</Button>)
      const link = screen.getByText("Link")
      expect(link.tagName).toBe("A")
      expect(link.className).toMatch(options.defaultButtonClassName)

      rerender(
        <StylingEngineProvider value={options.adapter}>
          <Button asChild>
            <a href="#child">Child</a>
          </Button>
        </StylingEngineProvider>,
      )
      expect(screen.getByRole("link").getAttribute("href")).toBe("#child")
    })
  })

  describe(`${options.name} ButtonGroup`, () => {
    afterEach(cleanup)

    it("composes layout, context, child overrides, refs, and HTML", () => {
      const ref = createRef<HTMLDivElement>()
      const { container } = renderWithAdapter(
        <ButtonGroup
          ref={ref}
          size="sm"
          variant="outline"
          className="consumer-group"
          data-testid="group"
        >
          <Button>Inherited</Button>
          <Button size="lg">Override</Button>
        </ButtonGroup>,
      )

      const group = screen.getByTestId("group")
      const inherited = screen.getByRole("button", { name: "Inherited" })
      const override = screen.getByRole("button", { name: "Override" })

      expect(ref.current).toBe(group)
      expect(group.className).toMatch(options.groupClassName)
      expect(group.className.split(" ")).toEqual(
        expect.arrayContaining(["chakra-group", "consumer-group"]),
      )
      expect(inherited.className).toMatch(options.buttonClassName)
      expect(override.className).toMatch(options.buttonClassName)
      expect(inherited.className).not.toBe(override.className)
      expect(inherited.getAttribute("data-first")).toBe("")
      expect(override.getAttribute("data-last")).toBe("")
      expect(normalizeHtml(container.innerHTML)).toBe(
        normalizeHtml(options.groupHtml),
      )
    })
  })
}
