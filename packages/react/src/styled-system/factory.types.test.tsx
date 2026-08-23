import { createRef } from "react"
import type { JSX, Ref } from "react"
import { expectTypeOf, it } from "vitest"
import type {
  ChakraComponent,
  ChakraIntrinsicElementProps,
  ChakraJsxStyleProps,
  ChakraRecipeProps,
  ChakraSlotRecipeProps,
  PolymorphicRef,
} from "./factory.types"
import type { RecipeDefinition, SlotRecipeDefinition } from "./recipe.types"

it("types intrinsic, polymorphic, and Ark v5 composition props", () => {
  expectTypeOf<ChakraIntrinsicElementProps<"button">>().toHaveProperty("type")
  expectTypeOf<ChakraIntrinsicElementProps<"button">>().toHaveProperty("css")
  expectTypeOf<ChakraIntrinsicElementProps<"button">>().toHaveProperty(
    "asChild",
  )
  expectTypeOf<PolymorphicRef<"button">>().toEqualTypeOf<
    Ref<HTMLButtonElement>
  >()

  const Component = null as unknown as ChakraComponent<"button">
  const buttonRef = createRef<HTMLButtonElement>()
  const anchorRef = createRef<HTMLAnchorElement>()
  const button = <Component type="submit" ref={buttonRef} />
  const anchor = <Component as="a" href="/docs" ref={anchorRef} />
  const composed = (
    <Component asChild>
      <a href="/docs">Docs</a>
    </Component>
  )

  expectTypeOf(button).toEqualTypeOf<JSX.Element>()
  expectTypeOf(anchor).toEqualTypeOf<JSX.Element>()
  expectTypeOf(composed).toEqualTypeOf<JSX.Element>()

  // @ts-expect-error anchor props require `as="a"`
  void (<Component href="/docs" />)
  // @ts-expect-error `as="a"` requires an anchor ref
  void (<Component as="a" ref={buttonRef} />)
})

it("exposes canonical recipe, slot recipe, and JSX style helpers", () => {
  expectTypeOf<ChakraRecipeProps<"button">>().toHaveProperty("variant")
  expectTypeOf<ChakraSlotRecipeProps<"dialog">>().toHaveProperty("size")
  expectTypeOf<ChakraJsxStyleProps>().toHaveProperty("css")
  expectTypeOf<ChakraJsxStyleProps>().toHaveProperty("color")
})

it("accepts Panda extraction metadata as a safe Emotion no-op", () => {
  const recipe = {
    jsx: ["Button"],
    className: "chakra-button",
  } satisfies RecipeDefinition
  const slotRecipe = {
    slots: ["root", "content"],
    jsx: ["Dialog"],
    className: "chakra-dialog",
  } satisfies SlotRecipeDefinition

  expectTypeOf(recipe.jsx).toEqualTypeOf<string[]>()
  expectTypeOf(slotRecipe.jsx).toEqualTypeOf<string[]>()
})
