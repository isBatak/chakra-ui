import * as CSS from "csstype"
import { Config } from "../utils/prop-config"
import { t, Token } from "../utils"

export const position: Config = {
  position: true,
  pos: t.prop("position"),
  zIndex: t.prop("zIndex", "zIndices"),
  inset: t.spaceT("inset"),
  insetX: t.spaceT(["left", "right"]),
  insetInline: t.spaceT("insetInline"),
  insetY: t.spaceT(["top", "bottom"]),
  insetBlock: t.spaceT("insetBlock"),
  top: t.spaceT("top"),
  insetBlockStart: t.spaceT("insetBlockStart"),
  bottom: t.spaceT("bottom"),
  insetBlockEnd: t.spaceT("insetBlockEnd"),
  left: t.spaceT("left"),
  insetInlineStart: t.logical({
    scale: "space",
    property: { ltr: "left", rtl: "right" },
  }),
  right: t.spaceT("right"),
  insetInlineEnd: t.logical({
    scale: "space",
    property: { ltr: "right", rtl: "left" },
  }),
}

Object.assign(position, {
  insetStart: position.insetInlineStart,
  insetEnd: position.insetInlineEnd,
})

/**
 * Types for position CSS properties
 */
export interface PositionProps {
  /**
   * The CSS `z-index` property
   */
  zIndex?: Token<CSS.Property.ZIndex, "zIndices"> | undefined
  /**
   * The CSS `top` property
   */
  top?: Token<CSS.Property.Top | number, "sizes"> | undefined
  insetBlockStart?:
    | Token<CSS.Property.InsetBlockStart | number, "sizes">
    | undefined
  /**
   * The CSS `right` property
   */
  right?: Token<CSS.Property.Right | number, "sizes"> | undefined
  /**
   * When the direction is `ltr`, `insetInlineEnd` is equivalent to `right`.
   * When the direction is `rtl`, `insetInlineEnd` is equivalent to `left`.
   */
  insetInlineEnd?:
    | Token<CSS.Property.InsetInlineEnd | number, "sizes">
    | undefined
  /**
   * When the direction is `ltr`, `insetEnd` is equivalent to `right`.
   * When the direction is `rtl`, `insetEnd` is equivalent to `left`.
   */
  insetEnd?: Token<CSS.Property.InsetInlineEnd | number, "sizes"> | undefined
  /**
   * The CSS `bottom` property
   */
  bottom?: Token<CSS.Property.Bottom | number, "sizes"> | undefined
  insetBlockEnd?:
    | Token<CSS.Property.InsetBlockEnd | number, "sizes">
    | undefined
  /**
   * The CSS `left` property
   */
  left?: Token<CSS.Property.Left | number, "sizes"> | undefined
  insetInlineStart?:
    | Token<CSS.Property.InsetInlineStart | number, "sizes">
    | undefined
  /**
   * When the direction is `start`, `end` is equivalent to `left`.
   * When the direction is `start`, `end` is equivalent to `right`.
   */
  insetStart?:
    | Token<CSS.Property.InsetInlineStart | number, "sizes">
    | undefined
  /**
   * The CSS `left`, `right`, `top`, `bottom` property
   */
  inset?: Token<CSS.Property.Inset | number, "sizes"> | undefined
  /**
   * The CSS `left`, and `right` property
   */
  insetX?: Token<CSS.Property.Inset | number, "sizes"> | undefined
  /**
   * The CSS `top`, and `bottom` property
   */
  insetY?: Token<CSS.Property.Inset | number, "sizes"> | undefined
  /**
   * The CSS `position` property
   */
  pos?: Token<CSS.Property.Position> | undefined
  /**
   * The CSS `position` property
   */
  position?: Token<CSS.Property.Position> | undefined
  insetInline?: Token<CSS.Property.InsetInline> | undefined
  insetBlock?: Token<CSS.Property.InsetBlock> | undefined
}
