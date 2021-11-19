import React from "react"
import { TestComponentProps, TestRunner } from "../TestRunner"
import { Button, ChakraProvider } from "@chakra-ui/react"

const Test = ({ testIndex }: TestComponentProps) => {
  return (
    <Button
      css={{
        "--test-index": testIndex,
      }}
      bgColor={`hsl(${Math.floor(Math.random() * 360)} 80% 80%)`}
      p="20px"
    >
      testing
    </Button>
  )
}

const ChakraUITest = () => {
  return (
    <TestRunner
      numberOfRuns={3}
      iterationN={1000}
      TestComponent={Test}
      wrapper={(children) => <ChakraProvider>{children}</ChakraProvider>}
    />
  )
}

export default ChakraUITest
