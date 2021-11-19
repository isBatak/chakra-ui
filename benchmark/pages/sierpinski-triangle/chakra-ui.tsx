import dynamic from "next/dynamic"

const SierpinskiTriangle = () => {
  const Test = dynamic(
    () => import("../../bench/sierpinski-triangle/chakra-ui"),
    { ssr: false },
  )

  return <Test />
}

export default SierpinskiTriangle
