import { button } from "../../../../../styled-system/recipes"

/**
 * Keep this registry limited to recipes consumed by the adapter. Registering
 * every generated recipe here would make them all reachable from one module
 * and could prevent unused recipes from being tree-shaken.
 */
export const recipes = { button } as const
