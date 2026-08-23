# Manual styling-engine migration

Use this guide after the v3-to-v4 migration finishes with Emotion. Component
imports stay unchanged. You only change the application-owned Provider and the
engine configuration.

The Chakra CLI never overwrites an existing Provider or theme file. Make the
changes below yourself and review them before committing.

## Choose one target

### Panda only

1. Keep a supported `panda.config.*` file in the project root.
2. Add `@chakra-ui/panda`, `@chakra-ui/panda-preset`, and matching supported
   versions of `@pandacss/dev` and `@pandacss/types`.
3. Add the Chakra preset to `panda.config.*` and include the generated Panda CSS
   once in the application entry point.
4. Replace the root `EmotionStylingEngine` with `PandaStylingEngine` in the
   application-owned Provider.
5. Remove `@chakra-ui/emotion` only after no Emotion boundary remains.

```tsx
import { PandaStylingEngine } from "@chakra-ui/panda"
import { ChakraProvider } from "@chakra-ui/react"

export function Provider(props: { children: React.ReactNode }) {
  return (
    <PandaStylingEngine>
      <ChakraProvider>{props.children}</ChakraProvider>
    </PandaStylingEngine>
  )
}
```

### Panda and Emotion

Use Panda at the root. Wrap only the legacy subtree in Emotion. A component uses
the nearest engine boundary.

```tsx
import { EmotionStylingEngine } from "@chakra-ui/emotion"
import { PandaStylingEngine } from "@chakra-ui/panda"
import { ChakraProvider } from "@chakra-ui/react"

export function Provider(props: { children: React.ReactNode }) {
  return (
    <PandaStylingEngine>
      <ChakraProvider>{props.children}</ChakraProvider>
    </PandaStylingEngine>
  )
}

export function LegacyRoute() {
  return (
    <EmotionStylingEngine>
      <LegacyPage />
    </EmotionStylingEngine>
  )
}
```

Keep each multipart component, such as Dialog, inside one engine boundary. Do
not switch engines between its slots.

## Extend the theme

The application owns its extension wiring. Choose one of these approaches:

- Define the same extension separately in the Panda and Emotion configuration.
- Put the extension in one `theme.ts` file and import it from both
  configurations. This reduces drift.

For Panda, merge the extension through `theme.extend`:

```ts
// panda.config.ts
import chakraPreset from "@chakra-ui/panda-preset"
import { defineConfig } from "@pandacss/dev"
import { theme } from "./src/theme"

export default defineConfig({
  presets: [chakraPreset],
  theme: { extend: theme },
})
```

For Emotion, pass the packaged configuration and the application extension as
separate `defineSystem` inputs. Later inputs override earlier inputs.

```ts
// src/system.ts
import { defaultConfig, defineConfig, defineSystem } from "@chakra-ui/react"
import { theme } from "./theme"

const appConfig = defineConfig({ theme })

export const system = defineSystem(defaultConfig, appConfig)
```

Do not edit the packaged theme. If you used `chakra eject`, the copied theme is
application code: maintain it and its Panda and Emotion glue yourself.

## Manual verification

- [ ] The Provider file contains the intended root engine boundary.
- [ ] Every legacy subtree that still needs Emotion has an explicit Emotion
      boundary.
- [ ] Panda scans every component that can render inside a Panda boundary.
- [ ] Generated Panda CSS is included exactly once.
- [ ] Theme extensions are present in both engine configurations.
- [ ] Button, ButtonGroup, and Dialog render correctly in each enabled engine.
- [ ] No existing Provider or theme file was overwritten.

## Test scope

This migration plan covers focused unit tests for detection, overwrite
protection, and migration output. End-to-end CLI integration tests are not part
of this plan.
