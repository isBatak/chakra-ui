import type {
  SystemContext,
  SystemStyleObject,
} from "@chakra-ui/react/styled-system"
import type {
  StylingEngineAdapter,
  StylingEngineClassName,
  StylingEngineProps,
} from "@chakra-ui/react/styling-engine"
import createCache from "@emotion/cache"
import type { EmotionCache } from "@emotion/cache"
import { createEmotionStyleResolver } from "./style-resolver"

export interface EmotionAdapterOptions {
  system: SystemContext
  cache?: EmotionCache
}

const cx = (...values: StylingEngineClassName[]) =>
  values.filter(Boolean).join(" ")

export function createEmotionAdapter(
  options: EmotionAdapterOptions,
): StylingEngineAdapter<SystemStyleObject> {
  const { system } = options
  const resolveStyle = createEmotionStyleResolver(
    options.cache ?? createCache({ key: "chakra" }),
  )

  return {
    splitProps<Props extends StylingEngineProps>(props: Readonly<Props>) {
      const [styleProps, elementProps] = system.splitCssProps(
        props as Props & SystemStyleObject,
      )
      return {
        elementProps: elementProps as Partial<Props>,
        styleProps: styleProps as Partial<Props>,
      }
    },
    css: resolveStyle,
    recipe({ name, definitions, props }) {
      if (definitions?.length) {
        const recipes = definitions.map((definition) =>
          system.cva(definition as Parameters<typeof system.cva>[0]),
        )
        const recipe = recipes.slice(1).reduce((a, b) => a.merge(b), recipes[0])
        return resolveStyle(recipe(props) as SystemStyleObject)
      }
      if (!name) throw new Error("A recipe name or definition is required")
      return resolveStyle(system.getRecipeFn(name)(props) as SystemStyleObject)
    },
    slotRecipe({ name, props }) {
      const styles = system.getSlotRecipeFn(name)(props)
      return Object.fromEntries(
        Object.entries(styles).map(([slot, style]) => [
          slot,
          resolveStyle(style as SystemStyleObject),
        ]),
      )
    },
    cx,
    token(path, fallback) {
      return system.token(path, fallback)
    },
  }
}
