import { SystemProps, ThemingProps } from "@chakra-ui/styled-system"
import { useMemo } from "react"
import type { AlertStatus } from "../alert"
import { useChakra } from "../system"
import { CreateToastFnReturn, createToastFn } from "./create-toast-fn"
import { ToastPosition } from "./toast.placement"
import { useToastOptionContext } from "./toast.provider"
import type { RenderProps, ToastId, ToastOptions } from "./toast.types"

export interface UseToastOptions extends ThemingProps<"Alert"> {
  /**
   * The placement of the toast
   *
   * @default "bottom"
   */
  position?: ToastPosition | undefined
  /**
   * The delay before the toast hides (in milliseconds)
   * If set to `null`, toast will never dismiss.
   *
   * @default 5000 ( = 5000ms )
   */
  duration?: ToastOptions["duration"] | undefined
  /**
   * Render a component toast component.
   * Any component passed will receive 2 props: `id` and `onClose`.
   */
  render?: (props: RenderProps) => React.ReactNode | undefined
  /**
   * The title of the toast
   */
  title?: React.ReactNode | undefined
  /**
   * The description of the toast
   */
  description?: React.ReactNode | undefined
  /**
   * If `true`, toast will show a close button
   * @default false
   */
  isClosable?: boolean | undefined
  /**
   * The status of the toast.
   */
  status?: AlertStatus | undefined
  /**
   * A custom icon that will be displayed by the toast.
   */
  icon?: React.ReactNode | undefined
  /**
   * The `id` of the toast.
   *
   * Mostly used when you need to prevent duplicate.
   * By default, we generate a unique `id` for each toast
   */
  id?: ToastId | undefined
  /**
   * Callback function to run side effects after the toast has closed.
   */
  onCloseComplete?: () => void | undefined
  /**
   * Optional style overrides for the container wrapping the toast component.
   */
  containerStyle?: SystemProps | undefined
}

/**
 * React hook used to create a function that can be used
 * to show toasts in an application.
 */
export function useToast(options?: UseToastOptions): CreateToastFnReturn {
  const { theme } = useChakra()
  const defaultOptions = useToastOptionContext()

  return useMemo(
    () =>
      createToastFn(theme.direction, {
        ...defaultOptions,
        ...options,
      }),
    [options, theme.direction, defaultOptions],
  )
}
