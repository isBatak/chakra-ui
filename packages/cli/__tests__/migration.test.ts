import { describe, expect, test } from "vitest"
import {
  analyzeMigration,
  formatMigrationAnalysis,
} from "../src/utils/migration"

const baseOptions = {
  packageJson: {},
  pandaConfigPath: null,
  providerPath: "src/components/ui/provider.tsx",
  providerSource: "import { ChakraProvider } from '@chakra-ui/react'",
  themePaths: ["src/theme.ts"],
}

describe("migration analysis", () => {
  test("defaults to Emotion and proposes only missing packages and imports", () => {
    const analysis = analyzeMigration({
      ...baseOptions,
      packageJson: { dependencies: { "@chakra-ui/react": "^4.0.0" } },
    })

    expect(analysis.engine).toBe("emotion")
    expect(analysis.missingDependencies).toEqual({
      "@chakra-ui/emotion": "^4.0.0",
    })
    expect(analysis.missingImports).toEqual([
      'import { EmotionStylingEngine } from "@chakra-ui/emotion"',
    ])
    expect(analysis.proposedDiff).not.toContain('+    "@chakra-ui/react"')
  })

  test("selects Panda only when panda.config.* was detected", () => {
    const analysis = analyzeMigration({
      ...baseOptions,
      pandaConfigPath: "/app/panda.config.ts",
    })

    expect(analysis.engine).toBe("panda")
    expect(analysis.missingDependencies).toEqual({
      "@chakra-ui/react": "^4.0.0",
      "@chakra-ui/panda": "^4.0.0",
    })
    expect(analysis.missingImports).toEqual([
      'import { PandaStylingEngine } from "@chakra-ui/panda"',
    ])
  })

  test("preserves Provider and theme files and never applies changes", () => {
    const analysis = analyzeMigration(baseOptions)
    const output = formatMigrationAnalysis(analysis)

    expect(analysis.preservedFiles).toEqual([
      "src/components/ui/provider.tsx",
      "src/theme.ts",
    ])
    expect(analysis.appliesChanges).toBe(false)
    expect(output).toContain("Proposed dependency diff (not applied):")
    expect(output).toContain("No files were changed.")
    expect(output).toContain("Edit src/components/ui/provider.tsx yourself")
  })

  test("does not propose packages or imports that already exist", () => {
    const analysis = analyzeMigration({
      ...baseOptions,
      packageJson: {
        dependencies: {
          "@chakra-ui/react": "^4.0.0",
          "@chakra-ui/emotion": "^4.0.0",
        },
      },
      providerSource:
        'import { EmotionStylingEngine } from "@chakra-ui/emotion"',
    })

    expect(analysis.missingDependencies).toEqual({})
    expect(analysis.missingImports).toEqual([])
    expect(analysis.proposedDiff).toBe("No dependency changes proposed.")
  })
})
