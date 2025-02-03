import { ariaAttr, callAllHandlers } from "@chakra-ui/utils"
import { FormControlOptions, useFormControlContext } from "./form-control"

export interface UseFormControlProps<T extends HTMLElement>
  extends FormControlOptions {
  id?: string | undefined
  onFocus?: React.FocusEventHandler<T> | undefined
  onBlur?: React.FocusEventHandler<T> | undefined
  disabled?: boolean | undefined
  readOnly?: boolean | undefined
  required?: boolean | undefined
  "aria-describedby"?: string | undefined
}

/**
 * React hook that provides the props that should be spread on to
 * input fields (`input`, `select`, `textarea`, etc.).
 *
 * It provides a convenient way to control a form fields, validation
 * and helper text.
 *
 * @internal
 */
export function useFormControl<T extends HTMLElement>(
  props: UseFormControlProps<T>,
) {
  const { isDisabled, isInvalid, isReadOnly, isRequired, ...rest } =
    useFormControlProps(props)

  return {
    ...rest,
    disabled: isDisabled,
    readOnly: isReadOnly,
    required: isRequired,
    "aria-invalid": ariaAttr(isInvalid),
    "aria-required": ariaAttr(isRequired),
    "aria-readonly": ariaAttr(isReadOnly),
  }
}

/**
 * @internal
 */
export function useFormControlProps<T extends HTMLElement>(
  props: UseFormControlProps<T>,
) {
  const field = useFormControlContext()

  const {
    id,
    disabled,
    readOnly,
    required,
    isRequired,
    isInvalid,
    isReadOnly,
    isDisabled,
    onFocus,
    onBlur,
    ...rest
  } = props

  const labelIds: string[] = props["aria-describedby"]
    ? [props["aria-describedby"]]
    : []

  // Error message must be described first in all scenarios.
  if (field?.hasFeedbackText && field?.isInvalid) {
    labelIds.push(field.feedbackId)
  }

  if (field?.hasHelpText) {
    labelIds.push(field.helpTextId)
  }

  return {
    ...rest,
    "aria-describedby": labelIds.join(" ") || undefined,
    id: id ?? field?.id,
    isDisabled: disabled ?? isDisabled ?? field?.isDisabled,
    isReadOnly: readOnly ?? isReadOnly ?? field?.isReadOnly,
    isRequired: required ?? isRequired ?? field?.isRequired,
    isInvalid: isInvalid ?? field?.isInvalid,
    onFocus: callAllHandlers(field?.onFocus, onFocus),
    onBlur: callAllHandlers(field?.onBlur, onBlur),
  }
}
