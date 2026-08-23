import type {
  StylingEngineAdapter,
  StylingEngineClassName,
  StylingEngineProps,
} from "@chakra-ui/react/styling-engine"
import type { EmotionCache } from "@emotion/cache"
import type {
  SystemContext,
  SystemStyleObject,
} from "@chakra-ui/react/styled-system"
import { createEmotionStyleResolver } from "./style-resolver"

export interface EmotionAdapterOptions {
  system: SystemContext
  cache: EmotionCache
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
      const [styleProps, elementProps] = system.splitCssProps(
        props as Props & SystemStyleObject,
      )
      return {
        elementProps: elementProps as Partial<Props>,
        styleProps: styleProps as Partial<Props>,
      }
    },
    css: resolveStyle,
    recipe({ name, props }) {
      return resolveStyle(system.getRecipeFn(name)(props) as SystemStyleObject)
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
