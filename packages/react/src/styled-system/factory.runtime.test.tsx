import { render, screen } from "@testing-library/react"
import { createRef } from "react"
import type { StylingEngineAdapter } from "../styling-engine"
import { StylingEngineProvider } from "../styling-engine"
import { chakra } from "./factory"

function createRecordingAdapter() {
  const calls = {
    splitProps: 0,
    css: [] as unknown[],
    recipe: 0,
    cx: 0,
  }
  const adapter: StylingEngineAdapter = {
    splitProps<Props extends Record<string, unknown>>(props: Readonly<Props>) {
      calls.splitProps++
      const elementProps: Record<string, unknown> = {}
      const styleProps: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(props)) {
        ;(key === "bg" || key === "css" ? styleProps : elementProps)[key] =
          value
      }
      return {
        elementProps: elementProps as Partial<Props>,
        styleProps: styleProps as Partial<Props>,
      }
    },
    css(style) {
      calls.css.push(style)
      return {
        className: "generated",
        insertion: <style data-testid="insertion">.generated{}</style>,
      }
    },
    recipe() {
      calls.recipe++
      return { className: "recipe", insertion: null }
    },
    slotRecipe() {
      return {}
    },
    cx(...values) {
      calls.cx++
      return values.filter(Boolean).join(" ")
    },
    token(path, fallback) {
      return fallback ?? path
    },
  }
  return { adapter, calls }
}

function renderWithAdapter(
  node: React.ReactNode,
  adapter: StylingEngineAdapter,
) {
  return render(
    <StylingEngineProvider value={adapter}>{node}</StylingEngineProvider>,
  )
}

describe("engine-neutral chakra factory", () => {
  it("creates stable intrinsic elements and delegates styling", () => {
    const { adapter, calls } = createRecordingAdapter()
    expect(chakra.button).toBe(chakra.button)

    renderWithAdapter(
      <chakra.button
        type="button"
        name="save"
        disabled
        aria-label="Save"
        data-kind="primary"
        bg="red"
        css={{ color: "white" }}
        className="user"
      >
        Save
      </chakra.button>,
      adapter,
    )

    const button = screen.getByRole("button", { name: "Save" })
    expect(button.getAttribute("name")).toBe("save")
    expect((button as HTMLButtonElement).disabled).toBe(true)
    expect(button.getAttribute("data-kind")).toBe("primary")
    expect(button.hasAttribute("bg")).toBe(false)
    expect(button.className.split(" ")).toEqual(
      expect.arrayContaining(["generated", "user"]),
    )
    expect(screen.getAllByTestId("insertion")).toHaveLength(1)
    expect(calls.splitProps).toBe(1)
    expect(calls.css).toHaveLength(1)
    expect(calls.cx).toBe(1)
  })

  it("forwards refs, HTML aliases, and polymorphic props", () => {
    const { adapter } = createRecordingAdapter()
    const ref = createRef<HTMLAnchorElement>()

    renderWithAdapter(
      <chakra.button as="a" href="#target" htmlTranslate="no" ref={ref}>
        Link
      </chakra.button>,
      adapter,
    )

    expect(screen.getByRole("link").getAttribute("translate")).toBe("no")
    expect(ref.current).toBe(screen.getByRole("link"))
  })

  it("delegates Ark v5 asChild composition", () => {
    const { adapter } = createRecordingAdapter()

    renderWithAdapter(
      <chakra.button asChild className="parent">
        <a href="#child" className="child">
          Child
        </a>
      </chakra.button>,
      adapter,
    )

    const link = screen.getByRole("link")
    expect(link.className.split(" ")).toEqual(
      expect.arrayContaining(["generated", "parent", "child"]),
    )
  })

  it("delegates inline recipe resolution", () => {
    const { adapter, calls } = createRecordingAdapter()
    const RecipeButton = chakra("button", { base: { color: "red" } })

    renderWithAdapter(<RecipeButton>Recipe</RecipeButton>, adapter)

    expect(screen.getByRole("button").className.split(" ")).toEqual(
      expect.arrayContaining(["recipe", "generated"]),
    )
    expect(calls.recipe).toBe(1)
  })

  it("throws an actionable error without an engine boundary", () => {
    expect(() => render(<chakra.button>Missing</chakra.button>)).toThrow(
      /@chakra-ui\/emotion.*@chakra-ui\/panda|@chakra-ui\/panda.*@chakra-ui\/emotion/,
    )
  })
})
