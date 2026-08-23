import { Command } from "commander"
import { globbySync } from "globby"
import { existsSync, readFileSync } from "node:fs"
import { join, relative } from "node:path"
import { getProjectContext } from "../utils/context"
import {
  type MigrationPackageJson,
  analyzeMigration,
  formatMigrationAnalysis,
} from "../utils/migration"

interface MigrationFlags {
  cwd: string
}

export const MigrateCommand = new Command("migrate")
  .description("Inspect a v3 project and print a non-destructive v4 proposal")
  .option("--cwd <DIR>", "Project directory", process.cwd())
  .action(async (flags: MigrationFlags) => {
    const cwd = flags.cwd
    const packagePath = join(cwd, "package.json")
    const packageJson: MigrationPackageJson = existsSync(packagePath)
      ? JSON.parse(readFileSync(packagePath, "utf8"))
      : {}
    const context = await getProjectContext({ cwd })
    const [providerPath = null] = globbySync(
      ["{src,app,components}/**/provider.{tsx,jsx,ts,js}"],
      { cwd, absolute: true },
    )
    const providerSource = providerPath
      ? readFileSync(providerPath, "utf8")
      : null
    const themePaths = globbySync(
      [
        "{src,app}/**/theme.{ts,tsx,js,jsx}",
        "{src,app}/**/theme/**/*.{ts,tsx,js,jsx}",
        "theme/**/*.{ts,tsx,js,jsx}",
      ],
      { cwd, absolute: true },
    )
    const displayPath = (path: string) => relative(cwd, path)

    const analysis = analyzeMigration({
      packageJson,
      pandaConfigPath: context.pandaConfigPath,
      providerPath: providerPath ? displayPath(providerPath) : null,
      providerSource,
      themePaths: themePaths.map(displayPath),
    })

    process.stdout.write(`${formatMigrationAnalysis(analysis)}\n`)
  })
