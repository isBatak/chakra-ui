"use client"

import { useChakraContext } from "@chakra-ui/react/styled-system"
import {
  type StylingEngineBoundaryProps,
  StylingEngineProvider,
} from "@chakra-ui/react/styling-engine"
import { createElement, useMemo } from "react"
import { createEmotionAdapter } from "./adapter"

/** Binds the nearest Chakra system to the Emotion styling runtime. */
export function EmotionStylingEngine(props: StylingEngineBoundaryProps) {
  const system = useChakraContext()
  const adapter = useMemo(() => createEmotionAdapter({ system }), [system])

  return createElement(StylingEngineProvider, {
    value: adapter,
    children: props.children,
  })
}

EmotionStylingEngine.displayName = "EmotionStylingEngine"
