"use client"

import { createStylingEngineBoundary } from "@chakra-ui/react/styling-engine"
import type { StylingEngineProps } from "@chakra-ui/react/styling-engine"
import { createPandaAdapter } from "./adapter"
import type { PandaAdapterOptions } from "./adapter"

/**
 * Creates a fixed Panda boundary from an application's generated Panda runtime.
 *
 * Panda helpers are generated from the consuming application's Panda config, so
 * they cannot be safely predefined by the framework package.
 */
export function createPandaStylingEngine<
  SystemStyle,
  RecipeProps extends StylingEngineProps = StylingEngineProps,
  SlotRecipeProps extends StylingEngineProps = RecipeProps,
>(options: PandaAdapterOptions<SystemStyle, RecipeProps, SlotRecipeProps>) {
  const adapter = createPandaAdapter(options)
  return createStylingEngineBoundary(adapter, "PandaStylingEngine")
}
