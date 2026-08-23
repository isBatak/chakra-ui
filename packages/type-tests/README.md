# Styling-engine type matrix

Each directory is an isolated consumer package. Its `package.json` defines the
installed styling engines and its source compiles only against the public API.

| Fixture                    | Emotion | Panda adapter | `@pandacss/types`               |
| -------------------------- | ------- | ------------- | ------------------------------- |
| `emotion-only`             | yes     | no            | transitive canonical types only |
| `panda-only`               | no      | yes           | `^1.4.2` (resolved `1.11.1`)    |
| `dual-engine`              | yes     | yes           | `^1.4.2` (resolved `1.11.1`)    |
| `panda-compatible-version` | no      | yes           | `1.11.0`                        |

Run the matrix with:

```sh
pnpm --filter "./packages/type-tests/**" typecheck
```

Each engine-mode fixture also has a `runtime.tsx` entry. The focused dependency
test follows its transitive runtime imports and fails if a single-engine fixture
loads the other adapter runtime.

The compatible-version fixture deliberately installs Panda `1.11.0` while Chakra
core resolves `1.11.1`, then verifies structural compatibility in both
directions. The shared public-API entry isolates declaration checks from runtime
source files. None of these fixtures depends on `@pandacss/dev`.
