import { createRef } from "react"
import type { JSX } from "react"
import { expectTypeOf, it } from "vitest"
import { Button, ButtonGroup } from "./index"
import type { ButtonGroupProps, ButtonProps } from "./index"

it("exposes public Button recipe, behavior, DOM, and ref types", () => {
  expectTypeOf<ButtonProps>().toHaveProperty("size")
  expectTypeOf<ButtonProps>().toHaveProperty("variant")
  expectTypeOf<ButtonProps>().toHaveProperty("loading")
  expectTypeOf<ButtonProps>().toHaveProperty("className")

  const ref = createRef<HTMLButtonElement>()
  const button = (
    <Button
      ref={ref}
      type="submit"
      size="sm"
      variant="outline"
      loading
      className="consumer"
    >
      Save
    </Button>
  )

  expectTypeOf(button).toEqualTypeOf<JSX.Element>()

  // @ts-expect-error Button rejects unknown recipe variants
  void (<Button variant="unknown">Save</Button>)
})

it("exposes public ButtonGroup recipe, layout, DOM, and ref types", () => {
  expectTypeOf<ButtonGroupProps>().toHaveProperty("size")
  expectTypeOf<ButtonGroupProps>().toHaveProperty("variant")
  expectTypeOf<ButtonGroupProps>().toHaveProperty("orientation")
  expectTypeOf<ButtonGroupProps>().toHaveProperty("className")

  const ref = createRef<HTMLDivElement>()
  const group = (
    <ButtonGroup ref={ref} size="sm" variant="outline" orientation="vertical">
      <Button>One</Button>
      <Button>Two</Button>
    </ButtonGroup>
  )

  expectTypeOf(group).toEqualTypeOf<JSX.Element>()

  // @ts-expect-error ButtonGroup rejects unknown Button recipe sizes
  void (<ButtonGroup size="unknown" />)
})
