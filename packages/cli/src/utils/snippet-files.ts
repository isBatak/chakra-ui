import { basename } from "node:path/posix"

export function shouldSkipSnippetFile(
  filename: string,
  exists: boolean,
  force: boolean | undefined,
) {
  if (!exists) return false
  const name = basename(filename)
  if (name === "provider.tsx" || name === "provider.jsx") return true
  return !force
}
