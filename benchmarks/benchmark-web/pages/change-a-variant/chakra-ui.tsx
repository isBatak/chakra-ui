import dynamic from "next/dynamic"

const CreateAndMountComponent = () => {
  const Test = dynamic(() => import("../../bench/change-a-variant/chakra-ui"), {
    ssr: false,
  })

  return <Test />
}

export default CreateAndMountComponent
