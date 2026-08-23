"use client"

import { createContext, useContext } from "react"
import type { ReactNode } from "react"
import type { StylingEngineAdapter } from "./types"

const StylingEngineContext = createContext<StylingEngineAdapter | null>(null)

export interface StylingEngineProviderProps {
  value: StylingEngineAdapter
  children: ReactNode
}

/** Provides the fixed styling adapter used by the nearest Chakra subtree. */
export function StylingEngineProvider(props: StylingEngineProviderProps) {
  return (
    <StylingEngineContext.Provider value={props.value}>
      {props.children}
    </StylingEngineContext.Provider>
  )
}

/** Resolves the adapter selected by the nearest styling-engine boundary. */
export function useStylingEngine(): StylingEngineAdapter {
  const adapter = useContext(StylingEngineContext)

  if (!adapter) {
    throw new Error(
      "[chakra-ui] No styling engine was found. Mount an adapter from " +
        '"@chakra-ui/emotion" or "@chakra-ui/panda" above Chakra components.',
    )
  }

  return adapter
}
