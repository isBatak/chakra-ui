import { SystemProps } from "@chakra-ui/styled-system"

export interface ButtonGroupOptions {
  /**
   * If `true`, the borderRadius of button that are direct children will be altered
   * to look flushed together
   *
   * @default false
   */
  isAttached?: boolean | undefined
  /**
   * If `true`, all wrapped button will be disabled
   *
   * @default false
   */
  isDisabled?: boolean | undefined
  /**
   * The spacing between the buttons
   * @default '0.5rem'
   * @type SystemProps["marginRight"]
   */
  spacing?: SystemProps["marginRight"] | undefined
}

export interface ButtonOptions {
  /**
   * If `true`, the button will show a spinner.
   * @default false
   */
  isLoading?: boolean | undefined
  /**
   * If `true`, the button will be styled in its active state.
   * @default false
   */
  isActive?: boolean | undefined
  /**
   * If `true`, the button will be disabled.
   * @default false
   */
  isDisabled?: boolean | undefined
  /**
   * The label to show in the button when `isLoading` is true
   * If no text is passed, it only shows the spinner
   */
  loadingText?: React.ReactNode | undefined
  /**
   * The html button type to use.
   */
  type?: "button" | "reset" | "submit" | undefined
  /**
   * If added, the button will show an icon before the button's label.
   * @type React.ReactElement
   */
  leftIcon?: React.ReactElement | undefined
  /**
   * If added, the button will show an icon after the button's label.
   * @type React.ReactElement
   */
  rightIcon?: React.ReactElement | undefined
  /**
   * The space between the button icon and label.
   * @type SystemProps["marginRight"]
   */
  iconSpacing?: SystemProps["marginRight"] | undefined
  /**
   * Replace the spinner component when `isLoading` is set to `true`
   * @type React.ReactElement
   */
  spinner?: React.ReactElement | undefined
  /**
   * It determines the placement of the spinner when isLoading is true
   * @default "start"
   */
  spinnerPlacement?: "start" | "end" | undefined
  /**
   * If `true`, the button content will be wrapped within a `<span/>`.
   * This is useful to fix issues with translation extensions.
   */
  shouldWrapChildren?: boolean | undefined
}

export interface ButtonSpinnerOptions {
  label?: React.ReactNode | undefined
  /**
   * @type SystemProps["margin"]
   */
  spacing?: SystemProps["margin"] | undefined
  placement?: "start" | "end" | undefined
}
