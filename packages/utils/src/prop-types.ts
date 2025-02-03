import { Merge } from "./types"

export interface AriaLabelingProps {
  "aria-label"?: string | undefined
  "aria-labelledby"?: string | undefined
  "aria-describedby"?: string | undefined
  "aria-details"?: string | undefined
}

export interface AriaValidationProps {
  "aria-errormessage"?: string | undefined
}

export interface IdProps {
  id?: string | undefined
}

export interface InputDOMEvents {
  onCopy?: React.ClipboardEventHandler<HTMLInputElement> | undefined
  onCut?: React.ClipboardEventHandler<HTMLInputElement> | undefined
  onPaste?: React.ClipboardEventHandler<HTMLInputElement> | undefined
  onCompositionStart?:
    | React.CompositionEventHandler<HTMLInputElement>
    | undefined
  onCompositionEnd?: React.CompositionEventHandler<HTMLInputElement> | undefined
  onCompositionUpdate?:
    | React.CompositionEventHandler<HTMLInputElement>
    | undefined
  onSelect?: React.ReactEventHandler<HTMLInputElement> | undefined
  onBeforeInput?: React.FormEventHandler<HTMLInputElement> | undefined
  onInput?: React.FormEventHandler<HTMLInputElement> | undefined
}

export interface InputDOMProps extends IdProps, InputDOMEvents {
  autoComplete?: string | undefined
  maxLength?: number | undefined
  minLength?: number | undefined
  name?: string | undefined
  pattern?: string | undefined
  placeholder?: string | undefined
  type?:
    | "text"
    | "search"
    | "url"
    | "tel"
    | "email"
    | "password"
    | "hidden"
    | (string & {})
    | undefined
  inputMode?:
    | "none"
    | "text"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | "search"
    | undefined
}

export interface DOMElement extends Element, HTMLOrSVGElement {}

interface DataAttributes {
  [dataAttr: string]: any
}

export interface DOMAttributes<T = DOMElement>
  extends React.AriaAttributes,
    React.DOMAttributes<T>,
    DataAttributes {
  id?: string | undefined
  role?: React.AriaRole | undefined
  tabIndex?: number | undefined
  style?: React.CSSProperties | undefined
}

export interface InputDOMAttributes
  extends InputDOMProps,
    DOMAttributes<HTMLInputElement> {}

export type PropGetter<P = Record<string, unknown>, R = DOMAttributes> = (
  props?: Merge<DOMAttributes, P>,
  ref?: React.Ref<any>,
) => R & React.RefAttributes<any>

export type RequiredPropGetter<
  P = Record<string, unknown>,
  R = DOMAttributes,
> = (
  props: Merge<DOMAttributes, P>,
  ref?: React.Ref<any>,
) => R & React.RefAttributes<any>

export type MaybeRenderProp<P> =
  | React.ReactNode
  | ((props: P) => React.ReactNode)
