import { join, normalize } from "node:path"

const RE_SHADOW_BARE_BLACK = /(?<![.{])black\b/g

const RE_RECIPES_CONTAINER_IMPORT =
  /^\s*import\s*\{\s*containerRecipe\s*\}\s*from\s*["']\.\/container["']\s*\r?\n/m

const RE_RECIPES_CONTAINER_ENTRY = /^\s*container:\s*containerRecipe,\s*\r?\n/m

/**
 * Chakra → Panda adjustments: shadow token refs, and drop the `container`
 * recipe (Panda already provides a `container` pattern).
 */
export function applyPandaThemeMappings(
  content: string,
  relativeFile: string,
): string {
  let out = content.replaceAll("{black/", "{colors.black/")

  if (
    normalize(relativeFile) === normalize(join("semantic-tokens", "shadows.ts"))
  ) {
    out = out.replace(RE_SHADOW_BARE_BLACK, "{colors.black}")
  }

  if (normalize(relativeFile) === normalize(join("recipes", "index.ts"))) {
    out = out
      .replace(RE_RECIPES_CONTAINER_IMPORT, "")
      .replace(RE_RECIPES_CONTAINER_ENTRY, "")
  }

  return out
}
