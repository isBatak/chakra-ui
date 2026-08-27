import type { StyledEngineAdapter } from "./types"

export function createAdapter<Adapter extends StyledEngineAdapter>(
  adapter: Adapter,
): Adapter {
  return adapter
}
