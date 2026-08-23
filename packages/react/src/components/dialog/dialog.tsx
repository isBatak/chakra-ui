"use client"

import type { Assign } from "@ark-ui/react"
import { Dialog as ArkDialog, useDialogContext } from "@ark-ui/react/dialog"
import { forwardRef, useMemo } from "react"
import { createContext } from "../../create-context"
import { mergeProps } from "../../merge-props"
import {
  type HTMLChakraProps,
  type SlotRecipeProps,
  type UnstyledProp,
  chakra,
} from "../../styled-system"

export { useDialogSlotStyles as useDialogStyles } from "./dialog-style-context"

export interface DialogRootProviderBaseProps
  extends
    Assign<ArkDialog.RootProviderProps, SlotRecipeProps<"dialog">>,
    UnstyledProp {}

export interface DialogRootProviderProps extends DialogRootProviderBaseProps {
  children: React.ReactNode
}

export function DialogRootProvider(props: DialogRootProviderProps) {
  return <ArkDialog.RootProvider lazyMount unmountOnExit {...props} />
}

export interface DialogRootBaseProps
  extends
    Assign<ArkDialog.RootProps, SlotRecipeProps<"dialog">>,
    UnstyledProp {}

export interface DialogRootProps extends DialogRootBaseProps {
  children: React.ReactNode
}

const [DialogPropsProvider, useDialogPropsContext] =
  createContext<DialogRootBaseProps>({
    strict: false,
    name: "DialogPropsContext",
    providerName: "DialogPropsProvider",
  })

export function DialogRoot(inProps: DialogRootProps) {
  const propsContext = useDialogPropsContext()
  const props = useMemo(
    () => mergeProps(propsContext, inProps) as DialogRootProps,
    [propsContext, inProps],
  )

  return <ArkDialog.Root lazyMount unmountOnExit {...props} />
}

export { DialogPropsProvider }

export interface DialogTriggerProps
  extends HTMLChakraProps<"button", ArkDialog.TriggerBaseProps>, UnstyledProp {}

export const DialogTrigger = ArkDialog.Trigger

export interface DialogPositionerProps
  extends HTMLChakraProps<"div", ArkDialog.PositionerBaseProps>, UnstyledProp {}

export const DialogPositioner = chakra(ArkDialog.Positioner)

export interface DialogContentProps
  extends
    HTMLChakraProps<"section", ArkDialog.ContentBaseProps>,
    UnstyledProp {}

export const DialogContent = chakra(ArkDialog.Content)

export interface DialogDescriptionProps
  extends HTMLChakraProps<"p", ArkDialog.DescriptionBaseProps>, UnstyledProp {}

export const DialogDescription = chakra(ArkDialog.Description)

export interface DialogTitleProps
  extends HTMLChakraProps<"h2", ArkDialog.TitleBaseProps>, UnstyledProp {}

export const DialogTitle = chakra(ArkDialog.Title)

export interface DialogCloseTriggerProps
  extends
    HTMLChakraProps<"button", ArkDialog.CloseTriggerBaseProps>,
    UnstyledProp {}

export const DialogCloseTrigger = ArkDialog.CloseTrigger

export interface DialogActionTriggerProps extends HTMLChakraProps<"button"> {}

export const DialogActionTrigger = forwardRef<
  HTMLButtonElement,
  DialogActionTriggerProps
>(function DialogActionTrigger(props, ref) {
  const dialog = useDialogContext()
  return (
    <chakra.button
      type="button"
      {...props}
      ref={ref}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        props.onClick?.(event)
        if (!event.defaultPrevented) dialog.setOpen(false)
      }}
    />
  )
})

export interface DialogBackdropProps
  extends HTMLChakraProps<"div", ArkDialog.BackdropBaseProps>, UnstyledProp {}

export const DialogBackdrop = chakra(ArkDialog.Backdrop)

export interface DialogBodyProps extends HTMLChakraProps<"div">, UnstyledProp {}

export const DialogBody = chakra.div

export interface DialogFooterProps
  extends HTMLChakraProps<"div">, UnstyledProp {}

export const DialogFooter = chakra.div

export interface DialogHeaderProps
  extends HTMLChakraProps<"div">, UnstyledProp {}

export const DialogHeader = chakra.div

export const DialogContext = ArkDialog.Context

export interface DialogOpenChangeDetails extends ArkDialog.OpenChangeDetails {}
