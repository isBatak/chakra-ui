import * as CSS from "csstype"
import { Config } from "../utils/prop-config"
import { Length, t, Token, transforms } from "../utils"

export const layout: Config = {
  width: t.sizesT("width"),
  inlineSize: t.sizesT("inlineSize"),
  height: t.sizes("height"),
  blockSize: t.sizes("blockSize"),
  boxSize: t.sizes(["width", "height"]),
  minWidth: t.sizes("minWidth"),
  minInlineSize: t.sizes("minInlineSize"),
  minHeight: t.sizes("minHeight"),
  minBlockSize: t.sizes("minBlockSize"),
  maxWidth: t.sizes("maxWidth"),
  maxInlineSize: t.sizes("maxInlineSize"),
  maxHeight: t.sizes("maxHeight"),
  maxBlockSize: t.sizes("maxBlockSize"),
  overflow: true,
  overflowX: true,
  overflowY: true,
  overscrollBehavior: true,
  overscrollBehaviorX: true,
  overscrollBehaviorY: true,
  display: true,
  aspectRatio: true,
  hideFrom: {
    scale: "breakpoints",
    transform: (value: string, theme) => {
      const breakpoint = theme.__breakpoints?.get(value)?.minW ?? value
      const mq = `@media screen and (min-width: ${breakpoint})`
      return { [mq]: { display: "none" } }
    },
  },
  hideBelow: {
    scale: "breakpoints",
    transform: (value: string, theme) => {
      const breakpoint = theme.__breakpoints?.get(value)?._minW ?? value
      const mq = `@media screen and (max-width: ${breakpoint})`
      return { [mq]: { display: "none" } }
    },
  },
  verticalAlign: true,
  boxSizing: true,
  boxDecorationBreak: true,
  float: t.propT("float", transforms.float),
  objectFit: true,
  objectPosition: true,
  visibility: true,
  isolation: true,
}

Object.assign(layout, {
  w: layout.width,
  h: layout.height,
  minW: layout.minWidth,
  maxW: layout.maxWidth,
  minH: layout.minHeight,
  maxH: layout.maxHeight,
  overscroll: layout.overscrollBehavior,
  overscrollX: layout.overscrollBehaviorX,
  overscrollY: layout.overscrollBehaviorY,
})

/**
 * Types for layout related CSS properties
 */
export interface LayoutProps {
  /**
   * The CSS `display` property
   */
  display?: Token<CSS.Property.Display> | undefined
  /**
   * Hides an element from the specified breakpoint and up
   */
  hideFrom?: Token<string & {}, "breakpoints"> | undefined
  /**
   * Hides an element below the specified breakpoint
   */
  hideBelow?: Token<string & {}, "breakpoints"> | undefined
  /**
   * The CSS `width` property
   */
  width?: Token<CSS.Property.Width | number, "sizes"> | undefined
  /**
   * The CSS `width` property
   */
  w?: Token<CSS.Property.Width | number, "sizes"> | undefined
  inlineSize?: Token<CSS.Property.InlineSize | number, "sizes"> | undefined
  /**
   * The CSS `width` and `height` property
   */
  boxSize?: Token<CSS.Property.Width | number, "sizes"> | undefined
  /**
   * The CSS `max-width` property
   */
  maxWidth?: Token<CSS.Property.MaxWidth | number, "sizes"> | undefined
  /**
   * The CSS `max-width` property
   */
  maxW?: Token<CSS.Property.MaxWidth | number, "sizes"> | undefined
  maxInlineSize?:
    | Token<CSS.Property.MaxInlineSize | number, "sizes">
    | undefined
  /**
   * The CSS `min-width` property
   */
  minWidth?: Token<CSS.Property.MinWidth | number, "sizes"> | undefined
  /**
   * The CSS `min-width` property
   */
  minW?: Token<CSS.Property.MinWidth | number, "sizes"> | undefined
  minInlineSize?:
    | Token<CSS.Property.MinInlineSize | number, "sizes">
    | undefined
  /**
   * The CSS `height` property
   */
  height?: Token<CSS.Property.Height | number, "sizes"> | undefined
  /**
   * The CSS `height` property
   */
  h?: Token<CSS.Property.Height | number, "sizes"> | undefined
  blockSize?: Token<CSS.Property.BlockSize | number, "sizes"> | undefined
  /**
   * The CSS `max-height` property
   */
  maxHeight?: Token<CSS.Property.MaxHeight | number, "sizes"> | undefined
  /**
   * The CSS `max-height` property
   */
  maxH?: Token<CSS.Property.MaxHeight | number, "sizes"> | undefined
  maxBlockSize?: Token<CSS.Property.MaxBlockSize | number, "sizes"> | undefined
  /**
   * The CSS `min-height` property
   */
  minHeight?: Token<CSS.Property.MinHeight | number, "sizes"> | undefined
  /**
   * The CSS `min-height` property
   */
  minH?: Token<CSS.Property.MinHeight | number, "sizes"> | undefined
  minBlockSize?: Token<CSS.Property.MinBlockSize | number, "sizes"> | undefined
  /**
   * The CSS `vertical-align` property
   */
  verticalAlign?: Token<CSS.Property.VerticalAlign<Length>> | undefined
  /**
   * The CSS `overflow` property
   */
  overflow?: Token<CSS.Property.Overflow> | undefined
  /**
   * The CSS `overflow-x` property
   */
  overflowX?: Token<CSS.Property.OverflowX> | undefined
  /**
   * The CSS `overflow-y` property
   */
  overflowY?: Token<CSS.Property.OverflowY> | undefined
  /**
   * The CSS `box-sizing` property
   */
  boxSizing?: CSS.Property.BoxSizing | undefined
  /**
   * The CSS `box-decoration` property
   */
  boxDecorationBreak?: Token<CSS.Property.BoxDecorationBreak> | undefined
  /**
   * The CSS `float` property
   */
  float?: Token<CSS.Property.Float> | undefined
  /**
   * The CSS `object-fit` property
   */
  objectFit?: Token<CSS.Property.ObjectFit> | undefined
  /**
   * The CSS `object-position` property
   */
  objectPosition?: Token<CSS.Property.ObjectPosition<Length>> | undefined
  /**
   * The CSS `overscroll-behavior` property
   */
  overscrollBehavior?: Token<CSS.Property.OverscrollBehavior> | undefined
  /**
   * The CSS `overscroll-behavior` property
   */
  overscroll?: Token<CSS.Property.OverscrollBehavior> | undefined
  /**
   * The CSS `overscroll-behavior-x` property
   */
  overscrollBehaviorX?: Token<CSS.Property.OverscrollBehaviorX> | undefined
  /**
   * The CSS `overscroll-behavior-x` property
   */
  overscrollX?: Token<CSS.Property.OverscrollBehaviorX> | undefined
  /**
   * The CSS `overscroll-behavior-y` property
   */
  overscrollBehaviorY?: Token<CSS.Property.OverscrollBehaviorY> | undefined
  /**
   * The CSS `overscroll-behavior-y` property
   */
  overscrollY?: Token<CSS.Property.OverscrollBehaviorY> | undefined
  /**
   * The CSS `visibility` property
   */
  visibility?: Token<CSS.Property.Visibility> | undefined
  /**
   * The CSS `isolation` property
   */
  isolation?: Token<CSS.Property.Isolation> | undefined
  /**
   * The CSS `aspect-ratio` property
   */
  aspectRatio?: Token<CSS.Property.AspectRatio> | undefined
}
