import dynamic from "next/dynamic"
import { ChakraProvider } from "@chakra-ui/react"

const CreateAndMountComponent = () => {
  const ChakraUiTest = dynamic(
    () => import("../../bench/create-and-mount-button/chakra-ui"),
    { ssr: false },
  )

  return (
    <ChakraProvider>
      <ChakraUiTest />
    </ChakraProvider>
  )
}

export default CreateAndMountComponent
