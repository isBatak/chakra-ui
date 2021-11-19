import dynamic from "next/dynamic"

const SierpinskiTriangle = () => {
  const Test = dynamic(() => import("../../bench/mount-deep-tree/chakra-ui"), {
    ssr: false,
  })

  return <Test />
}

export default SierpinskiTriangle
