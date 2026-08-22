import type { EmotionCache } from "@emotion/cache"
import { serializeStyles } from "@emotion/serialize"
import { useInsertionEffectAlwaysWithSyncFallback } from "@emotion/use-insertion-effect-with-fallbacks"
import { insertStyles, registerStyles } from "@emotion/utils"
import { createElement } from "react"
import type {
  StylingEngineStyleInput,
  StylingEngineStyleOutput,
} from "@chakra-ui/react/styling-engine"
import type { SystemStyleObject } from "@chakra-ui/react/styled-system"

interface EmotionInsertionProps {
  cache: EmotionCache
  serialized: ReturnType<typeof serializeStyles>
}

function EmotionInsertion(props: EmotionInsertionProps) {
  const { cache, serialized } = props
  registerStyles(cache, serialized, true)

  const rules = useInsertionEffectAlwaysWithSyncFallback(() =>
    insertStyles(cache, serialized, true),
  )

  if (typeof document !== "undefined" || rules === undefined) return null

  let names = serialized.name
  let next = serialized.next
  while (next !== undefined) {
    names += ` ${next.name}`
    next = next.next
  }

  return createElement("style", {
    "data-emotion": `${cache.key} ${names}`,
    dangerouslySetInnerHTML: { __html: rules },
    nonce: cache.sheet.nonce,
  })
}

export function createEmotionStyleResolver(cache: EmotionCache) {
  return (
    style: StylingEngineStyleInput<SystemStyleObject>,
  ): StylingEngineStyleOutput => {
    const styles = Array.isArray(style) ? style : [style]
    const serialized = serializeStyles(styles, cache.registered)

    return {
      className: serialized.styles
        ? `${cache.key}-${serialized.name}`
        : "",
      insertion: createElement(EmotionInsertion, { cache, serialized }),
    }
  }
}
