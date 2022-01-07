import React from "react"
import { Button, ChakraProvider } from "@chakra-ui/react"
import { TestComponentProps, TestRunner } from "../TestRunner"

const Test = ({ testIndex }: TestComponentProps) => {
  return <Button sx={{ "--test-index": `${testIndex}` }}>testing</Button>
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
