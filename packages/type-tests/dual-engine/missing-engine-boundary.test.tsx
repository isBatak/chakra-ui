import { Button } from "@chakra-ui/react"
import { render } from "@testing-library/react"
import { expect, it } from "vitest"

it("identifies a missing styling-engine boundary", () => {
  expect(() => render(<Button>Missing boundary</Button>)).toThrow(
    /No styling engine boundary.*@chakra-ui\/emotion.*@chakra-ui\/panda/s,
  )
})
