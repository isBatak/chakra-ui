import * as CSS from "csstype"
import { Config } from "../utils/prop-config"
import { Length, Token, t, transforms } from "../utils"

export const filter: Config = {
  filter: { transform: transforms.filter },
  blur: t.blur("--chakra-blur"),
  brightness: t.propT("--chakra-brightness", transforms.brightness),
  contrast: t.propT("--chakra-contrast", transforms.contrast),
  hueRotate: t.propT("--chakra-hue-rotate", transforms.hueRotate),
  invert: t.propT("--chakra-invert", transforms.invert),
  saturate: t.propT("--chakra-saturate", transforms.saturate),
  dropShadow: t.propT("--chakra-drop-shadow", transforms.dropShadow),
  backdropFilter: { transform: transforms.backdropFilter },
  backdropBlur: t.blur("--chakra-backdrop-blur"),
  backdropBrightness: t.propT(
    "--chakra-backdrop-brightness",
    transforms.brightness,
  ),
  backdropContrast: t.propT("--chakra-backdrop-contrast", transforms.contrast),
  backdropHueRotate: t.propT(
    "--chakra-backdrop-hue-rotate",
    transforms.hueRotate,
  ),
  backdropInvert: t.propT("--chakra-backdrop-invert", transforms.invert),
  backdropSaturate: t.propT("--chakra-backdrop-saturate", transforms.saturate),
}

export interface FilterProps {
  /**
   * The CSS `filter` property. When set to `auto`, you allow
   * Chakra UI to define the color based on the filter style props
   * (`blur`, `saturate`, etc.)
   */
  filter?: Token<CSS.Property.Filter | "auto"> | undefined
  /**
   * Sets the blur filter value of an element.
   * Value is assigned to `--chakra-filter` css variable
   */
  blur?: Token<{}, "blur"> | undefined
  /**
   * Sets the brightness filter value of an element.
   * Value is assigned to `--chakra-brightness` css variable
   */
  brightness?: Token<Length> | undefined
  /**
   * Sets the contrast filter value of an element.
   * Value is assigned to `--chakra-contrast` css variable
   */
  contrast?: Token<Length> | undefined
  /**
   * Sets the hue-rotate filter value of an element.
   * Value is assigned to `--chakra-hue-rotate` css variable
   */
  hueRotate?: Token<Length> | undefined
  /**
   * Sets the invert filter value of an element.
   * Value is assigned to `--chakra-invert` css variable
   */
  invert?: Token<Length> | undefined
  /**
   * Sets the saturation filter value of an element.
   * Value is assigned to `--chakra-saturate` css variable
   */
  saturate?: Token<Length> | undefined
  /**
   * Sets the drop-shadow filter value of an element.
   * Value is assigned to `--chakra-drop-shadow` css variable
   */
  dropShadow?: Token<CSS.Property.BoxShadow, "shadows"> | undefined
  /**
   * The CSS `backdrop-filter` property. When set to `auto`, you allow
   * Chakra UI to define the color based on the backdrop filter style props
   * (`backdropBlur`, `backdropSaturate`, etc.)
   */
  backdropFilter?: Token<CSS.Property.BackdropFilter | "auto"> | undefined
  /**
   * Sets the backdrop-blur filter value of an element.
   * Value is assigned to `--chakra-backdrop-blur` css variable
   */
  backdropBlur?: Token<{}, "blur"> | undefined
  /**
   * Sets the backdrop-brightness filter value of an element.
   * Value is assigned to `--chakra-backdrop-brightness` css variable
   */
  backdropBrightness?: Token<Length> | undefined
  /**
   * Sets the backdrop-contrast filter value of an element.
   * Value is assigned to `--chakra-backdrop-contrast` css variable
   */
  backdropContrast?: Token<Length> | undefined
  /**
   * Sets the backdrop-hue-rotate filter value of an element.
   * Value is assigned to `--chakra-backdrop-hue-rotate` css variable
   */
  backdropHueRotate?: Token<Length> | undefined
  /**
   * Sets the backdrop-invert filter value of an element.
   * Value is assigned to `--chakra-backdrop-invert` css variable
   */
  backdropInvert?: Token<Length> | undefined
  /**
   * Sets the backdrop-saturate filter value of an element.
   * Value is assigned to `--chakra-backdrop-saturate` css variable
   */
  backdropSaturate?: Token<Length> | undefined
}
