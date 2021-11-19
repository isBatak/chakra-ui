import React from "react"
import { Box, ChakraProvider } from "@chakra-ui/react"

export default function App() {
  return (
    <ChakraProvider>
      <h1>Chakra UI</h1>
      {Array(500)
        .fill(1)
        .map((_, i) => (
          <Box
            key={i}
            m={`${i}px`}
            display="inline-block"
            minW={100}
            h={100}
            bgColor="gray.400"
            textAlign="center"
            lineHeight={1}
            fontSize={100}
          >
            {i}
          </Box>
        ))}
    </ChakraProvider>
  )
}
