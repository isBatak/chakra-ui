import React from "react"
import dynamic from "next/dynamic"

const CreateAndMountComponent = () => {
  const ChakraUiTest = dynamic(
    () => import("../../bench/create-and-mount-button/chakra-ui"),
    { ssr: false },
  )

  return <ChakraUiTest />
}

export default CreateAndMountComponent
