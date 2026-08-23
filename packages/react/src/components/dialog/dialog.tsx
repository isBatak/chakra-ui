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
import { useStylingEngine } from "../../styling-engine"
import {
  type DialogSlotStyles,
  DialogSlotStylesProvider,
  useDialogSlotStyles,
} from "./dialog-style-context"

export { useDialogSlotStyles as useDialogStyles } from "./dialog-style-context"

export interface DialogRootProviderBaseProps
  extends
    Assign<ArkDialog.RootProviderProps, SlotRecipeProps<"dialog">>,
    UnstyledProp {}

export interface DialogRootProviderProps extends DialogRootProviderBaseProps {
  children: React.ReactNode
}

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
] as const

function useDialogRecipe(
  props: SlotRecipeProps<"dialog"> & UnstyledProp,
): DialogSlotStyles {
  const system = useStylingEngine()
  if (props.unstyled) {
    return Object.fromEntries(
      dialogSlots.map((slot) => [slot, { className: "", insertion: null }]),
    ) as DialogSlotStyles
  }
  return system.slotRecipe({
    name: "dialog",
    props: {
      placement: props.placement,
      scrollBehavior: props.scrollBehavior,
      size: props.size,
      motionPreset: props.motionPreset,
    },
  }) as DialogSlotStyles
}

function omitRecipeProps<
  Props extends SlotRecipeProps<"dialog"> & UnstyledProp,
>(props: Props) {
  const {
    unstyled: _unstyled,
    placement: _placement,
    scrollBehavior: _scrollBehavior,
    size: _size,
    motionPreset: _motionPreset,
    ...rootProps
  } = props
  return rootProps
}

export function DialogRootProvider(props: DialogRootProviderProps) {
  const styles = useDialogRecipe(props)
  return (
    <DialogSlotStylesProvider value={styles}>
      <ArkDialog.RootProvider
        lazyMount
        unmountOnExit
        {...omitRecipeProps(props)}
      />
    </DialogSlotStylesProvider>
  )
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

  const styles = useDialogRecipe(props)

  return (
    <DialogSlotStylesProvider value={styles}>
      <ArkDialog.Root lazyMount unmountOnExit {...omitRecipeProps(props)} />
    </DialogSlotStylesProvider>
  )
}

export { DialogPropsProvider }

export interface DialogTriggerProps
  extends HTMLChakraProps<"button", ArkDialog.TriggerBaseProps>, UnstyledProp {}

export const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(
  function DialogTrigger({ unstyled, className, ...props }, ref) {
    const system = useStylingEngine()
    const style = useDialogSlotStyles().trigger
    const { elementProps, styleProps } = system.splitProps(props)
    const directStyle = system.css(styleProps)
    return (
      <>
        {!unstyled && style.insertion}
        {directStyle.insertion}
        <ArkDialog.Trigger
          {...(elementProps as ArkDialog.TriggerProps)}
          ref={ref}
          className={system.cx(
            !unstyled && style.className,
            directStyle.className,
            className,
          )}
        />
      </>
    )
  },
)

export interface DialogPositionerProps
  extends HTMLChakraProps<"div", ArkDialog.PositionerBaseProps>, UnstyledProp {}

const StyledDialogPositioner = chakra(ArkDialog.Positioner)

export const DialogPositioner = forwardRef<
  HTMLDivElement,
  DialogPositionerProps
>(function DialogPositioner({ unstyled, className, ...props }, ref) {
  const system = useStylingEngine()
  const style = useDialogSlotStyles().positioner
  return (
    <>
      {!unstyled && style.insertion}
      <StyledDialogPositioner
        {...props}
        ref={ref}
        className={system.cx(!unstyled && style.className, className)}
      />
    </>
  )
})

export interface DialogContentProps
  extends
    HTMLChakraProps<"section", ArkDialog.ContentBaseProps>,
    UnstyledProp {}

const StyledDialogContent = chakra(ArkDialog.Content)

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  function DialogContent({ unstyled, className, ...props }, ref) {
    const system = useStylingEngine()
    const style = useDialogSlotStyles().content
    return (
      <>
        {!unstyled && style.insertion}
        <StyledDialogContent
          {...props}
          ref={ref}
          className={system.cx(!unstyled && style.className, className)}
        />
      </>
    )
  },
)

