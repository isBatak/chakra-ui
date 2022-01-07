import React from "react"
import { ChakraProvider } from "@chakra-ui/react"
import { TestComponentProps, TestRunner } from "../TestRunner"

const Test = ({ testIndex }: TestComponentProps) => {
  return <ChakraProvider />
}

const ChakraUiTest = () => {
  return <TestRunner numberOfRuns={3} iterationN={1} TestComponent={Test} />
}

export default ChakraUiTest
