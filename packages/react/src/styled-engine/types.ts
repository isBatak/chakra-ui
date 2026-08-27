import type { StyledFactoryFn } from "../styled-system/factory.types"

export interface StyledEngineAdapter {
  styled: StyledFactoryFn
  recipe(
    name: string,
    props: Record<string, any>,
  ): {
    className?: string | undefined
    styles?: unknown
    props: Record<string, any>
  }
}