export interface DialogDescriptionProps
  extends HTMLChakraProps<"p", ArkDialog.DescriptionBaseProps>, UnstyledProp {}

const StyledDialogDescription = chakra(ArkDialog.Description)

export const DialogDescription = forwardRef<
  HTMLParagraphElement,
  DialogDescriptionProps
>(function DialogDescription({ unstyled, className, ...props }, ref) {
  const system = useStylingEngine()
  const style = useDialogSlotStyles().description
  return (
    <>
      {!unstyled && style.insertion}
      <StyledDialogDescription
        {...props}
        ref={ref}
        className={system.cx(!unstyled && style.className, className)}
      />
    </>
  )
})

export interface DialogTitleProps
  extends HTMLChakraProps<"h2", ArkDialog.TitleBaseProps>, UnstyledProp {}

const StyledDialogTitle = chakra(ArkDialog.Title)

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  function DialogTitle({ unstyled, className, ...props }, ref) {
    const system = useStylingEngine()
    const style = useDialogSlotStyles().title
    return (
      <>
        {!unstyled && style.insertion}
        <StyledDialogTitle
          {...props}
          ref={ref}
          className={system.cx(!unstyled && style.className, className)}
        />
      </>
    )
  },
)

export interface DialogCloseTriggerProps
  extends
    HTMLChakraProps<"button", ArkDialog.CloseTriggerBaseProps>,
    UnstyledProp {}

export const DialogCloseTrigger = forwardRef<
  HTMLButtonElement,
  DialogCloseTriggerProps
>(function DialogCloseTrigger({ unstyled, className, ...props }, ref) {
  const system = useStylingEngine()
  const style = useDialogSlotStyles().closeTrigger
  const { elementProps, styleProps } = system.splitProps(props)
  const directStyle = system.css(styleProps)
  return (
    <>
      {!unstyled && style.insertion}
      {directStyle.insertion}
      <ArkDialog.CloseTrigger
        {...(elementProps as ArkDialog.CloseTriggerProps)}
        ref={ref}
        className={system.cx(
          !unstyled && style.className,
          directStyle.className,
          className,
        )}
      />
    </>
  )
})

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

const StyledDialogBackdrop = chakra(ArkDialog.Backdrop)

export const DialogBackdrop = forwardRef<HTMLDivElement, DialogBackdropProps>(
  function DialogBackdrop({ unstyled, className, ...props }, ref) {
    const system = useStylingEngine()
    const style = useDialogSlotStyles().backdrop
    return (
      <>
        {!unstyled && style.insertion}
        <StyledDialogBackdrop
          {...props}
          ref={ref}
          className={system.cx(!unstyled && style.className, className)}
        />
      </>
    )
  },
)

export interface DialogBodyProps extends HTMLChakraProps<"div">, UnstyledProp {}

export const DialogBody = createIntrinsicDialogSlot("body")

export interface DialogFooterProps
  extends HTMLChakraProps<"div">, UnstyledProp {}

export const DialogFooter = createIntrinsicDialogSlot("footer")

export interface DialogHeaderProps
  extends HTMLChakraProps<"div">, UnstyledProp {}

export const DialogHeader = createIntrinsicDialogSlot("header")

function createIntrinsicDialogSlot(slot: "body" | "footer" | "header") {
  return forwardRef<HTMLDivElement, HTMLChakraProps<"div"> & UnstyledProp>(
    function DialogSlot({ unstyled, className, ...props }, ref) {
      const system = useStylingEngine()
      const style = useDialogSlotStyles()[slot]
      return (
        <>
          {!unstyled && style.insertion}
          <chakra.div
            {...props}
            ref={ref}
            className={system.cx(!unstyled && style.className, className)}
          />
        </>
      )
    },
  )
}

export const DialogContext = ArkDialog.Context

export interface DialogOpenChangeDetails extends ArkDialog.OpenChangeDetails {}
