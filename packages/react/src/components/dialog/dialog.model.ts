import { Dialog as ArkDialog } from "@ark-ui/react/dialog"
import type { ChakraSlotRecipeProps, UnstyledProp } from "../../styled-system"

/**
 * The Ark v5 primitive (or Chakra-owned intrinsic element) behind every Dialog
 * part. Keep this inventory next to the implementation so later runtime work
 * cannot silently omit a part.
 */
export const dialogPartModel = {
  rootProvider: { primitive: ArkDialog.RootProvider, slot: null },
  root: { primitive: ArkDialog.Root, slot: null },
  trigger: { primitive: ArkDialog.Trigger, slot: "trigger" },
  backdrop: { primitive: ArkDialog.Backdrop, slot: "backdrop" },
  positioner: { primitive: ArkDialog.Positioner, slot: "positioner" },
  content: { primitive: ArkDialog.Content, slot: "content" },
  header: { primitive: "div", slot: "header" },
  title: { primitive: ArkDialog.Title, slot: "title" },
  description: { primitive: ArkDialog.Description, slot: "description" },
  body: { primitive: "div", slot: "body" },
  footer: { primitive: "div", slot: "footer" },
  closeTrigger: {
    primitive: ArkDialog.CloseTrigger,
    slot: "closeTrigger",
  },
} as const

export type DialogPart = keyof typeof dialogPartModel

export type DialogSlot = Exclude<
  (typeof dialogPartModel)[DialogPart]["slot"],
  null
>

/** Canonical Dialog variants shared by every styling-engine adapter. */
export interface DialogSlotRecipeProps
  extends ChakraSlotRecipeProps<"dialog">, UnstyledProp {}
