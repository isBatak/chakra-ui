import dynamic from "next/dynamic"
import React from "react"

const CreateAndMountComponent = () => {
  const SCTest = dynamic(
    () => import("../../bench/create-and-mount-button/styled-components"),
    { ssr: false },
  )

  return <SCTest />
}

export default CreateAndMountComponent
