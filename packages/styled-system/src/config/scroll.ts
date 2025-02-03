import * as CSS from "csstype"
import { Config } from "../utils/prop-config"
import { t, Token } from "../utils"

export const scroll: Config = {
  scrollBehavior: true,
  scrollSnapAlign: true,
  scrollSnapStop: true,
  scrollSnapType: true,
  // scroll margin
  scrollMargin: t.spaceT("scrollMargin"),
  scrollMarginTop: t.spaceT("scrollMarginTop"),
  scrollMarginBottom: t.spaceT("scrollMarginBottom"),
  scrollMarginLeft: t.spaceT("scrollMarginLeft"),
  scrollMarginRight: t.spaceT("scrollMarginRight"),
  scrollMarginX: t.spaceT(["scrollMarginLeft", "scrollMarginRight"]),
  scrollMarginY: t.spaceT(["scrollMarginTop", "scrollMarginBottom"]),
  // scroll padding
  scrollPadding: t.spaceT("scrollPadding"),
  scrollPaddingTop: t.spaceT("scrollPaddingTop"),
  scrollPaddingBottom: t.spaceT("scrollPaddingBottom"),
  scrollPaddingLeft: t.spaceT("scrollPaddingLeft"),
  scrollPaddingRight: t.spaceT("scrollPaddingRight"),
  scrollPaddingX: t.spaceT(["scrollPaddingLeft", "scrollPaddingRight"]),
  scrollPaddingY: t.spaceT(["scrollPaddingTop", "scrollPaddingBottom"]),
}

export interface ScrollProps {
  scrollBehavior?: Token<CSS.Property.ScrollBehavior> | undefined
  scrollSnapAlign?: Token<CSS.Property.ScrollSnapAlign> | undefined
  scrollSnapStop?: Token<CSS.Property.ScrollSnapStop> | undefined
  scrollSnapType?: Token<CSS.Property.ScrollSnapType> | undefined
  scrollMargin?: Token<CSS.Property.ScrollMargin | number, "space"> | undefined
  scrollMarginTop?:
    | Token<CSS.Property.ScrollMarginTop | number, "space">
    | undefined
  scrollMarginBottom?:
    | Token<CSS.Property.ScrollMarginBottom | number, "space">
    | undefined
  scrollMarginLeft?:
    | Token<CSS.Property.ScrollMarginLeft | number, "space">
    | undefined
  scrollMarginRight?:
    | Token<CSS.Property.ScrollMarginRight | number, "space">
    | undefined
  scrollMarginX?: Token<CSS.Property.ScrollMargin | number, "space"> | undefined
  scrollMarginY?: Token<CSS.Property.ScrollMargin | number, "space"> | undefined
  scrollPadding?:
    | Token<CSS.Property.ScrollPadding | number, "space">
    | undefined
  scrollPaddingTop?:
    | Token<CSS.Property.ScrollPaddingTop | number, "space">
    | undefined
  scrollPaddingBottom?:
    | Token<CSS.Property.ScrollPaddingBottom | number, "space">
    | undefined
  scrollPaddingLeft?:
    | Token<CSS.Property.ScrollPaddingLeft | number, "space">
    | undefined
  scrollPaddingRight?:
    | Token<CSS.Property.ScrollPaddingRight | number, "space">
    | undefined
  scrollPaddingX?:
    | Token<CSS.Property.ScrollPadding | number, "space">
    | undefined
  scrollPaddingY?:
    | Token<CSS.Property.ScrollPadding | number, "space">
    | undefined
}
