import { cleanup, render, screen } from "@testing-library/react"
import { createRef } from "react"
import { afterEach, describe, expect, it } from "vitest"
import type { StylingEngineAdapter } from "../../styling-engine"
import { StylingEngineProvider } from "../../styling-engine"
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "./dialog"
import type { DialogSlot } from "./dialog.model"

const slots = [
  "trigger",
  "backdrop",
  "positioner",
  "content",
  "header",
  "title",
  "description",
  "body",
  "footer",
  "closeTrigger",
] as const satisfies readonly DialogSlot[]

export interface DialogAdapterConformanceOptions {
  name: string
  adapter: StylingEngineAdapter
  slotClassName(slot: DialogSlot): string | RegExp
  html: string
}

const normalizeHtml = (html: string) =>
  html
    .replace(/dialog:_r_\d+_/g, "dialog:generated")
    .replace(/_r_\d+_/g, "generated")
    .replace(/\s+/g, " ")
    .replace(/;"/g, '"')
    .trim()

export function runDialogAdapterConformance(
  options: DialogAdapterConformanceOptions,
) {
  describe(`${options.name} Dialog`, () => {
    afterEach(cleanup)

    it("styles every slot and preserves refs, asChild, user classes, and HTML", () => {
      const contentRef = createRef<HTMLDivElement>()
      const { container } = render(
        <StylingEngineProvider value={options.adapter}>
          <DialogRoot defaultOpen size="sm" placement="top">
            <DialogTrigger asChild className="user-trigger">
              <button data-testid="trigger">Open</button>
            </DialogTrigger>
            <DialogBackdrop data-testid="backdrop" />
            <DialogPositioner data-testid="positioner">
              <DialogContent
                ref={contentRef}
                data-testid="content"
                className="user-content"
                aria-label="Adapter dialog"
              >
                <DialogHeader data-testid="header">
                  <DialogTitle data-testid="title">Title</DialogTitle>
                  <DialogDescription data-testid="description">
                    Description
                  </DialogDescription>
                </DialogHeader>
                <DialogBody data-testid="body">Body</DialogBody>
                <DialogFooter data-testid="footer">
                  <DialogCloseTrigger asChild className="user-close">
                    <button data-testid="closeTrigger">Close</button>
                  </DialogCloseTrigger>
                </DialogFooter>
              </DialogContent>
            </DialogPositioner>
          </DialogRoot>
        </StylingEngineProvider>,
      )

      for (const slot of slots) {
        const expected = options.slotClassName(slot)
        if (typeof expected === "string") {
          expect(screen.getByTestId(slot).className.split(" ")).toContain(
            expected,
          )
        } else {
          expect(screen.getByTestId(slot).className).toMatch(expected)
        }
      }
      expect(contentRef.current).toBe(screen.getByTestId("content"))
      expect(screen.getByTestId("trigger").className.split(" ")).toContain(
        "user-trigger",
      )
      expect(screen.getByTestId("content").className.split(" ")).toContain(
        "user-content",
      )
      expect(screen.getByTestId("closeTrigger").className.split(" ")).toContain(
        "user-close",
      )

      expect(normalizeHtml(container.innerHTML)).toBe(
        normalizeHtml(options.html),
      )
    })
  })
}
