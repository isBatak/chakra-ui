import React from "react"
import { Button } from "@chakra-ui/react"
import { TestComponentProps, TestRunner } from "../TestRunner"
import { ChakraProvider } from "@chakra-ui/provider"

const Test = ({ testIndex }: TestComponentProps) => {
  return <Button sx={{ "--test-index": `${testIndex}` }}>testing</Button>
}

const ChakraUiTest = () => {
  return (
    <TestRunner
      numberOfRuns={3}
      iterationN={1000}
      TestComponent={Test}
      wrapper={(children) => <ChakraProvider>{children}</ChakraProvider>}
    />
  )
}

export default ChakraUiTest
