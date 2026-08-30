import { allCssProperties } from "@pandacss/is-valid-prop"
import { preset } from "@pandacss/preset-base"

let cachedGeneratedStyleProps: Set<string> | undefined

function generateStyleProps() {
  const props = new Set(["css", ...allCssProperties])

  for (const definition of Object.values(preset.utilities)) {
    const shorthand = definition?.shorthand
    if (!shorthand) continue

    for (const name of Array.isArray(shorthand) ? shorthand : [shorthand]) {
      props.add(name)
    }
  }

  for (const key of Object.keys(preset.utilities)) {
    props.add(key)
  }

  return props
}

export function getGeneratedStyleProps() {
  cachedGeneratedStyleProps ??= generateStyleProps()
  return cachedGeneratedStyleProps
}
