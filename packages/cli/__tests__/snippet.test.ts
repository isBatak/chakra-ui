import { describe, expect, test } from "vitest"
import { shouldSkipSnippetFile } from "../src/commands/snippet"

describe("shouldSkipSnippetFile", () => {
  test("never overwrites an installed Provider", () => {
    expect(shouldSkipSnippetFile("provider.tsx", true, false)).toBe(true)
    expect(shouldSkipSnippetFile("provider.tsx", true, true)).toBe(true)
    expect(shouldSkipSnippetFile("provider.jsx", true, true)).toBe(true)
  })

  test("allows force for other installed snippets", () => {
    expect(shouldSkipSnippetFile("tooltip.tsx", true, true)).toBe(false)
  })

  test("allows a Provider to be installed when it is absent", () => {
    expect(shouldSkipSnippetFile("provider.tsx", false, false)).toBe(false)
  })
})
