import { Box } from "@chakra-ui/react"
import { RegularComponent } from "./components"

export function Usage({
  active,
  runtimeColor,
}: {
  active: boolean
  runtimeColor: string
}) {
  return (
    <>
      <Box color={active ? runtimeColor : "red.500"} />
      <RegularComponent color={active ? runtimeColor : "red.500"} />
    </>
  )
}
