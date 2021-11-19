import React from "react"
import dynamic from "next/dynamic"

const CreateThemeComponent = () => {
  const Test = dynamic(() => import("../../bench/create-theme/chakra-ui"), {
    ssr: false,
  })

  return <Test />
}

export default CreateThemeComponent
