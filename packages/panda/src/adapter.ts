import type {
  StylingEngineAdapter,
  StylingEngineClassName,
  StylingEngineProps,
  StylingEngineStyleInput,
  StylingEngineStyleOutput,
} from "@chakra-ui/react/styling-engine"

export type PandaRecipe<Props extends StylingEngineProps> = (
  props: Readonly<Props>,
) => string

export type PandaSlotRecipe<Props extends StylingEngineProps> = (
  props: Readonly<Props>,
) => Record<string, string>

export interface PandaAdapterOptions<
  SystemStyle,
  RecipeProps extends StylingEngineProps = StylingEngineProps,
  SlotRecipeProps extends StylingEngineProps = RecipeProps,
> {
  isStyleProp(prop: string): boolean
  css(...styles: SystemStyle[]): string
  recipes: Record<string, PandaRecipe<RecipeProps>>
  slotRecipes: Record<string, PandaSlotRecipe<SlotRecipeProps>>
  token(path: string, fallback?: string): string
  cx?: (...classNames: StylingEngineClassName[]) => string
}

const defaultCx = (...values: StylingEngineClassName[]) =>
  values.filter(Boolean).join(" ")

const output = (className: string): StylingEngineStyleOutput => ({
  className,
  insertion: null,
})

export function createPandaAdapter<
  SystemStyle,
  RecipeProps extends StylingEngineProps = StylingEngineProps,
  SlotRecipeProps extends StylingEngineProps = RecipeProps,
>(
  options: PandaAdapterOptions<SystemStyle, RecipeProps, SlotRecipeProps>,
): StylingEngineAdapter<SystemStyle, RecipeProps, SlotRecipeProps> {
  return {
    splitProps<Props extends StylingEngineProps>(props: Readonly<Props>) {
      const elementProps: Partial<Props> = {}
      const styleProps: Partial<Props> = {}

      for (const key in props) {
        const target = options.isStyleProp(key) ? styleProps : elementProps
        ;(target as StylingEngineProps)[key] = props[key]
      }

      return { elementProps, styleProps }
    },
    css(style: StylingEngineStyleInput<SystemStyle>) {
      const styles = Array.isArray(style) ? style : [style]
      return output(options.css(...(styles as SystemStyle[])))
    },
    recipe({ name, props }) {
      const recipe = options.recipes[name]
      if (!recipe) throw new Error(`Unknown Panda recipe: ${name}`)
      return output(recipe(props))
    },
    slotRecipe({ name, props }) {
      const recipe = options.slotRecipes[name]
      if (!recipe) throw new Error(`Unknown Panda slot recipe: ${name}`)
      return Object.fromEntries(
        Object.entries(recipe(props)).map(([slot, className]) => [
          slot,
          output(className),
        ]),
      )
    },
    cx: options.cx ?? defaultCx,
    token: options.token,
  }
}
