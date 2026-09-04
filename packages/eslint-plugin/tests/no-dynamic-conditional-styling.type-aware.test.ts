import * as tsParser from "@typescript-eslint/parser"
import { type Rule, RuleTester } from "eslint"
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, it } from "vitest"
import { noDynamicConditionalStyling } from "../src/rules/no-dynamic-conditional-styling"

RuleTester.describe = describe
RuleTester.it = it

const currentDir = dirname(fileURLToPath(import.meta.url))
const fixtureDir = join(currentDir, "fixtures/type-aware")
const filename = join(fixtureDir, "usage.tsx")
const code = readFileSync(filename, "utf8")

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      ecmaFeatures: { jsx: true },
      project: join(fixtureDir, "tsconfig.json"),
      tsconfigRootDir: fixtureDir,
    },
  },
})

ruleTester.run(
  "no-dynamic-conditional-styling (automatic type information)",
  noDynamicConditionalStyling as unknown as Rule.RuleModule,
  {
    valid: [],
    invalid: [
      {
        code,
        filename,
        output: null,
        errors: [{ messageId: "dynamicConditional", line: 13 }],
      },
    ],
  },
)
