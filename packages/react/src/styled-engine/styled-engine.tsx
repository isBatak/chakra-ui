"use client"

import { createContext, useContext } from "react"
import type { StyledEngineAdapter } from "./types"

const StyledEngineContext = createContext<StyledEngineAdapter | null>(null)

export interface StyledEngineProps {
  adapter: StyledEngineAdapter
  children: React.ReactNode
}

export function StyledEngine({ adapter, children }: StyledEngineProps) {
  return (
    <StyledEngineContext.Provider value={adapter}>
      {children}
    </StyledEngineContext.Provider>
  )
}

export function useStyledEngine() {
  const engine = useContext(StyledEngineContext)

  if (!engine) {
    throw new Error(
      "[chakra-ui] No styled engine boundary was found. Mount EmotionStyledEngine or PandaStyledEngine above Chakra components.",
    )
  }

  return engine
}
