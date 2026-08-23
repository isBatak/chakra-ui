import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, test } from "vitest"
import * as emotion from "../../emotion/src"
import * as panda from "../../panda/src"
import * as chakra from "./index"

interface PackageManifest {
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}

const readManifest = (name: "emotion" | "panda" | "panda-preset" | "react") =>
  JSON.parse(
    readFileSync(
      resolve(process.cwd(), `packages/${name}/package.json`),
      "utf8",
    ),
  ) as PackageManifest

const packageNames = (manifest: PackageManifest) => [
  ...Object.keys(manifest.dependencies ?? {}),
  ...Object.keys(manifest.peerDependencies ?? {}),
]

describe("styling engine package boundaries", () => {
  test("keeps the React component package independent of adapter packages", () => {
    const manifest = readManifest("react")
    const dependencies = packageNames(manifest)

    expect(dependencies).not.toContain("@chakra-ui/emotion")
    expect(dependencies).not.toContain("@chakra-ui/panda")
    expect(manifest.dependencies).not.toHaveProperty("@pandacss/dev")
    expect(manifest.peerDependencies).not.toHaveProperty("@pandacss/dev")
  })

  test("keeps each adapter implementation in its dedicated package", () => {
    const emotionManifest = readManifest("emotion")
    const pandaManifest = readManifest("panda")
    const emotionDependencies = packageNames(emotionManifest)
    const pandaDependencies = packageNames(pandaManifest)

    expect(emotionDependencies).toContain("@chakra-ui/react")
    expect(emotionDependencies).toContain("@emotion/react")
    expect(emotionDependencies).not.toContain("@chakra-ui/panda")
    expect(emotionManifest.dependencies).not.toHaveProperty("@pandacss/dev")
    expect(emotionManifest.peerDependencies).not.toHaveProperty("@pandacss/dev")

    expect(pandaDependencies).toContain("@chakra-ui/react")
    expect(pandaManifest.dependencies).not.toHaveProperty("@pandacss/dev")
    expect(pandaManifest.peerDependencies).toHaveProperty(
      "@pandacss/dev",
      "^1.4.2",
    )
    expect(pandaDependencies).not.toContain("@chakra-ui/emotion")
    expect(pandaDependencies.some((name) => name.startsWith("@emotion/"))).toBe(
      false,
    )

    expect(emotion.createEmotionAdapter).toBeTypeOf("function")
    expect(emotion).not.toHaveProperty("createPandaAdapter")
    expect(panda.createPandaAdapter).toBeTypeOf("function")
    expect(panda).not.toHaveProperty("createEmotionAdapter")
  })

  test("keeps the Panda preset framework-neutral", () => {
    const dependencies = packageNames(readManifest("panda-preset"))

    expect(dependencies).not.toContain("react")
    expect(dependencies).not.toContain("@chakra-ui/react")
  })
})

describe("@chakra-ui/react public component exports", () => {
  test("exposes normal consumer APIs from one entry point", () => {
    expect(chakra.Button).toBeTypeOf("object")
    expect(chakra.ButtonGroup).toBeTypeOf("object")
    expect(chakra.Dialog.Root).toBeTypeOf("function")
    expect(chakra.chakra).toBeTypeOf("function")
  })

  test("does not expose adapter-author APIs from the component entry point", () => {
    expect(chakra).not.toHaveProperty("createEmotionAdapter")
    expect(chakra).not.toHaveProperty("createPandaAdapter")
    expect(chakra).not.toHaveProperty("StylingEngineProvider")
  })
})
