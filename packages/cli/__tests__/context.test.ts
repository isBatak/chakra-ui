import { mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { describe, expect, test } from "vitest"
import { getProjectContext } from "../src/utils/context"

describe("getProjectContext", () => {
  test("detects Panda from panda.config.*", async () => {
    const cwd = mkdtempSync(join(tmpdir(), "chakra-cli-panda-"))
    const configPath = join(cwd, "panda.config.ts")
    writeFileSync(configPath, "export default {}")

    const context = await getProjectContext({ cwd })

    expect(context.pandaConfigPath).toBe(configPath)
  })

  test("does not use chakra.config.* as an engine signal", async () => {
    const cwd = mkdtempSync(join(tmpdir(), "chakra-cli-config-"))
    writeFileSync(join(cwd, "chakra.config.ts"), "export default {}")

    const context = await getProjectContext({ cwd })

    expect(context.pandaConfigPath).toBeNull()
  })
})
