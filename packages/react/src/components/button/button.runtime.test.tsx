import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import type {
  StylingEngineAdapter,
  StylingEngineRecipeInput,
} from "../../styling-engine"
import { StylingEngineProvider } from "../../styling-engine"
import { Button } from "./button"
import { ButtonGroup } from "./button-group"

afterEach(cleanup)

function createAdapter() {
  const recipeCalls: StylingEngineRecipeInput[] = []
  const adapter: StylingEngineAdapter = {
    splitProps(props) {
      return { elementProps: props, styleProps: {} }
    },
    css() {
      return { className: "factory", insertion: null }
    },
    recipe(input) {
      recipeCalls.push(input)
      const size = input.props.size ?? "md"
      const variant = input.props.variant ?? "solid"
      return {
        className: input.name
          ? `button-${String(size)}-${String(variant)}`
          : "group-layout",
        insertion: null,
      }
    },
    slotRecipe() {
      return {}
    },
    cx(...values) {
      return values.filter(Boolean).join(" ")
    },
    token(path, fallback) {
      return fallback ?? path
    },
  }
  return { adapter, recipeCalls }
}

function renderWithAdapter(node: React.ReactNode) {
  const result = createAdapter()
  render(
    <StylingEngineProvider value={result.adapter}>
      {node}
    </StylingEngineProvider>,
  )
  return result
}

describe("Button adapter prototype", () => {
  it("applies recipe defaults and preserves the user class name", () => {
    const { recipeCalls } = renderWithAdapter(
      <Button className="user">Save</Button>,
    )

    const button = screen.getByRole("button", { name: "Save" })
    expect(button.className.split(" ")).toEqual(
      expect.arrayContaining(["button-md-solid", "factory", "user"]),
    )
    expect(recipeCalls).toContainEqual({
      name: "button",
      props: { size: undefined, variant: undefined },
    })
  })

  it("preserves loading, disabled, ref, as, and asChild behavior", () => {
    const ref = { current: null as HTMLButtonElement | null }
    const { rerender } = render(
      <StylingEngineProvider value={createAdapter().adapter}>
        <Button ref={ref} loading spinner={null}>
          Save
        </Button>
      </StylingEngineProvider>,
    )

    expect(ref.current).toBe(screen.getByRole("button"))
    expect(ref.current?.disabled).toBe(true)
    expect(ref.current?.dataset.loading).toBe("")

    rerender(
      <StylingEngineProvider value={createAdapter().adapter}>
        <Button as="a">Link</Button>
      </StylingEngineProvider>,
    )
    expect(screen.getByText("Link").tagName).toBe("A")

    rerender(
      <StylingEngineProvider value={createAdapter().adapter}>
        <Button asChild>
          <a href="#child">Child</a>
        </Button>
      </StylingEngineProvider>,
    )
    expect(screen.getByRole("link")).toHaveAttribute("href", "#child")
  })

  it("shares group values while allowing child overrides", () => {
    const { recipeCalls } = renderWithAdapter(
      <ButtonGroup size="sm" variant="outline" data-testid="group">
        <Button>Inherited</Button>
        <Button size="lg">Override</Button>
      </ButtonGroup>,
    )

    expect(screen.getByTestId("group").className).toContain("group-layout")
    expect(
      screen.getByRole("button", { name: "Inherited" }).className,
    ).toContain("button-sm-outline")
    expect(
      screen.getByRole("button", { name: "Override" }).className,
    ).toContain("button-lg-outline")
    expect(recipeCalls.filter((call) => call.name === "button")).toHaveLength(2)
  })
})
