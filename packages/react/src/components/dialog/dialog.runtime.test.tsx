import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { createRef } from "react"
import { afterEach, describe, expect, it } from "vitest"
import type { StylingEngineAdapter } from "../../styling-engine"
import { StylingEngineProvider } from "../../styling-engine"
import { Portal } from "../portal"
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "./dialog"

afterEach(cleanup)

const adapter: StylingEngineAdapter = {
  splitProps(props) {
    return { elementProps: props, styleProps: {} }
  },
  css() {
    return { className: "factory", insertion: null }
  },
  recipe() {
    return { className: "recipe", insertion: null }
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

function renderWithAdapter(node: React.ReactNode) {
  return render(
    <StylingEngineProvider value={adapter}>{node}</StylingEngineProvider>,
  )
}

function DialogFixture() {
  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <button data-testid="trigger">Open dialog</button>
      </DialogTrigger>
      <Portal>
        <DialogBackdrop data-testid="backdrop" />
        <DialogPositioner data-testid="positioner">
          <DialogContent data-testid="content">
            <DialogHeader>
              <DialogTitle>Account settings</DialogTitle>
            </DialogHeader>
            <DialogBody data-testid="body">Dialog body</DialogBody>
            <DialogFooter data-testid="footer">
              <DialogCloseTrigger asChild>
                <button data-testid="close">Close dialog</button>
              </DialogCloseTrigger>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </DialogRoot>
  )
}

describe("Dialog behavior shell", () => {
  it("opens and closes through Ark asChild triggers and returns focus", async () => {
    renderWithAdapter(<DialogFixture />)

    const trigger = screen.getByTestId("trigger")
    trigger.focus()
    fireEvent.click(trigger)

    const dialog = await screen.findByRole("dialog")
    expect(dialog).toHaveAttribute("data-state", "open")
    expect(screen.getByTestId("backdrop")).toHaveAttribute("data-state", "open")
    expect(screen.getByTestId("positioner").parentElement).toBe(document.body)

    fireEvent.click(screen.getByTestId("close"))

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it("closes on Escape and preserves focus return", async () => {
    renderWithAdapter(<DialogFixture />)

    const trigger = screen.getByTestId("trigger")
    fireEvent.click(trigger)
    const dialog = await screen.findByRole("dialog")
    await waitFor(() =>
      expect(dialog).toContainElement(document.activeElement as HTMLElement),
    )

    fireEvent.keyDown(document, { key: "Escape" })

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it("preserves refs, DOM props, data attributes, and nested parts", async () => {
    const contentRef = createRef<HTMLDivElement>()

    renderWithAdapter(
      <DialogRoot defaultOpen>
        <DialogTrigger>Open</DialogTrigger>
        <Portal>
          <DialogPositioner>
            <DialogContent
              ref={contentRef}
              aria-label="Nested composition"
              data-owner="application"
              data-testid="nested-content"
            >
              <DialogHeader data-testid="header">
                <DialogTitle>Title</DialogTitle>
              </DialogHeader>
              <DialogBody data-testid="body">Body</DialogBody>
              <DialogFooter data-testid="footer">Footer</DialogFooter>
            </DialogContent>
          </DialogPositioner>
        </Portal>
      </DialogRoot>,
    )

    const dialog = await screen.findByTestId("nested-content")
    expect(contentRef.current).toBe(dialog)
    expect(dialog).toHaveAttribute("data-owner", "application")
    expect(dialog).toHaveAttribute("data-scope", "dialog")
    expect(screen.getByTestId("header")).toContainElement(
      screen.getByText("Title"),
    )
    expect(screen.getByTestId("body")).toHaveTextContent("Body")
    expect(screen.getByTestId("footer")).toHaveTextContent("Footer")
  })

  it("allows callers to keep closed content mounted for presence", async () => {
    renderWithAdapter(
      <DialogRoot open={false} lazyMount={false} unmountOnExit={false}>
        <DialogContent data-testid="persistent-content">
          Persistent
        </DialogContent>
      </DialogRoot>,
    )

    await waitFor(() =>
      expect(screen.getByTestId("persistent-content")).toHaveAttribute(
        "data-state",
        "closed",
      ),
    )
  })

  it("composes nested dialogs without closing the parent", async () => {
    renderWithAdapter(
      <DialogRoot>
        <DialogTrigger>Open parent</DialogTrigger>
        <Portal>
          <DialogPositioner>
            <DialogContent aria-label="Parent dialog">
              <DialogRoot>
                <DialogTrigger>Open child</DialogTrigger>
                <Portal>
                  <DialogPositioner>
                    <DialogContent aria-label="Child dialog">
                      <DialogTitle>Child dialog</DialogTitle>
                    </DialogContent>
                  </DialogPositioner>
                </Portal>
              </DialogRoot>
            </DialogContent>
          </DialogPositioner>
        </Portal>
      </DialogRoot>,
    )

    fireEvent.click(screen.getByRole("button", { name: "Open parent" }))
    await screen.findByRole("dialog", { name: "Parent dialog" })
    fireEvent.click(screen.getByRole("button", { name: "Open child" }))
    const childDialog = await screen.findByRole("dialog", {
      name: "Child dialog",
    })
    await waitFor(() =>
      expect(childDialog).toContainElement(
        document.activeElement as HTMLElement,
      ),
    )

    fireEvent.keyDown(document, { key: "Escape" })

    await waitFor(() =>
      expect(screen.queryByRole("dialog", { name: "Child dialog" })).toBeNull(),
    )
    expect(
      screen.getByRole("dialog", { name: "Parent dialog" }),
    ).toBeInTheDocument()
  })
})
