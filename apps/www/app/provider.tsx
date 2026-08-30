"use client"

import { ChakraProvider } from "@chakra-ui/react"
import { EmotionStyledEngine } from "@chakra-ui/react/styled-engine"
import { ColorModeProvider } from "compositions/ui/color-mode"
import { Toaster } from "compositions/ui/toaster"
import { system } from "./theme"

export const Provider = (props: { children: React.ReactNode }) => {
  return (
    <ChakraProvider value={system}>
      <EmotionStyledEngine>
        <ColorModeProvider>
          {props.children}
          <Toaster />
        </ColorModeProvider>
      </EmotionStyledEngine>
    </ChakraProvider>
  )
}
