import { existsSync, readFileSync } from "node:fs"
import { dirname, extname, resolve } from "node:path"
import { describe, expect, test } from "vitest"

const packageEntries = new Map([
  ["@chakra-ui/emotion", "packages/emotion/src/index.ts"],
  ["@chakra-ui/panda", "packages/panda/src/index.ts"],
  [
    "@chakra-ui/react/styled-system",
    "packages/react/src/styled-system/index.ts",
  ],
  [
    "@chakra-ui/react/styling-engine",
    "packages/react/src/styling-engine/index.ts",
  ],
])

const runtimeImport =
  /^(?!\s*(?:import|export)\s+type\b)\s*(?:import|export)\s+(?:[^"']*?\s+from\s+)?["']([^"']+)["']/gm

function resolveLocalImport(from: string, specifier: string) {
  const mapped = packageEntries.get(specifier)
  if (mapped) return resolve(mapped)
  if (!specifier.startsWith(".")) return undefined

  const target = resolve(dirname(from), specifier)
  const candidates = extname(target)
    ? [target]
    : [
        `${target}.ts`,
        `${target}.tsx`,
        resolve(target, "index.ts"),
        resolve(target, "index.tsx"),
      ]
  return candidates.find(existsSync)
}

function runtimeDependencies(entry: string) {
  const visited = new Set<string>()
  const packages = new Set<string>()
  const pending = [resolve(entry)]

  while (pending.length) {
    const file = pending.pop()!
    if (visited.has(file)) continue
    visited.add(file)

    for (const match of readFileSync(file, "utf8").matchAll(runtimeImport)) {
      const specifier = match[1]
      if (!specifier.startsWith(".")) packages.add(specifier)
      const local = resolveLocalImport(file, specifier)
      if (local) pending.push(local)
    }
  }

  return packages
}

describe("engine mode runtime dependencies", () => {
  test("Emotion-only does not load the Panda adapter runtime", () => {
    const dependencies = runtimeDependencies(
      "packages/type-tests/emotion-only/runtime.tsx",
    )

    expect([...dependencies]).not.toContain("@chakra-ui/panda")
    expect([...dependencies]).not.toContain("@pandacss/dev")
  })

  test("Panda-only does not load the Emotion adapter runtime", () => {
    const dependencies = runtimeDependencies(
      "packages/type-tests/panda-only/runtime.tsx",
    )

    expect([...dependencies]).not.toContain("@chakra-ui/emotion")
    expect([...dependencies].some((name) => name.startsWith("@emotion/"))).toBe(
      false,
    )
  })

  test("dual-engine loads both adapter runtimes", () => {
    const dependencies = runtimeDependencies(
      "packages/type-tests/dual-engine/runtime.tsx",
    )

    expect([...dependencies]).toContain("@chakra-ui/emotion")
    expect([...dependencies]).toContain("@chakra-ui/panda")
  })
})
