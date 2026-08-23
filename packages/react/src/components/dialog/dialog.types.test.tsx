import { createRef } from "react"
import type { JSX } from "react"
import { expectTypeOf, it } from "vitest"
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
} from "./index"
import type {
  DialogCloseTriggerProps,
  DialogContentProps,
  DialogRootProps,
  DialogTriggerProps,
} from "./index"

it("exposes public Dialog variants, DOM props, style props, refs, and asChild", () => {
  expectTypeOf<DialogRootProps>().toHaveProperty("size")
  expectTypeOf<DialogRootProps>().toHaveProperty("placement")
  expectTypeOf<DialogContentProps>().toHaveProperty("className")
  expectTypeOf<DialogContentProps>().toHaveProperty("css")
  expectTypeOf<DialogTriggerProps>().toHaveProperty("asChild")
  expectTypeOf<DialogCloseTriggerProps>().toHaveProperty("asChild")

  const contentRef = createRef<HTMLDivElement>()
  const dialog = (
    <DialogRoot size="sm" placement="top">
      <DialogTrigger asChild css={{ color: "red" }}>
        <button>Open</button>
      </DialogTrigger>
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent ref={contentRef} className="consumer">
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
          </DialogHeader>
          <DialogBody>Body</DialogBody>
          <DialogFooter>
            <DialogCloseTrigger asChild>
              <button>Close</button>
            </DialogCloseTrigger>
          </DialogFooter>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  )
  expectTypeOf(dialog).toEqualTypeOf<JSX.Element>()

  // @ts-expect-error Dialog rejects unknown recipe sizes
  void (<DialogRoot size="unknown">Dialog</DialogRoot>)
})
