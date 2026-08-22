import type {
  StylingEngineAdapter,
  StylingEngineClassName,
  StylingEngineProps,
} from "@chakra-ui/react/styling-engine"
import type {
  SystemContext,
  SystemStyleObject,
} from "@chakra-ui/react/styled-system"
import {
  createEmotionStyleResolver,
  type EmotionCacheLike,
} from "./style-resolver"

export interface EmotionAdapterOptions {
  system: SystemContext
  cache: EmotionCacheLike
}

const cx = (...values: StylingEngineClassName[]) =>
  values.filter(Boolean).join(" ")

export function createEmotionAdapter(
  options: EmotionAdapterOptions,
): StylingEngineAdapter<SystemStyleObject> {
  const { system } = options
  const resolveStyle = createEmotionStyleResolver(options.cache)

  return {
    splitProps<Props extends StylingEngineProps>(props: Readonly<Props>) {
      const [styleProps, elementProps] = system.splitCssProps(props)
      return { elementProps, styleProps }
    },
    css: resolveStyle,
    recipe({ name, props }) {
      return resolveStyle(system.getRecipeFn(name)(props))
    },
    slotRecipe({ name, props }) {
      const styles = system.getSlotRecipeFn(name)(props)
      return Object.fromEntries(
        Object.entries(styles).map(([slot, style]) => [
          slot,
          resolveStyle(style),
        ]),
      )
    },
    cx,
    token(path, fallback) {
      return system.token(path, fallback)
    },
  }
}
