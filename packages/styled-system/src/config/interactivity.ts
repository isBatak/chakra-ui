import * as CSS from "csstype"
import { Config } from "../utils/prop-config"
import { t, Token, Length, transforms } from "../utils"

export const interactivity: Config = {
  appearance: true,
  cursor: true,
  resize: true,
  userSelect: true,
  pointerEvents: true,
  outline: { transform: transforms.outline },
  outlineOffset: true,
  outlineColor: t.colors("outlineColor"),
}

export interface InteractivityProps {
  /**
   * The CSS `appearance` property
   */
  appearance?: Token<CSS.Property.Appearance> | undefined
  /**
   * The CSS `user-select` property
   */
  userSelect?: Token<CSS.Property.UserSelect> | undefined
  /**
   * The CSS `pointer-events` property
   */
  pointerEvents?: Token<CSS.Property.PointerEvents> | undefined
  /**
   * The CSS `resize` property
   */
  resize?: Token<CSS.Property.Resize> | undefined
  /**
   * The CSS `cursor` property
   */
  cursor?: Token<CSS.Property.Cursor> | undefined
  /**
   * The CSS `outline` property
   */
  outline?: Token<CSS.Property.Outline<Length>> | undefined
  /**
   * The CSS `outline-offset` property
   */
  outlineOffset?: Token<CSS.Property.OutlineOffset<Length>> | undefined
  /**
   * The CSS `outline-color` property
   */
  outlineColor?: Token<CSS.Property.Color, "colors"> | undefined
}
