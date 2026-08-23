export type MigrationEngine = "emotion" | "panda"

export interface MigrationPackageJson {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

export interface MigrationAnalysisOptions {
  packageJson: MigrationPackageJson
  pandaConfigPath: string | null
  providerPath: string | null
  providerSource: string | null
  themePaths: string[]
}

export interface MigrationAnalysis {
  engine: MigrationEngine
  missingDependencies: Record<string, string>
  missingImports: string[]
  preservedFiles: string[]
  proposedDiff: string
  manualSteps: string[]
  appliesChanges: false
}

const packageVersions = {
  "@chakra-ui/react": "^4.0.0",
  "@chakra-ui/emotion": "^4.0.0",
  "@chakra-ui/panda": "^4.0.0",
} as const

function hasPackage(packageJson: MigrationPackageJson, name: string) {
  return (
    packageJson.dependencies?.[name] != null ||
    packageJson.devDependencies?.[name] != null
  )
}

function formatPackageDiff(missingDependencies: Record<string, string>) {
  const entries = Object.entries(missingDependencies)
  if (entries.length === 0) return "No dependency changes proposed."

  return [
    "--- a/package.json",
    "+++ b/package.json",
    "@@ dependencies @@",
    '   "dependencies": {',
    ...entries.map(([name, version]) => `+    \"${name}\": \"${version}\",`),
    "   }",
  ].join("\n")
}

export function analyzeMigration(
  options: MigrationAnalysisOptions,
): MigrationAnalysis {
  const engine = options.pandaConfigPath ? "panda" : "emotion"
  const adapterPackage =
    engine === "panda" ? "@chakra-ui/panda" : "@chakra-ui/emotion"
  const boundary =
    engine === "panda" ? "PandaStylingEngine" : "EmotionStylingEngine"
  const requiredPackages = ["@chakra-ui/react", adapterPackage] as const
  const missingDependencies = Object.fromEntries(
    requiredPackages
      .filter((name) => !hasPackage(options.packageJson, name))
      .map((name) => [name, packageVersions[name]]),
  )

  const missingImports =
    options.providerSource && !options.providerSource.includes(boundary)
      ? [`import { ${boundary} } from "${adapterPackage}"`]
      : []
  const preservedFiles = [
    ...(options.providerPath ? [options.providerPath] : []),
    ...options.themePaths,
  ]
  const manualSteps: string[] = []

  if (options.providerPath) {
    manualSteps.push(
      `Edit ${options.providerPath} yourself: wrap ChakraProvider with ${boundary}.`,
    )
  } else {
    manualSteps.push(
      `Install a user-owned Provider snippet and wrap ChakraProvider with ${boundary}.`,
    )
  }

  if (missingImports.length > 0) {
    manualSteps.push(`Add the missing import: ${missingImports[0]}`)
  }

  if (options.themePaths.length > 0) {
    manualSteps.push(
      `Keep the existing theme files unchanged: ${options.themePaths.join(", ")}.`,
    )
  }

  return {
    engine,
    missingDependencies,
    missingImports,
    preservedFiles,
    proposedDiff: formatPackageDiff(missingDependencies),
    manualSteps,
    appliesChanges: false,
  }
}

export function formatMigrationAnalysis(analysis: MigrationAnalysis) {
  const lines = [
    `Migration engine: ${analysis.engine}`,
    "",
    "Proposed dependency diff (not applied):",
    analysis.proposedDiff,
    "",
    "Manual steps:",
    ...analysis.manualSteps.map((step) => `- ${step}`),
  ]

  if (analysis.preservedFiles.length > 0) {
    lines.push(
      "",
      "Preserved user-owned files:",
      ...analysis.preservedFiles.map((path) => `- ${path}`),
    )
  }

  lines.push("", "No files were changed.")
  return lines.join("\n")
}
