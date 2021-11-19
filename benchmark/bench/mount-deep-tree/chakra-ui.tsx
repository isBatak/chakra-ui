import React, { FC } from "react"
import { TestComponentProps, TestRunner } from "../TestRunner"
import { Tree } from "../utils/Tree"
import { ChakraProvider, Box } from "@chakra-ui/react"
import { getColor } from "../utils/color"

interface ITestBoxProps {
  layout: string
  outer: boolean
  fixed: boolean
  color: string
}

export const Test = ({ testIndex }: TestComponentProps) => {
  // This purposefully creates the styled component inside the Test component
  // so that we can measure the time it takes using the React profiler
  const TestBox: FC<ITestBoxProps> = ({
    layout,
    outer,
    fixed,
    color,
    ...rest
  }) => {
    const flexDirection = layout === "column" ? "column" : "row"
    const p = outer ? "4px" : "0"
    const dimensions = fixed
      ? {
          h: "6px",
          w: "6px",
        }
      : {}

    return (
      <Box
        alignItems="stretch"
        borderWidth="0"
        borderStyle="solid"
        boxSizing="border-box"
        display="flex"
        flexBasis="auto"
        flexShrink={0}
        m="0"
        position="relative"
        minHeight="0"
        minWidth="0"
        alignSelf="flex-start"
        flexDirection={flexDirection}
        p={p}
        {...dimensions}
        backgroundColor={getColor(color)}
        {...rest}
      />
    )
  }

  return <Tree breadth={2} depth={7} id={0} wrap={1} box={TestBox} />
}

const BenchTest = () => {
  return (
    <TestRunner
      numberOfRuns={3}
      iterationN={50}
      TestComponent={Test}
      // wrapper={(children) => <ChakraProvider>{children}</ChakraProvider>}
    />
  )
}

export default BenchTest
