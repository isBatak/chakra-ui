import * as CSS from "csstype"
import { Config } from "../utils/prop-config"
import { t, Token } from "../utils"

export const effect: Config = {
  boxShadow: t.shadows("boxShadow"),
  mixBlendMode: true,
  blendMode: t.prop("mixBlendMode"),
  backgroundBlendMode: true,
  bgBlendMode: t.prop("backgroundBlendMode"),
  opacity: true,
}

Object.assign(effect, {
  shadow: effect.boxShadow,
})

/**
 * Types for box and text shadow properties
 */
export interface EffectProps {
  /**
   * The `box-shadow` property
   */
  boxShadow?: Token<CSS.Property.BoxShadow | number, "shadows"> | undefined
  /**
   * The `box-shadow` property
   */
  shadow?: Token<CSS.Property.BoxShadow | number, "shadows"> | undefined
  /**
   * The `mix-blend-mode` property
   */
  mixBlendMode?: Token<CSS.Property.MixBlendMode> | undefined
  /**
   * The `blend-mode` property
   */
  blendMode?: Token<CSS.Property.MixBlendMode> | undefined
  /**
   * The CSS `background-blend-mode` property
   */
  backgroundBlendMode?: Token<CSS.Property.BackgroundBlendMode> | undefined
  /**
   * The CSS `background-blend-mode` property
   */
  bgBlendMode?: Token<CSS.Property.BackgroundBlendMode> | undefined
  /**
   * The CSS `opacity` property
   */
  opacity?: Token<CSS.Property.Opacity> | undefined
}
