import React from "react"
import { TestComponentProps, TestRunner } from "../TestRunner"
import { Tree } from "../utils/Tree"
import styled from "@emotion/styled"
import { getColor } from "../utils/color"

export const Test = ({ testIndex }: TestComponentProps) => {
  // This purposefully creates the styled component inside the Test component
  // so that we can measure the time it takes using the React profiler

  const View = styled("div")({
    alignItems: "stretch",
    borderWidth: "0",
    borderStyle: "solid",
    boxSizing: "border-box",
    display: "flex",
    flexBasis: "auto",
    flexDirection: "column",
    flexShrink: 0,
    margin: "0",
    padding: "0",
    position: "relative",
    minHeight: "0",
    minWidth: "0",
  })

  const Box = styled(View)((props: any) => ({
    alignSelf: "flex-start",
    flexDirection:
      props.layout === "column" ? ("column" as any) : ("row" as any),
    padding: props.outer ? "4px" : "0",
    ...(props.fixed
      ? {
          height: "6px",
          width: "6px",
        }
      : {}),

    backgroundColor: getColor(props.color),
  }))

  return <Tree breadth={2} depth={7} id={0} wrap={1} box={Box} />
}

const BenchTest = () => {
  return <TestRunner numberOfRuns={3} iterationN={50} TestComponent={Test} />
}

export default BenchTest
