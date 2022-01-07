import React from "react"
import dynamic from "next/dynamic"

const CreateAndMountButtonComponent = () => {
  const Test = dynamic(
    () => import("../../bench/create-and-mount-button/chakra-ui"),
    { ssr: false },
  )

  return <Test />
}

export default CreateAndMountButtonComponent
