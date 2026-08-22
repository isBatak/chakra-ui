export interface StylingEngineSplitProps<Props> {
  elementProps: Partial<Props>
  styleProps: Partial<Props>
}

export type StylingEngineClassName =
  | string
  | false
  | null
  | undefined

/**
 * Engine-neutral styling contract consumed by Chakra's factory and
 * style-context helpers.
 *
 * Implementations live in engine packages such as `@chakra-ui/emotion` and
 * `@chakra-ui/panda`.
 */
export interface StylingEngineAdapter<
  SystemStyle = unknown,
  RecipeProps extends Record<string, unknown> = Record<string, unknown>,
  SlotRecipeProps extends Record<string, unknown> = RecipeProps,
> {
  splitProps<Props extends Record<string, unknown>>(
    props: Props,
  ): StylingEngineSplitProps<Props>
  css(style: SystemStyle): string
  recipe(name: string, props: RecipeProps): string
  slotRecipe(name: string, props: SlotRecipeProps): Record<string, string>
  cx(...classNames: StylingEngineClassName[]): string
  token(path: string, fallback?: string): string
}
