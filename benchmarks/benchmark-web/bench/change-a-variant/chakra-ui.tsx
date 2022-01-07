import React from "react"
import { TestComponentProps, TestRunner } from "../TestRunner"
import { Button, ChakraProvider } from "@chakra-ui/react"

const Test: React.FunctionComponent<TestComponentProps> = ({
  testIndex,
}: TestComponentProps) => {
  const variants = {
    variant: testIndex % 2 === 0 ? "solid" : "outline",
    size: testIndex % 2 === 0 ? "md" : "lg",
  }

  return <Button {...variants}>testing</Button>
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
