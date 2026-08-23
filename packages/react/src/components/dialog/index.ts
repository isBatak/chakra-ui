export {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogRootProvider,
  DialogPropsProvider,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogPositioner,
  DialogContext,
  DialogDescription,
  DialogActionTrigger,
  useDialogStyles,
} from "./dialog"

export type {
  DialogBackdropProps,
  DialogBodyProps,
  DialogCloseTriggerProps,
  DialogContentProps,
  DialogFooterProps,
  DialogRootProps,
  DialogRootProviderProps,
  DialogTitleProps,
  DialogTriggerProps,
  DialogHeaderProps,
  DialogPositionerProps,
  DialogDescriptionProps,
  DialogOpenChangeDetails,
  DialogActionTriggerProps,
} from "./dialog"

export { useDialog, useDialogContext } from "@ark-ui/react/dialog"

export type { DialogSlotRecipeProps } from "./dialog.model"
export {
  DialogSlotStylesProvider,
  useDialogSlotStyles,
} from "./dialog-style-context"
export type { DialogSlotStyles } from "./dialog-style-context"

export type {
  UseDialogProps,
  UseDialogReturn,
  DialogInteractOutsideEvent,
  DialogFocusOutsideEvent,
  DialogPointerDownOutsideEvent,
} from "@ark-ui/react/dialog"

export * as Dialog from "./namespace"
