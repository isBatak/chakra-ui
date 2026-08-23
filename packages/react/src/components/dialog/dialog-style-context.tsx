"use client"

import { createContext } from "../../create-context"
import type { StylingEngineStyleOutput } from "../../styling-engine"
import type { DialogSlot } from "./dialog.model"

export type DialogSlotStyles = Record<DialogSlot, StylingEngineStyleOutput>

export const [DialogSlotStylesProvider, useDialogSlotStyles] =
  createContext<DialogSlotStyles>({
    name: "DialogSlotStylesContext",
    hookName: "useDialogSlotStyles",
    providerName: "DialogSlotStylesProvider",
  })
