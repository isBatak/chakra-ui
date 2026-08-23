import { renderHook } from "@testing-library/react"
import type { ReactNode } from "react"
import { expectTypeOf } from "vitest"
import type { DialogVariantProps } from "../../styled-system/generated/recipes.gen"
import {
  type DialogSlotStyles,
  DialogSlotStylesProvider,
  useDialogSlotStyles,
} from "./dialog-style-context"
import {
  type DialogPart,
  type DialogSlot,
  type DialogSlotRecipeProps,
  dialogPartModel,
} from "./dialog.model"

const dialogSlots = [
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

describe("Dialog model", () => {
  it("maps every planned part to an Ark v5 primitive or Chakra intrinsic", () => {
    expect(Object.keys(dialogPartModel)).toEqual([
      "rootProvider",
      "root",
      ...dialogSlots,
    ])
    expect(dialogPartModel.root.primitive).toBeTypeOf("function")
    expect(dialogPartModel.trigger.primitive).toBeTypeOf("object")
    expect(dialogPartModel.header.primitive).toBe("div")

    expectTypeOf<keyof typeof dialogPartModel>().toEqualTypeOf<DialogPart>()
  })

  it("exposes canonical generated Dialog variants", () => {
    expectTypeOf<DialogSlotRecipeProps>().toMatchTypeOf<DialogVariantProps>()
    expectTypeOf<DialogSlotRecipeProps>().toHaveProperty("unstyled")
    expectTypeOf<DialogSlotRecipeProps>().toHaveProperty("placement")
  })

  it("provides engine-neutral output for every styled slot", () => {
    const styles = Object.fromEntries(
      dialogSlots.map((slot) => [
        slot,
        { className: `dialog__${slot}`, insertion: null },
      ]),
    ) as DialogSlotStyles

    const wrapper = ({ children }: { children: ReactNode }) => (
      <DialogSlotStylesProvider value={styles}>
        {children}
      </DialogSlotStylesProvider>
    )
    const { result } = renderHook(useDialogSlotStyles, { wrapper })

    expect(result.current.content).toEqual({
      className: "dialog__content",
      insertion: null,
    })
  })

  it("fails clearly outside the Dialog slot-style provider", () => {
    expect(() => renderHook(useDialogSlotStyles)).toThrow(
      "useDialogSlotStyles returned `undefined`",
    )
  })
})
