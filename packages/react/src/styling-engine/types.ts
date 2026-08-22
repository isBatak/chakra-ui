export type StylingEngineProps = Record<string, unknown>

export type StylingEngineSplitPropsInput<
  Props extends StylingEngineProps,
> = Readonly<Props>

export interface StylingEngineSplitPropsOutput<ElementProps, StyleProps> {
  elementProps: ElementProps
  styleProps: StyleProps
}

export type StylingEngineStyleInput<SystemStyle> =
  | SystemStyle
  | readonly SystemStyle[]

export type StylingEngineStyleOutput = string

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
  RecipeProps extends StylingEngineProps = StylingEngineProps,
  SlotRecipeProps extends StylingEngineProps = RecipeProps,
> {
  splitProps<Props extends StylingEngineProps>(
    props: StylingEngineSplitPropsInput<Props>,
  ): StylingEngineSplitPropsOutput<Partial<Props>, Partial<Props>>
  css(style: StylingEngineStyleInput<SystemStyle>): StylingEngineStyleOutput
  recipe(name: string, props: RecipeProps): string
  slotRecipe(name: string, props: SlotRecipeProps): Record<string, string>
  cx(...classNames: StylingEngineClassName[]): string
  token(path: string, fallback?: string): string
}
